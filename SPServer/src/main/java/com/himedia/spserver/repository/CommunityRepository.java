package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Community.C_Category;
import com.himedia.spserver.entity.Community.C_Reply;
import com.himedia.spserver.entity.Community.C_post;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.print.Pageable;
import java.util.List;

public interface CommunityRepository extends JpaRepository<C_post, Integer> {
    C_post findByCpostNum(int cpostNum);
}
