package com.himedia.spserver.service;

import com.himedia.spserver.dto.ShopSuggestDto;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SHOP.SHOP_Category;
import com.himedia.spserver.entity.SHOP.SHOP_File;
import com.himedia.spserver.entity.SHOP.SHOP_Suggest;
import com.himedia.spserver.repository.MemberRepository;
import com.himedia.spserver.repository.ShopCategoryRepository;
import com.himedia.spserver.repository.ShopFileRepository;
import com.himedia.spserver.repository.ShopSuggestRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopSuggestService {
    private final ShopSuggestRepository ssr;
    private final ShopFileRepository shopfr;
    private final ShopCategoryRepository shopCategoryRepository;
    private final MemberRepository memberRepository;
    private final S3UploadService s3UploadService;

    @Transactional
    public ShopSuggestDto createSuggest(ShopSuggestDto dto) {

        System.out.println("=== createSuggest 호출 ===");
        System.out.println("title=" + dto.getTitle() + ", memberId=" + dto.getMemberId() + ", categoryId=" + dto.getCategoryId());

        // 1. 카테고리 & 멤버 조회
        SHOP_Category category = shopCategoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없음"));
        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없음"));

        // 2. 엔티티 생성
        SHOP_Suggest suggest = new SHOP_Suggest();
        suggest.setTitle(dto.getTitle());
        suggest.setContent(dto.getContent());
        suggest.setPrice(dto.getPrice());
        suggest.setCategory(category);
        suggest.setMember(member);
        suggest.setIsAccept(null);

        // 3. 파일 업로드 전 DB 저장
        suggest = ssr.save(suggest);

        List<String> uploadedUrls = new ArrayList<>();

        // 4. 파일 업로드 처리
        if (dto.getFiles() != null) {
            for (MultipartFile file : dto.getFiles()) {
                try {
                    String fileUrl = s3UploadService.saveFile(file);

                    SHOP_File shopFile = new SHOP_File();
                    shopFile.setSuggest(suggest);
                    shopFile.setFilePath(fileUrl);
                    shopFile.setFileName(file.getOriginalFilename());

                    shopfr.save(shopFile);
                    uploadedUrls.add(fileUrl);

                } catch (Exception e) {   // IOException → Exception으로 확장
                    e.printStackTrace();
                    throw new RuntimeException("파일 업로드 실패: " + file.getOriginalFilename());
                }
            }
        }

        // 5. DTO 반환
        dto.setSuggestId(suggest.getSuggestId().longValue());
        dto.setFileUrls(uploadedUrls);

        return dto;
    }

    public Object getSuggestList(int page, int memberId) {

        int pageSize = 10;
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by("suggestId").descending());

        Page<SHOP_Suggest> result = ssr.findByMemberIdOrderBySuggestIdDesc(memberId, pageable);

        // 페이지 정보 계산
        int blockLimit = 10;
        int currentPage = page;
        int totalPages = result.getTotalPages();

        int beginPage = ((currentPage - 1) / blockLimit) * blockLimit + 1;
        int endPage = Math.min(beginPage + blockLimit - 1, totalPages);

        // DTO 변환
        List<ShopSuggestDto> list = result.getContent().stream()
                .map(ShopSuggestDto::fromEntity)
                .toList();

        // return 구조
        return new HashMap<>() {{
            put("list", list);
            put("paging", new HashMap<>() {{
                put("page", currentPage);
                put("beginPage", beginPage);
                put("endPage", endPage);
                put("prev", beginPage > 1);
                put("next", endPage < totalPages);
            }});
        }};
    }


    public SHOP_Suggest findById(Integer id) {
        return ssr.findById(id)
                .orElseThrow(() -> new RuntimeException("요청을 찾을 수 없습니다."));
    }

    public void deleteSuggest(Integer id) {
        SHOP_Suggest suggest = findById(id);
        ssr.delete(suggest);
    }

}

