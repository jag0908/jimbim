package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.SH_post;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface ShRepository extends JpaRepository<SH_post, Integer
        > {
    ArrayList<SH_post> findAllByOrderByIndateDesc();

    // 대표이미지까지 한 번에 fetch
    @Query("SELECT p FROM SH_post p LEFT JOIN FETCH p.representFile ORDER BY p.indate DESC")
    List<SH_post> findAllWithRepresentFile();

    SH_post findByPostId(Integer id);

}
