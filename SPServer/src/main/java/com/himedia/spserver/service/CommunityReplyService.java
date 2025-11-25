package com.himedia.spserver.service;

import com.himedia.spserver.dto.CommunityReplyDTO;
import com.himedia.spserver.dto.CommunityReplyResponseDTO;
import com.himedia.spserver.entity.Community.C_Reply;
import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.repository.CommunityListRepository;
import com.himedia.spserver.repository.CommunityReplyRepository;
import com.himedia.spserver.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityReplyService {

    private final CommunityReplyRepository crr;

    private final MemberRepository mr;

    private final CommunityListRepository cr;

    // 댓글 리스트 조회
    @Transactional(readOnly = true)
    public List<CommunityReplyResponseDTO> getReplyList(int cpostId) {
        List<C_Reply> replies = crr.findByCpostCpostIdOrderByReplyId(cpostId);
        // 엔티티 → DTO 변환
        return replies.stream()
                .map(r -> new CommunityReplyResponseDTO(
                        r.getReplyId(),
                        r.getContent(),
                        r.getMember().getUserid(),
                        r.getMember().getMember_id()
                ))
                .toList();
    }

    // 댓글 추가
    @Transactional
    public void addReply(CommunityReplyDTO dto) {
        Member member = mr.findById(dto.getMemberId())
                .orElseThrow(() -> new RuntimeException("회원 없음"));

        C_post post = cr.findById(dto.getCpostId())
                .orElseThrow(() -> new RuntimeException("게시글 없음"));

        C_Reply reply = new C_Reply();
        reply.setContent(dto.getContent());
        reply.setMember(member);
        reply.setCpost(post);

        crr.saveAndFlush(reply); //수정: saveAndFlush로 즉시 DB 반영
    }

    // 댓글 삭제
    @Transactional
    public void deleteReply(int replyId) {
        C_Reply reply = crr.findByReplyId(replyId);
        if(reply != null) {
            crr.delete(reply);
        }
    }
}
