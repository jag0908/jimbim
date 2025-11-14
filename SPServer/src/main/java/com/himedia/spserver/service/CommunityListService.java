package com.himedia.spserver.service;

import com.himedia.spserver.dto.CommunityViewDTO;
import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.repository.CommunityListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Optional;

@Service
@Transactional
public class CommunityListService {

    @Autowired
    private CommunityListRepository cr;

    // 조회수 증가
    public void addReadCount(int cpost_id) {
        Optional<C_post> optionalPost = cr.findById(cpost_id);
        optionalPost.ifPresent(post -> post.setReadcount(post.getReadcount() + 1));
    }

    // 게시글 수정
    public HashMap<String, Object> updateCommunity(C_post post) {
        HashMap<String, Object> result = new HashMap<>();
        Optional<C_post> optionalPost = cr.findById(post.getCpost_id());
        if(optionalPost.isPresent()) {
            C_post updateCommunity = optionalPost.get();
            updateCommunity.setTitle(post.getTitle());
            updateCommunity.setContent(post.getContent());
            updateCommunity.setC_image(post.getC_image());
            updateCommunity.setFile(post.getFile());
            result.put("msg", "ok");
        } else {
            result.put("msg", "notok");
        }
        return result;
    }

    // 게시글 리스트 조회 (DTO 기반)
    public HashMap<String, Object> getCommunityList(int page, Integer categoryId) {
        HashMap<String, Object> result = new HashMap<>();

        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Direction.DESC, "readcount"));
        Page<CommunityViewDTO> list = (categoryId == null || categoryId == 0)
                ? cr.findAllDTO(pageable)
                : cr.findByCategoryDTO(categoryId, pageable);

        result.put("communityList", list.getContent());
        result.put("totalPages", list.getTotalPages());
        result.put("currentPage", page);

        return result;
    }

    // 게시글 상세조회
    public Optional<C_post> getCommunityById(int id) {
        return cr.findById(id);
    }
}
