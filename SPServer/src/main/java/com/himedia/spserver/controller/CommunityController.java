package com.himedia.spserver.controller;

import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.service.CommunityService;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;

@RestController
@RequestMapping("/community")
public class CommunityController {

    @Autowired
    CommunityService cs;
//
//    @GetMapping("/getCommunityList/{page}")
//    public HashMap<String, Object> getCommunityList(@PathVariable("page") int page){
//        HashMap<String, Object> result = cs.getCommunityList( page );
//        return result;
//    }
//
//    @Autowired
//    ServletContext sc;
//
//    @PostMapping("/fileupload")
//    public HashMap<String, Object> uploadFile(@RequestParam("image") MultipartFile file){
//        HashMap<String, Object> result = new HashMap<>();
//        String path = sc.getRealPath("/images");
//        Calendar today = Calendar.getInstance();
//        long dt = today.getTimeInMillis();
//        String filename = file.getOriginalFilename();
//        String fn1 = filename.substring(0, filename.indexOf(".")); // . 왼쪽 파일이름
//        String fn2 = filename.substring(filename.indexOf(".")); // . 오른쪽 확장자
//        String uploadPath = path + "/" + fn1 + dt + fn2;
//        try{
//            file.transferTo( new File(uploadPath) ); // 파일 저장
//            result.put("image", filename);
//            result.put("savefilename", fn1 + dt + fn2);
//        }catch (IllegalStateException | IOException e){
//            e.printStackTrace();
//        }
//        return result;
//    }
//
//    @PostMapping("/insertCommunity")
//    public HashMap<String, Object> insertCommunity(@RequestBody C_post post) {
//        HashMap<String, Object> result = new HashMap<>();
//        cs.insertCommunity( post );
//        result.put("msg", "ok");
//        return result;
//    }
//
//    @PostMapping("/addReadCount")
//    public HashMap<String, Object> addReadCount(@RequestParam("num") int num ){
//        HashMap<String, Object> result = new HashMap<>();
//        cs.addReadCount( num );
//        result.put("msg", "ok");
//        return result;
//    }
//
//    @GetMapping("/getCommunity/{num}")
//    public HashMap<String, Object> getCommunity(@PathVariable("num") int num){
//        HashMap<String, Object> result = new HashMap<>();
//        result.put("community", cs.getCommunity(num));
//        return result;
//    }
//
//    @DeleteMapping("/deleteCommunity/{communitynum}")
//    public HashMap<String, Object> deleteCommunity(@PathVariable("communitynum") int communitynum){
//        HashMap<String, Object> result = new HashMap<>();
//        cs.deleteCommunity(communitynum);
//        result.put("msg", "ok");
//        return result;
//    }
//
//    @PostMapping("/updateCommunity")
//    public HashMap<String, Object> updateCommunity(@RequestBody C_post post){
//        HashMap<String, Object> result = cs.updateCommunity(post);
//        return result;
//    }



}
