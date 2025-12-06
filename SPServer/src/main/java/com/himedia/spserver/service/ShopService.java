package com.himedia.spserver.service;

import com.himedia.spserver.dto.ShopSuggestDto;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SHOP.SHOP_File;
import com.himedia.spserver.entity.SHOP.SHOP_Suggest;
import com.himedia.spserver.repository.MemberRepository;
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

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ShopService {

    private final ShopSuggestRepository ssr;
    private final ShopFileRepository sfr;
    private final MemberRepository mr;
    private final S3UploadService sus;

    /** 메인 저장 (제안 글 + 파일 같이 저장) */
    public SHOP_Suggest saveSuggest(ShopSuggestDto dto) throws IOException {
        SHOP_Suggest suggest = new SHOP_Suggest();
        suggest.setTitle(dto.getTitle());
        suggest.setContent(dto.getContent());
        suggest.setMember(
                mr.findById(dto.getMemberId())
                        .orElseThrow(() -> new RuntimeException("회원 없음"))
        );

        SHOP_Suggest saved = ssr.save(suggest);

        if (dto.getFiles() != null && !dto.getFiles().isEmpty()) {
            for (MultipartFile mf : dto.getFiles()) {
                String fileUrl = sus.saveFile(mf);
                SHOP_File file = new SHOP_File();
                file.setSuggest(saved);
                file.setFileName(mf.getOriginalFilename());
                file.setFilePath(fileUrl);
                sfr.save(file);
            }
        }

        return saved;
    }

    /** 파일만 따로 업로드 */
    public void fileUpload(List<MultipartFile> files, Integer suggestId) throws IOException {
        SHOP_Suggest suggest = ssr.findById(suggestId)
                .orElseThrow(() -> new RuntimeException("제안글 없음"));

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String fileUrl = sus.saveFile(file);
                SHOP_File shopFile = new SHOP_File();
                shopFile.setSuggest(suggest);
                shopFile.setFileName(file.getOriginalFilename());
                shopFile.setFilePath(fileUrl);
                sfr.save(shopFile);
            }
        }
    }

    /** 제안글 리스트 조회 (리스트 전용 DTO 적용) */
    public HashMap<String, Object> getSuggestList(int page, Integer memberId, String title) {
        HashMap<String, Object> result = new HashMap<>();
        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Direction.DESC, "indate"));

        Page<SHOP_Suggest> list;

        if (memberId != null) {
            list = ssr.findByMemberIdAndTitleContaining(
                    memberId,
                    (title == null) ? "" : title,
                    pageable
            );
        } else {
            list = ssr.searchByTitle(
                    (title == null) ? null : title,
                    pageable
            );
        }

        // 리스트 전용 DTO 변환 (ID, 제목, 작성일만)
        List<ShopSuggestDto> dtoList = list.getContent().stream()
                .map(s -> {
                    ShopSuggestDto dto = new ShopSuggestDto();
                    dto.setSuggestId(s.getSuggestId());
                    dto.setTitle(s.getTitle());
                    dto.setIndate(s.getIndate().toLocalDateTime());
                    return dto;
                })
                .collect(Collectors.toList());

        result.put("list", dtoList);

        int totalPages = list.getTotalPages();
        int currentPage = page;
        int beginPage = Math.max(1, currentPage - 2);
        int endPage = Math.min(totalPages, currentPage + 2);

        HashMap<String, Object> paging = new HashMap<>();
        paging.put("page", currentPage);
        paging.put("prev", currentPage > 1);
        paging.put("next", currentPage < totalPages);
        paging.put("beginPage", beginPage);
        paging.put("endPage", endPage);

        result.put("paging", paging);
        return result;
    }

    public void deleteSuggest(Integer suggestId) {
        SHOP_Suggest suggest = ssr.findById(suggestId)
                .orElseThrow(() -> new RuntimeException("삭제할 제안글이 없습니다"));

        // 1) 첨부파일 삭제
        if (suggest.getFiles() != null && !suggest.getFiles().isEmpty()) {
            for (SHOP_File file : suggest.getFiles()) {
                // S3에서 삭제
                try {
                    sus.deleteFile(file.getFilePath());
                } catch (Exception e) {
                    System.err.println("S3 파일 삭제 실패: " + file.getFilePath());
                }
                // DB에서 삭제
                sfr.delete(file);
            }
        }

        // 2) 제안글 삭제
        ssr.delete(suggest);
    }

    public Optional<SHOP_Suggest> getSuggestById(Integer id) {
        return ssr.findById(id);
    }
}
