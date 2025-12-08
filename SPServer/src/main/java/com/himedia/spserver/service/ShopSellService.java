//package com.himedia.spserver.service;
//
//import com.himedia.spserver.entity.SHOP.SHOP_SellList;
//import com.himedia.spserver.repository.ShopSellListRepository;
//
//import java.util.Collections;
//import java.util.List;
//
//public class ShopSellService {
//    private final ShopSellListRepository shopSellListRepository;
//
//    public ShopSellService(ShopSellListRepository shopSellRepository) {
//        this.shopSellListRepository = shopSellRepository;
//    }
//
//    public List<SHOP_SellList> findMinPriceSellsByOptionId(Long optionId) {
//        Integer minPrice = shopSellListRepository.findMinPriceByOptionId(optionId);
//        if (minPrice == null) {
//            return Collections.emptyList();
//        }
//        return shopSellListRepository.findAllByOptionIdAndPrice(optionId, minPrice);
//    }
//}
