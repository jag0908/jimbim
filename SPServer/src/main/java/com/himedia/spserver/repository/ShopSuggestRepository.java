package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.entity.SHOP.SHOP_Suggest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ShopSuggestRepository extends JpaRepository<SHOP_Suggest, Integer> {

    @Query("SELECT s FROM SHOP_Suggest s WHERE s.member.member_id = :memberId AND s.title LIKE %:title%")
    Page<SHOP_Suggest> findByMemberIdAndTitleContaining(
            @Param("memberId") Integer memberId,
            @Param("title") String title,
            Pageable pageable
    );

    Page<SHOP_Suggest> searchByTitle(String s, Pageable pageable);

    /// ////////////// 어드민 페이지용 /////////////////////////////
    @Query("SELECT p FROM SHOP_Suggest p WHERE p.title like %:key% ")
    List<SHOP_Suggest> findByTitleContaining(String key);

    @Query("SELECT p FROM SHOP_Suggest p WHERE p.title like %:key% ")
    Page<SHOP_Suggest> findByTitleContaining(String key, Pageable pageable);
    /// //////////////////////////////////////////////////////
}
