package com.himedia.spserver.controller;

import com.himedia.spserver.dto.CommunityReplyDTO;
import com.himedia.spserver.dto.CommunityReplyResponseDTO;
import com.himedia.spserver.entity.Community.C_Reply;
import com.himedia.spserver.entity.Community.C_Reply_Like;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.repository.CommunityReplyLikeRepository;
import com.himedia.spserver.repository.CommunityReplyRepository;
import com.himedia.spserver.repository.MemberRepository;
import com.himedia.spserver.service.CommunityReplyService;
import com.himedia.spserver.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/communityReply")
public class CommunityReplyController {

    private final CommunityReplyService crs; // 생성자 주입
    private final MemberRepository memberRepository;
    private final CommunityReplyRepository replyRepository;
    private final CommunityReplyLikeRepository replyLikeRepository;
    private final NotificationService notificationService;


    // 댓글 리스트 조회(이삭 수정)
    @GetMapping("/getReply/{cpostId}")
    public Map<String, Object> getReply(@PathVariable int cpostId, @RequestParam(required = false) Integer loginMemberId) {
        // 서비스에서 DTO 반환 (익명 여부 포함)
        List<CommunityReplyResponseDTO> replyList = crs.getReplyList(cpostId, loginMemberId);
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

    //이삭 수정

    // 댓글 좋아요 토글
    @PostMapping("/toggleReplyLike/{replyId}/{memberId}")
    public Map<String, Object> toggleReplyLike(
            @PathVariable Integer replyId,   // primitive int -> Integer
            @PathVariable Integer memberId
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("회원이 없습니다."));
        C_Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("댓글이 없습니다."));

        Optional<C_Reply_Like> existingLike = replyLikeRepository.findByMemberAndReply(member, reply);

        boolean liked;
        if (existingLike.isPresent()) {
            replyLikeRepository.delete(existingLike.get());
            liked = false;
        } else {
            C_Reply_Like newLike = new C_Reply_Like();
            newLike.setMember(member);
            newLike.setReply(reply);
            replyLikeRepository.save(newLike);
            liked = true;

            // ✅ 알림 처리
            if (!reply.getMember().getMember_id().equals(member.getMember_id())) {
                notificationService.sendCommunityCommentLikeNotification(
                        reply.getMember(),
                        reply.getCpost().getCpostId().longValue(),
                        reply.getReplyId().longValue(),
                        member
                );
            }
        }

        // 좋아요 수
        long likeCount = replyLikeRepository.countByReply(reply);

        Map<String, Object> result = new HashMap<>();
        result.put("liked", liked);
        result.put("likeCount", likeCount);

        return result;
    }

}
