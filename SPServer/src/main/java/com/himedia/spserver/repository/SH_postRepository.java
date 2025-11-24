package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface SH_postRepository extends JpaRepository<SH_post,Integer> {
    List<SH_post> findAllByMember(Member member);

    List<SH_post> findByTitleContaining(String key);

    Page<SH_post> findByTitleContaining(String key, Pageable pageable);
}
