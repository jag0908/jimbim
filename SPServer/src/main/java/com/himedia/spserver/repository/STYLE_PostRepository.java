package com.himedia.spserver.repository;

import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface STYLE_PostRepository extends JpaRepository<STYLE_post, Integer> {

    @Query("SELECT p FROM STYLE_post p ORDER BY p.indate DESC")
    List<STYLE_post> findAllByOrderByIndateDesc();

    Optional<STYLE_post> findBySpostId(Integer id);

    List<STYLE_post> findAllByMember_UseridOrderByIndateDesc(String userid);

    @Query("SELECT p FROM STYLE_post p LEFT JOIN p.likes l GROUP BY p ORDER BY COUNT(l) DESC, p.indate DESC")
    List<STYLE_post> findAllOrderByLikeCountDesc();

    @Query("SELECT p FROM STYLE_post p ORDER BY p.viewCount DESC, p.indate DESC")
    List<STYLE_post> findAllOrderByViewCountDesc();

    @Query("SELECT ph.postId FROM STYLE_Posthash ph WHERE ph.tagId.word = :tagName")
    List<STYLE_post> findPostsByTag(@Param("tagName") String tagName);
}
