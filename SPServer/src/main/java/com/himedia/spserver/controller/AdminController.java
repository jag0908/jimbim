package com.himedia.spserver.controller;

import com.himedia.spserver.entity.Community.C_Category;
import com.himedia.spserver.entity.Community.C_File;
import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.entity.SH.SH_File;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.entity.SHOP.SHOP_File;
import com.himedia.spserver.entity.SHOP.SHOP_Product;
import com.himedia.spserver.entity.SHOP.SHOP_Suggest;
import com.himedia.spserver.entity.SHOP.SHOP_post;
import com.himedia.spserver.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/updateBlacklist")
    public HashMap<String,Object> updateBlacklist( @RequestParam("userid") String userid, @RequestParam("blacklist") int blacklist){
        HashMap<String, Object> result = new HashMap<>();
        as.updateBlacklist(userid, blacklist);
        result.put("msg", "ok");
        return result;
    }
    /////////////// 중고마을 관련 ////////////////////////

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
        List<SH_File> shFileList = as.getShFileList(postId);
        result.put("shPost", post);
        result.put("shCategoryList", shCategoryList);
        result.put("shFileList", shFileList);
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

    /// //////////////////// shop 관련 //////////////////////////

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getShopList")
    public HashMap<String, Object> getShopList(@RequestParam("page") int page,
                                               @RequestParam(value="key", required = false, defaultValue = "") String key){
        HashMap<String, Object> result = as.getShopList(page, key);
        return result;
    }

//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/getShopPost")
//    public HashMap<String, Object> getShopPost(@RequestParam("postId") int postId){
//        HashMap<String, Object> result = new HashMap<>();
//        SH_post post = as.getShPost( postId );
//        List<SH_Category> shCategoryList = as.getShCategoryList();
//        result.put("shPost", post);
//        result.put("shCategoryList", shCategoryList);
//        return result;
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("/deleteShPost")
//    public HashMap<String, Object> deleteShPost(@RequestParam("postId") int postId){
//        HashMap<String, Object> result = new HashMap<>();
//        as.deleteShPost(postId);
//        result.put("msg", "ok");
//        return result;
//    }

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

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/changeNotice")
    public HashMap<String,Object> changeNotice(@RequestParam("cpostId") int cpostId, @RequestParam("isNotice") String isNotice){
        HashMap<String, Object> result = new HashMap<>();
        as.changeNotice(cpostId, isNotice);
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
    /// //////////// 요청내역 관련 //////////////////

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getSuggestList")
    public HashMap<String, Object> getSuggestList(@RequestParam("page") int page,
                                              @RequestParam(value="key", required = false, defaultValue = "") String key){
        return as.getSuggestList(page, key);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getSuggest")
    public HashMap<String, Object> getSuggest(@RequestParam("suggestId") int suggestId){
        HashMap<String, Object> result = new HashMap<>();
        SHOP_Suggest suggest = as.getSuggest( suggestId );
        List<SHOP_File> files = as.getShopFiles(suggestId);
        result.put("suggest", suggest);
        result.put("files", files);
        return result;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getShopCategoryList")
    public HashMap<String,Object> getShopCategoryList(){
        HashMap<String, Object> result = new HashMap<>();
        result.put("categoryList", as.getShopCategoryList());
        return result;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/setStatus")
    public HashMap<String,Object> setStatus( @RequestParam("suggestId") int suggestId, @RequestParam("status") String status){
        HashMap<String, Object> result = new HashMap<>();
        as.setStatus(suggestId, status);
        result.put("msg", "ok");
        return result;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/writeShopPost")
    public HashMap<String,Object> writeShopPost(@RequestParam("title") String title, @RequestParam("content") String content, @RequestParam("categoryId") Long categoryId){
        HashMap<String, Object> result = new HashMap<>();
        SHOP_Product post = as.writeShopPost(title, content, categoryId);
        result.put("postId", post.getProductId());
        return result;
    }
    @PostMapping("/uploadOldFile")
    public HashMap<String,Object> uploadOldFile(@RequestParam("idList[]") List<Integer> idList, @RequestParam("postId") Long postId){
        HashMap<String, Object> result = new HashMap<>();
        as.uploadOldFile(idList, postId);
        result.put("msg", "ok");
        return result;
    }

    @PostMapping("/fileupload")
    public HashMap<String, Object> fileUpload(
            @RequestParam("imageList") List<MultipartFile> images,
            @RequestParam("postId") Long postId) {

        HashMap<String, Object> result = new HashMap<>();
        try {
            if (images == null || images.isEmpty()) {
                result.put("error", "no files uploaded");
                return result;
            }

            as.fileUpload(images, postId);
            result.put("msg", "ok");

        } catch (IOException e) {
            e.printStackTrace();
            result.put("error", "failed");
        }
        return result;
    }
}
