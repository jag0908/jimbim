package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SHOP.SHOP_File;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShopFileRepository extends JpaRepository<SHOP_File, Integer> {
    List<SHOP_File> findBySuggest_SuggestId(int suggestId);
}
