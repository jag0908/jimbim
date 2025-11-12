package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Community.C_post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityListRepository extends JpaRepository<C_post, Integer> {
    C_post findByCpostNum(int cpostNum);
}
