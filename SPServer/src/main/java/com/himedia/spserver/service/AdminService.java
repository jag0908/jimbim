package com.himedia.spserver.service;

import com.himedia.spserver.dto.Paging;
import com.himedia.spserver.dto.ShPostDto;
import com.himedia.spserver.entity.Community.C_Category;
import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.MemberRole;
import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.entity.customer.Qna;
import com.himedia.spserver.repository.*;
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
    private final SH_postRepository spr;
    private final Sh_categoryRepository scr;
    private final QnaRepository qr;
    private final CommunityListRepository cpr;
    private final CCategoryRepository ccr;

    /// ////////////// 멤버관련 /////////////////

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

    public Member getMember(int memberId) {
        return mr.findByIdWithDeleted( memberId );
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

    /// /////////// 상품 관련 /////////////////////////

    public HashMap<String, Object> getShList(int page, String key) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayPage(10);
        paging.setDisplayRow(10);
        if( key.equals("") ) {
            int count = spr.findWithMember().size();
            paging.setTotalCount(count);
            paging.calPaging();

            Pageable pageable = PageRequest.of(page-1, paging.getDisplayRow(), Sort.by(Sort.Direction.DESC, "postId"));
            Page<SH_post> list = spr.findWithMember( pageable );

            result.put("shList", list.getContent());
        }else{
            int count = spr.findByTitleContainingWithMember(key).size();
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page-1, 10, Sort.by(Sort.Direction.DESC, "indate"));
            Page<SH_post> list = spr.findByTitleContainingWithMember( key, pageable );
            result.put("shList", list.getContent());
        }
        result.put("shCategoryList", scr.findAll());
        result.put("paging", paging);
        result.put("key", key);
        return result;
    }

    public SH_post getShPost(int postId) {
        return spr.findByIdWithMember( postId );
    }

    public List<SH_Category> getShCategoryList() {
        return scr.findAll();
    }

    public void deleteShPost(int postId) {
        spr.deleteById(postId);
    }

    /// ////////// 커뮤니티 관련 /////////////////
    public HashMap<String, Object> getCPostList(int page, String key) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayPage(10);
        paging.setDisplayRow(10);
        if( key.equals("") ) {
            int count = cpr.findAll().size();
            paging.setTotalCount(count);
            paging.calPaging();

            Pageable pageable = PageRequest.of(page-1, paging.getDisplayRow(), Sort.by(Sort.Direction.DESC, "cpostId"));
            Page<C_post> list = cpr.findAll( pageable );

            result.put("cPostList", list.getContent());
        }else{
            int count = cpr.findByTitleContaining(key).size();
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page-1, 10, Sort.by(Sort.Direction.DESC, "indate"));
            Page<C_post> list = cpr.findByTitleContaining( key, pageable );
            result.put("cPostList", list.getContent());
        }
        result.put("cCategoryList", ccr.findAll());
        result.put("paging", paging);
        result.put("key", key);
        return result;
    }
    public C_post getCPost(int cpostId) {
        return cpr.findById( cpostId ).get();
    }
    public List<C_Category> getCCategoryList() {
        return ccr.findAll();
    }

    public void deleteCommunity(int cpostId) {
        cpr.deleteById(cpostId);
    }

    /// ////////////// qna 관련 /////////////////////////

    public HashMap<String, Object> getQnaList(int page, String key) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayPage(10);
        paging.setDisplayRow(10);
        if( key.equals("") ) {
            int count = qr.findAll().size();
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page-1, 10, Sort.by(Sort.Direction.DESC, "qnaId"));
            Page<Qna> list = qr.findAll( pageable );
            result.put("qnaList", list.getContent());
        }else{
            int count = qr.findAllByTitleContaining(key).size();
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page-1, 10, Sort.by(Sort.Direction.DESC, "qnaId"));
            Page<Qna> list = qr.findAllByTitleContaining( key, pageable );
            result.put("qnaList", list.getContent());
        }
        result.put("paging", paging);
        result.put("key", key);
        return result;
    }

    public Qna getQna(int qnaId) {
        return qr.findById( qnaId ).get();
    }

    public void writeReply(int qnaId, String reply, String answerer) {
        Qna qna = qr.findById( qnaId).get();
        Member member = mr.findByUserid(answerer);

        qna.setReply( reply );
        qna.setAnswerer(member);
    }
}
