package com.himedia.spserver.controller;


import com.himedia.spserver.dto.MemberDTO;
import com.himedia.spserver.dto.StylePostDTO;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import com.himedia.spserver.repository.FollowRepository;
import com.himedia.spserver.repository.MemberRepository;
import com.himedia.spserver.service.S3UploadService;
import com.himedia.spserver.service.StyleService;
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

@RestController
@RequestMapping("/style")
@RequiredArgsConstructor
public class StyleController {

    private final StyleService styleService;
    private final S3UploadService sus;
    private final MemberRepository memberRepository;
    private final FollowRepository followRepository;

    @GetMapping("/posts")
    public List<StylePostDTO> getAllPosts(){
        return styleService.getAllPosts();
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

        Map<String, Object> result = new HashMap<>();
        result.put("userid", member.getUserid());
        result.put("nickname", member.getName());
        result.put("profileImg", member.getProfileImg());
        result.put("intro", member.getProfileMsg());

        // 팔로워/팔로잉 수
        result.put("followers", followRepository.findByEndMember(member).size());
        result.put("following", followRepository.findByStartMember(member).size());

        return ResponseEntity.ok(result);
    }


    @GetMapping("/post/{id}")
    public ResponseEntity<?> getPost(@PathVariable Integer id) {
        STYLE_post post = styleService.findBySpostId(id);

        // ✅ 조회수 증가 로직 추가
        post.setViewCount(post.getViewCount() + 1);
        styleService.save(post); // DB에 반영 (StyleService에 save 메서드 있어야 함)


        // File 엔티티 리스트 → 이미지 URL 리스트로 변환
        List<String> imageUrls = post.getFiles().stream()
                .map(file -> file.getPath()) // ✅ 실제 접근 경로로 변경
                .toList();


        Map<String, Object> result = new HashMap<>();
        result.put("title", post.getTitle());
        result.put("content", post.getContent());
        result.put("userid", post.getMember().getUserid());
        result.put("profileImg", post.getMember().getProfileImg());
        result.put("s_images", imageUrls);
        result.put("likesCount", styleService.countLikes(id));
        result.put("replies", styleService.findReplies(id));
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
            // S3 업로드 후 URL 반환
            String fileUrl = sus.saveFile(file); // 이미 URL 리턴

            // 클라이언트에게 반환할 데이터 구성
            result.put("image", fileUrl);   // S3 URL
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
            return ResponseEntity.ok(response); // { liked: true/false, likeCount: n }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("좋아요 처리 실패");
        }
    }


    // ✅ 팔로우 / 언팔로우 토글
    @PostMapping("/follow")
    public ResponseEntity<?> toggleFollow(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal MemberDTO memberDTO) {

        if (memberDTO == null) {
            return ResponseEntity.status(401).body(Map.of("error", "REQUIRE_LOGIN"));
        }

        String targetUserid = body.get("targetUserid");
        boolean followed = styleService.toggleFollow(memberDTO.getUserid(), targetUserid);

        return ResponseEntity.ok(Map.of(
                "followed", followed,
                "message", followed ? "팔로우 성공" : "언팔로우 됨"
        ));
    }

    // ✅ 팔로우 상태 확인
    @GetMapping("/follow/{targetUserid}")
    public ResponseEntity<?> checkFollow(@PathVariable String targetUserid,
                                         @AuthenticationPrincipal MemberDTO memberDTO) {
        if (memberDTO == null) {
            return ResponseEntity.ok(Map.of("followed", false));
        }

        boolean followed = styleService.isFollowing(memberDTO.getUserid(), targetUserid);
        return ResponseEntity.ok(Map.of("followed", followed));
    }

    @PostMapping("/reply/{spostId}")
    public ResponseEntity<?> addReply(
            @PathVariable Integer spostId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal MemberDTO memberDTO
    ) {
        if (memberDTO == null) {
            // Access Token 만료 시 응답
            Map<String, Object> res = new HashMap<>();
            res.put("error", "Access token expired");
            res.put("code", "TOKEN_EXPIRED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
        }

        try {
            Map<String, Object> replies = styleService.addReply(spostId, memberDTO.getUserid(), body.get("content"));
            return ResponseEntity.ok(Map.of("replies", replies));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 등록 실패");
        }
    }

    @DeleteMapping("/reply/{replyId}")
    public ResponseEntity<?> deleteReply(@PathVariable Integer replyId,
                                         @AuthenticationPrincipal MemberDTO memberDTO) {
        try {
            if (memberDTO == null) {
                throw new IllegalStateException("로그인이 필요합니다.");
            }
            styleService.deleteReply(replyId, memberDTO.getUserid());
            return ResponseEntity.ok(Map.of("message", "댓글이 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
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

}
