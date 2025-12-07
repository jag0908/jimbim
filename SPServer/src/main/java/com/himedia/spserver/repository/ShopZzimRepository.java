package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SHOP.SHOP_zzim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShopZzimRepository extends JpaRepository<SHOP_zzim, Long> {

    @Query("SELECT z FROM SHOP_zzim z WHERE z.member.member_id = :memberId")
    List<SHOP_zzim> findByMemberId(@Param("memberId") Long memberId);
}
