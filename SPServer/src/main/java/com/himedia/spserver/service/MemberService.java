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

    public void kakaoIdFirstEdit(Member member) {
        Member updateMem = mr.findByUserid( member.getUserid());

        updateMem.setPhone(member.getPhone());
        updateMem.setProfileImg(member.getProfileImg());
        updateMem.setProfileMsg(member.getProfileMsg());
        updateMem.setTerms_agree(member.getTerms_agree());
        updateMem.setPersonal_agree(member.getPersonal_agree());

        if(updateMem.getRrn().equals("미설정"))
            updateMem.setRrn(member.getRrn());  // 주민번호는 카카오로그인 초기설정 한정으로만 변경가능
    }
}
