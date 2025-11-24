package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.SH_post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ShPostRepository extends JpaRepository<SH_post, Integer> {

//    List<SH_post> findAllByOrderByIndateDesc();
    Page<SH_post> findAllByOrderByIndateDesc(Pageable pageable);

    SH_post findByPostId(Integer postId);

    @Query("SELECT p FROM SH_post p JOIN FETCH p.member WHERE p.postId = :postId")
    Optional<SH_post> findByIdWithMember(Integer postId);


    //이삭 수정
    @Query(value = "SELECT * FROM SH_post WHERE memberid = :memberId", nativeQuery = true)
    List<SH_post> findByMemberId(Integer memberId);
}
