package com.himedia.spserver.controller;

import com.himedia.spserver.dto.MemberDTO;
import com.himedia.spserver.service.StyleReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/style/reply")
@RequiredArgsConstructor
public class StyleReplyController {

    private final StyleReplyService stylereplyService;

    @PostMapping("/{spostId}")
    public ResponseEntity<?> addReply(
            @PathVariable Integer spostId,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal MemberDTO memberDTO
    ) {
        if (memberDTO == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Access token expired", "code", "TOKEN_EXPIRED"));
        }

        try {
            Integer parent_id = body.get("parent_id") != null ? ((Number) body.get("parent_id")).intValue() : null;
            String content = body.get("content") != null ? body.get("content").toString() : null;
            Map<String, Object> reply = stylereplyService.addReply(spostId, memberDTO.getUserid(), content, parent_id);
            return ResponseEntity.ok(Map.of("reply", reply));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 등록 실패");
        }
    }

    @GetMapping("/{spostId}")
    public ResponseEntity<?> getReplies(
            @PathVariable Integer spostId,
            @RequestParam(defaultValue = "latest") String sort,
            @AuthenticationPrincipal MemberDTO memberDTO
    ) {
        String loginUserid = (memberDTO != null) ? memberDTO.getUserid() : null;

        List<Map<String, Object>> replies = stylereplyService.findReplies(spostId, sort, loginUserid);
        return ResponseEntity.ok(replies);
    }

    @DeleteMapping("/{replyId}")
    public ResponseEntity<?> deleteReply(
            @PathVariable Integer replyId,
            @AuthenticationPrincipal MemberDTO memberDTO
    ) {
        if (memberDTO == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "로그인 필요"));
        }

        try {
            stylereplyService.deleteReply(replyId, memberDTO.getUserid());
            return ResponseEntity.ok(Map.of("message", "삭제 완료"));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(Map.of("message", e.getMessage()));
        }
    }

}
