package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SHOP.SHOP_ProductOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShopProductOptionRepository extends JpaRepository<SHOP_ProductOption, Long> {
    List<SHOP_ProductOption> findByProduct_ProductId(Long productId);
}
