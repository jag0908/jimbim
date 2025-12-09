package com.himedia.spserver.service;

import com.himedia.spserver.dto.*;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SHOP.*;
import com.himedia.spserver.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ShopService {

    private final ShopProductRepository productRepo;
    private final ShopProductOptionRepository optionRepo;
    private final ShopSellListRepository sellRepo;
    private final ShopBuyOrderRepository buyRepo;
    private final ShopZzimRepository zzimRepo;
    private final ShopSuggestRepository suggestRepo;
    private final ShopProductImageRepository imageRepo;
    private final ShopCategoryRepository categoryRepo;

    private final ShopPostRepository spr;
    private final MemberRepository mr;

    // 상품 전체 조회
    public List<ShopProductDTO> getAllProducts() {
        return productRepo.findAll().stream()
                .map(ShopProductDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 카테고리별 조회
    public List<ShopProductDTO> getProductsByCategory(Long categoryId) {
        return productRepo.findByCategory_CategoryId(categoryId).stream()
                .map(ShopProductDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 상품 등록
    public SHOP_Product createProduct(ShopProductCreateDTO dto, Member seller) {
        SHOP_Product product = new SHOP_Product();
        product.setTitle(dto.getTitle());
        product.setContent(dto.getContent());
        product.setDeliveryPrice(dto.getDeliveryPrice());
        // category 처리 필요
        // product.setCategory(category);

        product = productRepo.save(product);

        // 옵션 등록
        for (String optionName : dto.getOptionNames()) {
            SHOP_ProductOption option = new SHOP_ProductOption();
            option.setOptionName(optionName);
            option.setProduct(product);
            optionRepo.save(option);
        }

        // 이미지 등록
        for (MultipartFile file : dto.getImages()) {
            SHOP_ProductImage img = new SHOP_ProductImage();
            img.setProduct(product);
            img.setFileName(file.getOriginalFilename());
            // 실제 저장 경로 처리 필요
            img.setFilePath("/uploads/" + file.getOriginalFilename());
            imageRepo.save(img);
        }

        return product;
    }

    // 찜 등록
    public SHOP_zzim createZzim(Long productId, Member member) {
        SHOP_zzim zzim = new SHOP_zzim();
        zzim.setProduct(productRepo.findById(productId).orElseThrow());
        zzim.setMember(member);
        return zzimRepo.save(zzim);
    }

    public List<SHOP_Category> getCategories() {
        return categoryRepo.findAll();
    }

    public List<ShopProductDTO> searchProducts(String keyword, Long categoryId) {
        if (categoryId != null) {
            // 카테고리 + 키워드 검색
            return productRepo.findByCategory_CategoryIdAndTitleContainingIgnoreCase(categoryId, keyword)
                    .stream()
                    .map(ShopProductDTO::fromEntity)
                    .collect(Collectors.toList());
        } else {
            // 전체 키워드 검색
            return productRepo.findByTitleContainingIgnoreCase(keyword)
                    .stream()
                    .map(ShopProductDTO::fromEntity)
                    .collect(Collectors.toList());
        }
    }

    public SHOP_Product getProductById(Long productId) {
        SHOP_Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품이 존재하지 않습니다."));
        return product;
    }


    public SHOP_post getPostById(Integer postId) {
        return spr.findById(postId)
                .orElseThrow(() -> new RuntimeException("해당 게시글을 찾을 수 없습니다. id: " + postId));
    }

    public SHOP_SellList createSell(ShopSellRequestDTO dto) {
        SHOP_Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("상품이 존재하지 않습니다."));
        SHOP_ProductOption option = optionRepo.findById(dto.getOptionId())
                .orElseThrow(() -> new RuntimeException("옵션이 존재하지 않습니다."));
        Member seller = mr.findById(dto.getSellerId())
                .orElseThrow(() -> new RuntimeException("판매자(Member)가 존재하지 않습니다."));

        SHOP_SellList sell = new SHOP_SellList();
        sell.setProduct(product);
        sell.setOption(option);
        sell.setPrice(dto.getPrice());
        sell.setSeller(seller);

        return sellRepo.save(sell);
    }


    public List<ShopSellListDTO> getSellList(Long productId, Long optionId) {
        return sellRepo.findByProduct_ProductIdAndOption_OptionIdAndStatus(productId, optionId, "N")
                .stream()
                .map(sell -> {
                    ShopSellListDTO dto = new ShopSellListDTO();
                    dto.setSellId(sell.getSellId());
                    dto.setProductId(sell.getProduct().getProductId());
                    dto.setOptionId(sell.getOption().getOptionId());
                    dto.setPrice(sell.getPrice());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 구매 등록
    public SHOP_BuyOrder createBuy(Long sellId, Member buyer) {
        SHOP_SellList sell = sellRepo.findById(sellId).orElseThrow();
        SHOP_BuyOrder order = new SHOP_BuyOrder();
        order.setSellList(sell);
        order.setBuyer(buyer);
        order.setPurchasePrice(sell.getPrice());
        sell.setStatus("soldout");
        sellRepo.save(sell);
        return buyRepo.save(order);
    }



}
