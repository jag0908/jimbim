package com.himedia.spserver.controller;

import com.himedia.spserver.dto.*;
import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.service.S3UploadService;
import com.himedia.spserver.service.ShService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/sh-page")
public class ShController {

    @Autowired
    ShService ss;

    @Autowired
    S3UploadService sus;

    @GetMapping("/sh-list")
    public HashMap<String, Object> shList() {
        HashMap<String, Object> result = new HashMap<>();

        // 서비스에서 DTO 변환된 게시글 목록 조회
        List<ShPostDto> shList = ss.getShList();

        if (shList == null || shList.isEmpty()) {
            result.put("msg", "<h1>텅 비었습니다.</h1>");
        } else {
            result.put("msg", "ok");
            result.put("shList", shList);
        }

        return result;
    }

    @GetMapping("/sh-category")
    public HashMap<String, Object> shCategory() {
        HashMap<String, Object> result = new HashMap<>();
        ArrayList<SH_Category> shCategorys = ss.getShCategorys();

        if (shCategorys == null || shCategorys.isEmpty()) {
            result.put("msg", "메뉴");
        } else {
            result.put("msg", "ok");
            result.put("shCategory", shCategorys);
        }

        return result;
    }

    @PostMapping("/sh-write")
    public HashMap<String, Object> shWrite(
            @RequestParam("member_id") Member member_id,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("price") Integer price,
            @RequestParam("categoryId") String categoryId,
            @RequestParam("directYN") String directYN,
            @RequestParam("deliveryYN") String deliveryYN,
            @RequestParam(value = "deliveryPrice", required = false, defaultValue = "0") Integer deliveryPrice
    ) {
        HashMap<String, Object> result = new HashMap<>();

        SH_post post = ss.insertShPost(member_id, title, content, price, categoryId, directYN, deliveryYN, deliveryPrice);

        boolean firstFile = true; // 첫 번째 파일 체크
        for(MultipartFile file : files) {
            try {
                String uploadFilePathName = sus.saveFile( file );
                result.put("files", uploadFilePathName);


                File savedFile = ss.insertFiles(post, file.getOriginalFilename(), uploadFilePathName, file.getSize(), file.getContentType());
                // 첫 번째 파일이면 대표이미지로 설정
                if(firstFile) {
                    ss.updateRepresentFile(post, savedFile);
                    firstFile = false;
                }

            } catch (IllegalStateException | IOException e) {
                e.printStackTrace();
            }
        }

        result.put("msg", "ok");
        return result;
    }


    @GetMapping("/sh-view/{id}")
    public HashMap<String, Object> getPostView(@PathVariable Integer id) {
        HashMap<String, Object> result = new HashMap<>();
        ShPostDto post = ss.getShPost(id);
        ArrayList<SH_Category> shCategorys = ss.getShCategorys();
        result.put("post", post);
        result.put("category", shCategorys);

        return result;
    }



    @PostMapping("/sh-view-count")
    public HashMap<String, Object> shViewCount(@RequestBody ShViewCountDTO dto) {
        HashMap<String, Object> result = new HashMap<>();
        ss.addViewCount(dto.getPostId(), dto.getMemberId());
        return result;
    }

    @PostMapping("/sh-update")
    public HashMap<String, Object> shUpdate(@ModelAttribute ShPostUpdateReqDTO reqDto) {
        HashMap<String, Object> result = new HashMap<>();
        ShPostUpdateReqDTO resDto = ss.updatePost(reqDto);


        result.put("msg", "ok");
        result.put("resDto", resDto);

        return result;
    }

}
