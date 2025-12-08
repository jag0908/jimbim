package com.himedia.spserver.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private Integer memberId;
    private Long categoryId;

    @JsonIgnore
    private List<MultipartFile> files;   // 요청 전용

    private List<String> fileUrls;       // 응답 전용
    private LocalDateTime indate;

    public static ShopSuggestDto fromEntity(SHOP_Suggest suggest) {
        ShopSuggestDto dto = new ShopSuggestDto();
        dto.setSuggestId(suggest.getSuggestId().longValue());
        dto.setTitle(suggest.getTitle());
        dto.setContent(suggest.getContent());
        dto.setPrice(suggest.getPrice());
        dto.setMemberId(suggest.getMember().getMember_id());
        dto.setCategoryId(suggest.getCategory().getCategoryId());

        // ✅ Timestamp → LocalDateTime 변환 (replace 필요 없음!)
        try {
            if (suggest.getIndate() != null) {
                dto.setIndate(suggest.getIndate().toLocalDateTime());
            }
        } catch (Exception e) {
            System.out.println("날짜 변환 실패: " + suggest.getIndate());
            dto.setIndate(null);
        }

        // 파일 URL
        if (suggest.getFiles() != null) {
            dto.setFileUrls(
                    suggest.getFiles().stream()
                            .map(SHOP_File::getFilePath)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }


}
