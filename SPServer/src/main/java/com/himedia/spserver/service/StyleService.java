package com.himedia.spserver.service;

import com.himedia.spserver.dto.MemberDTO;
import com.himedia.spserver.dto.StyleFollowerCountDTO;
import com.himedia.spserver.dto.StylePostDTO;
import com.himedia.spserver.dto.StylePostHashtagDTO;
import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Follow;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.STYLE.*;
import com.himedia.spserver.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final S3UploadService s3UploadService;

    public List<String> getAllImageUrls(STYLE_post post) {
        return fileRepository.findByPost(post)
                .stream()
                .map(File::getPath)
                .collect(Collectors.toList());
    }

    public List<StylePostDTO> getPostsByUseridDTO(String userid) {
        List<STYLE_post> posts = postRepository.findAllByMember_UseridOrderByIndateDesc(userid);

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

    public List<StylePostDTO> getAllPosts() {

        // 1. 게시글 + 멤버 한 번에 조회 (Q1: 1 query - Fetch Join 사용)
        List<STYLE_post> posts = postRepository.findAllWithMemberOrderByIndateDesc();

        // 2. 관련 데이터 한 번에 조회 (Q2-Q5: 4 queries - IN 절 Batch Loading)
        List<Integer> allIds = posts.stream()
                .map(STYLE_post::getSpostId)
                .toList();

        if (allIds.isEmpty()) {
            return List.of();
        }

        // 3. 관련 데이터 한 번에 조회
        List<STYLE_Like> allLikes = likeRepository.findBySpost_SpostIdIn(allIds);
        List<STYLE_Reply> allReplies = replyRepository.findBySpost_SpostIdIn(allIds);
        List<StylePostHashtagDTO> postHashtagDTOs = posthashRepository.findHashtagsByPostIds(allIds);
        List<File> allFiles = fileRepository.findByPost_SpostIdIn(allIds);

        // 4. Map으로 매핑
        Map<Integer, Long> likeCountMap = allLikes.stream()
                .collect(Collectors.groupingBy(l -> l.getSpost().getSpostId(), Collectors.counting()));

        Map<Integer, Long> replyCountMap = allReplies.stream()
                .collect(Collectors.groupingBy(r -> r.getSpost().getSpostId(), Collectors.counting()));

        Map<Integer, List<String>> hashtagMap = postHashtagDTOs.stream()
                .collect(Collectors.groupingBy(
                        StylePostHashtagDTO::postId,
                        Collectors.mapping(StylePostHashtagDTO::word, Collectors.toList())
                ));

        Map<Integer, List<String>> fileMap = allFiles.stream()
                .collect(Collectors.groupingBy(
                        f -> f.getPost().getSpostId(),
                        Collectors.mapping(File::getPath, Collectors.toList())
                ));

        // 5. DTO 변환
        return posts.stream().map(post -> StylePostDTO.builder()
                .spost_id(post.getSpostId())
                .title(post.getTitle())
                .content(post.getContent())
                .s_images(fileMap.getOrDefault(post.getSpostId(), List.of()))
                .hashtags(hashtagMap.getOrDefault(post.getSpostId(), List.of()))
                .indate(post.getIndate())
                .likeCount(likeCountMap.getOrDefault(post.getSpostId(), 0L).intValue())
                .replyCount(replyCountMap.getOrDefault(post.getSpostId(), 0L).intValue())
                .userid(post.getMember().getUserid())
                .profileImg(post.getMember().getProfileImg())
                .build()
        ).toList();
    }


    public void save(STYLE_post post) {
        postRepository.save(post);
    }

    public void saveStylePost(String title, String content, List<MultipartFile> images, String userid, List<String> hashtags) {
        try {
            Member member = memberRepository.findByUserid(userid);
            if (member == null) throw new RuntimeException("사용자를 찾을 수 없습니다.");

            STYLE_post post = new STYLE_post();
            post.setTitle(title);
            post.setContent(content);
            post.setIndate(new Timestamp(System.currentTimeMillis()));
            post.setMember(member);
            postRepository.save(post);

            if (images != null && !images.isEmpty()) {
                for (MultipartFile image : images) {
                    String fileUrl = s3UploadService.saveFile(image);
                    File postFile = new File();
                    postFile.setPost(post);
                    postFile.setPath(fileUrl);
                    postFile.setOriginalname(image.getOriginalFilename());
                    postFile.setSize(Long.valueOf(image.getSize()));
                    postFile.setContentType(image.getContentType());
                    fileRepository.save(postFile);
                }
            }

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
        } catch (IOException e) {
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

    public boolean toggleFollow(String startUserid, String endUserid) {
        Member startMember = memberRepository.findByUserid(startUserid);
        Member endMember = memberRepository.findByUserid(endUserid);

        if (startMember == null || endMember == null) {
            throw new RuntimeException("회원 정보를 찾을 수 없습니다.");
        }

        return followRepository.findByStartMemberAndEndMember(startMember, endMember)
                .map(existing -> {
                    followRepository.delete(existing);
                    return false;
                })
                .orElseGet(() -> {
                    Follow newFollow = new Follow();
                    newFollow.setStartMember(startMember);
                    newFollow.setEndMember(endMember);
                    followRepository.save(newFollow);
                    return true;
                });
    }


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


    public int countLikes(Integer id) {
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
                    map.put("parentId", r.getParent() != null ? r.getParent().getReply_id() : null);
                    map.put("isOpen", false);

                    return map;
                })
                .collect(Collectors.toList());
    }


    public List<String> findHashtags(Integer id) {
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

        if (parentId != null) {
            STYLE_Reply parent = replyRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("부모 댓글 없음"));
            reply.setParent(parent);
        }

        reply.setIndate(new Timestamp(System.currentTimeMillis()));
        replyRepository.save(reply);

        return Map.of(
                "reply_id", reply.getReply_id(),
                "userid", reply.getMemberid().getUserid(),
                "profileImg", reply.getMemberid().getProfileImg(),
                "content", reply.getContent(),
                "indate", reply.getIndate()
        );
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

        // 댓글, 좋아요, 해시태그 매핑 삭제
        replyRepository.deleteAll(replyRepository.findBySpost(post));
        likeRepository.deleteAllBySpost(post);
        posthashRepository.deleteAll(posthashRepository.findByPostId(post));

        // 이미지 삭제
        List<File> files = fileRepository.findByPost(post);
        for (File f : files) {
            s3UploadService.deleteFile(f.getPath());
        }
        fileRepository.deleteAll(files);

        postRepository.delete(post);
    }

    public void editPost(Integer spostId,
                         String userid,
                         String title,
                         String content,
                         List<MultipartFile> newImages,
                         List<String> existingImages,
                         List<String> hashtags) throws IOException {

        STYLE_post post = postRepository.findById(spostId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!post.getMember().getUserid().equals(userid)) {
            throw new RuntimeException("본인 게시글만 수정할 수 있습니다.");
        }

        post.setTitle(title);
        post.setContent(content);
        postRepository.save(post);

        List<File> currentFiles = fileRepository.findByPost(post);
        if (existingImages != null) {
            List<File> filesToDelete = currentFiles.stream()
                    .filter(f -> !existingImages.contains(f.getPath()))
                    .toList();
            for (File f : filesToDelete) {
                s3UploadService.deleteFile(f.getPath());
            }
            fileRepository.deleteAll(filesToDelete);
        } else {
            fileRepository.deleteAll(currentFiles);
        }

        if (newImages != null && !newImages.isEmpty()) {
            for (MultipartFile image : newImages) {
                String fileUrl = s3UploadService.saveFile(image);
                File postFile = new File();
                postFile.setPost(post);
                postFile.setPath(fileUrl);
                postFile.setOriginalname(image.getOriginalFilename());
                postFile.setSize(Long.valueOf(image.getSize()));
                postFile.setContentType(image.getContentType());
                fileRepository.save(postFile);
            }
        }

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

        // 1) 인기순 게시글 목록 조회 (N+1 발생 X)
        List<STYLE_post> posts = postRepository.findAllOrderByLikeCountDesc();
        if (posts.isEmpty()) return Collections.emptyList();

        // 포스트 ID 목록 추출
        List<Integer> postIds = posts.stream()
                .map(STYLE_post::getSpostId)
                .toList();

        // 2) 좋아요 한꺼번에 가져오기
        Map<Integer, List<STYLE_Like>> likeMap =
                likeRepository.findAllBySpostIds(postIds)
                        .stream()
                        .collect(Collectors.groupingBy(l -> l.getSpost().getSpostId()));

        // 3) 댓글 한꺼번에 가져오기
        Map<Integer, List<STYLE_Reply>> replyMap =
                replyRepository.findAllBySpostIds(postIds)
                        .stream()
                        .collect(Collectors.groupingBy(r -> r.getSpost().getSpostId()));

        // 4) 파일 한꺼번에 가져오기
        Map<Integer, List<File>> fileMap =
                fileRepository.findAllByStylePostIds(postIds)
                        .stream()
                        .collect(Collectors.groupingBy(f -> f.getPost().getSpostId()));

        // 5) 해시태그 한꺼번에 가져오기
        Map<Integer, List<STYLE_Posthash>> hashtagMap =
                posthashRepository.findAllByPostIds(postIds)
                        .stream()
                        .collect(Collectors.groupingBy(h -> h.getPostId().getSpostId()));

        // 6) 한번에 DTO 변환
        return posts.stream()
                .map(post -> {
                    List<STYLE_Like> likes = likeMap.getOrDefault(post.getSpostId(), List.of());
                    List<STYLE_Reply> replies = replyMap.getOrDefault(post.getSpostId(), List.of());
                    List<File> files = fileMap.getOrDefault(post.getSpostId(), List.of());
                    List<STYLE_Posthash> hashtags = hashtagMap.getOrDefault(post.getSpostId(), List.of());

                    return StyleConvertToDTO(post, likes, replies, files, hashtags);
                })
                .toList();
    }

    public List<StylePostDTO> getAllPostsOrderByViewsDTO() {

        // 1) 조회수순 포스트 목록 조회
        List<STYLE_post> posts = postRepository.findAllOrderByViewCountDesc();
        if (posts.isEmpty()) {
            return Collections.emptyList();
        }

        // 포스트 ID 목록
        List<Integer> postIds = posts.stream()
                .map(STYLE_post::getSpostId)
                .toList();

        // 2) 좋아요 한 번에 조회(IN)
        Map<Integer, List<STYLE_Like>> likeMap =
                likeRepository.findAllBySpostIds(postIds)
                        .stream()
                        .collect(Collectors.groupingBy(l -> l.getSpost().getSpostId()));

        // 3) 댓글 한 번에 조회(IN)
        Map<Integer, List<STYLE_Reply>> replyMap =
                replyRepository.findAllBySpostIds(postIds)
                        .stream()
                        .collect(Collectors.groupingBy(r -> r.getSpost().getSpostId()));

        // 4) 파일 한 번에 조회(IN)
        Map<Integer, List<File>> fileMap =
                fileRepository.findAllByStylePostIds(postIds)
                        .stream()
                        .collect(Collectors.groupingBy(f -> f.getPost().getSpostId()));

        // 5) 해시태그 한 번에 조회(IN + tag JOIN FETCH)
        Map<Integer, List<STYLE_Posthash>> hashtagMap =
                posthashRepository.findAllByPostIds(postIds)
                        .stream()
                        .collect(Collectors.groupingBy(h -> h.getPostId().getSpostId()));

        // 6) DTO 변환
        return posts.stream()
                .map(post -> {

                    List<STYLE_Like> likes = likeMap.getOrDefault(post.getSpostId(), List.of());
                    List<STYLE_Reply> replies = replyMap.getOrDefault(post.getSpostId(), List.of());
                    List<File> files = fileMap.getOrDefault(post.getSpostId(), List.of());
                    List<STYLE_Posthash> hashtags = hashtagMap.getOrDefault(post.getSpostId(), List.of());

                    return StyleConvertToDTO(post, likes, replies, files, hashtags);

                })
                .toList();
    }

    private StylePostDTO StyleConvertToDTO(
            STYLE_post post,
            List<STYLE_Like> likes,
            List<STYLE_Reply> replies,
            List<File> files,
            List<STYLE_Posthash> hashtags
    ) {

        return StylePostDTO.builder()
                .spost_id(post.getSpostId())
                .title(post.getTitle())
                .content(post.getContent())
                .indate(post.getIndate())
                .viewCount(post.getViewCount())

                // 이미지 파일 path 리스트
                .s_images(
                        files.stream()
                                .map(File::getPath)      // 이미지 경로
                                .toList()
                )

                // 좋아요 개수
                .likeCount(likes.size())

                // 댓글 개수
                .replyCount(replies.size())

                // 작성자 정보
                .userid(post.getMember().getUserid())
                .profileImg(post.getMember().getProfileImg())

                // 로그인 정보가 없으므로 기본값 설정 (추후 로그인 서비스 연동 시 변경)
                .liked(false)
                .followed(false)

                // 해시태그 문자열 리스트
                .hashtags(
                        hashtags.stream()
                                .map(h -> h.getTagId().getWord())
                                .toList()
                )

                .build();
    }


    public List<Map<String, Object>> getHotTags() {
        // 1. 인기 해시태그 조회
        List<Object[]> hotTags = posthashRepository.findHotTags();
        List<String> tagNames = hotTags.stream()
                .map(row -> (String) row[0])
                .limit(10)
                .toList();

        // 2. 태그별 포스트와 태그를 한 번에 fetch join으로 조회
        List<STYLE_Posthash> postHashes = posthashRepository.findByTagWordsWithFetch(tagNames);

        // 3. 포스트 ID별 그룹화
        Map<String, List<STYLE_post>> tagPostMap = new HashMap<>();
        for (STYLE_Posthash ph : postHashes) {
            String tagWord = ph.getTagId().getWord();
            STYLE_post post = ph.getPostId();

            tagPostMap.computeIfAbsent(tagWord, k -> new ArrayList<>());
            List<STYLE_post> posts = tagPostMap.get(tagWord);
            if (posts.size() < 10) {  // 태그별 상위 10개 제한
                posts.add(post);
            }
        }

        // 4. 포스트 ID 목록 준비
        List<Integer> allPostIds = tagPostMap.values().stream()
                .flatMap(List::stream)
                .map(STYLE_post::getSpostId)
                .distinct()
                .toList();

        // 5. 파일, 좋아요 한 번에 조회
        Map<Integer, List<String>> fileMap = fileRepository.findByPostIds(allPostIds).stream()
                .collect(Collectors.groupingBy(
                        f -> f.getPost().getSpostId(),
                        Collectors.mapping(File::getPath, Collectors.toList())
                ));

        Map<Integer, Long> likeMap = likeRepository.findByPostIds(allPostIds).stream()
                .collect(Collectors.groupingBy(
                        l -> l.getSpost().getSpostId(),
                        Collectors.counting()
                ));

        // 6. 최종 DTO 생성
        return tagNames.stream().map(tagName -> {
            List<STYLE_post> posts = tagPostMap.getOrDefault(tagName, List.of());
            List<Map<String, Object>> postDtos = posts.stream()
                    .map(post -> Map.of(
                            "spost_id", post.getSpostId(),
                            "s_images", fileMap.getOrDefault(post.getSpostId(), List.of()),
                            "userid", post.getMember().getUserid(),
                            "profileImg", post.getMember().getProfileImg(),
                            "likeCount", likeMap.getOrDefault(post.getSpostId(), 0L)
                    ))
                    .toList();

            return Map.of(
                    "tagName", tagName,
                    "posts", postDtos
            );
        }).toList();
    }


    public Integer getCurrentMemberId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof MemberDTO)) {
            return null; // 로그인 안된 경우
        }

        MemberDTO member = (MemberDTO) authentication.getPrincipal();
        return member.getMember_id(); // MemberDTO에서 memberId getter
    }


    public List<Map<String, Object>> getHotUsers() {
        // 1. 모든 회원 조회
        List<Member> allMembers = memberRepository.findAll();

        // 2. 회원 ID 목록
        List<Integer> memberIds = allMembers.stream()
                .map(Member::getMember_id)
                .toList();

        // 3. 팔로워 수 한 번에 조회
        Map<Integer, Long> followerCountMap = followRepository.countByEndMemberIn(memberIds)
                .stream()
                .collect(Collectors.toMap(
                        StyleFollowerCountDTO::getMemberId,
                        StyleFollowerCountDTO::getFollowerCount
                ));

        // 4. 게시글 + 회원 정보 한 번에 조회
        List<STYLE_post> posts = postRepository.findAllWithMemberByMemberIds(memberIds);

        // 5. 게시글 ID 목록
        List<Integer> postIds = posts.stream().map(STYLE_post::getSpostId).toList();

        // 6. 파일 한 번에 조회 (별도)
        Map<Integer, List<String>> fileMap = fileRepository.findByPostIds(postIds).stream()
                .collect(Collectors.groupingBy(
                        f -> f.getPost().getSpostId(),
                        Collectors.mapping(File::getPath, Collectors.toList())
                ));

        // 7. 회원별 게시글 매핑
        Map<Integer, List<STYLE_post>> memberPostMap = posts.stream()
                .collect(Collectors.groupingBy(p -> p.getMember().getMember_id()));

        // 8. 팔로우 상태 조회
        Integer currentMemberId = getCurrentMemberId();
        Set<Integer> followingSet = followRepository.findAllByStartMemberAndEndMembers(currentMemberId, memberIds)
                .stream()
                .map(f -> f.getEndMember().getMember_id())
                .collect(Collectors.toSet());

        // 9. DTO 생성 + 정렬 + 상위 10명
        return allMembers.stream()
                .map(member -> {
                    List<STYLE_post> memberPosts = memberPostMap.getOrDefault(member.getMember_id(), List.of())
                            .stream().limit(10).toList();

                    List<Map<String, Object>> postDto = memberPosts.stream()
                            .map(p -> Map.of(
                                    "spost_id", p.getSpostId(),
                                    "s_images", fileMap.getOrDefault(p.getSpostId(), List.of())
                            ))
                            .toList();

                    return Map.of(
                            "userid", member.getUserid(),
                            "profileImg", member.getProfileImg(),
                            "followerCount", followerCountMap.getOrDefault(member.getMember_id(), 0L),
                            "isFollowing", followingSet.contains(member.getMember_id()),
                            "posts", postDto
                    );
                })
                .sorted((a, b) -> Long.compare((Long) b.get("followerCount"), (Long) a.get("followerCount")))
                .limit(10)
                .toList();
    }



}

