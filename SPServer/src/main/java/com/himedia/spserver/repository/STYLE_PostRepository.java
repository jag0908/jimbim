package com.himedia.spserver.repository;

import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface STYLE_PostRepository extends JpaRepository<STYLE_post, Integer> {

    List<STYLE_post> findAllByMember_UseridOrderByIndateDesc(String userid);

    Optional<STYLE_post> findBySpostId(Integer id);

    @Query("""
        SELECT ps FROM STYLE_post ps
        LEFT JOIN FETCH ps.member m
        LEFT JOIN STYLE_Like l ON l.spost = ps
        GROUP BY ps
        ORDER BY ps.indate DESC
    """)
    List<STYLE_post> findAllWithMemberOrderByIndateDesc();


    // 회원 리스트에 해당하는 게시글 + 파일 한 번에 가져오기
    @Query("SELECT DISTINCT p FROM STYLE_post p LEFT JOIN FETCH p.member m WHERE m.member_id IN :memberIds")
    List<STYLE_post> findAllWithMemberByMemberIds(@Param("memberIds") List<Integer> memberIds);

    @Query("SELECT p FROM STYLE_post p JOIN FETCH p.member m ORDER BY p.viewCount DESC")
    List<STYLE_post> findAllOrderByViewsDesc();

    @Query("""
           SELECT p FROM STYLE_post p
           LEFT JOIN FETCH p.member m
           LEFT JOIN STYLE_Like l ON l.spost = p
           GROUP BY p
           ORDER BY COUNT(l) DESC
           """)
    List<STYLE_post> findAllOrderByLikesDesc();

}
