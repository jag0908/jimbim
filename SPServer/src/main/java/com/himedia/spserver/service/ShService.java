package com.himedia.spserver.service;

import com.himedia.spserver.entity.SH.SH_post;

import com.himedia.spserver.repository.ShRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@Transactional
public class ShService {

    @Autowired
    ShRepository sr;

    public ArrayList<SH_post> getShList() {
        ArrayList<SH_post> srList = sr.findAll();

        return srList;
    }

}
