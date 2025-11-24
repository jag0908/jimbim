package com.himedia.spserver.controller;

import com.himedia.spserver.entity.customer.Qna;
import com.himedia.spserver.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    CustomerService cs;

    @GetMapping("/getQnaList")
    public HashMap<String, Object> getQnaList(@RequestParam("memberId") String memberId){
        HashMap<String, Object> result = new HashMap<>();
        result.put("qnaList", cs.getQnaList(memberId));
        return result;
    }
}
