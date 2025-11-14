package com.himedia.spserver.controller;

import com.himedia.spserver.dto.CommunityViewDTO;
import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.service.CommunityListService;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
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

    // 조회수 증가
    @PostMapping("/addReadCount")
    public HashMap<String, Object> addReadCount(@RequestParam("num") int cpost_id) {
        cs.addReadCount(cpost_id);
        HashMap<String, Object> result = new HashMap<>();
        result.put("msg", "ok");
        return result;
    }

    // 게시글 상세조회
    @GetMapping("/getCommunity/{id}")
    public HashMap<String, Object> getCommunity(@PathVariable int id) {
        HashMap<String, Object> result = new HashMap<>();
        Optional<C_post> post = cs.getCommunityById(id);
        if(post.isPresent()) {
            result.put("community", post.get());
        } else {
            result.put("error", "notfound");
        }
        return result;
    }

    // 게시글 수정
    @PostMapping("/updateCommunity")
    public HashMap<String, Object> updateCommunity(@RequestBody C_post cpost){
        return cs.updateCommunity(cpost);
    }

    // 파일 업로드
    @PostMapping("/fileupload")
    public HashMap<String, Object> uploadFile(@RequestParam("image") MultipartFile file) {
        HashMap<String, Object> result = new HashMap<>();
        String path = sc.getRealPath("/images");
        Calendar today = Calendar.getInstance();
        long dt = today.getTimeInMillis();
        String filename = file.getOriginalFilename();
        String fn1 = filename.substring(0, filename.indexOf("."));
        String fn2 = filename.substring(filename.indexOf("."));
        String uploadPath = path + "/" + fn1 + dt + fn2;
        try {
            file.transferTo(new File(uploadPath));
            result.put("image", filename);
            result.put("savefilename", fn1 + dt + fn2);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }
}
