package com.himedia.spserver.controller;

import com.himedia.spserver.entity.customer.Qna;
import com.himedia.spserver.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    CustomerService cs;

    @GetMapping("/getQnaList")
    public HashMap<String, Object> getQnaList(@RequestParam("userid") String userid, int page){
        return cs.getQnaList(userid, page);
    }

    @PostMapping("/writeQna")
    public HashMap<String, Object> writeQna(@RequestBody Qna qna){
        HashMap<String, Object> result = new HashMap<>();
        cs.writeQna(qna);
        result.put("msg", "ok");
        return result;
    }
    @GetMapping("/getQna")
    public HashMap<String, Object> getQna(@RequestParam("qnaId") int qnaId){
        HashMap<String, Object> result = new HashMap<>();
        result.put("qna", cs.getQna(qnaId));
        return result;
    }
}
