package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.Mypage.SH_Orderdetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SH_OrderdetailRepository extends JpaRepository<SH_Orderdetail, Integer> {
    List<SH_Orderdetail> findAllByMemberId(Member member);
}
