package com.himedia.spserver.service;

import com.himedia.spserver.dto.StylePostDTO;
import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Follow;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.STYLE.*;
import com.himedia.spserver.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StyleService {

    private final STYLE_PostRepository postRepository;
    private final STYLE_LikeRepository likeRepository;
    private final STYLE_ReplyRepository replyRepository;
    private final STYLE_PosthashRepository posthashRepository;
    private final STYLE_HashtagRepository hashtagRepository;
    private final MemberRepository memberRepository;
    private final FileRepository fileRepository;
    private final FollowRepository followRepository;
    private final S3UploadService sus;


    private List<String> getAllImageUrls(STYLE_post post) {
        return fileRepository.findByPost(post)
                .stream()
                .map(File::getPath)
                .collect(Collectors.toList());
    }

    public List<StylePostDTO> getPostsByUseridDTO(String userid) {
        List<STYLE_post> posts = findPostsByUserid(userid);

        return posts.stream().map(post -> {
            List<String> imageUrls = getAllImageUrls(post);
            List<String> hashtags = posthashRepository.findByPostId(post)
                    .stream().map(ph -> ph.getTagId().getWord())
                    .collect(Collectors.toList());

            int likeCount = likeRepository.countBySpost(post);
            int replyCount = replyRepository.countBySpost(post);

            return StylePostDTO.builder()
                    .spost_id(post.getSpostId())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .s_images(imageUrls)
                    .indate(post.getIndate())
                    .likeCount(likeCount)
                    .replyCount(replyCount)
                    .userid(post.getMember().getUserid())
                    .profileImg(post.getMember().getProfileImg())
                    .viewCount(post.getViewCount())
                    .hashtags(hashtags)
                    .build();
        }).collect(Collectors.toList());
    }

    private List<STYLE_post> findPostsByUserid(String userid) {
        return postRepository.findAllByMember_UseridOrderByIndateDesc(userid);
    }


    // 전체 피드 조회
    public List<StylePostDTO> getAllPosts() {
        List<STYLE_post> posts = postRepository.findAllByOrderByIndateDesc();

        return posts.stream().map(post -> {
            int likeCount = likeRepository.countBySpost(post);
            int replyCount = replyRepository.countBySpost(post);
            List<String> hashtags = posthashRepository.findByPostId(post)
                    .stream().map(ph -> ph.getTagId().getWord())
                    .collect(Collectors.toList());

            List<String> imageUrls = fileRepository.findAllByPost(post)
                    .stream()
                    .map(File::getPath)
                    .collect(Collectors.toList());

            return StylePostDTO.builder()
                    .spost_id(post.getSpostId())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .s_images(imageUrls)
                    .indate(post.getIndate())
                    .likeCount(likeCount)
                    .replyCount(replyCount)
                    .userid(post.getMember().getUserid())
                    .profileImg(post.getMember().getProfileImg())
                    .hashtags(hashtags)
                    .build();
        }).collect(Collectors.toList());
    }

    public void save(STYLE_post post) {
        postRepository.save(post);
    }


    public void saveStylePost(String title, String content, List<MultipartFile> images, String userid, List<String> hashtags) {
        try {
            Member member = memberRepository.findByUserid(userid);
            if (member == null) throw new RuntimeException("사용자를 찾을 수 없습니다.");

            STYLE_post post = new STYLE_post();
            post.setTitle(title); // 제목 저장
            post.setContent(content);
            post.setIndate(new Timestamp(System.currentTimeMillis()));
            post.setMember(member);
            postRepository.save(post);

            // 이미지 저장 (S3)
            if (images != null && !images.isEmpty()) {
                for (MultipartFile image : images) {
                    String fileUrl = sus.saveFile(image); // S3 업로드

                    File postFile = new File();
                    postFile.setPost(post);
                    postFile.setPath(fileUrl); // S3 URL 저장
                    postFile.setOriginalname(image.getOriginalFilename());
                    postFile.setSize(Long.valueOf(image.getSize())); // 파일 크기
                    postFile.setContentType(image.getContentType()); // 파일 타입

                    fileRepository.save(postFile); // FileRepository로 저장
                }
            }

            // 해시태그 처리
            if (hashtags != null && !hashtags.isEmpty()) {
                for (String rawTag : hashtags) {
                    String word = rawTag.replaceAll("[#\\s]", "");
                    STYLE_Hashtag tag = hashtagRepository.findByWord(word)
                            .orElseGet(() -> {
                                STYLE_Hashtag newTag = new STYLE_Hashtag();
                                newTag.setWord(word);
                                return hashtagRepository.save(newTag);
                            });

                    STYLE_Posthash mapping = new STYLE_Posthash();
                    mapping.setPostId(post);
                    mapping.setTagId(tag);
                    posthashRepository.save(mapping);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Image upload failed", e);
        }
    }

    public Map<String, Object> toggleLike(Integer spostId, String userid) {
        Member member = memberRepository.findByUserid(userid);
        STYLE_post post = postRepository.findById(spostId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<STYLE_Like> existingLike = likeRepository.findByMemberidAndSpost(member, post);

        boolean liked;
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            liked = false;
        } else {
            STYLE_Like newLike = new STYLE_Like();
            newLike.setMemberid(member);
            newLike.setSpost(post);
            likeRepository.save(newLike);
            liked = true;
        }

        int likeCount = likeRepository.countBySpost(post);

        return Map.of("liked", liked, "likeCount", likeCount);
    }

     //✅ 팔로우 토글 (팔로우 중이면 취소, 아니면 등록)
    public boolean toggleFollow(String startUserid, String endUserid) {
        Member startMember = memberRepository.findByUserid(startUserid);
        Member endMember = memberRepository.findByUserid(endUserid);

        if (startMember == null || endMember == null) {
            throw new RuntimeException("회원 정보를 찾을 수 없습니다.");
        }

        return followRepository.findByStartMemberAndEndMember(startMember, endMember)
                .map(existing -> {
                    followRepository.delete(existing);
                    return false; // 언팔로우
                })
                .orElseGet(() -> {
                    Follow newFollow = new Follow();
                    newFollow.setStartMember(startMember);
                    newFollow.setEndMember(endMember);
                    followRepository.save(newFollow);
                    return true; // 팔로우 성공
                });
    }

    // ✅ 팔로우 상태 확인
    public boolean isFollowing(String startUserid, String endUserid) {
        Member startMember = memberRepository.findByUserid(startUserid);
        Member endMember = memberRepository.findByUserid(endUserid);

        if (startMember == null || endMember == null)
            throw new RuntimeException("회원 정보를 찾을 수 없습니다.");

        return followRepository.findByStartMemberAndEndMember(startMember, endMember).isPresent();
    }

    public STYLE_post findBySpostId(Integer id) {
        return postRepository.findBySpostId(id)
                .orElseThrow(() -> new RuntimeException("Post를 찾을 수 없습니다"));

    }

    public Object countLikes(Integer id) {
        STYLE_post post = findBySpostId(id);
        return likeRepository.countBySpost(post);
    }

    public List<Map<String, Object>> findReplies(Integer id) {
        STYLE_post post = findBySpostId(id);

        return replyRepository.findBySpost(post).stream()
                .map(r -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("reply_id", r.getReply_id());
                    map.put("userid", r.getMemberid().getUserid());
                    map.put("profileImg", r.getMemberid().getProfileImg());
                    map.put("content", r.getContent());
                    map.put("indate", r.getIndate());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public Object findHashtags(Integer id) {
        STYLE_post post = findBySpostId(id);
        return posthashRepository.findByPostId(post)
                .stream()
                .map(ph -> ph.getTagId().getWord())
                .collect(Collectors.toList());
    }

    public Map<String, Object> addReply(Integer spostId, String userid, String content, Integer parentId) {
        Member member = memberRepository.findByUserid(userid);
        STYLE_post post = findBySpostId(spostId);

        STYLE_Reply reply = new STYLE_Reply();
        reply.setSpost(post);
        reply.setMemberid(member);
        reply.setContent(content);
        reply.setIndate(new Timestamp(System.currentTimeMillis()));

        // parentId가 있으면 부모 댓글 연결
        if (parentId != null) {
            STYLE_Reply parentReply = replyRepository.findById(parentId)
                    .orElseThrow(() -> new IllegalArgumentException("부모 댓글 없음"));
            reply.setParent(parentReply);
        }

        replyRepository.save(reply);

        // 새로 추가한 댓글만 반환
        Map<String, Object> result = new HashMap<>();
        result.put("reply_id", reply.getReply_id());
        result.put("userid", reply.getMemberid().getUserid());
        result.put("profileImg", reply.getMemberid().getProfileImg());
        result.put("content", reply.getContent());
        result.put("indate", reply.getIndate());
        result.put("parent_id", parentId);

        return result;
    }

    public void deleteReply(Integer replyId, String userid) {
        STYLE_Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        if (!reply.getMemberid().getUserid().equals(userid)) {
            throw new RuntimeException("본인 댓글만 삭제할 수 있습니다.");
        }

        replyRepository.delete(reply);
    }

    public void deletePost(Integer spostId, String userid) {
        STYLE_post post = postRepository.findById(spostId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!post.getMember().getUserid().equals(userid)) {
            throw new RuntimeException("본인 게시글만 삭제할 수 있습니다.");
        }

        // 파일 삭제 가능 (S3, DB)
        // 댓글 삭제
        replyRepository.deleteAll(replyRepository.findBySpost(post));

        // 좋아요 삭제
        likeRepository.deleteAllBySpost(post);

        // 해시태그 매핑 삭제
        posthashRepository.deleteAll(posthashRepository.findByPostId(post));

        List<File> files = fileRepository.findByPost(post);
        for (File f : files) {
            sus.deleteFile(f.getPath()); // S3 실제 삭제
        }
        fileRepository.deleteAll(files);

        postRepository.delete(post);
    }

    // 게시글 수정
    public void editPost(Integer spostId,
                         String userid,
                         String title,
                         String content,
                         List<MultipartFile> newImages,
                         List<String> existingImages,
                         List<String> hashtags) throws IOException {

        STYLE_post post = postRepository.findById(spostId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        // 작성자 확인
        if (!post.getMember().getUserid().equals(userid)) {
            throw new RuntimeException("본인 게시글만 수정할 수 있습니다.");
        }

        // 게시글 내용 수정
        post.setTitle(title);
        post.setContent(content);
        postRepository.save(post);

        // 기존 이미지 유지/삭제
        List<File> currentFiles = fileRepository.findByPost(post);
        if (existingImages != null) {
            // 삭제할 이미지 필터링
            List<File> filesToDelete = currentFiles.stream()
                    .filter(f -> !existingImages.contains(f.getPath()))
                    .toList();
            for (File f : filesToDelete) {
                sus.deleteFile(f.getPath());  // S3 삭제 추가
            }
            fileRepository.deleteAll(filesToDelete);
        } else {
            // 기존 이미지 전부 삭제
            fileRepository.deleteAll(currentFiles);
        }

        // 새 이미지 업로드
        if (newImages != null && !newImages.isEmpty()) {
            for (MultipartFile image : newImages) {
                String fileUrl = sus.saveFile(image); // S3 업로드

                File postFile = new File();
                postFile.setPost(post);
                postFile.setPath(fileUrl);
                postFile.setOriginalname(image.getOriginalFilename());
                postFile.setSize(Long.valueOf(image.getSize()));
                postFile.setContentType(image.getContentType());

                fileRepository.save(postFile);
            }
        }

        // 해시태그 처리
        // 기존 매핑 삭제
        List<STYLE_Posthash> existingTags = posthashRepository.findByPostId(post);
        posthashRepository.deleteAll(existingTags);

        if (hashtags != null && !hashtags.isEmpty()) {
            for (String rawTag : hashtags) {
                String word = rawTag.replaceAll("[#\\s]", "").trim();
                if (word.isEmpty()) continue;
                STYLE_Hashtag tag = hashtagRepository.findByWord(word)
                        .orElseGet(() -> {
                            STYLE_Hashtag newTag = new STYLE_Hashtag();
                            newTag.setWord(word);
                            return hashtagRepository.save(newTag);
                        });

                STYLE_Posthash mapping = new STYLE_Posthash();
                mapping.setPostId(post);
                mapping.setTagId(tag);
                posthashRepository.save(mapping);
            }
        }
    }

    public List<StylePostDTO> getAllPostsOrderByLikesDTO() {
        List<STYLE_post> posts = postRepository.findAllOrderByLikeCountDesc();
        return convertToDTO(posts);
    }

    public List<StylePostDTO> getAllPostsOrderByViewsDTO() {
        List<STYLE_post> posts = postRepository.findAllOrderByViewCountDesc();
        return convertToDTO(posts);
    }

    private List<StylePostDTO> convertToDTO(List<STYLE_post> posts) {
        return posts.stream().map(post -> {
            int likeCount = likeRepository.countBySpost(post);

            List<String> imageUrls = fileRepository.findAllByPost(post)
                    .stream().map(File::getPath).toList();

            return StylePostDTO.builder()
                    .spost_id(post.getSpostId())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .s_images(imageUrls)
                    .userid(post.getMember().getUserid())
                    .profileImg(post.getMember().getProfileImg())
                    .likeCount(likeCount)
                    .build();
        }).toList();
    }

    public List<Map<String, Object>> getHotTags() {
        List<Object[]> hotTags = posthashRepository.findHotTags();

        List<Map<String, Object>> result = new ArrayList<>();

        // 상위 10개 태그만 처리
        hotTags.stream().limit(10).forEach(row -> {
            String tagName = (String) row[0];

            // 해당 태그의 게시물 가져오기
            List<STYLE_post> posts = postRepository.findPostsByTag(tagName);

            List<Map<String, Object>> postDtos = posts.stream()
                    .limit(4)
                    .map(post -> {
                        Map<String, Object> p = new HashMap<>();
                        p.put("spost_id", post.getSpostId());
                        p.put("s_images",
                                fileRepository.findByPost(post)
                                        .stream()
                                        .map(File::getPath)
                                        .toList()
                        );
                        p.put("userid", post.getMember().getUserid());
                        p.put("profileImg", post.getMember().getProfileImg());
                        p.put("likeCount", post.getLikes().size());
                        return p;
                    }).toList();

            Map<String, Object> tagMap = new HashMap<>();
            tagMap.put("tagName", tagName);
            tagMap.put("posts", postDtos);

            result.add(tagMap);
        });

        return result;
    }

    public List<Map<String, Object>> getHotUsers() {

        // 팔로워 많은 사람 기준 인기유저 선정
        List<Member> allMembers = memberRepository.findAll();

        List<Map<String, Object>> result = allMembers.stream()
                .map(member -> {
                    int followerCount = followRepository.findByEndMember(member).size();

                    // 유저 게시물 4개
                    List<STYLE_post> posts = postRepository
                            .findAllByMember_UseridOrderByIndateDesc(member.getUserid())
                            .stream().limit(4).toList();

                    List<Map<String, Object>> postDto = posts.stream()
                            .map(p -> Map.of(
                                    "spost_id", p.getSpostId(),
                                    "s_images", fileRepository.findAllByPost(p)
                                            .stream().map(File::getPath).toList()
                            ))
                            .toList();

                    Map<String, Object> m = new HashMap<>();
                    m.put("userid", member.getUserid());
                    m.put("profileImg", member.getProfileImg());
                    m.put("followerCount", followerCount);
                    m.put("posts", postDto);

                    return m;
                })
                .sorted((a, b) ->
                        ((Integer) b.get("followerCount")) - ((Integer) a.get("followerCount"))
                )
                .limit(10) // 상위 10명만
                .toList();

        return result;
    }



}
