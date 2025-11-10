package com.himedia.spserver.controller;


import com.himedia.spserver.dto.MemberDTO;
import com.himedia.spserver.dto.StylePostDTO;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.STYLE.STYLE_post;
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

    @GetMapping("/posts")
    public List<StylePostDTO> getAllPosts(){
        return styleService.getAllPosts();
    }

    @GetMapping("/post/{id}")
    public ResponseEntity<?> getPost(@PathVariable Integer id) {
        STYLE_post post = styleService.findBySpostId(id);

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

//    @Autowired
//    ServletContext sc;
//
//    @PostMapping("/fileupload")
//    public HashMap<String, Object> fileUpload(@RequestParam("image") MultipartFile file ) {
//        HashMap<String , Object> result = new HashMap<>();
//        String path = sc.getRealPath("/style_img");
//
//        File uploadDir = new File(path);
//        if (!uploadDir.exists()) {
//            uploadDir.mkdirs(); // 디렉토리 없으면 생성
//        }
//
//        Calendar today = Calendar.getInstance();
//        long dt = today.getTimeInMillis();
//        String filename = file.getOriginalFilename();
//        String f1 = filename.substring(0, filename.lastIndexOf("."));
//        String f2 = filename.substring(filename.lastIndexOf("."));
//        String uploadPath = path + "/" + f1 + dt + f2;
//        try {
//            file.transferTo( new File(uploadPath) );
//            result.put("filename", f1 + dt + f2);
//        } catch (IllegalStateException | IOException e) {
//            e.printStackTrace();
//        }
//        return result;
//    }


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


    @PostMapping("/follow")
    public ResponseEntity<?> toggleFollow(@RequestParam String targetUserid, @AuthenticationPrincipal MemberDTO memberDTO) {
        if (memberDTO == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            boolean followed = styleService.toggleFollow(memberDTO.getUserid(), targetUserid);
            Map<String, Object> res = new HashMap<>();
            res.put("followed", followed);
            res.put("message", followed ? "팔로우 성공" : "팔로우 취소");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("팔로우 처리 실패");
        }
    }

    @PostMapping("/reply/{spostId}")
    public ResponseEntity<?> addReply(
            @PathVariable Integer spostId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal MemberDTO memberDTO
    ) {
        if (memberDTO == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
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
    public ResponseEntity<?> deleteReply(@PathVariable Integer replyId, @AuthenticationPrincipal Member member) {
        try {
            styleService.deleteReply(replyId, member.getUserid());
            return ResponseEntity.ok(Map.of("message", "댓글이 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

}
