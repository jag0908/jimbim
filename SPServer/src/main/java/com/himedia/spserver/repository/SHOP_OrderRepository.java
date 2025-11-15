package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.Mypage.SHOP_Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SHOP_OrderRepository extends JpaRepository<SHOP_Order, Integer> {
    List<SHOP_Order> findAllByMemberId(Member member);
}
