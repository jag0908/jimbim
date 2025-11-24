package com.himedia.spserver.controller;

import com.himedia.spserver.entity.Community.C_Like;
import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.repository.CommunityLikeRepository;
import com.himedia.spserver.repository.MemberRepository;
import com.himedia.spserver.service.CommunityListService;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/communityList")
public class CommunityListController {

    @Autowired
    private CommunityListService cs;

    @Autowired
    private MemberRepository mr;

    @Autowired
    private CommunityLikeRepository cr;

    @Autowired
    ServletContext sc;

    // 게시글 리스트 조회
    @GetMapping("/getCommunityList/{page}")
    public HashMap<String, Object> getCommunityList(@PathVariable int page,
                                                    @RequestParam(required = false) Integer categoryId) {
        return cs.getCommunityList(page, categoryId);
    }

    // 게시글 상세조회
    @GetMapping("/getCommunity/{id}")
    public HashMap<String, Object> getCommunity(@PathVariable int id) {
        HashMap<String, Object> result = new HashMap<>();
        Optional<C_post> post = cs.getCommunityById(id);
        if (post.isPresent()) {
            result.put("community", post.get());
        } else {
            result.put("error", "notfound");
        }
        return result;
    }


    // 조회수 증가
    @PostMapping("/addReadCount")
    public HashMap<String, Object> addReadCount(@RequestParam("num") int cpost_id) {
        cs.addReadCount(cpost_id);
        HashMap<String, Object> result = new HashMap<>();
        result.put("msg", "ok");
        return result;
    }

    // 게시글 작성
    @PostMapping("/createCommunity")
    public HashMap<String, Object> createCommunity(@RequestBody C_post cpost){
        HashMap<String, Object> result = new HashMap<>();
        try {
            cs.saveCommunity(cpost);
            result.put("msg", "ok");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "failed");
        }
        return result;
    }

    // 게시글 수정
    @PostMapping("/updateCommunity")
    public HashMap<String, Object> updateCommunity(@RequestBody C_post cpost) {
        return cs.updateCommunity(cpost);
    }

    // 게시글 삭제
    @DeleteMapping("/deleteCommunity/{id}")
    public HashMap<String, Object> deleteCommunity(@PathVariable int id) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            cs.deleteCommunity(id);
            result.put("msg", "deleted");
        } catch (Exception e) {
            result.put("error", "failed");
        }
        return result;
    }

    // 가장 최근 게시글 가져오기
    @GetMapping("/getNewCommunity")
    public HashMap<String, Object> getNewCommunity() {
        HashMap<String, Object> result = new HashMap<>();
        result.put("community", cs.getNewCommunity());
        return result;
    }

    // 파일 업로드
    @PostMapping("/fileupload")
    public HashMap<String, Object> fileUpload(@RequestParam("imageList") List<MultipartFile> file,
                                              @RequestParam("cpostId") String cpostId) {
        HashMap<String , Object> result = new HashMap<>();
        try {
            cs.fileUpload(file, cpostId);
            result.put("msg", "ok");
        } catch (IllegalStateException | IOException e) {
            e.printStackTrace();
            result.put("error", "failed");
        }
        return result;
    }

    // 추천 토글 (한 계정당 한 번만 추천 가능)
    @PostMapping("/toggleLike")
    public HashMap<String, Object> toggleLike(@RequestParam Integer cpostId,
                                              @RequestParam Integer memberId) {
        HashMap<String, Object> result = new HashMap<>();

        // 게시물 조회
        Optional<C_post> optionalPost = cs.getCommunityById(cpostId);
        if (!optionalPost.isPresent()) {
            result.put("error", "게시물이 없습니다.");
            return result;
        }
        C_post cpost = optionalPost.get();

        // 유저 조회
        Optional<Member> optionalMember = mr.findById(memberId);
        if (!optionalMember.isPresent()) {
            result.put("error", "유저 정보가 없습니다.");
            return result;
        }
        Member member = optionalMember.get();

        // 기존 추천 체크
        Optional<C_Like> existingLike = cr.findByMemberAndCpost(member, cpost);

        if (existingLike.isPresent()) {
            // 추천 취소
            cr.delete(existingLike.get());
            result.put("liked", false);
        } else {
            // 추천 추가
            C_Like newLike = new C_Like();
            newLike.setMember(member);
            newLike.setCpost(cpost);
            cr.save(newLike);
            result.put("liked", true);
        }

        // 현재 추천 수
        long likeCount = cr.countByCpost(cpost);
        result.put("likeCount", likeCount);

        return result;
    }
}
