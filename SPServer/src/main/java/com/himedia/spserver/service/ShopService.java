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

        // 1) 제안글 저장
        SHOP_Suggest suggest = new SHOP_Suggest();
        suggest.setTitle(dto.getTitle());
        suggest.setContent(dto.getContent());
        suggest.setMember_id(
                mr.findById(dto.getMemberId())
                        .orElseThrow(() -> new RuntimeException("회원 없음"))
        );

        SHOP_Suggest saved = ssr.save(suggest);

        // 2) 파일 저장 처리
        if (dto.getFiles() != null && !dto.getFiles().isEmpty()) {
            for (MultipartFile mf : dto.getFiles()) {

                // S3 업로드
                String fileUrl = sus.saveFile(mf);

                SHOP_File file = new SHOP_File();
                file.setSuggest(saved);                        // FK
                file.setFileName(mf.getOriginalFilename());    // 원본 이름
                file.setFilePath(fileUrl);                     // S3 저장된 경로(URL)

                sfr.save(file);
            }
        }

        return saved;
    }

    /** 파일만 따로 업로드하는 방식 (필요하면 사용) */
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

    public HashMap<String, Object> getSuggestList(int page, Integer suggestId, String title) {
        HashMap<String, Object> result = new HashMap<>();
        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Direction.DESC, "indate"));

        Page<SHOP_Suggest> list = ssr.searchByTitle(
                (title == null || title.isEmpty()) ? null : title,
                pageable
        );

        result.put("list", list.getContent());

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
}
