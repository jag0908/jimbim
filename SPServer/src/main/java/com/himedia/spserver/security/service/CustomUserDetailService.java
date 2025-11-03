package com.himedia.spserver.security.service;

import com.himedia.spserver.dto.MemberDTO;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    final MemberRepository mr;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("loadUserByUsername - username : " + username + "   ----------------------------------");

        Member member = mr.findByUserid( username );
        System.out.println("member : " + member);
        if( member == null) {
            throw new UsernameNotFoundException(username + " - User Not found");
        }
        MemberDTO memberDTO = new MemberDTO(
                member.getUserid(),
                member.getPwd(),/*
                member.getName(),
                member.getEmail(),
                member.getPhone(),
                member.getZip_num(),
                member.getAddress1(),
                member.getAddress2(),
                member.getAddress3(),
                member.getProvider(),
                member.getSnsid(),*/
                member.getMemberRoleList().stream().map(memberRole -> memberRole.name()).collect(Collectors.toList())  // List<MemberRole> 형자료에서 List<String>형태로 변환
        );
        System.out.println("member : " + member);
        System.out.println("memberdto : " + memberDTO);
        return memberDTO;
        // UsernamePasswordAuthenticationToken 로 리턴
        // 로그인에 성공을 하면  APILoginSuccessHandler
        // 로그인에 실패하면   APILoginFailHandler
        // 로 이동합니다
    }
}
