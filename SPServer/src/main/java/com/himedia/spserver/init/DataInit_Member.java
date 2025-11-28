package com.himedia.spserver.init;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.MemberRole;
import com.himedia.spserver.repository.MemberRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInit_Member implements CommandLineRunner {
    private final MemberRepository mr;
    public DataInit_Member(MemberRepository mr) {
        this.mr = mr;
    }

    @Override
    public void run(String... args) {
        if (mr.findByUserid("admin") == null ) {
            initMember();
        }
    }

    private void initMember() {
        List<MemberRole> memberRoles = new ArrayList<>();
        memberRoles.add(MemberRole.ADMIN);
        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        List<Member> members = List.of(
                new Member(null, "admin", "관리자", pe.encode("admin"), null, null, "관리자", "관리자", "관리자", "N", "N", "N", null, 0, null, memberRoles )
        );

        mr.saveAll(members);
    }
}
