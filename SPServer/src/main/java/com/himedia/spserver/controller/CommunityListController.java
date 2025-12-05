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

import java.io.IOException;
import java.util.Arrays;
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

    // ---------------- 공지사항 리스트 조회 ----------------
    @GetMapping("/getNoticeList")
    public HashMap<String, Object> getNoticeList() {
        HashMap<String, Object> result = new HashMap<>();
        result.put("noticeList", cs.getNoticeList());
        return result;
    }

    // ---------------- 게시글 리스트 조회 ----------------
    @GetMapping("/getCommunityList/{page}")
    public HashMap<String, Object> getCommunityList(
            @PathVariable int page,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String title) {
        return cs.getCommunityList(page, categoryId, title);
    }

    // ---------------- 게시글 상세조회 ----------------
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

    // ---------------- 조회수 증가 ----------------
    @PostMapping("/addReadCount")
    public HashMap<String, Object> addReadCount(@RequestParam("num") int cpost_id) {
        cs.addReadCount(cpost_id);
        HashMap<String, Object> result = new HashMap<>();
        result.put("msg", "ok");
        return result;
    }

    // ---------------- 게시글 작성 ----------------
    @PostMapping("/createCommunity")
    public HashMap<String, Object> createCommunity(@RequestBody C_post cpost){
        HashMap<String, Object> result = new HashMap<>();
        try {
            C_post savedPost = cs.saveCommunity(cpost);
            result.put("msg", "ok");
            result.put("cpostId", savedPost.getCpostId()); // React에서 파일 업로드용으로 ID 필요
        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "failed");
        }
        return result;
    }

    // ---------------- 게시글 수정 ----------------
    @PostMapping("/updateCommunity")
    public HashMap<String, Object> updateCommunity(
            @RequestParam("cpostId") Integer cpostId,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "deletedIds", required = false) String deletedIdsStr, // 삭제 이미지 ID (콤마 구분)
            @RequestParam(value = "newImages", required = false) List<MultipartFile> newImages
    ) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            // deletedIdsStr -> List<Integer>
            List<Integer> deletedIds = null;
            if (deletedIdsStr != null && !deletedIdsStr.isEmpty()) {
                deletedIds = Arrays.stream(deletedIdsStr.split(","))
                        .map(Integer::parseInt)
                        .toList();
            }

            boolean updated = cs.updateCommunity(cpostId, title, content, deletedIds, newImages);

            result.put("msg", updated ? "ok" : "notok");

        } catch (Exception e) {
            e.printStackTrace();
            result.put("msg", "failed");
        }
        return result;
    }

    // ---------------- 게시글 삭제 ----------------
    @DeleteMapping("/deleteCommunity/{id}")
    public HashMap<String, Object> deleteCommunity(@PathVariable Integer id) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            cs.deleteCommunity(id);
            result.put("msg", "deleted");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "failed");
        }
        return result;
    }

    // ---------------- 가장 최근 게시글 ----------------
    @GetMapping("/getNewCommunity")
    public HashMap<String, Object> getNewCommunity() {
        HashMap<String, Object> result = new HashMap<>();
        result.put("community", cs.getNewCommunity());
        return result;
    }

    // ---------------- 파일 업로드 ----------------
    @PostMapping("/fileupload")
    public HashMap<String, Object> fileUpload(
            @RequestParam("imageList") List<MultipartFile> images,
            @RequestParam("cpostId") String cpostId) {

        HashMap<String, Object> result = new HashMap<>();
        try {
            if (images == null || images.isEmpty()) {
                result.put("error", "no files uploaded");
                return result;
            }

            cs.fileUpload(images, cpostId);
            result.put("msg", "ok");

        } catch (IOException e) {
            e.printStackTrace();
            result.put("error", "failed");
        }
        return result;
    }

    // ---------------- 추천 토글 ----------------
    @PostMapping("/toggleLike")
    public HashMap<String, Object> toggleLike(@RequestParam Integer cpostId,
                                              @RequestParam Integer memberId) {
        HashMap<String, Object> result = new HashMap<>();

        C_post post = cs.getCommunityById(cpostId)
                .orElseThrow(() -> new RuntimeException("게시물이 없습니다."));
        Member member = mr.findById(memberId)
                .orElseThrow(() -> new RuntimeException("회원이 없습니다."));

        Optional<C_Like> existingLike = cr.findByMemberAndCpost(member, post);

        if (existingLike.isPresent()) {
            cr.delete(existingLike.get());
            result.put("liked", false);
        } else {
            C_Like newLike = new C_Like();
            newLike.setMember(member);
            newLike.setCpost(post);
            cr.save(newLike);
            result.put("liked", true);
        }

        long likeCount = cr.countByCpost(post);
        post.setC_like((int) likeCount);
        cs.saveCommunity(post);

        result.put("likeCount", likeCount);

        return result;
    }

    @GetMapping("/myPosts/{userid}")
    public List<C_post> getMyCommunityPosts(@PathVariable String userid) {
        Member member = mr.findByUserid(userid);
        if (member == null) {
            throw new RuntimeException("회원이 없습니다.");
        }
        return cs.getPostsByMember(member);
    }

    // ---------------- 파일 삭제 ----------------
    @DeleteMapping("/file/{fileId}")
    public HashMap<String, Object> deleteFile(@PathVariable Integer fileId) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            cs.deleteFile(fileId);
            result.put("msg", "deleted");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "failed");
        }
        return result;
    }

}
