package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Follow;
import com.himedia.spserver.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    Optional<Follow> findByStartMemberAndEndMember(Member startMember, Member endMember);

    List<Follow> findByStartMember(Member startMember); // 내가 팔로우한 목록
    List<Follow> findByEndMember(Member endMember);// 나를 팔로우한 목록

    @Query("SELECT f.endMember.member_id, COUNT(f) " +
            "FROM Follow f " +
            "WHERE f.endMember IN :members " +
            "GROUP BY f.endMember")
    List<Object[]> countFollowersByEndMembers(@Param("members") List<Member> members);
}
