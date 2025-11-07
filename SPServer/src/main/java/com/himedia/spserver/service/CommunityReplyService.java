package com.himedia.spserver.service;

import com.himedia.spserver.entity.Community.C_Reply;
import com.himedia.spserver.repository.CommunityReplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CommunityReplyService {

    @Autowired
    CommunityReplyRepository crr;
//    public List<C_Reply> getReplyList(int replyId) {
//        return crr.findByPostIdOrderByReplyIdDesc(replyId);
//    }
//
//    public void addReply(C_Reply creply) {
//        crr.save(creply);
//    }
//
//    public void deleteReply(int replyId) {
//        C_Reply reply = crr.findByReplyId(replyId);
//        crr.delete(reply);
//    }
}
