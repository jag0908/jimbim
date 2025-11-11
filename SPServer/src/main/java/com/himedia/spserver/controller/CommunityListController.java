package com.himedia.spserver.controller;

import com.himedia.spserver.entity.Community.*;
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

@RestController
@RequestMapping("/communityList")
public class CommunityListController {

    @Autowired
    private CommunityListService cs;

    @GetMapping("/getCommunityList/{page}")
    public HashMap<String, Object> getCommunityList(@PathVariable int page) {
        return cs.getCommunityList(page);
    }

    @PostMapping("/addReadCount")
    public HashMap<String, Object> addReadCount(@RequestParam int num) {
        cs.addReadCount(num);
        HashMap<String, Object> result = new HashMap<>();
        result.put("msg", "ok");
        return result;
    }

    @Autowired
    ServletContext sc;
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
        try{
            file.transferTo(new File(uploadPath));
            result.put("image", filename);
            result.put("savefilename", fn1 + dt + fn2);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/updateCommunity")
    public HashMap<String, Object> updateCommunity(@RequestBody C_post cpost){
        HashMap<String, Object> result = cs.updateCommunity(cpost);
        return result;
    }

//    // 파일 업로드
//    @PostMapping("/fileupload")
//    public HashMap<String, Object> fileUpload(  @RequestParam("image") MultipartFile file ) {
//        HashMap<String , Object> result = new HashMap<>();
//        try {
//            String uploadFilePathName = sus.saveFile( file );
//            result.put("image", file.getOriginalFilename() );
//            result.put("savefilename", uploadFilePathName);
//        } catch (IllegalStateException | IOException e) {
//            e.printStackTrace();
//        }
//        return result;
//    }
//
//    // 게시글 등록
//    @PostMapping("/insertCommunity")
//    public HashMap<String, Object> insertCommunity(@RequestBody C_post post){
//        HashMap<String, Object> result = new HashMap<>();
//        cs.insertCommunity(post);
//        result.put("msg", "ok");
//        return result;
//    }
//
//    // 게시글 수정
//    @PostMapping("/updateCommunity")
//    public HashMap<String, Object> updateCommunity(@RequestBody C_post post) {
//        HashMap<String, Object> result = cs.updateCommunity(post);
//        return result;
//    }
//
//    // 게시글 삭제
//    @DeleteMapping("/delete/{num}")
//    public HashMap<String, Object> deleteCommunity(@PathVariable int num) {
//        HashMap<String, Object> result = new HashMap<>();
//        cs.deleteCommunity(num);
//        result.put("msg", "ok");
//        return result;
//    }
//
//    // 조회수 증가
//    @PostMapping("/addReadCount")
//    public HashMap<String, Object> addReadCount(@RequestParam("num") int num) {
//        HashMap<String, Object> result = new HashMap<>();
//        cs.addReadCount(num);
//        result.put("msg", "ok");
//        return result;
//    }
//
//    // 게시글 리스트 조회
//    @GetMapping("/getCommunityList/{page}")
//    public HashMap<String, Object> getCommunityList(@PathVariable int page) {
//        HashMap<String, Object> result = cs.getCommunityList(page);
//        return result;
//    }
//
//    // 게시글 상세조회
//    @GetMapping("/getCommunity/{num}")
//    public HashMap<String, Object> getCommunity(@PathVariable int num) {
//        HashMap<String, Object> result = new HashMap<>();
//        result.put("post", cs.getCommunity(num));
//        return result;
//    }


}
