package com.himedia.spserver.service;

import com.himedia.spserver.dto.StylePostDTO;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import com.himedia.spserver.repository.STYLE_LikeRepository;
import com.himedia.spserver.repository.STYLE_PostRepository;
import com.himedia.spserver.repository.STYLE_PosthashRepository;
import com.himedia.spserver.repository.STYLE_ReplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class StyleService {

    private final STYLE_PostRepository postRepository;
    private final STYLE_LikeRepository likeRepository;
    private final STYLE_ReplyRepository replyRepository;
    private final STYLE_PosthashRepository posthashRepository;

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

}
