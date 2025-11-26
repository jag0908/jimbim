package com.himedia.spserver.service;

import com.himedia.spserver.entity.Follow;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class StyleFollowService {

    private final MemberRepository memberRepository;
    private final FollowRepository followRepository;


    public boolean toggleFollow(String startUserid, String endUserid) {
        Member startMember = memberRepository.findByUserid(startUserid);
        Member endMember = memberRepository.findByUserid(endUserid);

        if (startMember == null || endMember == null) {
            throw new RuntimeException("회원 정보를 찾을 수 없습니다.");
        }

        return followRepository.findByStartMemberAndEndMember(startMember, endMember)
                .map(existing -> {
                    followRepository.delete(existing);
                    return false;
                })
                .orElseGet(() -> {
                    Follow newFollow = new Follow();
                    newFollow.setStartMember(startMember);
                    newFollow.setEndMember(endMember);
                    followRepository.save(newFollow);
                    return true;
                });
    }


    public boolean isFollowing(String startUserid, String endUserid) {
        Member startMember = memberRepository.findByUserid(startUserid);
        Member endMember = memberRepository.findByUserid(endUserid);

        if (startMember == null || endMember == null)
            throw new RuntimeException("회원 정보를 찾을 수 없습니다.");

        return followRepository.findByStartMemberAndEndMember(startMember, endMember).isPresent();
    }
}
