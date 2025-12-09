package com.himedia.spserver.controller;

import com.himedia.spserver.dto.*;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SHOP.*;
import com.himedia.spserver.repository.MemberRepository;
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

    private final MemberRepository mr;

    // =================== 상품 관련 ===================


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

    @GetMapping("/products/search")
    public List<ShopProductDTO> searchProducts(
            @RequestParam("keyword") String keyword,
            @RequestParam(value = "categoryId", required = false) Long categoryId
    ) {
        return shopService.searchProducts(keyword, categoryId);
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

//    @GetMapping("/products/search")
//    public List<ShopProductDTO> searchProducts(
//            @RequestParam("keyword") String keyword,
//            @RequestParam(value = "categoryId", required = false) Long categoryId
//    ) {
//        return shopService.searchProducts(keyword, categoryId);
//    }
//
//    @GetMapping("/product/{productId}")
//    public ShopProductDTO getProduct(@PathVariable Long productId) {
//        SHOP_Product product = shopService.getProductById(productId);
//        return ShopProductDTO.fromEntity(product);
//    }

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

    @GetMapping("/post/{postId}")
    public ShopPostDTO getPost(@PathVariable Integer postId) {
        SHOP_post post = shopService.getPostById(postId); // 엔티티로 받기
        return ShopPostDTO.fromEntity(post); // DTO로 변환
    }

    @GetMapping("/product/{productId}")
    public ShopProductDTO getProduct(@PathVariable Long productId) {
        SHOP_Product product = shopService.getProductById(productId);
        return ShopProductDTO.fromEntity(product);
    }

    @PostMapping("/sell")
    public ResponseEntity<SHOP_Sell> createSell(@RequestBody ShopSellRequestDTO dto) {
        Member seller = new Member();
        seller.setMember_id(dto.getSellerId());
        SHOP_Sell sell = shopService.createSell(dto, seller);
        return ResponseEntity.ok(sell);
    }




}
