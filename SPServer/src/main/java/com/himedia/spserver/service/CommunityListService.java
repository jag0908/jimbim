package com.himedia.spserver.service;

import com.himedia.spserver.entity.Community.C_File;
import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.repository.*;
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
    private S3UploadService sus;

    @Autowired
    private CommunityListRepository cr;

    @Autowired
    private CommunityLikeRepository clr;

    @Autowired
    private CommunityReplyRepository crr;

    @Autowired
    private MemberRepository mr;

    @Autowired
    private CommunityFileRepository cfr;

    @Autowired
    private CommunityFileService cfs;

    // ---------------- 게시글 저장 ----------------
    public C_post saveCommunity(C_post cpost) {
        return cr.save(cpost);
    }

    // ---------------- 조회수 증가 ----------------
    public void addReadCount(int cpostId) {
        Optional<C_post> optionalPost = cr.findById(cpostId);
        optionalPost.ifPresent(post -> {
            int currentCount = post.getReadcount() == null ? 0 : post.getReadcount();
            post.setReadcount(currentCount + 1);
        });
    }

    // ---------------- 게시글 수정 ----------------
    public HashMap<String, Object> updateCommunity(C_post post) {
        HashMap<String, Object> result = new HashMap<>();
        Optional<C_post> optionalPost = cr.findById(post.getCpostId());

        if (optionalPost.isPresent()) {
            C_post existingPost = optionalPost.get();
            existingPost.setTitle(post.getTitle());
            existingPost.setContent(post.getContent());
            existingPost.setC_image(post.getC_image());

            // 파일 리스트 수정 시
            if (post.getFileList() != null && !post.getFileList().isEmpty()) {
                for (C_File file : post.getFileList()) {
                    file.setCpost(existingPost); // 게시글 연결
                    cfr.save(file);
                }
                existingPost.setFileList(post.getFileList());
            }

            cr.save(existingPost);
            result.put("msg", "ok");
        } else {
            result.put("msg", "notok");
        }
        return result;
    }

    // ---------------- 게시글 상세조회 ----------------
    public Optional<C_post> getCommunityById(int id) {
        return cr.findById(id);
    }

    // ---------------- 게시글 삭제 ----------------
    public void deleteCommunity(Integer cpostId) {
        crr.deleteByCpost_CpostId(cpostId); // 댓글 삭제
        clr.deleteByCpost_CpostId(cpostId); // 좋아요 삭제
        cr.deleteById(cpostId); // 게시글 삭제
    }

    // ---------------- 최신 게시글 ----------------
    public C_post getNewCommunity() {
        return cr.findFirstByOrderByCpostIdDesc();
    }

    // ---------------- 파일 업로드 ----------------
    public void fileUpload(List<MultipartFile> images, String cpostId) throws IOException {
        C_post post = cr.findById(Integer.parseInt(cpostId))
                .orElseThrow(() -> new RuntimeException("게시글 없음"));

        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                String fileUrl = sus.saveFile(image); // S3 업로드

                C_File cfile = new C_File();
                cfile.setCpost(post);
                cfile.setPath(fileUrl);
                cfile.setOriginalname(image.getOriginalFilename());
                cfile.setSize(image.getSize());
                cfile.setContentType(image.getContentType());

                cfr.save(cfile);

                // 게시글 파일 리스트에 추가
                if (post.getFileList() != null) {
                    post.getFileList().add(cfile);
                }
            }
            cr.save(post);
        }
    }

    // ---------------- 추천 증가 ----------------
    public int incrementLike(int cpostId) {
        C_post post = cr.findById(cpostId)
                .orElseThrow(() -> new RuntimeException("게시글 없음: " + cpostId));

        Integer current = post.getC_like();
        if (current == null) current = 0;
        post.setC_like(current + 1);

        cr.save(post);
        return post.getC_like();
    }

    // ---------------- 게시글 리스트 조회 ----------------
    public HashMap<String, Object> getCommunityList(int page, Integer categoryId, String title) {
        HashMap<String, Object> result = new HashMap<>();
        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Direction.DESC, "indate"));

        Page<C_post> list = cr.searchByTitleAndCategory(
                (title == null || title.isEmpty()) ? null : title,
                (categoryId == null || categoryId == 0) ? null : categoryId,
                pageable
        );

        result.put("communityList", list.getContent());

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

    public boolean updateCommunity(Integer cpostId, String title, String content, String pass, MultipartFile image) throws IOException {
        // 1. 게시글 조회
        Optional<C_post> postOpt = cr.findById(cpostId);
        if (postOpt.isEmpty()) return false;

        C_post post = postOpt.get();
        Member writer = post.getMember();

        // 2. 비밀번호 체크
        if (!writer.getPwd().equals(pass)) {
            return false; // 비밀번호 불일치 시 false 반환
        }

        // 3. 게시글 내용 수정
        post.setTitle(title);
        post.setContent(content);

        // 4. 이미지가 있으면 업데이트
        if (image != null && !image.isEmpty()) {
            String saveFilename = sus.saveFile(image); // S3 업로드 서비스 사용
            post.setC_image(saveFilename);
        }

        // 5. 수정 완료 후 저장
        cr.save(post);

        return true; // 수정 성공
    }

    public List<C_post> getPostsByMember(Member member) {
        return cr.findByMember(member); // JPA 메서드
    }
}
