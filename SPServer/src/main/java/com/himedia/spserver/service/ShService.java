package com.himedia.spserver.service;

import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.entity.SH.SH_post;

import com.himedia.spserver.entity.SH.ShViewHistory;
import com.himedia.spserver.repository.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ShService {

    private final ShRepository sr;           // 자동으로 생성자 주입
    private final ShCategoryRepository sc;   // 두 개 Repository도 가능
    private final SH_file_repository sfr;
    private final FileRepository fr;
    private final ShViewRepository svr;

    public List<SHPostWithFilesDTO> getShList() {
        List<SH_post> shList = sr.findAllByOrderByIndateDesc();
        List<SHPostWithFilesDTO> result = new ArrayList<>();

        for (SH_post post : shList) {
            SHPostWithFilesDTO dto = new SHPostWithFilesDTO();
            dto.setPost(post);
            dto.setFiles(fr.findByShPost(post)); // 커스텀 메서드 사용
            result.add(dto);
        }

        return result;
    }

    public SHPostWithFilesDTO getShPost(Integer id) {
        SH_post shPost = sr.findByPostId(id);

        SHPostWithFilesDTO dto = new SHPostWithFilesDTO();
        dto.setPost(shPost);
        dto.setFiles(fr.findByShPost(shPost));

        return dto;
    }

    public ArrayList<SH_Category> getShCategorys() {
        ArrayList<SH_Category> shCategorys = (ArrayList<SH_Category>) sc.findAll();

        return shCategorys;
    }


    public SH_post insertShPost(Member member_id, String title, String content, Integer price, String categoryId, String directYN, String deliveryYN, Integer deliveryPrice) {

        SH_post post = new SH_post();
        post.setMember(member_id);
        post.setTitle(title);
        post.setContent(content);
        post.setPrice(price);
        post.setCategory(categoryId);
        post.setDirect_yn(directYN);
        post.setDelivery_yn(deliveryYN);
        post.setDelivery_price(deliveryPrice);

        sr.save(post);

        return post;
    }


    public void insertFiles(SH_post post, String originalFilename, String path, Long size, String type) {
        File file = new File();
        file.setShPost(post);
        file.setOriginalname(originalFilename);
        file.setPath(path);
        file.setSize(size);
        file.setContentType(type);
        fr.save(file);
    }

    public void addViewCount(Integer postId, Integer memberId) {
        // 이미 조회했는지 체크
        boolean alreadyViewed = svr.existsByPostIdAndMemberId(postId, memberId);
        if (alreadyViewed) return;

        // 조회수 증가
        SH_post shPost = sr.findByPostId(postId);
        shPost.setViewCount(shPost.getViewCount() + 1);

        // 기록 저장
        ShViewHistory vh = new ShViewHistory();
        vh.setPostId(postId);
        vh.setMemberId(memberId);
        svr.save(vh);
    }


    @Setter
    @Getter
    public class SHPostWithFilesDTO {
        private SH_post post;
        private List<File> files;

        // getter, setter
    }
}


