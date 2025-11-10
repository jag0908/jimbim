package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Follow;
import com.himedia.spserver.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    @Query("SELECT f FROM Follow f WHERE f.start_member = :start AND f.end_member = :end")
    Optional<Follow> findByStart_memberAndEnd_member(Member startMember, Member endMember);
}
