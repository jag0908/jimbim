package com.himedia.spserver.controller;
import com.himedia.spserver.dto.MemberDTO;
import com.himedia.spserver.dto.ShPostResDto;
import com.himedia.spserver.dto.ShPostWriteReqDto;
import com.himedia.spserver.dto.ShViewCountDTO;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.security.util.CustomJWTException;
import com.himedia.spserver.security.util.JWTUtil;
import com.himedia.spserver.service.S3UploadService;
import com.himedia.spserver.service.ShService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/sh-page")
public class ShController {

    @Autowired
    ShService ss;

    @GetMapping("/sh-category")
    public HashMap<String, Object> shCategory() {
        HashMap<String, Object> result = new HashMap<>();
        result.put("categoryList" ,ss.getCategoryList());
        return result;
    }

    @PostMapping("/sh-write")
    public HashMap<String, Object> shWrite(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("price") Integer price,
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam("directYN") String directYN,
            @RequestParam("deliveryYN") String deliveryYN,
            @RequestParam(value = "deliveryPrice", required = false) Integer deliveryPrice
    ) throws IOException, CustomJWTException {
        String token = authHeader.replace("Bearer ", "");
        Map<String, Object> claims = JWTUtil.validateToken(token);

        ShPostWriteReqDto reqDto = new ShPostWriteReqDto();
        reqDto.setMemberId((Integer) claims.get("member_id"));
        reqDto.setTitle(title);
        reqDto.setContent(content);
        reqDto.setPrice(price);
        reqDto.setCategoryId(categoryId);
        reqDto.setDirectYN(directYN);
        reqDto.setDeliveryYN(deliveryYN);
        reqDto.setDeliveryPrice(deliveryPrice);

        SH_post post = ss.insertPost(reqDto);
        ss.insertFile(files, post);

        HashMap<String, Object> result = new HashMap<>();
        return result;
    }

    @GetMapping("/sh-list")
    public HashMap<String, Object> shList() {
        HashMap<String, Object> result = new HashMap<>();
        result.put("postList", ss.getPostList());

        return result;
    }

    @PostMapping("/sh-view-count")
    public HashMap<String, Object> shViewCount(@RequestBody ShViewCountDTO shViewCountDTO) {
        HashMap<String, Object> result = new HashMap<>();
        ss.viewCount(shViewCountDTO);
        return  result;
    }

    @GetMapping("/sh-view/{id}")
    public HashMap<String, Object> shView(@PathVariable("id") Integer id) {
        HashMap<String, Object> result = new HashMap<>();
        ShPostResDto postData = ss.getPost(id);
        SH_Category categoryName = ss.getCategoryList().get(postData.getCategoryId());
        result.put("post", postData);
        result.put("category", categoryName);


        return result;
    }



}
