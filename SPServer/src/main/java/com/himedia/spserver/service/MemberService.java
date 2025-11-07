package com.himedia.spserver.service;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.MemberRole;
import com.himedia.spserver.repository.MemberRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
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

        updateMem.setEmail(member.getEmail());
        updateMem.setPhone(member.getPhone());
        updateMem.setProfileImg(member.getProfileImg());
        updateMem.setProfileMsg(member.getProfileMsg());
        updateMem.setTerms_agree(member.getTerms_agree());
        updateMem.setPersonal_agree(member.getPersonal_agree());

        if(updateMem.getRrn().equals("미설정"))
            updateMem.setRrn(member.getRrn());  // 주민번호는 카카오로그인 초기설정 한정으로만 변경가능
    }

    public Member getMemberByNamePhone(String name, String phone) {
        return mr.findByNameAndPhone(name, phone);
    }

    // 이메일 전송주체
    @Value("${spring.mail.username}")
    private static String senderEmail;
    private final JavaMailSender JMSender;
    private static  int number;

    public int sendMail(String email) {
        // 코드 발생
        number = (int)(Math.random() * (90000)) + 100000;
        // 수신 이메일, 제목 내용 등등을 설정할 객체를 생성, 전송될 이메일 내용(수신자, 제목, 내용 등) 구성 객체
        MimeMessage message = JMSender.createMimeMessage();
        try {
            message.setFrom( senderEmail );  // 보내는 사람 설정
            message.setRecipients( MimeMessage.RecipientType.TO, email );  // 받는 사람 설정
            message.setSubject("이메일 인증");  // 제목 설정
            String body = "";
            body += "<h3>" + "요청하신 인증 번호입니다." + "</h3>";
            body += "<h1>" + number + "</h1>";
            body += "<h3>" + "감사합니다." + "</h3>";
            message.setText(body,"UTF-8", "html");  // 본문 설정
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        JMSender.send(message);  // 구성 완료된 message 를  JMSender 로 전송
        return number;
    }

    public void resetPw(String userid, String pwd) {
        Member member = mr.findByUserid(userid);
        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        member.setPwd( pe.encode( pwd));
    }
}
