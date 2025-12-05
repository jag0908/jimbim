package com.himedia.spserver.controller;


import com.himedia.spserver.dto.MemberDTO;
import com.himedia.spserver.dto.ShPostResDto;
import com.himedia.spserver.dto.StylePostDTO;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.STYLE.STYLE_Reply;
import com.himedia.spserver.entity.STYLE.STYLE_Reply_Like;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import com.himedia.spserver.repository.FollowRepository;
import com.himedia.spserver.repository.MemberRepository;
import com.himedia.spserver.repository.STYLE_ReplyLikeRepository;
import com.himedia.spserver.repository.STYLE_ReplyRepository;
import com.himedia.spserver.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/style")
@RequiredArgsConstructor
public class StyleController {

    private final StyleService styleService;
    private final StyleReplyService styleReplyService;
    private final S3UploadService sus;
    private final MemberRepository memberRepository;
    private final FollowRepository followRepository;
    private final ShService shs;
    private final STYLE_ReplyRepository replyRepository;
    private final NotificationService notificationService;
    private final STYLE_ReplyLikeRepository replyLikeRepository;

    @GetMapping("/posts")
    public List<StylePostDTO> getAllPosts(){
        return styleService.getAllPosts();
    }

    @GetMapping("/trending")
    public ResponseEntity<List<StylePostDTO>> getTrendingPosts() {
        return ResponseEntity.ok(styleService.getAllPostsOrderByLikesDTO());
    }

    @GetMapping("/views")
    public ResponseEntity<List<StylePostDTO>> getPopularPosts() {
        return ResponseEntity.ok(styleService.getAllPostsOrderByViewsDTO());
    }

    @GetMapping("/hot-tags")
    public ResponseEntity<?> getHotTags() {
        return ResponseEntity.ok(styleService.getHotTags());
    }

    @GetMapping("/hot-users")
    public ResponseEntity<?> getHotUsers() {
        return ResponseEntity.ok(styleService.getHotUsers());
    }

    @GetMapping("/posts/{userid}")
    public ResponseEntity<?> getUserPosts(@PathVariable String userid) {
        List<StylePostDTO> posts = styleService.getPostsByUseridDTO(userid);
        if (posts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "작성한 게시물이 없습니다."));
        }
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/userinfo/{userid}")
    public ResponseEntity<?> getUserInfo(@PathVariable String userid) {
        Member member = memberRepository.findByUserid(userid);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "사용자를 찾을 수 없습니다."));
        }

        String defaultProfileImg = "/images/default-profile.png";

        String profileImg = member.getProfileImg() != null ? member.getProfileImg() : defaultProfileImg;
        String intro = member.getProfileMsg() != null ? member.getProfileMsg() : "";

        Map<String, Object> result = new HashMap<>();
        result.put("userid", member.getUserid());
        result.put("nickname", member.getName());
        result.put("profileImg", profileImg);
        result.put("intro", intro);
        result.put("memberId", member.getMember_id());

        result.put("followers", followRepository.findByEndMember(member).size());
        result.put("following", followRepository.findByStartMember(member).size());

        List<ShPostResDto> sellPosts = shs.getPostsByMemberId(member.getMember_id());
        result.put("sellPosts", sellPosts);


        return ResponseEntity.ok(result);
    }


    @GetMapping("/post/{id}")
    public ResponseEntity<?> getPost(
            @PathVariable Integer id,
            @AuthenticationPrincipal MemberDTO memberDTO) {

        STYLE_post post = styleService.findBySpostId(id);

        // 조회수 증가
        post.setViewCount(post.getViewCount() + 1);
        styleService.save(post);

        List<String> imageUrls = styleService.getAllImageUrls(post);

        // ★ 로그인 유저 아이디 추출
        String loginUserid = (memberDTO != null) ? memberDTO.getUserid() : null;

        // 게시글 좋아요 여부
        boolean liked = false;
        if (loginUserid != null) {
            liked = styleService.isLikedByUser(id, loginUserid);
        }

        // ★ 댓글 가져올 때 좋아요 포함된 findReplies 호출
        List<Map<String, Object>> replies =
                styleReplyService.findReplies(id, "latest", loginUserid);

        Map<String, Object> result = new HashMap<>();
        result.put("title", post.getTitle());
        result.put("content", post.getContent());
        result.put("userid", post.getMember().getUserid());
        result.put("profileImg", post.getMember().getProfileImg());
        result.put("s_images", imageUrls);
        result.put("liked", liked);
        result.put("likeCount", styleService.countLikes(id));
        result.put("replies", replies);
        result.put("hashtags", styleService.findHashtags(id));
        result.put("indate", post.getIndate());
        result.put("viewCount", post.getViewCount());

        return ResponseEntity.ok(result);
        }

    @PostMapping("/write")
    public ResponseEntity<?> uploadStylePost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) List<MultipartFile> images,
            @RequestParam(value = "hashtags", required = false) List<String> hashtags,
            @AuthenticationPrincipal MemberDTO memberDTO
    ) {
        if (images != null && images.size() > 10) {
            return ResponseEntity.badRequest().body("이미지는 최대 10장까지 업로드 가능합니다.");
        }

        try {
            styleService.saveStylePost(title, content, images, memberDTO.getUserid(), hashtags);
            return ResponseEntity.ok("Post created successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 등록 실패");
        }
    }

    @PostMapping("/fileupload")
    public HashMap<String, Object> fileUpload(@RequestParam("image") MultipartFile file) {
        HashMap<String, Object> result = new HashMap<>();

        if (file.isEmpty() || file.getOriginalFilename() == null) {
            result.put("error", "파일이 없습니다.");
            return result;
        }

        try {
            String fileUrl = sus.saveFile(file);
            result.put("image", fileUrl);
            result.put("filename", file.getOriginalFilename());
            result.put("size", file.getSize());
            result.put("contentType", file.getContentType());
        } catch (IllegalStateException | IOException e) {
            e.printStackTrace();
            result.put("error", "파일 업로드 실패: " + e.getMessage());
        }

        System.out.println("이미지 업로드 서버: " + result);
        return result;
    }

    @PostMapping("/like/{spostId}")
    public ResponseEntity<?> toggleLike(@PathVariable Integer spostId, @AuthenticationPrincipal MemberDTO memberDTO) {
        if (memberDTO == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            Map<String, Object> response = styleService.toggleLike(spostId, memberDTO.getUserid());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("좋아요 처리 실패");
        }
    }

    @PostMapping("/reply/like/{replyId}")
    public ResponseEntity<?> toggleReplyLike(
            @PathVariable Integer replyId,
            @AuthenticationPrincipal MemberDTO memberDTO
    ) {
        if (memberDTO == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "로그인 필요"));
        }

        STYLE_Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));

        Member member = memberRepository.findByUserid(memberDTO.getUserid());

        Optional<STYLE_Reply_Like> existing = replyLikeRepository.findByReplyAndMember(reply, member);

        boolean liked;
        if (existing.isPresent()) {
            replyLikeRepository.delete(existing.get());
            liked = false;
        } else {
            STYLE_Reply_Like newLike = new STYLE_Reply_Like();
            newLike.setReply(reply);
            newLike.setMember(member);
            replyLikeRepository.save(newLike);
            liked = true;

            // ⭐ 댓글 좋아요 알림 추가
            Member replyWriter = reply.getMemberid();
            if (!replyWriter.getUserid().equals(member.getUserid())) {
                notificationService.sendCommentLikeNotification(
                        replyWriter,
                        reply.getSpost().getSpostId().longValue(),
                        replyId.longValue(),
                        member
                );
            }
        }

        int likeCount = replyLikeRepository.countByReply(reply);

        return ResponseEntity.ok(Map.of(
                "liked", liked,
                "likeCount", likeCount
        ));
    }




    @DeleteMapping("/post/{spostId}")
    public ResponseEntity<?> deletePost(@PathVariable Integer spostId,
                                        @AuthenticationPrincipal MemberDTO memberDTO) {
        if (memberDTO == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "로그인이 필요합니다."));
        }

        try {
            styleService.deletePost(spostId, memberDTO.getUserid());
            return ResponseEntity.ok(Map.of("message", "게시글이 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/post/{spostId}")
    public ResponseEntity<?> editPost(
            @PathVariable Integer spostId,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) List<MultipartFile> newImages,
            @RequestParam(value = "existingImages", required = false) List<String> existingImages,
            @RequestParam(value = "hashtags", required = false) List<String> hashtags,
            @AuthenticationPrincipal MemberDTO memberDTO
    ) {
        if (memberDTO == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "로그인이 필요합니다."));
        }

        try {
            styleService.editPost(spostId, memberDTO.getUserid(), title, content, newImages, existingImages, hashtags);
            return ResponseEntity.ok(Map.of("message", "게시글이 수정되었습니다."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/zzim-list/{memberId}")
    public List<ShPostResDto> getZzimList(@PathVariable Integer memberId) {
        return styleService.getZzimPostsWithFirstImage(memberId);
    }


}

