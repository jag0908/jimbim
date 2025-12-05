package com.himedia.spserver.service;

import com.himedia.spserver.dto.CommunityReplyDTO;
import com.himedia.spserver.dto.CommunityReplyResponseDTO;
import com.himedia.spserver.entity.Community.C_Reply;
import com.himedia.spserver.entity.Community.C_Reply_Like;
import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.repository.CommunityListRepository;
import com.himedia.spserver.repository.CommunityReplyLikeRepository;
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
    private final CommunityReplyLikeRepository replyLikeRepo; //이삭 수정
    private final NotificationService notificationService;

    // 댓글 좋아요 토글
    @Transactional
    public boolean toggleReplyLike(int replyId, int memberId) {
        C_Reply reply = crr.findById(replyId)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));
        Member member = mr.findById(memberId)
                .orElseThrow(() -> new RuntimeException("회원 없음"));

        var existingLike = replyLikeRepo.findByMemberAndReply(member, reply);
        if (existingLike.isPresent()) {
            replyLikeRepo.delete(existingLike.get());
            return false; // 좋아요 취소
        } else {
            C_Reply_Like newLike = new C_Reply_Like();
            newLike.setReply(reply);
            newLike.setMember(member);
            replyLikeRepo.save(newLike);
            return true; // 좋아요 추가
        }
    }

    // 댓글 좋아요 수 조회
    @Transactional(readOnly = true)
    public long getReplyLikeCount(int replyId) {
        C_Reply reply = crr.findById(replyId)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));
        return replyLikeRepo.countByReply(reply);
    }

    // 특정 사용자가 댓글 좋아요 했는지 체크
    @Transactional(readOnly = true)
    public boolean hasUserLikedReply(int replyId, int memberId) {
        C_Reply reply = crr.findById(replyId).orElseThrow();
        Member member = mr.findById(memberId).orElseThrow();
        return replyLikeRepo.findByMemberAndReply(member, reply).isPresent();
    }

    // 댓글 리스트 조회 시 좋아요 수 및 좋아요 여부 포함 DTO 변환
    public List<CommunityReplyResponseDTO> getReplyListWithLikes(int cpostId, Integer loginMemberId) {
        List<C_Reply> replies = crr.findByCpostCpostIdOrderByReplyId(cpostId);
        List<C_Reply> parentReplies = replies.stream()
                .filter(r -> r.getParentReply() == null)
                .toList();

        return parentReplies.stream()
                .map(reply -> mapToDTOWithLike(reply, loginMemberId))
                .toList();
    }

    private CommunityReplyResponseDTO mapToDTOWithLike(C_Reply reply, Integer loginMemberId) {
        List<CommunityReplyResponseDTO> children = reply.getChildReplies().stream()
                .map(child -> mapToDTOWithLike(child, loginMemberId))
                .toList();

        boolean isAnonymous = Boolean.TRUE.equals(reply.getAnonymous());
        long likeCount = replyLikeRepo.countByReply(reply);
        boolean likedByUser = false;

        if (loginMemberId != null) {
            likedByUser = replyLikeRepo.findByMemberAndReply(
                    mr.findById(loginMemberId).orElse(null), reply).isPresent();
        }

        // 10개 인자로 생성 (likeCount, likedByUser 초기값 설정)
        CommunityReplyResponseDTO dto = new CommunityReplyResponseDTO(
                reply.getReplyId(),
                reply.getContent(),
                isAnonymous ? "익명" : reply.getMember().getUserid(),
                reply.getMember().getMember_id(),
                reply.getIndate().toString(),
                reply.getParentReply() != null ? reply.getParentReply().getReplyId() : null,
                children,
                isAnonymous,
                0L,        // likeCount 초기값
                false      // likedByUser 초기값
        );

        // 실제 값으로 setter 업데이트
        dto.setLikeCount(likeCount);
        dto.setLikedByUser(likedByUser);

        return dto;
    }

    // 댓글 리스트 조회
    @Transactional(readOnly = true)
    public List<CommunityReplyResponseDTO> getReplyList(int cpostId, Integer loginMemberId) {
        List<C_Reply> replies = crr.findByCpostCpostIdOrderByReplyId(cpostId);

        // 부모 댓글만 가져오기
        List<C_Reply> parentReplies = replies.stream()
                .filter(r -> r.getParentReply() == null)
                .toList();

        return parentReplies.stream()
                .map(reply -> mapToDTO(reply, loginMemberId))
                .toList();
    }

    private CommunityReplyResponseDTO mapToDTO(C_Reply reply, Integer loginMemberId) {
        List<CommunityReplyResponseDTO> children = reply.getChildReplies().stream()
                .map(child -> mapToDTO(child, loginMemberId))
                .toList();

        boolean isAnonymous = Boolean.TRUE.equals(reply.getAnonymous());
        long likeCount = replyLikeRepo.countByReply(reply);
        boolean likedByUser = false;

        if (loginMemberId != null) {
            likedByUser = replyLikeRepo.findByMemberAndReply(
                    mr.findById(loginMemberId).orElse(null), reply).isPresent();
        }

        CommunityReplyResponseDTO dto = new CommunityReplyResponseDTO(
                reply.getReplyId(),
                reply.getContent(),
                isAnonymous ? "익명" : reply.getMember().getUserid(),
                reply.getMember().getMember_id(),
                reply.getIndate().toString(),
                reply.getParentReply() != null ? reply.getParentReply().getReplyId() : null,
                children,
                isAnonymous,
                0L,        // likeCount 초기값
                false      // likedByUser 초기값
        );

        // 실제 값으로 setter 업데이트
        dto.setLikeCount(likeCount);
        dto.setLikedByUser(likedByUser);

        return dto;
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
        reply.setAnonymous(dto.getAnonymous() != null && dto.getAnonymous());

        if (dto.getParentReplyId() != null) {
            C_Reply parent = crr.findById(dto.getParentReplyId())
                    .orElseThrow(() -> new RuntimeException("부모 댓글 없음"));
            reply.setParentReply(parent);
        }

        crr.saveAndFlush(reply);

        // 알림 처리
        if (reply.getParentReply() == null) {
            // 게시글 작성자에게 댓글 알림
            notificationService.sendCommunityReplyNotification(
                    post.getMember(),
                    post.getCpostId().longValue(),
                    member,
                    false,
                    reply.getContent()
            );
        } else {
            // 부모 댓글 작성자에게 답글 알림
            C_Reply parent = reply.getParentReply();
            notificationService.sendCommunityReplyNotification(
                    parent.getMember(),
                    post.getCpostId().longValue(),
                    member,
                    true,
                    reply.getContent()
            );
        }
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
