package com.himedia.spserver.controller;

import com.himedia.spserver.dto.ShPostWriteReqDto;
import com.himedia.spserver.dto.ShopSuggestDto;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.entity.SHOP.SHOP_Suggest;
import com.himedia.spserver.repository.MemberRepository;
import com.himedia.spserver.security.util.CustomJWTException;
import com.himedia.spserver.security.util.JWTUtil;
import com.himedia.spserver.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/shop")
public class ShopController {

    @Autowired
    private ShopService ss;

    @Autowired
    private MemberRepository mr;

    @PostMapping("/shopSuggest")
    public HashMap<String, Object> shopSuggest(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("memberId") Integer memberId,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {
        HashMap<String, Object> result = new HashMap<>();

        try {
            ShopSuggestDto suggestDto = new ShopSuggestDto();
            suggestDto.setTitle(title);
            suggestDto.setContent(content);
            suggestDto.setMemberId(memberId);
            suggestDto.setFiles(files);

            SHOP_Suggest savePost = ss.saveSuggest(suggestDto);

            result.put("msg", "ok");
            result.put("suggestId", savePost.getSuggestId());

        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "failed");
        }
        return result;
    }


    @PostMapping("/fileupload")
    public HashMap<String, Object> fileUpload(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("suggestId") Integer suggestId) {

        HashMap<String, Object> result = new HashMap<>();
        try {
            if (files == null || files.isEmpty()) {
                result.put("error", "no files uploaded");
                return result;
            }

            ss.fileUpload(files, suggestId);
            result.put("msg", "ok");

        } catch (IOException e) {
            e.printStackTrace();
            result.put("error", "failed");
        }
        return result;
    }

    @GetMapping("/getSuggestList/{page}")
    public HashMap<String, Object> getSuggestList(
            @PathVariable int page,
            @RequestParam(required = false) Integer suggestId,
            @RequestParam(required = false) String title
    ) {
        return ss.getSuggestList(page, suggestId, title);
    }



}
