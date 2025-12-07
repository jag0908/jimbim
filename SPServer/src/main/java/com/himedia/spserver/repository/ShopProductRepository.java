package com.himedia.spserver.repository;


import com.himedia.spserver.entity.SHOP.SHOP_Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShopProductRepository extends JpaRepository<SHOP_Product, Long> {
    List<SHOP_Product> findByCategory_CategoryId(Long categoryId);
}
