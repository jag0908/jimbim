//package com.himedia.spserver.controller;
//
//import com.himedia.spserver.dto.ShopBuyOrderDTO;
//import com.himedia.spserver.entity.SHOP.SHOP_SellList;
//import com.himedia.spserver.repository.ShopBuyOrderRepository;
//import com.himedia.spserver.service.ShopBuyService;
//import io.swagger.v3.oas.annotations.parameters.RequestBody;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/shop/buy")
//public class ShopBuyController {
//
//    private final ShopBuyService shopBuyService;
//
//    public ShopBuyController(ShopBuyService shopBuyService) {
//        this.shopBuyService = shopBuyService;
//    }
//
//    // 옵션별 최소가 판매자 조회 (구매에 필요한 정보)
////    @GetMapping("/minprice-sell")
////    public ResponseEntity<List<SHOP_SellList>> getMinPriceSellByOption(@RequestParam Long optionId) {
////        List<SHOP_SellList> minPriceSells = shopBuyService.findMinPriceSellsByOptionId(optionId);
////        return ResponseEntity.ok(minPriceSells);
////    }
//
//    // 구매 처리 API
//    @PostMapping
//    public ResponseEntity<?> buyProduct(@RequestBody ShopBuyOrderDTO buyRequest) {
//        try {
//            //shopBuyService.buyProduct(buyRequest);
//            return ResponseEntity.ok("구매 완료");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("구매 실패");
//        }
//    }
//}
