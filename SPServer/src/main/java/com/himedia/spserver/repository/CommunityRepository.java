package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Community.C_Category;
import com.himedia.spserver.entity.Community.C_Reply;
import com.himedia.spserver.entity.Community.C_post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityRepository extends JpaRepository<C_Category, Integer> {

//    List<C_Category> findAllCategories();
//
//    int countByCategoryId(int categoryId);
//
//    List<C_post> findByCategoryIdWithPaging(int categoryId, int start, int displayRow);
//
//    void saveLike(int postId, int memberId);
//
//    List<C_Reply> findRepliesByPostId(int postId);
//
//    void saveReply(C_Reply reply);
}
