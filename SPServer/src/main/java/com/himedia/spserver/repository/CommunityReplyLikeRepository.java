package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Community.C_Reply;
import com.himedia.spserver.entity.Community.C_Reply_Like;
import com.himedia.spserver.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommunityReplyLikeRepository extends JpaRepository<C_Reply_Like, Integer> {
    long countByReply(C_Reply reply);

    Optional<C_Reply_Like> findByMemberAndReply(Member member, C_Reply reply);

    void deleteByReply_Cpost_CpostId(Integer cpostId);
}
