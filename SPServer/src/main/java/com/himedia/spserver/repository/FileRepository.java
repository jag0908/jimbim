package com.himedia.spserver.repository;

import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import com.himedia.spserver.entity.SH.SH_post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FileRepository extends JpaRepository<File,Integer> {
        List<File> findAllByPost(STYLE_post post);

        List<File> findByPost(STYLE_post post);

        // 예: File 엔티티가 post 필드(다대일)로 STYLE_post 참조한다고 가정
        @Query("SELECT f.post.spostId, f.path FROM File f WHERE f.post.spostId IN :ids ORDER BY f.post.spostId, f.file_id")
        List<Object[]> findPathsByPostIds(@Param("ids") List<Integer> postIds);

        List<File> findByPost_SpostIdIn(List<Integer> postIds);
}
