package com.himedia.spserver.service;

import com.himedia.spserver.dto.Paging;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.MemberRole;
import com.himedia.spserver.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final MemberRepository mr;

    public HashMap<String, Object> getMemberList(int page, String key) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayPage(10);
        paging.setDisplayRow(10);
        if( key.equals("") ) {
            int count = mr.findAllMemberWithDeleted().size();
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page-1, 10, Sort.by(Sort.Direction.DESC, "indate"));
            Page<Member> list = mr.findAllMemberWithDeleted( pageable );
            result.put("memberList", list.getContent());
        }else{
            int count = mr.findAllByNameContainingWithDeleted(key).size();
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page-1, 10, Sort.by(Sort.Direction.DESC, "indate"));
            Page<Member> list = mr.findAllByNameContainingWithDeleted( key, pageable );
            result.put("memberList", list.getContent());
        }
        result.put("paging", paging);
        result.put("key", key);
        return result;
    }

    public void changeRoleAdmin(String userid) {
        Member member = mr.findByUserid(userid);

        List<MemberRole> roleList = new ArrayList<>();
        roleList.add(MemberRole.valueOf("USER"));
        roleList.add(MemberRole.valueOf("ADMIN"));
        member.setMemberRoleList( roleList );
    }

    public void changeRoleUser(String userid) {
        Member member = mr.findByUserid(userid);

        List<MemberRole> roleList = new ArrayList<>();
        roleList.add(MemberRole.valueOf("USER"));
        member.setMemberRoleList( roleList );
    }
}
