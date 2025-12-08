package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.SH_Suggest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShSuggestRepository extends JpaRepository<SH_Suggest, Integer> {

    Optional<SH_Suggest> findByMemberId(Integer memberId);

    List<SH_Suggest> findAllByPostId(Integer postId);

    Optional<SH_Suggest> findByMemberIdAndPostId(Integer memberId, Integer postId);

    List<SH_Suggest> findAllByPostIdOrderByIndateDesc(Integer postId);
}
