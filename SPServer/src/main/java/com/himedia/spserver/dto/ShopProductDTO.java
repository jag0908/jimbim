package com.himedia.spserver.dto;

import com.himedia.spserver.entity.SHOP.SHOP_Product;
import com.himedia.spserver.entity.SHOP.SHOP_ProductImage;
import com.himedia.spserver.entity.SHOP.SHOP_ProductOption;
import com.himedia.spserver.entity.SHOP.SHOP_SellList;
import lombok.Data;

import java.util.*;
import java.util.stream.Collectors;

@Data
public class ShopProductDTO {

    private Long productId;
    private String title;
    private String content;
    private Integer minPrice;
    private String status;
    private String firstImage;
    private Long categoryId;
    private String indate;

    private List<String> imageUrls;

    // 옵션 목록 (순수 옵션)
    private List<ShopProductOptionDTO> options;

    // 옵션별 최저가
    private Map<Long, Integer> optionPrices;

    public static ShopProductDTO fromEntity(SHOP_Product product) {

        ShopProductDTO dto = new ShopProductDTO();
        dto.setProductId(product.getProductId());
        dto.setTitle(product.getTitle());
        dto.setContent(product.getContent());

        // 이미지 처리
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            dto.setFirstImage(product.getImages().get(0).getFilePath());
            dto.setImageUrls(
                    product.getImages().stream()
                            .map(SHOP_ProductImage::getFilePath)
                            .collect(Collectors.toList())
            );
        }

        // 카테고리
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
        }

        // ⭐ 옵션 목록 전체 내려주기 (판매 없어도 무조건 포함)
        List<ShopProductOptionDTO> optionList =
                product.getOptions().stream()
                        .map(ShopProductOptionDTO::fromEntity)
                        .collect(Collectors.toList());

        dto.setOptions(optionList);

        // ⭐ 옵션별 최저가 계산
        Map<Long, Integer> optionPrices = new HashMap<>();

        for (SHOP_ProductOption opt : product.getOptions()) {

            // 옵션에 연결된 판매 리스트 중 'selling' 상태만
            List<SHOP_SellList> sells =
                    opt.getSellList().stream()
                            .filter(s -> "selling".equals(s.getStatus()))
                            .collect(Collectors.toList());

            // 최저가 (없으면 null)
            Integer lowestPrice = sells.isEmpty() ? null :
                    sells.stream()
                            .map(SHOP_SellList::getPrice)
                            .min(Integer::compare)
                            .orElse(null);

            optionPrices.put(opt.getOptionId(), lowestPrice);
        }

        dto.setOptionPrices(optionPrices);

        // 전체 상품 최저가
        dto.setMinPrice(
                optionPrices.values().stream()
                        .filter(Objects::nonNull)
                        .min(Integer::compare)
                        .orElse(null)
        );

        // 상태: 하나라도 판매 중이면 selling
        boolean anySelling = optionPrices.values().stream().anyMatch(Objects::nonNull);
        dto.setStatus(anySelling ? "selling" : "soldout");

        // 등록일
        if (product.getIndate() != null) {
            dto.setIndate(product.getIndate().toString());
        }

        return dto;
    }
}
