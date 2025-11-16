package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.ShViewHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShViewRepository extends JpaRepository<ShViewHistory, Integer> {

    boolean existsByMemberIdAndPostId(Integer memberId, Integer postId);
}
