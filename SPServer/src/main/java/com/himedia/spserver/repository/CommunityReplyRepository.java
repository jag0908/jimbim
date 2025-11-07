package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Community.C_Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityReplyRepository extends JpaRepository<C_Reply, Integer> {

//    List<C_Reply> findByPostIdOrderByReplyIdDesc(int replyId);
//
//    C_Reply findByReplyId(int replyId);
}
