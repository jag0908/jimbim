package com.himedia.spserver.service;

import com.himedia.spserver.dto.Paging;
import com.himedia.spserver.entity.Community.*;
import com.himedia.spserver.repository.CommunityListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;

@Service
@Transactional
public class CommunityListService {

    @Autowired
    private CommunityListRepository cr;

    public void addReadCount(int cpostNum) {
        C_post post = cr.findByCpostNum(cpostNum);
        if (post != null) {
            post.setReadcount(post.getReadcount() + 1);
        }
    }

    public HashMap<String, Object> updateCommunity(C_post post) {
        HashMap<String, Object> result = new HashMap<>();
        C_post updateCommunity = cr.findByCpostNum(post.getCpostNum());

        if (updateCommunity != null) {
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

    public HashMap<String, Object> getCommunityList(int page) {
        HashMap<String, Object> result = new HashMap<>();

        Paging paging = new Paging();
        paging.setPage(page);

        int totalCount = (int) cr.count();
        paging.setTotalCount(totalCount);
        paging.calPaing();

        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Direction.DESC, "readcount"));
        Page<C_post> list = cr.findAll(pageable);

        System.out.println("DB에서 조회된 게시글 수: " + list.getContent().size());

        result.put("communityList", list.getContent());
        result.put("paging", paging);

        return result;
    }
}
