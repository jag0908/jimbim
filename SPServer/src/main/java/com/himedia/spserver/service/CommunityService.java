package com.himedia.spserver.service;

import com.himedia.spserver.dto.Paging;
import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.repository.CommunityRepository;
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
public class CommunityService {

    @Autowired
    CommunityRepository cr;

    public HashMap<String, Object> getCommunityList(int page) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        int count = cr.findAll().size();
        paging.setTotalCount(count);
        paging.calPaing();

        Pageable pageable = PageRequest.of(page -1, 10, Sort.by(Sort.Direction.DESC, "cpost_id"));
        Page<C_post> list = cr.findAll(pageable);
        result.put("postList", list.getContent());
        result.put("paging", paging);

        return result;
    }

    public void insertCommunity(C_post post) {
        cr.save(post);
    }

    public void addReadCount(int num) {
        C_post post = cr.findByNum(num);
        post.setReadcount(post.getReadcount()+1);
    }

    public Object getCommunity(int num) {
        C_post post = cr.findByNum(num);
        return post;
    }

    public void deleteCommunity(int communitynum) {
        C_post post = cr.findByNum(communitynum);
        cr.delete(post);
    }

    public HashMap<String, Object> updateCommunity(C_post post) {
        HashMap<String, Object> result = new HashMap<>();
        C_post updateCommunity = cr.findByNum(post.getCpost_id());

        return result;
    }
}
