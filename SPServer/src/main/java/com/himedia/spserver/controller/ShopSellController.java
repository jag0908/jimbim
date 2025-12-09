//package com.himedia.spserver.controller;
//
//import com.himedia.spserver.entity.SHOP.SHOP_SellList;
//import com.himedia.spserver.service.ShopSellService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//
//@RestController
//@RequestMapping("/shop")
//public class ShopSellController {
//
//    @Autowired
//    private ShopSellService sss;
//
//    // 판매 등록 API
//    @PostMapping("/product/{postId}")
//    public ResponseEntity<SHOP_SellList> registerSell(
//            @RequestParam Long productId,
//            @RequestParam Long optionId,
//            @RequestParam Long sellerId,
//            @RequestParam Integer price
//    ) {
//        SHOP_SellList sell = sss.registerSell(productId, optionId, sellerId, price);
//        return ResponseEntity.ok(sell);
//    }
//
//}
