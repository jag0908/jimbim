package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member,String> {
    Member findByUserid(String username);
}
