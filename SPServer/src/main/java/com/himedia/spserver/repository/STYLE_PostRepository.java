package com.himedia.spserver.repository;

import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface STYLE_PostRepository extends JpaRepository<STYLE_post, Integer> {

    @Query("SELECT p FROM STYLE_post p JOIN FETCH p.member ORDER BY p.indate DESC")
    List<STYLE_post> findAllWithMemberOrderByIndateDesc();

    List<STYLE_post> findAllByMember_UseridOrderByIndateDesc(String userid);

    @Query("""
        SELECT p
        FROM STYLE_post p
        JOIN FETCH p.member m
        LEFT JOIN STYLE_Like l ON l.spost = p
        GROUP BY p
        ORDER BY COUNT(l) DESC
    """)
    List<STYLE_post> findAllOrderByLikeCountDesc();

    @Query("""
        SELECT p
        FROM STYLE_post p
        JOIN FETCH p.member
        ORDER BY p.viewCount DESC
    """)
    List<STYLE_post> findAllOrderByViewCountDesc();

    @Query("""
        SELECT ph.postId
        FROM STYLE_Posthash ph
        JOIN ph.tagId t
        WHERE t.word = :tagName
    """)
    List<STYLE_post> findPostsByTag(@Param("tagName") String tagName);

    Optional<STYLE_post> findBySpostId(Integer id);

    // Member와 함께 포스트 조회 (N+1 방지)
    @Query("SELECT p FROM STYLE_post p JOIN FETCH p.member WHERE p.spostId IN :ids")
    List<STYLE_post> findAllWithMemberByIds(@Param("ids") List<Integer> ids);

    // 포스트 ID 목록 조회
    @Query("SELECT p.spostId FROM STYLE_post p ORDER BY p.indate DESC")
    List<Integer> findAllIds();

    @Query("""
        SELECT p
        FROM STYLE_post p
        JOIN FETCH p.member m
        WHERE m.member_id IN :memberIds
        ORDER BY p.indate DESC
    """)
    List<STYLE_post> findAllWithMemberByIdsForMembers(@Param("memberIds") List<Integer> memberIds);

    // 회원 리스트에 해당하는 게시글 + 파일 한 번에 가져오기
    @Query("SELECT DISTINCT p FROM STYLE_post p LEFT JOIN FETCH p.member m WHERE m.member_id IN :memberIds")
    List<STYLE_post> findAllWithMemberByMemberIds(@Param("memberIds") List<Integer> memberIds);

    @Query("SELECT f FROM File f WHERE f.post.spostId IN :postIds")
    List<File> findAllFilesByPostIds(@Param("postIds") List<Integer> postIds);
}
