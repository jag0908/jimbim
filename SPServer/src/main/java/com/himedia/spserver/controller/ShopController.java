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
//    private final ShopSellService sss; // 합쳐진 SellService

    // =================== 상품 관련 ===================
    @PostMapping("/product")
    public SHOP_Product createProduct(@ModelAttribute ShopProductCreateDTO dto) {
        Member seller = new Member();
        seller.setMember_id(1); // 테스트용
        return shopService.createProduct(dto, seller);
    }

    @GetMapping("/products")
    public List<ShopProductDTO> getAllProducts() {
        return shopService.getAllProducts();
    }

    @GetMapping("/products/category/{categoryId}")
    public List<ShopProductDTO> getProductsByCategory(@PathVariable Long categoryId) {
        return shopService.getProductsByCategory(categoryId);
    }

    @GetMapping("/product/{productId}")
    public ShopProductDTO getProduct(@PathVariable Long productId) {
        SHOP_Product product = shopService.getProductById(productId);
        return ShopProductDTO.fromEntity(product);
    }

    @GetMapping("/products/search")
    public List<ShopProductDTO> searchProducts(
            @RequestParam("keyword") String keyword,
            @RequestParam(value = "categoryId", required = false) Long categoryId
    ) {
        return shopService.searchProducts(keyword, categoryId);
    }

    // =================== 판매 관련 ===================
    @PostMapping("/sell") // 단일 POST 매핑 유지
    public SHOP_SellList createSell(@RequestBody ShopSellCreateDTO dto) {
        Member seller = new Member();
        seller.setMember_id(dto.getSellerId());
        return shopService.createSell(dto, seller);
    }

//    @PostMapping("/sell/register") // 옵션별 최소가 등록용
//    public ResponseEntity<SHOP_SellList> registerSell(
//            @RequestParam Long productId,
//            @RequestParam Long optionId,
//            @RequestParam Long sellerId,
//            @RequestParam Integer price
//    ) {
//        SHOP_SellList sell = sss.registerSell(productId, optionId, sellerId, price);
//        return ResponseEntity.ok(sell);
//    }

    @PostMapping("/buy/{sellId}")
    public SHOP_BuyOrder buyProduct(@PathVariable Long sellId) {
        Member buyer = new Member();
        buyer.setMember_id(1); // 테스트용
        return shopService.createBuy(sellId, buyer);
    }

    // =================== 찜 관련 ===================
    @PostMapping("/zzim/{productId}")
    public SHOP_zzim zzim(@PathVariable Long productId) {
        Member member = new Member();
        member.setMember_id(1); // 테스트용
        return shopService.createZzim(productId, member);
    }

    // =================== 카테고리 ===================
    @GetMapping("/categories")
    public List<SHOP_Category> getCategories() {
        return shopService.getCategories();
    }

    // =================== 제안 관련 ===================
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

        if (files != null && files.length > 0) {
            dto.setFiles(List.of(files));
        }

        ShopSuggestDto savedDto = shopSuggestService.createSuggest(dto);
        savedDto.setFiles(null); // NetworkError 방지
        return ResponseEntity.ok(savedDto);
    }

    @PostMapping("/suggest/approve/{suggestId}")
    public ResponseEntity<?> approve(@PathVariable int suggestId) {
        SHOP_Product product = shopSuggestService.approveSuggest(suggestId);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/getSuggestList/{page}")
    public ResponseEntity<?> getSuggestList(
            @PathVariable int page,
            @RequestParam int memberId
    ){
        return ResponseEntity.ok(shopSuggestService.getSuggestList(page, memberId));
    }

    @GetMapping("/getSuggestDetail/{id}")
    public ShopSuggestDto getSuggestDetail(@PathVariable Integer id) {
        SHOP_Suggest suggest = shopSuggestService.findById(id);
        return ShopSuggestDto.fromEntity(suggest);
    }

    @DeleteMapping("/deleteSuggest/{id}")
    public ResponseEntity<String> deleteSuggest(@PathVariable Integer id) {
        shopSuggestService.deleteSuggest(id);
        return ResponseEntity.ok("삭제 완료");
    }
}
