package com.himedia.spserver.controller;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.service.ShService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/sh-page")
public class ShController {

    @Autowired
    ShService ss;

    @GetMapping("/sh-list")
    public HashMap<String, Object> shList() {
        HashMap<String, Object> result = new HashMap<>();
        ArrayList<SH_post> shList = ss.getShList();

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

        ss.insertShPost(member_id, title, content, price, categoryId, directYN, deliveryYN, deliveryPrice);
        ss.insertFiles(files);

        result.put("msg", "ok");
        return result;
    }


}
