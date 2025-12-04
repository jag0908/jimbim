package com.himedia.spserver.repository;

import com.himedia.spserver.entity.STYLE.STYLE_Reply;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface STYLE_ReplyRepository extends JpaRepository<STYLE_Reply, Integer> {

    List<STYLE_Reply> findBySpost(STYLE_post post);

    int countBySpost(STYLE_post post);

    List<STYLE_Reply> findBySpost_SpostIdIn(List<Integer> spostIds);

    // 최신순
    List<STYLE_Reply> findBySpostOrderByIndateDesc(STYLE_post post);

    // 좋아요 수 기준 정렬 (JPQL)
    @Query("""
        SELECT r
        FROM STYLE_Reply r
        LEFT JOIN STYLE_Reply_Like l ON l.reply = r
        WHERE r.spost = :post
        GROUP BY r
        ORDER BY COUNT(l) DESC
    """)
    List<STYLE_Reply> findBySpostOrderByLikeCountDesc(@Param("post") STYLE_post post);

}
