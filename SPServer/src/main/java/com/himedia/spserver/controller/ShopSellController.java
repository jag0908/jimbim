//package com.himedia.spserver.controller;
//
//import com.himedia.spserver.entity.SHOP.SHOP_SellList;
//import com.himedia.spserver.service.ShopSellService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/shop")
//public class ShopSellController {
////    private final ShopSellService shopSellService;
////
////    public ShopSellController(ShopSellService shopSellService) {
////        this.shopSellService = shopSellService;
////    }
////
////    // 옵션별 최소가 판매자 조회 API
////    @GetMapping("/sell/minprice")
////    public ResponseEntity<List<SHOP_SellList>> getMinPriceSellByOption(@RequestParam Long optionId) {
////        List<SHOP_SellList> minPriceSells = shopSellService.findMinPriceSellsByOptionId(optionId);
////        return ResponseEntity.ok(minPriceSells);
////    }
//}
