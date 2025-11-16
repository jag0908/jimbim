package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.SH_File;
import com.himedia.spserver.entity.SH.SH_post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShFileRepository extends JpaRepository<SH_File, Integer> {
    SH_File findTop1ByPost_PostIdOrderByIndateDesc(Integer postId);

    List<SH_File> findAllByPost_postId(Integer id);

    // 특정 포스트의 최신 파일 1개 조회

}
