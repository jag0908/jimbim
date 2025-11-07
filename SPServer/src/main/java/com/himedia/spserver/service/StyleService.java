package com.himedia.spserver.service;

import com.himedia.spserver.dto.StylePostDTO;
import java.io.File;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.STYLE.STYLE_Hashtag;
import com.himedia.spserver.entity.STYLE.STYLE_PostImage;
import com.himedia.spserver.entity.STYLE.STYLE_Posthash;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import com.himedia.spserver.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;
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
    private final STYLE_PostImageRepository postImageRepository;

    // 전체 피드 조회
    public List<StylePostDTO> getAllPosts() {
        List<STYLE_post> posts = postRepository.findAllByOrderByIndateDesc();

        return posts.stream().map(post -> {
            int likeCount = likeRepository.countBySpost(post);
            int replyCount = replyRepository.countBySpost(post);
            List<String> hashtags = posthashRepository.findByPostId(post)
                    .stream().map(ph -> ph.getTagId().getWord())
                    .collect(Collectors.toList());

            return StylePostDTO.builder()
                    .spost_id(post.getSpost_id())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .s_image(post.getS_image())
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

        return StylePostDTO.builder()
                .spost_id(post.getSpost_id())
                .title(post.getTitle())
                .content(post.getContent())
                .s_image(post.getS_image())
                .indate(post.getIndate())
                .likeCount(likeCount)
                .replyCount(replyCount)
                .userid(post.getMember().getUserid())
                .profileImg(post.getMember().getProfileImg())
                .hashtags(hashtags)
                .build();
    }

    public void saveStylePost(List<MultipartFile> images, String content, String userid, List<String> hashtags) {
        try {
            // 작성자 조회
            Member member = memberRepository.findByUserid(userid);
            if (member == null) {
                throw new RuntimeException("사용자를 찾을 수 없습니다.");
            }

            // 게시글 저장
            STYLE_post post = new STYLE_post();
            post.setContent(content);
            post.setIndate(new Timestamp(System.currentTimeMillis()));
            post.setMember(member);
            postRepository.save(post);

            // 이미지 저장 및 게시글과 연결
            if (images != null && !images.isEmpty()) {
                String uploadDir = "uploads/";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                for (MultipartFile image : images) {
                    String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                    String filePath = uploadDir + fileName;
                    image.transferTo(new File(filePath));

                    // STYLE_postImage 엔티티 생성
                    STYLE_PostImage postImage = new STYLE_PostImage();
                    postImage.setPost(post); // 게시글 연결
                    postImage.setImagePath("/uploads/" + fileName);
                    postImageRepository.save(postImage);
                }
            }

            // 해시태그 처리
            if (hashtags != null && !hashtags.isEmpty()) {
                for (String rawTag : hashtags) {
                    String word = rawTag.replaceAll("[#\\s]", ""); // #, 공백 제거

                    // 기존 해시태그 재사용
                    STYLE_Hashtag tag = hashtagRepository.findByWord(word)
                            .orElseGet(() -> {
                                STYLE_Hashtag newTag = new STYLE_Hashtag();
                                newTag.setWord(word);
                                return hashtagRepository.save(newTag);
                            });

                    // 게시글-태그 매핑
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

}
