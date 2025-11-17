package com.himedia.spserver.service;

import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.repository.CommunityListRepository;
import com.himedia.spserver.repository.FileRepository;
import com.himedia.spserver.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CommunityListService {

    @Autowired
    S3UploadService sus;

    @Autowired
    private CommunityListRepository cr;

    @Autowired
    private MemberRepository mr;

    @Autowired
    private FileRepository fr;

    // 게시글 저장
    public void saveCommunity(C_post cpost) {
        if (cpost.getMember() == null) {
            cpost.setMember(mr.findByUserid("익명"));
        }
        cr.save(cpost);
    }

    // 조회수 증가
    public void addReadCount(int cpost_id) {
        Optional<C_post> optionalPost = cr.findById(cpost_id);
        optionalPost.ifPresent(post -> post.setReadcount(post.getReadcount() + 1));
    }

    // 게시글 수정
    public HashMap<String, Object> updateCommunity(C_post post) {
        HashMap<String, Object> result = new HashMap<>();
        Optional<C_post> optionalPost = cr.findById(post.getCpostId());

        if (optionalPost.isPresent()) {
            C_post existingPost = optionalPost.get();
            existingPost.setTitle(post.getTitle());
            existingPost.setContent(post.getContent());
            existingPost.setC_image(post.getC_image());
            existingPost.setFile(post.getFile());
            result.put("msg", "ok");
        } else {
            result.put("msg", "notok");
        }

        return result;
    }

    // 게시글 리스트 조회
    public HashMap<String, Object> getCommunityList(int page, Integer categoryId) {
        HashMap<String, Object> result = new HashMap<>();
        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Direction.DESC, "indate"));
        Page<C_post> list;

        if (categoryId == null || categoryId == 0) {
            list = cr.findAll(pageable);
        } else {
            list = cr.findByCategory_categoryId(categoryId, pageable);
        }

        result.put("communityList", list.getContent());

        // 페이징 정보
        int totalPages = list.getTotalPages();
        int currentPage = page;
        int beginPage = Math.max(1, currentPage - 2);
        int endPage = Math.min(totalPages, currentPage + 2);

        HashMap<String, Object> paging = new HashMap<>();
        paging.put("page", currentPage);
        paging.put("prev", currentPage > 1);
        paging.put("next", currentPage < totalPages);
        paging.put("beginPage", beginPage);
        paging.put("endPage", endPage);

        result.put("paging", paging);

        return result;
    }

    // 게시글 상세조회
    public Optional<C_post> getCommunityById(int id) {
        return cr.findById(id);
    }

    // 게시글 삭제
    public boolean deleteCommunity(int id) {
        Optional<C_post> optionalPost = cr.findById(id);
        if (optionalPost.isPresent()) {
            cr.deleteById(id);
            return true;
        }
        return false;
    }

    public C_post getNewCommunity() {
        return cr.findFirstByOrderByCpostIdDesc();
    }

    public void fileUpload(List<MultipartFile> images, String cpostId) throws IOException {
        C_post post = cr.findById(Integer.parseInt(cpostId)).get();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                String fileUrl = sus.saveFile(image); // S3 업로드

                File postFile = new File();
                postFile.setCpost(post);
                postFile.setPath(fileUrl); // S3 URL 저장
                postFile.setOriginalname(image.getOriginalFilename());
                postFile.setSize(Long.valueOf(image.getSize())); // 파일 크기
                postFile.setContentType(image.getContentType()); // 파일 타입

                fr.save(postFile); // FileRepository로 저장
            }
        }

    }
}
