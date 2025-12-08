//package com.himedia.spserver.service;
//
//import com.himedia.spserver.entity.Member;
//import com.himedia.spserver.entity.SHOP.SHOP_BuyOrder;
//import com.himedia.spserver.entity.SHOP.SHOP_SellList;
//import com.himedia.spserver.repository.ShopBuyOrderRepository;
//import com.himedia.spserver.repository.ShopSellListRepository;
//import org.springframework.stereotype.Service;
//
//import java.util.Collections;
//import java.util.List;
//
//@Service
//public class ShopBuyService {
//
//    private final ShopSellListRepository shopSellListRepository;
//    private final ShopBuyOrderRepository buyOrderRepository;
//
//    public ShopBuyService(ShopSellListRepository shopSellRepository, ShopBuyOrderRepository buyOrderRepository) {
//        this.shopSellListRepository = shopSellRepository;
//        this.buyOrderRepository = buyOrderRepository;
//    }
//
////    public List<SHOP_SellList> findMinPriceSellsByOptionId(Long optionId) {
////        Integer minPrice = shopSellListRepository.findMinPriceByOptionId(optionId);
////        if (minPrice == null) {
////            return Collections.emptyList();
////        }
////        return shopSellListRepository.findAllByOptionOptionIdAndPrice(optionId, minPrice);
////    }
////
////    public void buyProduct(BuyRequestDto buyRequest) {
////        SHOP_SellList sell = shopSellListRepository.findById(buyRequest.getSellId())
////                .orElseThrow(() -> new RuntimeException("판매 목록이 없습니다."));
////
////        // 주문 생성 및 저장
////        SHOP_BuyOrder order = new SHOP_BuyOrder();
////        order.setSellList(sell);
////        // buyer는 로그인한 사용자로 설정 (아래 예시는 단순히 ID 설정, 실제로는 SecurityContext에서 받아와야 함)
////        Member buyer = new Member();
////        buyer.setMember_id(buyRequest.getBuyerMemberId());
////        order.setBuyer(buyer);
////        order.setPurchasePrice(sell.getPrice());
////
////        buyOrderRepository.save(order);
////
////        // 판매 상태 변경 등 추가 로직 가능
////        sell.setStatus("soldout");
////        shopSellListRepository.save(sell);
////    }
//}
