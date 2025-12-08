package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SHOP.SHOP_SellList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShopSellListRepository extends JpaRepository<SHOP_SellList, Long> {
//    List<SHOP_SellList> findByProduct_ProductIdAndOption_OptionIdOrderByPriceAsc(Long productId, Long optionId);
//
//    @Query("SELECT MIN(s.price) FROM SHOP_SellList s WHERE s.option.optionId = :optionId")
//    Integer findMinPriceByOptionId(@Param("optionId") Long optionId);
//
//    List<SHOP_SellList> findAllByOptionIdAndPrice(Long optionId, Integer minPrice);
}
