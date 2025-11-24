package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.STYLE.STYLE_Like;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface STYLE_LikeRepository extends JpaRepository<STYLE_Like, Integer> {

    Optional<STYLE_Like> findByMemberidAndSpost(Member member, STYLE_post post);

    int countBySpost(STYLE_post post);

    void deleteAllBySpost(STYLE_post post);

    List<STYLE_Like> findBySpost_SpostIdIn(List<Integer> spostIds);

    @Query("select l from STYLE_Like l where l.spost.spostId in :postIds")
    List<STYLE_Like> findByPostIds(@Param("postIds") List<Integer> postIds);

    @Query("select count(l) from STYLE_Like l where l.spost = :post")
    Long countByPost(@Param("post") STYLE_post post);

//    Collection<Object> findAllBySpostIds(List<Integer> postIds);





}
