package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface SH_postRepository extends JpaRepository<SH_post,Integer> {
    List<SH_post> findAllByMember(Member member);

    @Query("SELECT p FROM SH_post p JOIN FETCH p.member WHERE p.title like %:key% ")
    List<SH_post> findByTitleContainingWithMember(String key);

    @Query("SELECT p FROM SH_post p JOIN FETCH p.member WHERE p.title like %:key% ")
    Page<SH_post> findByTitleContainingWithMember(String key, Pageable pageable);


    @Query("SELECT p FROM SH_post p JOIN FETCH p.member")
    List<SH_post> findWithMember();

    @Query("SELECT p FROM SH_post p JOIN FETCH p.member")
    Page<SH_post> findWithMember(Pageable pageable);

    @Query("SELECT p FROM SH_post p JOIN FETCH p.member WHERE p.postId = :postId")
    SH_post findByIdWithMember(int postId);
}
