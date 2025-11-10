package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.STYLE.STYLE_Like;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface STYLE_LikeRepository extends JpaRepository<STYLE_Like, Integer> {

    int countBySpost(STYLE_post post);

    Optional<STYLE_Like> findByMemberidAndSpost(Member member, STYLE_post post);
}
