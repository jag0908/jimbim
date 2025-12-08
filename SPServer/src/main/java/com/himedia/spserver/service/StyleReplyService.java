package com.himedia.spserver.service;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.STYLE.STYLE_Reply;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import com.himedia.spserver.repository.MemberRepository;
import com.himedia.spserver.repository.STYLE_PostRepository;
import com.himedia.spserver.repository.STYLE_ReplyLikeRepository;
import com.himedia.spserver.repository.STYLE_ReplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class StyleReplyService {

    private final STYLE_ReplyRepository replyRepository;
    private final STYLE_PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final STYLE_ReplyLikeRepository replyLikeRepository;
    private final NotificationService notificationService;

    public Map<String, Object> addReply(Integer spostId, String userid, String content, Integer parent_id) {
        Member member = memberRepository.findByUserid(userid);
        if (member == null) throw new RuntimeException("사용자를 찾을 수 없습니다");

        STYLE_post post = postRepository.findById(spostId)
                .orElseThrow(() -> new RuntimeException("게시물을 찾을 수 없습니다"));

        STYLE_Reply reply = new STYLE_Reply();
        reply.setSpost(post);
        reply.setMemberid(member);
        reply.setContent(content);

        if (parent_id != null) {
            STYLE_Reply parent = replyRepository.findById(parent_id)
                    .orElseThrow(() -> new RuntimeException("부모 댓글 없음"));
            reply.setParent(parent);
        }

        reply.setIndate(new Timestamp(System.currentTimeMillis()));
        replyRepository.save(reply);

        Member postOwner = post.getMember();
        if (!postOwner.getUserid().equals(userid)) { // 본인이 자기글에 쓴 건 알림 X
            notificationService.sendReplyNotification(postOwner, spostId.longValue(), member);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("reply_id", reply.getReply_id());
        result.put("userid", reply.getMemberid().getUserid());
        result.put("profileImg", reply.getMemberid().getProfileImg());
        result.put("content", reply.getContent());
        result.put("indate", reply.getIndate());
        result.put("parent_id", reply.getParent() != null ? reply.getParent().getReply_id() : null);

        return result;
    }

    public void deleteReply(Integer replyId, String userid) {
        STYLE_Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        if (!reply.getMemberid().getUserid().equals(userid)) {
            throw new RuntimeException("본인 댓글만 삭제할 수 있습니다.");
        }

        replyRepository.delete(reply);
    }

    public List<Map<String, Object>> findReplies(Integer spostId, String sortBy, String loginUserid) {

        // 1) 게시글 조회
        STYLE_post spost = postRepository.findById(spostId)
                .orElseThrow(() -> new RuntimeException("게시물을 찾을 수 없습니다"));

        // 2) 로그인 사용자 조회
        Member loginMember = null;
        if (loginUserid != null) {
            loginMember = memberRepository.findByUserid(loginUserid);
        }
        final Member finalLoginMember = loginMember; // final 처리

        // 3) 정렬 방식 선택
        List<STYLE_Reply> list =
                "like".equals(sortBy)
                        ? replyRepository.findBySpostOrderByLikeCountDesc(spost)
                        : replyRepository.findBySpostOrderByIndateDesc(spost);

        // 4) 결과 구성
        return list.stream()
                .map(r -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("reply_id", r.getReply_id());
                    map.put("userid", r.getMemberid().getUserid());
                    map.put("profileImg", r.getMemberid().getProfileImg());
                    map.put("content", r.getContent());
                    map.put("indate", r.getIndate());
                    map.put("parent_id", r.getParent() != null ? r.getParent().getReply_id() : null);

                    // 좋아요 개수
                    int likeCount = replyLikeRepository.countByReply(r);
                    map.put("likeCount", likeCount);

                    // 로그인한 유저가 좋아요 눌렀는지
                    boolean liked = false;
                    if (finalLoginMember != null) {
                        liked = replyLikeRepository.existsByReplyAndMember(r, finalLoginMember);
                    }
                    map.put("liked", liked);

                    return map;
                })
                .toList();
    }
}
