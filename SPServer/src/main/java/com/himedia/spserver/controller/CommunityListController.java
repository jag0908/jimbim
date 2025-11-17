package com.himedia.spserver.controller;

import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.service.CommunityListService;
import com.himedia.spserver.service.S3UploadService;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/communityList")
public class CommunityListController {

    @Autowired
    private CommunityListService cs;

    @Autowired
    ServletContext sc;

    // 게시글 리스트 조회
    @GetMapping("/getCommunityList/{page}")
    public HashMap<String, Object> getCommunityList(@PathVariable int page,
                                                    @RequestParam(required = false) Integer categoryId) {
        return cs.getCommunityList(page, categoryId);
    }

    // 게시글 상세조회
    @GetMapping("/getCommunity/{id}")
    public HashMap<String, Object> getCommunity(@PathVariable int id) {
        HashMap<String, Object> result = new HashMap<>();
        Optional<C_post> post = cs.getCommunityById(id);
        if (post.isPresent()) {
            result.put("community", post.get());
        } else {
            result.put("error", "notfound");
        }
        return result;
    }

    // 조회수 증가
    @PostMapping("/addReadCount")
    public HashMap<String, Object> addReadCount(@RequestParam("num") int cpost_id) {
        cs.addReadCount(cpost_id);
        HashMap<String, Object> result = new HashMap<>();
        result.put("msg", "ok");
        return result;
    }

    // 게시글 작성
    @PostMapping("/createCommunity")
    public HashMap<String, Object> createCommunity(@RequestBody C_post cpost) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            cs.saveCommunity(cpost);
            result.put("msg", "ok");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "failed");
        }
        return result;
    }

    // 게시글 수정
    @PostMapping("/updateCommunity")
    public HashMap<String, Object> updateCommunity(@RequestBody C_post cpost) {
        return cs.updateCommunity(cpost);
    }

    // 게시글 삭제
    @DeleteMapping("/deleteCommunity/{id}")
    public HashMap<String, Object> deleteCommunity(@PathVariable int id) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            cs.deleteCommunity(id);
            result.put("msg", "deleted");
        } catch (Exception e) {
            result.put("error", "failed");
        }
        return result;
    }

    // 가장 최근 게시글 가져오기(날짜 제일 최근인 게시물)
    @GetMapping("/getNewCommunity")
    public HashMap<String, Object> getNewCommunity() {
        HashMap<String, Object> result = new HashMap<>();
        result.put("community", cs.getNewCommunity());
        return result;
    }

    // 파일 업로드
    @PostMapping("/fileupload")
    public HashMap<String, Object> fileUpload(@RequestParam("imageList") List<MultipartFile> file, @RequestParam("cpostId") String cpostId) {
        HashMap<String , Object> result = new HashMap<>();
        try {
            cs.fileUpload(file, cpostId);
            result.put("msg", "ok");
        } catch (IllegalStateException | IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    /*
    @PostMapping("/fileupload")
    public HashMap<String, Object> uploadFile(@RequestParam("image") MultipartFile file) {
        HashMap<String, Object> result = new HashMap<>();
        String path = sc.getRealPath("/images");
        Calendar today = Calendar.getInstance();
        long dt = today.getTimeInMillis();
        String filename = file.getOriginalFilename();
        if (filename == null) {
            result.put("error", "파일이 없습니다.");
            return result;
        }
        String fn1 = filename.substring(0, filename.lastIndexOf("."));
        String fn2 = filename.substring(filename.lastIndexOf("."));
        String uploadPath = path + "/" + fn1 + dt + fn2;
        try {
            file.transferTo(new File(uploadPath));
            result.put("image", filename);
            result.put("savefilename", fn1 + dt + fn2);
        } catch (IOException e) {
            e.printStackTrace();
            result.put("error", "파일 업로드 실패");
        }
        return result;
    }
    */
}
