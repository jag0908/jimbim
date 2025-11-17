package com.himedia.spserver.repository;

import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface STYLE_PostRepository extends JpaRepository<STYLE_post, Integer> {

    Optional<STYLE_post> findBySpostId(Integer id);

    List<STYLE_post> findAllByMember_UseridOrderByIndateDesc(String userid);

    // 좋아요 기준 정렬
    @Query("SELECT p FROM STYLE_post p LEFT JOIN p.likes l GROUP BY p ORDER BY COUNT(l) DESC, p.indate DESC")
    List<STYLE_post> findAllOrderByLikeCountDesc();

    // 조회수 기준 정렬
    @Query("SELECT p FROM STYLE_post p ORDER BY p.viewCount DESC, p.indate DESC")
    List<STYLE_post> findAllOrderByViewCountDesc();

    // 태그별 포스트 조회
    @Query("SELECT ph.postId FROM STYLE_Posthash ph WHERE ph.tagId.word = :tagName")
    List<STYLE_post> findPostsByTag(@Param("tagName") String tagName);

    // 모든 포스트 ID 최신순
    @Query("SELECT p FROM STYLE_post p ORDER BY p.indate DESC")
    List<STYLE_post> findAllByOrderByIndateDesc();

    // =============================================
    // N+1 문제 해결용: 모든 연관 엔티티 한 번에 fetch
    @EntityGraph(attributePaths = {"likes", "replies", "files", "member", "hashtags"})
    @Query("SELECT p FROM STYLE_post p ORDER BY p.indate DESC")
    List<STYLE_post> findAllPostsWithDetails();

    @EntityGraph(attributePaths = {"likes", "replies", "files", "member", "hashtags"})
    @Query("SELECT p FROM STYLE_post p LEFT JOIN p.likes l GROUP BY p ORDER BY COUNT(l) DESC, p.indate DESC")
    List<STYLE_post> findAllPostsWithDetailsOrderByLikeCountDesc();

    @EntityGraph(attributePaths = {"likes", "replies", "files", "member", "hashtags"})
    @Query("SELECT p FROM STYLE_post p ORDER BY p.viewCount DESC, p.indate DESC")
    List<STYLE_post> findAllPostsWithDetailsOrderByViewCountDesc();
}
