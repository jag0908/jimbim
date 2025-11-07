package com.himedia.spserver.controller;

import com.himedia.spserver.repository.CommunityReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/communityReply")
public class CommunityReplyController {

    @Autowired
    CommunityReplyService crs;

//    @GetMapping("/getReply/{boardnum}")
//    public HashMap<String, Object> getReply(@PathVariable("boardnum") int boardnum){
//        HashMap<String, Object> result = new HashMap<>();
//        result.put("replyList", rs.getReplyList(boardnum));
//        return result;
//    }
//
//    @PostMapping("/addReply")
//    public HashMap<String, Object> addReply(@RequestBody Reply reply){
//        HashMap<String, Object> result = new HashMap<>();
//        rs.addReply( reply );
//        result.put("msg", "ok");
//        return result;
//    }
//
//    @DeleteMapping("/deleteReply/{replynum}")
//    public HashMap<String, Object> deleteReply(@PathVariable("replynum") int replynum){
//        HashMap<String, Object> result = new HashMap<>();
//        rs.deleteReply(replynum);
//        result.put("msg", "ok");
//        return result;
//    }
}
