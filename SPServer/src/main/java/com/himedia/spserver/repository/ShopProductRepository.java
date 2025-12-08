package com.himedia.spserver.repository;


import com.himedia.spserver.entity.SHOP.SHOP_Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ShopProductRepository extends JpaRepository<SHOP_Product, Long> {
    List<SHOP_Product> findByCategory_CategoryId(Long categoryId);

    List<SHOP_Product> findByTitleContaining(String key);

    Page<SHOP_Product> findByTitleContaining(String key, Pageable pageable);
}
