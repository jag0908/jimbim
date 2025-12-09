package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SHOP.SHOP_SellList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShopSellListRepository extends JpaRepository<SHOP_SellList, Long> {

}
