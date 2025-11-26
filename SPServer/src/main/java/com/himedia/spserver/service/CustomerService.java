package com.himedia.spserver.service;

import com.himedia.spserver.dto.Paging;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.customer.Qna;
import com.himedia.spserver.repository.MemberRepository;
import com.himedia.spserver.repository.QnaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerService {
    private final QnaRepository qr;
    private final MemberRepository mr;

    public HashMap<String, Object> getQnaList(String userid, int page) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        Member member = mr.findByUserid(userid);
        int count = qr.findAllByMember(member).size();
        paging.setTotalCount(count);
        paging.calPaging();

        Pageable pageable = PageRequest.of( page-1 , paging.getDisplayRow() , Sort.by(Sort.Direction.DESC, "qnaId"));
        Page<Qna> pageObj = qr.findAllByMember(member, pageable);
        result.put("qnaList", pageObj.getContent());
        result.put("paging", paging);
        return result;
    }

    public void writeQna(Qna qna) {
        qr.save(qna);
    }

    public Qna getQna(int qnaId) {
        return qr.findById( qnaId ).get();
    }
}
