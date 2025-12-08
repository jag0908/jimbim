package com.himedia.spserver.service;

import com.himedia.spserver.dto.Paging;
import com.himedia.spserver.dto.ShPostDto;
import com.himedia.spserver.entity.Community.C_Category;
import com.himedia.spserver.entity.Community.C_File;
import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.MemberRole;
import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.entity.SH.SH_File;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.entity.SHOP.*;
import com.himedia.spserver.entity.customer.Qna;
import com.himedia.spserver.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    private final ShFileRepository sfr;

    private final QnaRepository qr;

    private final CommunityListRepository cpr;
    private final CCategoryRepository ccr;

    private final ShopSuggestRepository ssr;
    private final ShopCategoryRepository shopcr;
    private final ShopFileRepository shopfr;
    private final ShopProductRepository shoppr;
    private final ShopProductImageRepository shopir;

    @Autowired
    private S3UploadService sus;

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

    public void updateBlacklist(String userid, int blacklist) {
        Member member = mr.findByUserid(userid);

        member.setBlacklist(blacklist);
    }
    /// /////////// 중고 관련 /////////////////////////

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

    public List<SH_File> getShFileList(int postId) {
        return sfr.findAllByPost_postId(postId);
    }

    public void deleteShPost(int postId) {
        spr.deleteById(postId);
    }

    ///////////////// shop 관련 ///////////////

    public HashMap<String, Object> getShopList(int page, String key) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayPage(10);
        paging.setDisplayRow(10);
        if( key.equals("") ) {
            int count = shoppr.findAll().size();
            paging.setTotalCount(count);
            paging.calPaging();

            Pageable pageable = PageRequest.of(page-1, paging.getDisplayRow(), Sort.by(Sort.Direction.DESC, "productId"));
            Page<SHOP_Product> list = shoppr.findAll( pageable );

            result.put("shopList", list.getContent());
        }else{
            int count = shoppr.findByTitleContaining(key).size();
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page-1, 10, Sort.by(Sort.Direction.DESC, "productId"));
            Page<SHOP_Product> list = shoppr.findByTitleContaining( key, pageable );
            result.put("shopList", list.getContent());
        }
        result.put("shopCategoryList", shopcr.findAll());
        result.put("paging", paging);
        result.put("key", key);
        return result;
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

    public void changeNotice(int cpostId, String isNotice) {
        C_post post = cpr.findById(cpostId).get();
        if( isNotice.equals("Y") ) {
            post.setIsNotice("N");
        }else {
            post.setIsNotice("Y");
        }
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
        Qna qna = qr.findById(qnaId).get();
        Member member = mr.findByUserid(answerer);

        qna.setReply(reply);
        qna.setAnswerer(member);
    }

    /////////////////////////// 요청내역 관련 ////////////////////
    public HashMap<String, Object> getSuggestList(int page, String key) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayPage(10);
        paging.setDisplayRow(10);
        if( key.equals("") ) {
            int count = ssr.findAll().size();
            paging.setTotalCount(count);
            paging.calPaging();

            Pageable pageable = PageRequest.of(page-1, paging.getDisplayRow(), Sort.by(Sort.Direction.DESC, "indate"));
            Page<SHOP_Suggest> list = ssr.findAll( pageable );

            result.put("suggestList", list.getContent());
        }else{
            int count = ssr.findByTitleContaining(key).size();
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page-1, 10, Sort.by(Sort.Direction.DESC, "indate"));
            Page<SHOP_Suggest> list = ssr.findByTitleContaining( key, pageable );
            result.put("suggestList", list.getContent());
        }
        result.put("paging", paging);
        result.put("key", key);
        return result;
    }

    public SHOP_Suggest getSuggest(int suggestId) {
        return ssr.findById( suggestId ).get();
    }

    public void setStatus(int suggestId, String status) {
        SHOP_Suggest suggest = ssr.findById(suggestId).get();
        suggest.setIsAccept(status);    // status에 있는 Y 또는 N 값을 isAccept에 넣음
    }

    public List<SHOP_Category> getShopCategoryList() {
        return shopcr.findAll();
    }

    public List<SHOP_File> getShopFiles(int suggestId) {
        return shopfr.findBySuggest_SuggestId(suggestId);
    }

    public SHOP_Product writeShopPost(String title, String content, Long categoryId) {
        SHOP_Category category =  shopcr.findById(categoryId).get();
        SHOP_Product post = new SHOP_Product();
        post.setTitle(title);
        post.setContent(content);
        post.setCategory(category);
        return shoppr.save(post);
    }

    public void fileUpload(List<MultipartFile> images, Long postId) throws IOException {
        SHOP_Product post = shoppr.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글 없음"));

        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                String fileUrl = sus.saveFile(image); // S3 업로드

                SHOP_ProductImage shoppi = new SHOP_ProductImage();
                shoppi.setProduct(post);
                shoppi.setFilePath(fileUrl);
                shoppi.setFileName(image.getOriginalFilename());
//                shopFile.setSize(image.getSize());
//                shopFile.setContentType(image.getContentType());

                shopir.save(shoppi);

                if (post.getImages() != null) {
                    post.getImages().add(shoppi);
                }
            }
            shoppr.save(post);
        }
    }

    public void uploadOldFile(List<Integer> idList, Long postId) {
        SHOP_Product post = shoppr.findById(postId).get();
        for(Integer id : idList) {
            SHOP_File fileInDB =  shopfr.findById(id).get();        // suggest는 SHOP_File을 씀

            SHOP_ProductImage shoppi = new SHOP_ProductImage();     // product는 SHOP_ProductImage를 씀
            shoppi.setProduct(post);
            shoppi.setFilePath(fileInDB.getFilePath());
            shoppi.setFileName(fileInDB.getFileName());
            shopir.save(shoppi);

            if (post.getImages() != null) {
                post.getImages().add(shoppi);
            }
        }
    }
}
