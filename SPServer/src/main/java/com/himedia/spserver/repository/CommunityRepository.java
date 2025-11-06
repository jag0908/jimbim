package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Community.C_Category;
import com.himedia.spserver.entity.Community.C_post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityRepository extends JpaRepository<C_Category, Integer> {

    C_post findByNum(int num);
}
