package com.himedia.spserver.repository;

import com.himedia.spserver.dto.CommunityViewDTO;
import com.himedia.spserver.entity.Community.C_Category;
import com.himedia.spserver.entity.Community.C_post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityListRepository extends JpaRepository<C_post, Integer> {

    @Query("SELECT new com.himedia.spserver.dto.CommunityViewDTO(" +
            "p.cpostId, p.title, p.content, p.c_image, p.readcount, " +
            "c.categoryName, m.userid, p.indate) " +
            "FROM C_post p " +
            "LEFT JOIN p.category c " +
            "LEFT JOIN p.member m")
    Page<CommunityViewDTO> findAllDTO(Pageable pageable);

    @Query("SELECT new com.himedia.spserver.dto.CommunityViewDTO(" +
            "p.cpostId, p.title, p.content, p.c_image, p.readcount, " +
            "c.categoryName, m.userid, p.indate) " +
            "FROM C_post p " +
            "LEFT JOIN p.category c " +
            "LEFT JOIN p.member m " +
            "WHERE c.categoryId = :categoryId")
    Page<CommunityViewDTO> findByCategoryDTO(Integer categoryId, Pageable pageable);

    long countByCategoryCategoryId(Integer categoryId);

    Page<C_post> findByCategory_categoryId(Integer categoryId, Pageable pageable);

    C_post findFirstByOrderByCpostIdDesc();
}
