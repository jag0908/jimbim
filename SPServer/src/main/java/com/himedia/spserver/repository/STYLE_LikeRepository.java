package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.STYLE.STYLE_Like;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface STYLE_LikeRepository extends JpaRepository<STYLE_Like, Integer> {

    int countBySpost(STYLE_post post);

    Optional<STYLE_Like> findByMemberidAndSpost(Member member, STYLE_post post);

    void deleteAllBySpost(STYLE_post post);

    @Query("SELECT l.spost.spostId, COUNT(l) FROM STYLE_Like l WHERE l.spost.spostId IN :ids GROUP BY l.spost.spostId")
    List<Object[]> countLikesByPostIds(@Param("ids") List<Integer> ids);
}
