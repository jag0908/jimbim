package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.entity.SH.SH_post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShCategoryRepository extends JpaRepository<SH_Category, Integer> {

}
