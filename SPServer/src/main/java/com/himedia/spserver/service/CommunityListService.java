package com.himedia.spserver.service;

import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.repository.CommunityListRepository;
import com.himedia.spserver.repository.MemberRepository;
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

    @Autowired
    private MemberRepository mr;

    // 게시글 저장
    public void saveCommunity(C_post cpost) {
        if (cpost.getMember() == null) {
            Member anonymous = new Member();
            anonymous.setUserid("익명");
            anonymous.setName("익명");
            cpost.setMember(anonymous);
        }
        cr.save(cpost);
    }

    // 조회수 증가
    public void addReadCount(int cpost_id) {
        Optional<C_post> optionalPost = cr.findById(cpost_id);
        optionalPost.ifPresent(post -> post.setReadcount(post.getReadcount() + 1));
    }

    // 게시글 수정
    public HashMap<String, Object> updateCommunity(C_post post) {
        HashMap<String, Object> result = new HashMap<>();
        Optional<C_post> optionalPost = cr.findById(post.getCpost_id());

        if (optionalPost.isPresent()) {
            C_post existingPost = optionalPost.get();
            existingPost.setTitle(post.getTitle());
            existingPost.setContent(post.getContent());
            existingPost.setC_image(post.getC_image());
            existingPost.setFile(post.getFile());
            result.put("msg", "ok");
        } else {
            result.put("msg", "notok");
        }

        return result;
    }

    // 게시글 리스트 조회
    public HashMap<String, Object> getCommunityList(int page, Integer categoryId) {
        HashMap<String, Object> result = new HashMap<>();
        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Direction.DESC, "indate"));
        Page<C_post> list;

        if (categoryId == null || categoryId == 0) {
            list = cr.findAll(pageable);
        } else {
            list = cr.findByCategoryId(categoryId, pageable);
        }

        result.put("communityList", list.getContent());

        // 페이징 정보
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

    // 게시글 상세조회
    public Optional<C_post> getCommunityById(int id) {
        return cr.findById(id);
    }

    // 게시글 삭제
    public boolean deleteCommunity(int id) {
        Optional<C_post> optionalPost = cr.findById(id);
        if (optionalPost.isPresent()) {
            cr.deleteById(id);
            return true;
        }
        return false;
    }
}
