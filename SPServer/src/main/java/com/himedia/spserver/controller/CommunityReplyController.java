package com.himedia.spserver.controller;

import com.himedia.spserver.entity.Community.C_Reply;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/communityReply")
public class CommunityReplyController {

    @Autowired
    com.himedia.spserver.service.CommunityReplyService crs;

//    @GetMapping("/getReply/{reply_id}")
//    public HashMap<String, Object> getReply(@PathVariable("reply_id") int reply_id){
//        HashMap<String, Object> result = new HashMap<>();
//        result.put("replyList", crs.getReplyList(reply_id));
//        return result;
//    }
//
//    @PostMapping("/addReply")
//    public HashMap<String, Object> addReply(@RequestBody C_Reply creply){
//        HashMap<String, Object> result = new HashMap<>();
//        crs.addReply( creply );
//        result.put("msg", "ok");
//        return result;
//    }
//
//    @DeleteMapping("/deleteReply/{reply_id}")
//    public HashMap<String, Object> deleteReply(@PathVariable("reply_id") int reply_id){
//        HashMap<String, Object> result = new HashMap<>();
//        crs.deleteReply(reply_id);
//        result.put("msg", "ok");
//        return result;
//    }
}
