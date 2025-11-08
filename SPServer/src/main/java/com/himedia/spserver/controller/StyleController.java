package com.himedia.spserver.controller;


import com.himedia.spserver.dto.MemberDTO;
import com.himedia.spserver.dto.StylePostDTO;
import com.himedia.spserver.service.StyleService;
import jakarta.servlet.ServletContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/style")
@RequiredArgsConstructor
public class StyleController {

    private final StyleService styleService;

    @GetMapping("/posts")
    public List<StylePostDTO> getAllPosts(){
        return styleService.getAllPosts();
    }

    @GetMapping("/post/{id}")
    public ResponseEntity<?> getPost(@PathVariable Integer id) {
        StylePostDTO post = styleService.getPostDetail(id);
        if (post == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
        }
        return ResponseEntity.ok(post);
    }

    @PostMapping("/write")
    public ResponseEntity<?> uploadStylePost(
            @RequestParam("image") List<MultipartFile> images,
            @RequestParam("content") String content,
            @RequestParam(value = "hashtags", required = false) List<String> hashtags,
            @AuthenticationPrincipal MemberDTO memberDTO

    ) {
        String userid = memberDTO.getUserid();

        styleService.saveStylePost(images, content, userid, hashtags);
        return ResponseEntity.ok("Post created successfully");
    }

    @Autowired
    ServletContext sc;

    @PostMapping("/fileupload")
    public HashMap<String, Object> fileUpload(@RequestParam("image") MultipartFile file ) {
        HashMap<String , Object> result = new HashMap<>();
        String path = sc.getRealPath("/style_img");

        File uploadDir = new File(path);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs(); // 디렉토리 없으면 생성
        }

        Calendar today = Calendar.getInstance();
        long dt = today.getTimeInMillis();
        String filename = file.getOriginalFilename();
        String f1 = filename.substring(0, filename.lastIndexOf("."));
        String f2 = filename.substring(filename.lastIndexOf("."));
        String uploadPath = path + "/" + f1 + dt + f2;
        try {
            file.transferTo( new File(uploadPath) );
            result.put("filename", f1 + dt + f2);
        } catch (IllegalStateException | IOException e) {
            e.printStackTrace();
        }
        return result;
    }

}
