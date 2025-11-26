package com.himedia.spserver.controller;


import com.himedia.spserver.dto.MemberDTO;
import com.himedia.spserver.dto.ShPostResDto;
import com.himedia.spserver.dto.StylePostDTO;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_File;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import com.himedia.spserver.repository.FollowRepository;
import com.himedia.spserver.repository.MemberRepository;
import com.himedia.spserver.service.S3UploadService;
import com.himedia.spserver.service.ShService;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/style")
@RequiredArgsConstructor
public class StyleController {

    private final StyleService styleService;
    private final S3UploadService sus;
    private final MemberRepository memberRepository;
    private final FollowRepository followRepository;
    private final ShService shs;

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

        Map<String, Object> result = new HashMap<>();
        result.put("userid", member.getUserid());
        result.put("nickname", member.getName());
        result.put("profileImg", member.getProfileImg());
        result.put("intro", member.getProfileMsg());
        result.put("memberId", member.getMember_id());

        result.put("followers", followRepository.findByEndMember(member).size());
        result.put("following", followRepository.findByStartMember(member).size());

        List<ShPostResDto> sellPosts = shs.getPostsByMemberId(member.getMember_id());
        result.put("sellPosts", sellPosts);


        return ResponseEntity.ok(result);
    }


    @GetMapping("/post/{id}")
    public ResponseEntity<?> getPost(@PathVariable Integer id, @AuthenticationPrincipal MemberDTO memberDTO) {
        STYLE_post post = styleService.findBySpostId(id);

        post.setViewCount(post.getViewCount() + 1);
        styleService.save(post);

        List<String> imageUrls = styleService.getAllImageUrls(post);

        boolean liked = false; // 기본값 false
        if (memberDTO != null) {
            // 로그인한 경우 좋아요 여부 확인
            liked = styleService.isLikedByUser(id, memberDTO.getUserid());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("title", post.getTitle());
        result.put("content", post.getContent());
        result.put("userid", post.getMember().getUserid());
        result.put("profileImg", post.getMember().getProfileImg());
        result.put("s_images", imageUrls);
        result.put("liked", liked);
        result.put("likeCount", styleService.countLikes(id));
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

