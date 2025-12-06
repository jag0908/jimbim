package com.himedia.spserver.controller;

import com.himedia.spserver.dto.ShopSuggestDto;
import com.himedia.spserver.entity.SHOP.SHOP_Suggest;
import com.himedia.spserver.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/shop")
public class ShopController {

    @Autowired
    private ShopService ss;

    // 글 작성
    @PostMapping("/shopSuggest")
    public HashMap<String, Object> shopSuggest(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("price") Integer price,       // 추가함
            @RequestParam("memberId") Integer memberId,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            ShopSuggestDto suggestDto = new ShopSuggestDto();
            suggestDto.setTitle(title);
            suggestDto.setContent(content);
            suggestDto.setPri(price);
            suggestDto.setMemberId(memberId);
            suggestDto.setFiles(files);

            var saved = ss.saveSuggest(suggestDto);

            result.put("msg", "ok");
            result.put("suggest", ShopSuggestDto.fromEntity(saved));

        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "failed");
        }
        return result;
    }

    // 파일 업로드
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

        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "failed");
        }
        return result;
    }

    // 글 리스트 조회 (페이지 처리) → DTO로 변환, 리스트에는 제목 + 작성일만 포함
    @GetMapping("/getSuggestList/{page}")
    public HashMap<String, Object> getSuggestList(
            @PathVariable int page,
            @RequestParam(required = false) Integer memberId,
            @RequestParam(required = false) String title
    ) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            // Service에서 이미 DTO 변환까지 완료
            result = ss.getSuggestList(page, memberId, title);

            // 이제 result.get("list")는 ShopSuggestDto 리스트임
            // 엔티티처럼 캐스팅하지 말 것

        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "failed");
        }
        return result;
    }

    @DeleteMapping("/deleteSuggest/{suggestId}")
    public HashMap<String, Object> deleteSuggest(@PathVariable Integer suggestId) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            ss.deleteSuggest(suggestId);
            result.put("msg", "삭제 완료");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "삭제 실패");
        }
        return result;
    }

    @GetMapping("/getSuggestDetail/{id}")
    public HashMap<String, Object> getSuggestDetail(@PathVariable Integer id) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            SHOP_Suggest suggest = ss.getSuggestById(id)
                    .orElseThrow(() -> new RuntimeException("게시물이 존재하지 않습니다."));

            result.put("suggest", ShopSuggestDto.fromEntity(suggest));
            result.put("msg", "ok");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", e.getMessage());
        }
        return result;
    }

}
