package com.himedia.spserver.dto;

import com.himedia.spserver.entity.SHOP.SHOP_File;
import com.himedia.spserver.entity.SHOP.SHOP_post;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class ShopPostDTO {
    private Integer postId;
    private String title;
    private String content;
    private Integer price;  // <- price 포함
    private String indate;
    private String deliveryYn;
    private Integer deliveryPrice;
    private String directYn;
    private Long categoryId;
    private Integer memberId;
    private List<String> fileUrls;

    public static ShopPostDTO fromEntity(SHOP_post post) {
        ShopPostDTO dto = new ShopPostDTO();
        dto.setPostId(post.getPostId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setPrice(post.getPrice());   // price 그대로 복사
        dto.setIndate(post.getIndate().toString());
        dto.setDeliveryYn(post.getDelivery_yn());
        dto.setDeliveryPrice(post.getDelivery_price());
        dto.setDirectYn(post.getDirect_yn());
        dto.setCategoryId(post.getCategory().getCategoryId());
        dto.setMemberId(post.getMember().getMember_id());
        if (post.getFiles() != null) {
            dto.setFileUrls(post.getFiles().stream()
                    .map(SHOP_File::getFilePath)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
