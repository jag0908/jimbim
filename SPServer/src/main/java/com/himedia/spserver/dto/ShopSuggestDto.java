package com.himedia.spserver.dto;

import com.himedia.spserver.entity.SHOP.SHOP_File;
import com.himedia.spserver.entity.SHOP.SHOP_Suggest;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ShopSuggestDto {
    private Long suggestId;
    private String title;
    private String content;
    private Integer price;
    private Integer memberId; // 작성자
    private Long categoryId;
    private List<MultipartFile> files; // 업로드용
    private List<String> fileUrls;     // 조회용
    private LocalDateTime indate;

    // 엔티티 → DTO
    public static ShopSuggestDto fromEntity(SHOP_Suggest suggest) {
        ShopSuggestDto dto = new ShopSuggestDto();
        dto.setSuggestId(suggest.getSuggestId().longValue());
        dto.setTitle(suggest.getTitle());
        dto.setContent(suggest.getContent());
        dto.setPrice(suggest.getPrice());
        dto.setMemberId(suggest.getMember().getMember_id());
        dto.setIndate(suggest.getIndate().toLocalDateTime());
        if (suggest.getFiles() != null) {
            dto.setFileUrls(suggest.getFiles().stream()
                    .map(SHOP_File::getFilePath)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
