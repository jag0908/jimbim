package com.himedia.spserver.service;

import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.entity.SH.SH_post;

import com.himedia.spserver.repository.ShCategoryRepository;
import com.himedia.spserver.repository.ShRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@Transactional
@RequiredArgsConstructor
public class ShService {

    private final ShRepository sr;           // 자동으로 생성자 주입
    private final ShCategoryRepository sc;   // 두 개 Repository도 가능

    public ArrayList<SH_post> getShList() {
        ArrayList<SH_post> shList = sr.findAll();

        return shList;
    }

    public ArrayList<SH_Category> getShCategorys() {
        ArrayList<SH_Category> shCategorys = (ArrayList<SH_Category>) sc.findAll();

        return shCategorys;
    }
}
