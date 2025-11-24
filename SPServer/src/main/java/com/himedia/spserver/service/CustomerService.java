package com.himedia.spserver.service;

import com.himedia.spserver.entity.customer.Qna;
import com.himedia.spserver.repository.QnaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerService {
    private final QnaRepository qr;

    public List<Qna> getQnaList(String memberId) {
        return null;
    }
}
