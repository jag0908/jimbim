package com.himedia.spserver.controller;

import com.himedia.spserver.entity.Community.C_Category;
import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    AdminService as;

    /// //////////// 멤버 관련 /////////////////////

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getMemberList")
    public HashMap<String, Object> getMemberList(@RequestParam("page") int page,
                                                 @RequestParam(value="key", required = false, defaultValue = "") String key){
        HashMap<String, Object> result = as.getMemberList(page, key);
        return result;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getMember")
    public HashMap<String, Object> getMember( @RequestParam("member_id") int memberId ) {
        HashMap<String, Object> result = new HashMap<>();
        Member member = as.getMember( memberId );
        result.put("member", member);
        return result;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/changeRoleAdmin")
    public HashMap<String,Object> changeRoleAdmin( @RequestParam("userid") String userid ){
        HashMap<String, Object> result = new HashMap<>();
        as.changeRoleAdmin(userid);
        result.put("msg", "ok");
        return result;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/changeRoleUser")
    public HashMap<String,Object> changeRoleUser( @RequestParam("userid") String userid ){
        HashMap<String, Object> result = new HashMap<>();
        as.changeRoleUser(userid);
        result.put("msg", "ok");
        return result;
    }

    /////////////// 상품 관련 ////////////////////////

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getShList")
    public HashMap<String, Object> getShList(@RequestParam("page") int page,
                                                 @RequestParam(value="key", required = false, defaultValue = "") String key){
        HashMap<String, Object> result = as.getShList(page, key);
        return result;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getShPost")
    public HashMap<String, Object> getShPost(@RequestParam("postId") int postId){
        HashMap<String, Object> result = new HashMap<>();
        SH_post post = as.getShPost( postId );
        List<SH_Category> shCategoryList = as.getShCategoryList();
        result.put("shPost", post);
        result.put("shCategoryList", shCategoryList);
        return result;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteShPost")
    public HashMap<String, Object> deleteShPost(@RequestParam("postId") int postId){
        HashMap<String, Object> result = new HashMap<>();
        as.deleteShPost(postId);
        result.put("msg", "ok");
        return result;
    }

    ///   ///////// 커뮤니티 관련 /////////
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getCPostList")
    public HashMap<String, Object> getCPostList(@RequestParam("page") int page,
                                             @RequestParam(value="key", required = false, defaultValue = "") String key){
        HashMap<String, Object> result = as.getCPostList(page, key);
        return result;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getCPost")
    public HashMap<String, Object> getCPost(@RequestParam("cpostId") int cpostId){
        HashMap<String, Object> result = new HashMap<>();
        C_post post = as.getCPost( cpostId );
        List<C_Category> cCategoryList = as.getCCategoryList();
        result.put("cPost", post);
        result.put("cCategoryList", cCategoryList);
        return result;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteCommunity")
    public HashMap<String, Object> deleteCommunity(@RequestParam("cpostId") int cpostId){
        HashMap<String, Object> result = new HashMap<>();
        as.deleteCommunity(cpostId);
        result.put("msg", "ok");
        return result;
    }

    /// ///////////// qna 관련 /////////////

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getQnaList")
    public HashMap<String, Object> getQnaList(@RequestParam("page") int page,
                                              @RequestParam(value="key", required = false, defaultValue = "") String key){
        return as.getQnaList(page, key);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getQna")
    public HashMap<String, Object> getQna(@RequestParam("qnaId") int qnaId){
        HashMap<String, Object> result = new HashMap<>();
        result.put("qna", as.getQna(qnaId));
        return result;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/writeReply")
    public HashMap<String,Object> writeReply(@RequestParam("qnaId") int qnaId, @RequestParam("reply") String reply, @RequestParam("answerer") String answerer){
        HashMap<String, Object> result = new HashMap<>();
        as.writeReply(qnaId, reply, answerer);
        result.put("msg", "ok");
        return result;
    }
}
