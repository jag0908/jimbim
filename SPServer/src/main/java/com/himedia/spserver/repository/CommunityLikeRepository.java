package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Community.C_Like;
import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommunityLikeRepository extends JpaRepository<C_Like, Integer> {
    long countByCpost(C_post cpost);

    Optional<C_Like> findByMemberAndCpost(Member member, C_post cpost);
}
