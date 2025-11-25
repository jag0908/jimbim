package com.himedia.spserver.repository;

import com.himedia.spserver.dto.CommunityViewDTO;
import com.himedia.spserver.entity.Community.C_Category;
import com.himedia.spserver.entity.Community.C_post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityListRepository extends JpaRepository<C_post, Integer> {

    C_post findFirstByOrderByCpostIdDesc();

    @Query("SELECT c FROM C_post c " +
            "WHERE (:title IS NULL OR c.title LIKE %:title%) " +
            "AND (:categoryId IS NULL OR c.category.categoryId = :categoryId)")
    Page<C_post> searchByTitleAndCategory(@Param("title") String title,
                                          @Param("categoryId") Integer categoryId,
                                          Pageable pageable);
}
