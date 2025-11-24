package com.himedia.spserver.repository;

import com.himedia.spserver.dto.StylePostHashtagDTO;
import com.himedia.spserver.entity.STYLE.STYLE_Posthash;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface STYLE_PosthashRepository extends JpaRepository<STYLE_Posthash, Integer> {

    List<STYLE_Posthash> findByPostId(STYLE_post post);

    // 인기 해시태그 조회
    @Query("SELECT ph.tagId.word, COUNT(ph) as cnt FROM STYLE_Posthash ph GROUP BY ph.tagId.word ORDER BY cnt DESC")
    List<Object[]> findHotTags();

    // 여러 태그 단어에 해당하는 포스트 조회
    @Query("SELECT ph FROM STYLE_Posthash ph JOIN ph.tagId t WHERE t.word IN :tagWords")
    List<STYLE_Posthash> findByTagWords(@Param("tagWords") List<String> tagWords);

    // 포스트 ID 기준 해시태그 DTO 조회
    @Query("SELECT new com.himedia.spserver.dto.StylePostHashtagDTO(ph.postId.spostId, ph.tagId.word) " +
            "FROM STYLE_Posthash ph " +
            "WHERE ph.postId.spostId IN :postIds")
    List<StylePostHashtagDTO> findHashtagsByPostIds(@Param("postIds") List<Integer> postIds);

    @Query("""
        SELECT ph
        FROM STYLE_Posthash ph
        JOIN FETCH ph.postId p
        JOIN FETCH p.member m
        JOIN FETCH ph.tagId t
        WHERE t.word IN :tagWords
    """)
    List<STYLE_Posthash> findByTagWordsWithFetch(@Param("tagWords") List<String> tagWords);
}
