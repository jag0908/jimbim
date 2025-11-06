package com.himedia.spserver.controller;

import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.service.ShService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;

@RestController
@RequestMapping("sh-page")
public class ShController {

    @Autowired
    ShService ss;

    @GetMapping("/sh-list")
    public HashMap<String, Object> shlist() {
        HashMap<String, Object> result = new HashMap<>();
        ArrayList<SH_post> shList = ss.getShList();

        if (shList == null || shList.isEmpty()) {
            result.put("msg", "<h1>텅 비었습니다.</h1>");
        } else {
            result.put("msg", "ok");
            result.put("shList", shList);
        }

        return result;
    }
}
