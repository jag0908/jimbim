package com.himedia.spserver.repository;

import com.himedia.spserver.entity.STYLE.STYLE_Posthash;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface STYLE_PosthashRepository extends JpaRepository<STYLE_Posthash, Integer> {

    List<STYLE_Posthash> findByPostId(STYLE_post post);

    @Query("SELECT ph.tagId.word AS tag, COUNT(ph) AS cnt FROM STYLE_Posthash ph GROUP BY ph.tagId.word ORDER BY cnt DESC")
    List<Object[]> findHotTags();
}
