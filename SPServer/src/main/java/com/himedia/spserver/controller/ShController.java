package com.himedia.spserver.controller;
import com.himedia.spserver.dto.*;
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
        HashMap<String, Object> result = new HashMap<>();

        String token = authHeader.replace("Bearer ", "");
        Map<String, Object> claims = JWTUtil.validateToken(token);

        ShPostWriteReqDto reqDto = new ShPostWriteReqDto();
        reqDto.setMemberId((Integer) claims.get("member_id"));
        reqDto.setTitle(title);
        reqDto.setContent(content);
        reqDto.setPrice(price);
        if(reqDto.getPrice() == null) {
            reqDto.setPrice(0);
        }
        reqDto.setCategoryId(categoryId);
        reqDto.setDirectYN(directYN);
        reqDto.setDeliveryYN(deliveryYN);
        reqDto.setDeliveryPrice(deliveryPrice);

        SH_post post = ss.insertPost(reqDto);
        if (files == null || files.isEmpty()) {
            return result;
        }
        ss.insertFile(files, post);


        return result;
    }

    @GetMapping("/sh-list/{page}")
    public HashMap<String, Object> shList(@PathVariable("page") int page) {
        HashMap<String, Object> result = new HashMap<>();
        result.put("postList", ss.getPostList(page));

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

    @PostMapping("/sh-update")
    public HashMap<String, Object> shUpdate(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "rmFiles", required = false) List<Integer> rmFiles,

            @RequestParam("postId") Integer postId,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("price") Integer price,
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam("directYN") String directYN,
            @RequestParam("deliveryYN") String deliveryYN,
            @RequestParam(value = "deliveryPrice", required = false) Integer deliveryPrice,
            @RequestParam("pMemnerId") Integer pMemnerId
    ) throws CustomJWTException, IOException {
        HashMap<String, Object> result = new HashMap<>();

        String token = authHeader.replace("Bearer ", "");
        Map<String, Object> claims = JWTUtil.validateToken(token);

        if(!(pMemnerId.equals(claims.get("member_id")))) {
            result.put("msg", "notOk");
            return result;
        }

        ShPostUpdateReqDTO reqDto = new ShPostUpdateReqDTO();
        reqDto.setPostId(postId);
        reqDto.setTitle(title);
        reqDto.setContent(content);
        reqDto.setPrice(price);
        reqDto.setCategoryId(categoryId);
        reqDto.setDirectYN(directYN);
        reqDto.setDeliveryYN(deliveryYN);
        reqDto.setDeliveryPrice(deliveryPrice);
        reqDto.setRmFiles(rmFiles);

        SH_post post = ss.updatePost(reqDto);
        if (files == null || files.isEmpty()) {
            return result;
        }
        ss.insertFile(files, post);
        return result;
    }

    @PostMapping("/delete-post")
    public HashMap<String, Object> deletePost(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("postId") Integer postId
    ) throws CustomJWTException {

        String token = authHeader.replace("Bearer ", "");
        Map<String, Object> claims = JWTUtil.validateToken(token);

        HashMap<String, Object> msg = ss.deletePost(postId, claims);

        return msg;
    }


    @PostMapping("/suggest")
    public HashMap<String, Object> insertSuggest(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ShSuggestDto reqDto
    ) throws CustomJWTException {
        HashMap<String, Object> result = new HashMap<>();
        String token = authHeader.replace("Bearer ", "");
        Map<String, Object> claims = JWTUtil.validateToken(token);

        ShSuggestDto resDto = ss.insertSuggest(claims, reqDto);

        result.put("msg", "ok");
        result.put("resDto", resDto);
        return result;
    }

    @GetMapping("/suggest")
    public HashMap<String, Object> getSuggest(@RequestParam("postId") Integer postId) {
        HashMap<String, Object> result = new HashMap<>();
        List<ShSuggestDto> resDto = ss.getSuggests(postId);
        result.put("msg", "ok");
        result.put("resDto", resDto);
        return result;
    }

    @PostMapping("/appSuggest")
    public HashMap<String, Object> appSuggest(@RequestParam("sid") Integer sid) {
        HashMap<String, Object> result = new HashMap<>();
        ss.appSuggest(sid);
        return result;
    }
}
