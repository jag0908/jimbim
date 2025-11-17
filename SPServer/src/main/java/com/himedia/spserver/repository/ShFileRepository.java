package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.SH_File;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShFileRepository extends JpaRepository<SH_File, Integer> {
    List<SH_File> findAllByPost_postId(Integer id);

    SH_File findTop1ByPost_PostIdOrderByIndateAsc(Integer postId);

    SH_File findByFileId(Integer rmFile);

    void deleteAllByPost_postId(Integer postId);

    // 특정 포스트의 최신 파일 1개 조회

}
