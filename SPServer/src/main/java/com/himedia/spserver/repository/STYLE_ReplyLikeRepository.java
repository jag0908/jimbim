package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.STYLE.STYLE_Reply;
import com.himedia.spserver.entity.STYLE.STYLE_Reply_Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface STYLE_ReplyLikeRepository extends JpaRepository<STYLE_Reply_Like, Integer> {

    // 특정 댓글에 특정 회원이 좋아요 눌렀는지 확인
    Optional<STYLE_Reply_Like> findByReplyAndMember(STYLE_Reply reply, Member member);


    // 댓글별 좋아요 개수
    int countByReply(STYLE_Reply reply);

    boolean existsByReplyAndMember(STYLE_Reply reply, Member member);

}
