package com.himedia.spserver.controller;

import com.himedia.spserver.dto.*;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SHOP.SHOP_BuyOrder;
import com.himedia.spserver.entity.SHOP.SHOP_Product;
import com.himedia.spserver.entity.SHOP.SHOP_SellList;
import com.himedia.spserver.entity.SHOP.SHOP_zzim;
import com.himedia.spserver.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @GetMapping("/products")
    public List<ShopProductDTO> getAllProducts() {
        return shopService.getAllProducts();
    }

    @GetMapping("/products/category/{categoryId}")
    public List<ShopProductDTO> getProductsByCategory(@PathVariable Long categoryId) {
        return shopService.getProductsByCategory(categoryId);
    }

    @PostMapping("/product")
    public SHOP_Product createProduct(@ModelAttribute ShopProductCreateDTO dto) {
        // 로그인 유저 Member 객체 필요
        Member seller = new Member();
        seller.setMember_id(1); // 테스트용
        return shopService.createProduct(dto, seller);
    }

    @PostMapping("/sell")
    public SHOP_SellList createSell(@RequestBody ShopSellCreateDTO dto) {
        Member seller = new Member();
        seller.setMember_id(dto.getSellerId());
        return shopService.createSell(dto, seller);
    }

    @PostMapping("/buy/{sellId}")
    public SHOP_BuyOrder buyProduct(@PathVariable Long sellId) {
        Member buyer = new Member();
        buyer.setMember_id(1); // 테스트용
        return shopService.createBuy(sellId, buyer);
    }

    @PostMapping("/zzim/{productId}")
    public SHOP_zzim zzim(@PathVariable Long productId) {
        Member member = new Member();
        member.setMember_id(1); // 테스트용
        return shopService.createZzim(productId, member);
    }
}