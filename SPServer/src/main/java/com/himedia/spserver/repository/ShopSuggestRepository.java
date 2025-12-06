package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SHOP.SHOP_Suggest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ShopSuggestRepository extends JpaRepository<SHOP_Suggest, Integer> {

    @Query("SELECT s FROM SHOP_Suggest s WHERE s.member.member_id = :memberId AND s.title LIKE %:title%")
    Page<SHOP_Suggest> findByMemberIdAndTitleContaining(
            @Param("memberId") Integer memberId,
            @Param("title") String title,
            Pageable pageable
    );

    Page<SHOP_Suggest> searchByTitle(String s, Pageable pageable);
}
