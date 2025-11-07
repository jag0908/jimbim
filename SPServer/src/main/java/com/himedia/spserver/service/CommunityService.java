//package com.himedia.spserver.service;
//
//import com.himedia.spserver.entity.Community.*;
//import com.himedia.spserver.entity.File;
//import com.himedia.spserver.repository.CommunityRepository;
//import com.himedia.spserver.repository.FileRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.HashMap;
//import java.util.List;
//
//@Service
//@Transactional
//public class CommunityService {
//
//    @Autowired
//    private CommunityRepository cr;
//
//    @Autowired
//    private FileRepository fr;
//
//    // 1. 카테고리 리스트 조회
//    public List<C_Category> getAllCategories() {
//        return cr.findAllCategories();
//    }
//
//    // 2. 게시글 총 개수 조회 (카테고리별)
//    public int countCommunityByCategory(int categoryId) {
//        return cr.countByCategoryId(categoryId);
//    }
//
//    // 3. 게시글 리스트 조회 (페이징 포함)
//    public List<C_post> getCommunityByCategory(int categoryId, int page, int displayRow) {
//        int start = (page - 1) * displayRow;
//        return cr.findByCategoryIdWithPaging(categoryId, start, displayRow);
//    }
//
//    // 4. 게시글 상세 조회
//    public C_Category getCommunity(int postId) {
//        return cr.findById(postId).orElse(null);
//    }
//
//    // 5. 게시글 등록
//    public void insertCommunity(C_post post) {
//        cr.save(post);
//    }
//
//    // 6. 게시글 수정
//    public HashMap<String, Object> updateCommunity(C_post post) {
//        HashMap<String, Object> result = new HashMap<>();
//        cr.save(post);
//        result.put("msg", "ok");
//        return result;
//    }
//
//    // 7. 게시글 삭제
//    public void deleteCommunity(int postId) {
//        cr.deleteById(postId);
//    }
//
//    // 8. 조회수 증가
//    public void addReadCount(int postId) {
//        C_post post = cr.findById(postId).orElse(null);
//        if(post != null) {
//            post.setReadcount(post.getReadcount() == null ? 1 : post.getReadcount() + 1);
//            cr.save(post);
//        }
//    }
//
//    // 9. 좋아요 추가
//    public void addLike(int postId, int memberId) {
//        cr.saveLike(postId, memberId);
//    }
//
//    // 10. 댓글 조회
//    public List<C_Reply> getReplies(int postId) {
//        return cr.findRepliesByPostId(postId);
//    }
//
//    // 11. 댓글 등록
//    public void addReply(C_Reply reply) {
//        cr.saveReply(reply);
//    }
//
//    // 12. 파일 업로드(DB 저장)
//    public void saveFile(File fileEntity) {
//        fr.save(fileEntity);
//    }
//}
