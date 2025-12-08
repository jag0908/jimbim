package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SHOP.SHOP_SellList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShopSellListRepository extends JpaRepository<SHOP_SellList, Long> {
    List<SHOP_SellList> findByProduct_ProductIdAndOption_OptionIdOrderByPriceAsc(Long productId, Long optionId);
}
