package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SHOP.SHOP_Suggest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface ShopSuggestRepository extends JpaRepository<SHOP_Suggest,Integer> {
    Page<SHOP_Suggest> searchByTitle(@Param("title") String title, Pageable pageable);
}
