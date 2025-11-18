package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SHOP.SHOP_zzim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SHOP_zzimRepository  extends JpaRepository<SHOP_zzim,Integer> {
    List<SHOP_zzim> findAllByMember(Member member);
}
