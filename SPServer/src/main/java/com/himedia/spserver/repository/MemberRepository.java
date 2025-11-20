package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    Member findByUserid(String username);

    Member findByNameAndPhone(String name, String phone);

    @Query(value = "select * from member ",  nativeQuery = true)
    List<Member> findAllMemberWithDeleted();

    @Query(value = "select * from member ",  nativeQuery = true)
    Page<Member> findAllMemberWithDeleted(Pageable pageable);

    @Query(value = "select * from member where name like %:key%",  nativeQuery = true)
    List<Member> findAllByNameContainingWithDeleted(@Param("key") String key);

    @Query(value = "select * from member where name like %:key%",  nativeQuery = true)
    Page<Member> findAllByNameContainingWithDeleted(@Param("key") String key, Pageable pageable);
}
