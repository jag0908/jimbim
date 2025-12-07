package com.himedia.spserver.controller;

import com.himedia.spserver.dto.*;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SHOP.*;
import com.himedia.spserver.service.ShopService;
import com.himedia.spserver.service.ShopSuggestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;
    private final ShopSuggestService shopSuggestService;

    @PostMapping("/suggest")
    public ResponseEntity<?> createSuggest(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("price") int price,
            @RequestParam("memberId") int memberId,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "files", required = false) MultipartFile[] files
    ) {

        ShopSuggestDto dto = new ShopSuggestDto();
        dto.setTitle(title);
        dto.setContent(content);
        dto.setPrice(price);
        dto.setMemberId(memberId);
        dto.setCategoryId(categoryId);

        //반드시 넣어줘야 파일 업로드 됨
        if (files != null && files.length > 0) {
            dto.setFiles(List.of(files));
        }

        ShopSuggestDto savedDto = shopSuggestService.createSuggest(dto);

        //응답에서 MultipartFile 제거해서 NetworkError 방지
        savedDto.setFiles(null);

        return ResponseEntity.ok(savedDto);
    }


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

    @GetMapping("/categories")
    public List<SHOP_Category> getCategories() {
        return shopService.getCategories();
    }
}
