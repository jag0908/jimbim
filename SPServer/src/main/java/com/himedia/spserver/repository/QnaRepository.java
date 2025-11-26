package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.customer.Qna;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QnaRepository extends JpaRepository<Qna,Integer> {

    List<Qna> findAllByMember(Member member);

    Page<Qna> findAllByMember(Member member, Pageable pageable);

    List<Qna> findAllByTitleContaining(String key);

    Page<Qna> findAllByTitleContaining(String key, Pageable pageable);
}
