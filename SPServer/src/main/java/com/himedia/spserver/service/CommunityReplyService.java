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

        // 부모 댓글만 가져오기
        List<C_Reply> parentReplies = replies.stream()
                .filter(r -> r.getParentReply() == null)
                .toList();

        return parentReplies.stream()
                .map(this::mapToDTO)
                .toList();
    }

    private CommunityReplyResponseDTO mapToDTO(C_Reply reply) {
        List<CommunityReplyResponseDTO> children = reply.getChildReplies().stream()
                .map(this::mapToDTO)
                .toList();

        // null-safe 익명 처리
        boolean isAnonymous = Boolean.TRUE.equals(reply.getAnonymous());

        return new CommunityReplyResponseDTO(
                reply.getReplyId(),
                reply.getContent(),
                isAnonymous ? "익명" : reply.getMember().getUserid(),
                reply.getMember().getMember_id(),
                reply.getIndate().toString(),
                reply.getParentReply() != null ? reply.getParentReply().getReplyId() : null,
                children,
                isAnonymous // DTO에 익명 여부 포함
        );
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

        // ★ 익명 여부 세팅
        reply.setAnonymous(dto.getAnonymous() != null && dto.getAnonymous());

        if (dto.getParentReplyId() != null) {
            C_Reply parent = crr.findById(dto.getParentReplyId())
                    .orElseThrow(() -> new RuntimeException("부모 댓글 없음"));
            reply.setParentReply(parent);
        }

        crr.saveAndFlush(reply);
    }

    // 댓글 삭제
    @Transactional
    public void deleteReply(int replyId) {
        C_Reply reply = crr.findByReplyId(replyId);
        if (reply != null) {
            deleteReplyRecursively(reply);
        }
    }

    private void deleteReplyRecursively(C_Reply reply) {
        if (reply.getChildReplies() != null) {
            for (C_Reply child : reply.getChildReplies()) {
                deleteReplyRecursively(child);
            }
        }
        crr.delete(reply);
    }

}
