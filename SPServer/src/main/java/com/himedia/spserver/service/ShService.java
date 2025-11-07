package com.himedia.spserver.service;

import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.entity.SH.SH_post;

import com.himedia.spserver.repository.SH_file_repository;
import com.himedia.spserver.repository.ShCategoryRepository;
import com.himedia.spserver.repository.ShRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ShService {

    private final ShRepository sr;           // 자동으로 생성자 주입
    private final ShCategoryRepository sc;   // 두 개 Repository도 가능
    private final SH_file_repository sfr;

    public ArrayList<SH_post> getShList() {
        ArrayList<SH_post> shList = sr.findAll();

        return shList;
    }

    public ArrayList<SH_Category> getShCategorys() {
        ArrayList<SH_Category> shCategorys = (ArrayList<SH_Category>) sc.findAll();

        return shCategorys;
    }


    public void insertShPost(Member member_id, String title, String content, Integer price, String categoryId, String directYN, String deliveryYN, Integer deliveryPrice) {

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
    }

//    public void insertFiles(List<MultipartFile> files) {

//            for(MultipartFile file : files) {
//
//                // File 엔티티 저장
//                File file = new File();
//
//
//                sfr.save(file);
//            }

//        }


}
