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
import java.util.*;
import java.util.stream.Collectors;

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

    // ---------------- 공지사항 리스트 조회 ----------------
    public List<C_post> getNoticeList() {
        return cr.findByIsNotice("Y");  // isNotice가 Y인 글 리스트 조회
    }

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

                if (post.getFileList() != null) {
                    post.getFileList().add(cfile);
                }
            }
            cr.save(post);
        }
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

        List<C_post> posts = list.getContent();

        // 댓글 수 세서 세팅
        posts.forEach(post -> {
            int replyCount = crr.countByCpost_CpostId(post.getCpostId()); // 댓글 Repository 사용
            post.setReplyCount(replyCount); // C_post 엔티티에 replyCount 필드가 있어야 함
        });

        result.put("communityList", posts); // 이제 replyCount가 포함됨


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

    // ---------------- 게시글 수정 (여러 이미지 + 삭제 이미지) ----------------
    @Transactional
    public boolean updateCommunity(Integer cpostId,
                                   String title,
                                   String content,
                                   List<Integer> deletedIds,
                                   List<MultipartFile> newImages) throws IOException {

        Optional<C_post> opt = cr.findById(cpostId);
        if (!opt.isPresent()) return false;

        C_post post = opt.get();

        // 게시글 내용 수정
        post.setTitle(title);
        post.setContent(content);

        // 기존 이미지 컬렉션 가져오기
        List<C_File> fileList = post.getFileList();

        // 삭제 처리
        if (deletedIds != null && !deletedIds.isEmpty()) {
            fileList.removeIf(file -> {
                if (deletedIds.contains(file.getId())) {
                    try {
                        deleteFile(file.getId()); // DB + S3 삭제
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                    return true;
                }
                return false;
            });
        }

        // 새 이미지 업로드 후 컬렉션에 추가
        if (newImages != null && !newImages.isEmpty()) {
            for (MultipartFile newImg : newImages) {
                String fileUrl = sus.saveFile(newImg);

                C_File cfile = new C_File();
                cfile.setCpost(post);
                cfile.setPath(fileUrl);
                cfile.setOriginalname(newImg.getOriginalFilename());
                cfile.setSize(newImg.getSize());
                cfile.setContentType(newImg.getContentType());

                cfr.save(cfile);
                fileList.add(cfile);
            }
        }

        // Hibernate 추적 컬렉션 그대로 저장
        cr.save(post);

        return true;
    }

    public List<C_post> getPostsByMember(Member member) {
        return cr.findByMember(member);
    }

    // ---------------- 파일 삭제 ----------------
    public void deleteFile(Integer fileId) throws IOException {
        Optional<C_File> optFile = cfr.findById(fileId);
        if (optFile.isEmpty()) {
            throw new RuntimeException("삭제할 파일이 없습니다. fileId: " + fileId);
        }

        C_File file = optFile.get();

        // S3에서 삭제
        if (file.getPath() != null) {
            sus.deleteFile(file.getPath());
        }

        // DB에서 삭제
        cfr.delete(file);
    }
}
