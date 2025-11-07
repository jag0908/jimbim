package com.himedia.spserver.controller;

import com.himedia.spserver.entity.Address;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.service.MypageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/mypage")
public class MypageController {

    @Autowired
    MypageService mys;

    @PostMapping("/insertAddress")   // id 중복체크
    public HashMap<String, Object> insertAddress(@RequestBody Address address) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("insertAddress : "+address);
        mys.insertAddress( address );
        result.put("msg", "ok");
        return result;
    }
}
