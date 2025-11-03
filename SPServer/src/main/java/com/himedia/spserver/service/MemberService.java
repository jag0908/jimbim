package com.himedia.spserver.service;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.MemberRole;
import com.himedia.spserver.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository mr;

    public Member getMember(String id) {
        return mr.findByUserid( id );
    }

    public void insertMember(Member member) {
        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        member.setPwd( pe.encode( member.getPwd()));

        List<MemberRole> roles = new ArrayList<>();
        roles.add(MemberRole.USER);
        member.setMemberRoleList(roles);

        mr.save( member );
    }
}
