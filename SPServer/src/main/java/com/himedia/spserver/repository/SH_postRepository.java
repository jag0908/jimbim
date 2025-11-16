package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SH_postRepository extends JpaRepository<SH_post,Integer> {
    List<SH_post> findAllByMember(Member member);
}
