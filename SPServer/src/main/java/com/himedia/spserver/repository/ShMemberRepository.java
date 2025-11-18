package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShMemberRepository extends JpaRepository<Member, Integer> {
//    Member findByMember_id(Integer memberid);

}
