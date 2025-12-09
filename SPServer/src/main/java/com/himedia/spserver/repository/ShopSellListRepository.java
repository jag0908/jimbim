package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SHOP.SHOP_SellList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ShopSellListRepository extends JpaRepository<SHOP_SellList, Long> {
    // productId 와 optionId 로 sellList 찾음
    List<SHOP_SellList> findByProduct_ProductIdAndOption_OptionId(Long productId, Long optionId);

    // 페이징
    Page<SHOP_SellList> findByProduct_ProductIdAndOption_OptionId(Long productId, Long optionId, Pageable pageable);

    // 판매자id로 검색
    List<SHOP_SellList> findByProduct_ProductIdAndOption_OptionIdAndSeller_UseridContaining(Long productProductId, Long optionOptionId, String sellerUserid);

    // 판매자id로 검색 페이지
    Page<SHOP_SellList> findByProduct_ProductIdAndOption_OptionIdAndSeller_UseridContaining(Long productId, Long optionId, String key, Pageable pageable);
//    List<SHOP_SellList> findByProduct_ProductIdAndOption_OptionIdOrderByPriceAsc(Long productId, Long optionId);
//
//    @Query("SELECT MIN(s.price) FROM SHOP_SellList s WHERE s.option.optionId = :optionId")
//    Integer findMinPriceByOptionId(@Param("optionId") Long optionId);
//
//    List<SHOP_SellList> findAllByOptionIdAndPrice(Long optionId, Integer minPrice);
}
