package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SHOP.SHOP_post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SHOP_postRepository extends JpaRepository<SHOP_post,Integer> {
    List<SHOP_post> findAllByMember(Member member);
}
