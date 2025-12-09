package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SHOP.SHOP_BuyOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShopBuyOrderRepository extends JpaRepository<SHOP_BuyOrder, Long> {
    List<SHOP_BuyOrder> findAllByBuyer(Member buyer);

        @Query("SELECT s FROM SHOP_BuyOrder s WHERE s.buyer.member_id = :memberId")
        List<SHOP_BuyOrder> findBuyOrdersByMemberId(@Param("memberId") Integer memberId);


}
