package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Follow;
import com.himedia.spserver.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {

//    Optional<Follow> findByStart_memberAndEnd_member(Member startMember, Member endMember);
//
//    List<Follow> findByStart_member(Member startMember); // 내가 팔로우한 목록
//    List<Follow> findByEnd_member(Member endMember);     // 나를 팔로우한 목록
}
