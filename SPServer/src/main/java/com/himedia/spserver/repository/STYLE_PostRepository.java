package com.himedia.spserver.repository;

import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface STYLE_PostRepository extends JpaRepository<STYLE_post, Integer> {

    @Query("SELECT p FROM STYLE_post p ORDER BY p.indate DESC")
    List<STYLE_post> findAllByOrderByIndateDesc();


    Optional<STYLE_post> findBySpostId(Integer id);

    List<STYLE_post> findAllByMember_UseridOrderByIndateDesc(String userid);
}
