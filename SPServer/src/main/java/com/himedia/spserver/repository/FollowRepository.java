package com.himedia.spserver.repository;

import com.himedia.spserver.dto.StyleFollowerCountDTO;
import com.himedia.spserver.entity.Follow;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    Optional<Follow> findByStartMemberAndEndMember(Member startMember, Member endMember);

    List<Follow> findByStartMember(Member startMember); // 내가 팔로우한 목록
    List<Follow> findByEndMember(Member endMember);// 나를 팔로우한 목록

    @Query("SELECT new com.himedia.spserver.dto.StyleFollowerCountDTO(f.endMember.member_id, COUNT(f)) " +
            "FROM Follow f WHERE f.endMember.member_id IN :memberIds " +
            "GROUP BY f.endMember.member_id")
    List<StyleFollowerCountDTO> countByEndMemberIn(@Param("memberIds") List<Integer> memberIds);

    @Query("SELECT DISTINCT p FROM STYLE_post p LEFT JOIN FETCH p.member m WHERE m.member_id IN :memberIds")
    List<STYLE_post> findAllWithMemberByMemberIds(@Param("memberIds") List<Integer> memberIds);

    @Query("SELECT f FROM Follow f " +
            "WHERE f.startMember.member_id = :startMemberId " +
            "AND f.endMember.member_id IN :endMemberIds")
    List<Follow> findAllByStartMemberAndEndMembers(
            @Param("startMemberId") Integer startMemberId,
            @Param("endMemberIds") List<Integer> endMemberIds
    );

    boolean existsByStartMember_UseridAndEndMember_Userid(String loginUserid, String userid);
}
