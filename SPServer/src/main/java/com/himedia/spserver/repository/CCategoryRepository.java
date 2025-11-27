package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Community.C_Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CCategoryRepository extends JpaRepository<C_Category, Integer> {
}