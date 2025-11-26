package com.himedia.spserver.controller;

import com.himedia.spserver.dto.CommunityReplyDTO;
import com.himedia.spserver.dto.CommunityReplyResponseDTO;
import com.himedia.spserver.service.CommunityReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/communityReply")
public class CommunityReplyController {

    private final CommunityReplyService crs; // 생성자 주입

    // 댓글 리스트 조회
    @GetMapping("/getReply/{cpostId}")
    public Map<String, Object> getReply(@PathVariable int cpostId) {
        // 서비스에서 DTO 반환 (익명 여부 포함)
        List<CommunityReplyResponseDTO> replyList = crs.getReplyList(cpostId);
        Map<String, Object> result = new HashMap<>();
        result.put("replyList", replyList);
        return result;
    }

    // 댓글 추가
    @PostMapping("/addReply")
    public Map<String, String> addReply(@RequestBody CommunityReplyDTO dto) {
        // DTO에 포함된 anonymous 필드도 서비스로 전달
        crs.addReply(dto);
        Map<String, String> result = new HashMap<>();
        result.put("status", "success");
        return result;
    }

    // 댓글 삭제
    @DeleteMapping("/deleteReply/{replyId}")
    public Map<String, String> deleteReply(@PathVariable int replyId) {
        crs.deleteReply(replyId);
        Map<String, String> result = new HashMap<>();
        result.put("status", "deleted");
        return result;
    }
}
