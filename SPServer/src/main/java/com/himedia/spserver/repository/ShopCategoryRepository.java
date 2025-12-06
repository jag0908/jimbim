package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SHOP.SHOP_Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopCategoryRepository extends JpaRepository<SHOP_Category,Integer> {
}
