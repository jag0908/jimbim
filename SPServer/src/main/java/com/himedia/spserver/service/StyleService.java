package com.himedia.spserver.service;

import com.himedia.spserver.dto.StylePostDTO;
import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Follow;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.STYLE.*;
import com.himedia.spserver.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
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

    // 단일 게시물 조회
    public StylePostDTO getPostDetail(Integer id) {
        STYLE_post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

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

    // ✅ 팔로우 토글 (팔로우 중이면 취소, 아니면 등록)
//    public boolean toggleFollow(String startUserid, String endUserid) {
//        Member startMember = memberRepository.findByUserid(startUserid);
//        Member endMember = memberRepository.findByUserid(endUserid);
//
//        if (startMember == null || endMember == null) {
//            throw new RuntimeException("회원 정보를 찾을 수 없습니다.");
//        }
//
//        return followRepository.findByStart_memberAndEnd_member(startMember, endMember)
//                .map(existing -> {
//                    followRepository.delete(existing);
//                    return false; // 언팔로우
//                })
//                .orElseGet(() -> {
//                    Follow newFollow = new Follow();
//                    newFollow.setStart_member(startMember);
//                    newFollow.setEnd_member(endMember);
//                    followRepository.save(newFollow);
//                    return true; // 팔로우 성공
//                });
//    }
//
//    // ✅ 팔로워 목록
//    public List<String> getFollowers(String userid) {
//        Member member = memberRepository.findByUserid(userid);
//        return followRepository.findByEnd_member(member).stream()
//                .map(f -> f.getStart_member().getUserid())
//                .collect(Collectors.toList());
//    }
//
//    // ✅ 팔로잉 목록
//    public List<String> getFollowing(String userid) {
//        Member member = memberRepository.findByUserid(userid);
//        return followRepository.findByStart_member(member).stream()
//                .map(f -> f.getEnd_member().getUserid())
//                .collect(Collectors.toList());
//    }
//
//    // ✅ 팔로우 상태 확인
//    public boolean isFollowing(String startUserid, String endUserid) {
//        Member startMember = memberRepository.findByUserid(startUserid);
//        Member endMember = memberRepository.findByUserid(endUserid);
//
//        if (startMember == null || endMember == null)
//            throw new RuntimeException("회원 정보를 찾을 수 없습니다.");
//
//        return followRepository.findByStart_memberAndEnd_member(startMember, endMember).isPresent();
//    }

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

    public Map<String, Object> addReply(Integer spostId, String userid, String content) {
        Member member = memberRepository.findByUserid(userid);
        STYLE_post post = findBySpostId(spostId);

        STYLE_Reply reply = new STYLE_Reply();
        reply.setSpost(post);
        reply.setMemberid(member);
        reply.setContent(content);
        reply.setIndate(new Timestamp(System.currentTimeMillis()));
        replyRepository.save(reply);

        // 새로 추가한 댓글만 반환
        Map<String, Object> result = new HashMap<>();
        result.put("reply_id", reply.getReply_id());
        result.put("userid", reply.getMemberid().getUserid());
        result.put("content", reply.getContent());
        result.put("indate", reply.getIndate());

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
        fileRepository.deleteAll(fileRepository.findByPost(post));
        postRepository.delete(post);
    }
}
