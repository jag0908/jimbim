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

//    public List<C_Reply> getReplyList(int reply_id) {
//        return crr.findByCpostidOrderByReplyIdDesc(reply_id);
//    }
//
//    public void addReply(C_Reply creply) {
//        crr.save(creply);
//    }
//
//    public void deleteReply(int reply_id) {
//        C_Reply reply = crr.findByReplyId(reply_id);
//        crr.delete(reply);
//    }
}
