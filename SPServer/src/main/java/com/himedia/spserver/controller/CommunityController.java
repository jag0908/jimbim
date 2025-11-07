package com.himedia.spserver.controller;

import com.himedia.spserver.dto.Paging;
import com.himedia.spserver.entity.Community.*;
import com.himedia.spserver.entity.File;
//import com.himedia.spserver.service.CommunityService;
import com.himedia.spserver.service.S3UploadService;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/community")
public class CommunityController {

//    @Autowired
//    private CommunityService cs;
//
//    @Autowired
//    private ServletContext sc;
//
//    @Autowired
//    S3UploadService sus;

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
//    // 1. 카테고리 리스트 조회
//    @GetMapping("/categories")
//    public List<C_Category> getCategories() {
//        return cs.getAllCategories();
//    }
//
//    // 2. 카테고리별 게시글 리스트 + 페이징
//    @GetMapping("/list/{categoryId}/{page}")
//    public HashMap<String, Object> getCommunityListByCategory(
//            @PathVariable int categoryId,
//            @PathVariable int page) {
//
//        HashMap<String, Object> result = new HashMap<>();
//
//        // 1. 게시글 총 개수 조회
//        int totalCount = cs.countCommunityByCategory(categoryId);
//
//        // 2. Paging 객체 생성 및 계산
//        Paging paging = new Paging();
//        paging.setPage(page);
//        paging.setTotalCount(totalCount);
//        paging.calPaing();
//
//        // 3. 게시글 리스트 조회
//        List<C_post> communityList = cs.getCommunityByCategory(categoryId, page, paging.getDisplayRow());
//
//        // 4. 결과 반환
//        result.put("communityList", communityList);
//        result.put("paging", paging);
//        return result;
//    }
//
//    // 3. 게시글 상세 조회
//    @GetMapping("/{postId}")
//    public C_Category getCommunity(@PathVariable int postId) {
//        return cs.getCommunity(postId);
//    }
//
//    // 4. 게시글 등록
//    @PostMapping("/insert")
//    public HashMap<String, Object> insertCommunity(@RequestBody C_post post) {
//        HashMap<String, Object> result = new HashMap<>();
//        cs.insertCommunity(post);
//        result.put("msg", "ok");
//        return result;
//    }
//
//    // 5. 게시글 수정
//    @PostMapping("/update")
//    public HashMap<String, Object> updateCommunity(@RequestBody C_post post) {
//        return cs.updateCommunity(post);
//    }
//
//    // 6. 게시글 삭제
//    @DeleteMapping("/delete/{cpost_num}")
//    public HashMap<String, Object> deleteCommunity(@PathVariable int cpost_num) {
//        HashMap<String, Object> result = new HashMap<>();
//        cs.deleteCommunity(cpost_num);
//        result.put("msg", "ok");
//        return result;
//    }
//
//    // 7. 조회수 증가
//    @PostMapping("/addReadCount")
//    public HashMap<String, Object> addReadCount(@RequestParam("cpost_num") int num) {
//        HashMap<String, Object> result = new HashMap<>();
//        cs.addReadCount(num);
//        result.put("msg", "ok");
//        return result;
//    }
//
//    // 8. 파일 업로드
//    @PostMapping("/fileupload")
//    public HashMap<String, Object> uploadFile(@RequestParam("image") MultipartFile file) {
//        HashMap<String, Object> result = new HashMap<>();
//        String path = sc.getRealPath("/images");
//        Calendar today = Calendar.getInstance();
//        long dt = today.getTimeInMillis();
//        String filename = file.getOriginalFilename();
//        String fn1 = filename.substring(0, filename.indexOf("."));
//        String fn2 = filename.substring(filename.indexOf("."));
//        String uploadPath = path + "/" + fn1 + dt + fn2;
//
//        try {
//            // 실제 서버에 파일 저장
//            file.transferTo(new java.io.File(uploadPath));
//
//            // DB용 File 엔티티 생성 및 저장
//            File fileEntity = new File();
//            fileEntity.setOriginalname(filename);
//            fileEntity.setPath("/images/" + fn1 + dt + fn2);
//            fileEntity.setSize(String.valueOf(file.getSize()));
//            fileEntity.setContentType(file.getContentType());
//            cs.saveFile(fileEntity);
//
//            result.put("image", filename);
//            result.put("savefilename", fn1 + dt + fn2);
//        } catch (IllegalStateException | IOException e) {
//            e.printStackTrace();
//            result.put("msg", "error");
//        }
//
//        return result;
//    }
}
