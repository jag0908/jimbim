package com.himedia.spserver.service;

import com.himedia.spserver.dto.*;
import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.*;
import com.himedia.spserver.mapper.ShPostMapper;
import com.himedia.spserver.mapper.ShSuggestMapper;
import com.himedia.spserver.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ShService {

    private final ShCategoryRepository scr;
    private final ShPostRepository spr;
    private final S3UploadService sus;
    private final ShFileRepository sfr;
    private final ShViewRepository svr;
    private final ShSuggestRepository ssr;
    private final ShSuggestMapper ssm;



    private final ShPostMapper spm;

    public List<SH_Category> getCategoryList() {
        List<SH_Category> categoryList = scr.findAll();
        return categoryList;
    }


    public SH_post insertPost(ShPostWriteReqDto reqDto) {
        Member member = new Member();
        member.setMember_id(reqDto.getMemberId());

        SH_post shPost = new SH_post();
        shPost.setMember(member);
        shPost.setTitle(reqDto.getTitle());
        shPost.setContent(reqDto.getContent());
        shPost.setPrice(reqDto.getPrice());
        shPost.setCategoryId(reqDto.getCategoryId());
        shPost.setDirectYN(reqDto.getDirectYN());
        shPost.setDeliveryYN(reqDto.getDeliveryYN());
        shPost.setDeliveryPrice(reqDto.getDeliveryPrice());
        if (reqDto.getDeliveryPrice() == null) {
            shPost.setDeliveryPrice(0);
        }
        spr.save(shPost);

        return shPost;
    }

    public void insertFile(List<MultipartFile> files, SH_post post) throws IOException {
        for (MultipartFile file : files) {
            // S3 업로드 후 URL 반환
            String fileUrl = sus.saveFile(file); // 이미 URL 리턴

            ShFileInsertReqDto reqDto = new ShFileInsertReqDto();
            reqDto.setPath(fileUrl);
            reqDto.setOriginalname(file.getOriginalFilename());
            reqDto.setSize(file.getSize());
            reqDto.setContentType(file.getContentType());

            SH_File shFile = new SH_File();
            shFile.setPath(reqDto.getPath());
            shFile.setOriginalname(reqDto.getOriginalname());
            shFile.setSize(reqDto.getSize());
            shFile.setContentType(reqDto.getContentType());
            shFile.setSize(reqDto.getSize());
            shFile.setPost(post);

            sfr.save(shFile);
        }
    }

//    public List<ShPostResDto> getPostList(int page) {
    public HashMap<String, Object> getPostList(int page) {

        Pageable pageable = PageRequest.of(page-1, 5);

        Page<SH_post> postsPage = spr.findAllByOrderByIndateDesc(pageable);
        List<SH_post> posts = postsPage.getContent();;
        long totalElements = postsPage.getTotalElements();   // 전체 데이터 개수
        int totalPages = postsPage.getTotalPages();          // 전체 페이지 개수
        System.out.println("@@@totalElements : " + totalElements);
        System.out.println("@@@totalPages : " + totalPages);
        HashMap<String, Object> result = new HashMap<>();



//        List<SH_post> posts = spr.findAllByOrderByIndateDesc();
        List<ShPostResDto> resultArr = new ArrayList<>();

        for (SH_post post : posts) {

            ShPostResDto mapper = spm.toResDto(post);

            // 파일 최신 1개만 조회
            SH_File firstFile = sfr.findTop1ByPost_PostIdOrderByIndateAsc(mapper.getPostId());
            if (firstFile != null) {
                mapper.setFirstFilePath(firstFile.getPath());
            }

            resultArr.add(mapper);
        }

        result.put("totalPages", totalPages);
        result.put("listArr", resultArr);
        return result;
    }

    public void viewCount(ShViewCountDTO shViewCountDTO) {
        ShViewCountDTO reqDto = new ShViewCountDTO();
        reqDto.setMemberId(shViewCountDTO.getMemberId());
        reqDto.setPostId(shViewCountDTO.getPostId());

        // 이미 조회했는지 확인
        boolean alreadyViewed = svr.existsByMemberIdAndPostId(reqDto.getMemberId(), reqDto.getPostId());

        if(!alreadyViewed) {
            ShViewHistory viewEntity = new ShViewHistory();
            viewEntity.setMemberId(reqDto.getMemberId());
            viewEntity.setPostId(reqDto.getPostId());
            svr.save(viewEntity);

            SH_post post = spr.findByPostId(reqDto.getPostId());
            post.setViewCount(post.getViewCount() + 1);
            spr.save(post);
        }
    }


    public ShPostResDto getPost(Integer id) {

        Optional<SH_post> postEntity = spr.findByIdWithMember(id);
        if (postEntity == null) {
            throw new RuntimeException("게시글이 없습니다");
        }

        ShPostResDto mapperDto = spm.toResDto(postEntity);

        List<SH_File> fileEntitys = sfr.findAllByPost_postId(id);

        List<ShFileDto> result = new ArrayList<>();
        for (SH_File fileEntity : fileEntitys) {
            ShFileDto fileDto = new ShFileDto();
            fileDto.setPath(fileEntity.getPath());
            fileDto.setFileId(fileEntity.getFileId());
            result.add(fileDto);
        }

        mapperDto.setFiles(result);

        return mapperDto;
    }

    public SH_post updatePost(ShPostUpdateReqDTO reqDto) {
        
        // 게시글 수정 저장
        SH_post post = spr.findByPostId(reqDto.getPostId());
        post.setCategoryId(reqDto.getCategoryId());
        post.setTitle(reqDto.getTitle());
        post.setContent(reqDto.getContent());
        post.setPrice(reqDto.getPrice());
        post.setDirectYN(reqDto.getDirectYN());
        post.setDeliveryYN(reqDto.getDeliveryYN());
        post.setDeliveryPrice(reqDto.getDeliveryPrice());
        if (reqDto.getDeliveryPrice() == null) {
            post.setDeliveryPrice(0);
        }

        // 기존 파일 지우기
        List<Integer> rmFiles = reqDto.getRmFiles();
        System.out.println("@@@@@@@@@@@@@@@@@@@@" + rmFiles);
        if (rmFiles != null && !rmFiles.isEmpty()) {
            for(Integer rmFile : rmFiles) {
                SH_File rmFileId = sfr.findByFileId(rmFile);
                sfr.delete(rmFileId);
            }
        }
        return post;
    }

    public HashMap<String, Object> deletePost(Integer postId, Map<String, Object> claims) {
        HashMap<String, Object> result =  new HashMap<>();

        SH_post post = spr.findByPostId(postId);


        if (claims.get("member_id").equals(post.getMember().getMember_id())) {
            sfr.deleteAllByPost_postId(postId);
            spr.delete(post);

            result.put("msg", "ok");
            return result;
        };

        result.put("msg", "notOk");
        return result;
    }



    //이삭 수정
    public List<ShPostResDto> getPostsByMemberId(Integer memberId) {
        // 해당 회원의 게시글 조회
        List<SH_post> posts = spr.findByMemberId(memberId);

        List<ShPostResDto> dtos = new ArrayList<>();

        for (SH_post post : posts) {
            ShPostResDto dto = new ShPostResDto();
            dto.setPostId(post.getPostId());
            dto.setTitle(post.getTitle());
            dto.setPrice(post.getPrice());

            // 파일 중 첫 번째 이미지 조회
            List<SH_File> files = sfr.findTop1ByPostOrderByFileIdAsc(post);
            if (!files.isEmpty()) {
                dto.setFirstFilePath(files.get(0).getPath()); // DTO 기존 필드 사용
            }

            dtos.add(dto);
        }

        return dtos;

    public ShSuggestDto insertSuggest(Map<String, Object> claims, ShSuggestDto reqDto) {

        reqDto = ssm.toReqDto(claims, reqDto);

//        Optional<SH_Suggest> isSuggest = ssr.findByMemberIdAndPostId(reqDto.getMemberId(), reqDto.getPostId());
//        if(isSuggest.isPresent()) {
//            isSuggest.get().setSuggest_price(reqDto.getSuggest_price());
//
//            return ssm.toResDto(isSuggest.get());
//        } else  {
            SH_Suggest suggest = new SH_Suggest();
            suggest.setMemberId(reqDto.getMemberId());
            suggest.setUserId(reqDto.getUserId());
            suggest.setMemberName(reqDto.getMemberName());
            suggest.setMemberProfileImg(reqDto.getMemberProfileImg());
            suggest.setPostId(reqDto.getPostId());
            suggest.setSuggest_price(reqDto.getSuggest_price());
            ssr.save(suggest);

            return ssm.toResDto(suggest);
//        }
    }

    public List<ShSuggestDto> getSuggests(Integer postId) {
        List<SH_Suggest> suggests = ssr.findAllByPostId(postId);

        List<ShSuggestDto> result = new ArrayList<>();
        for(SH_Suggest suggest:suggests) {
            result.add(ssm.toResDto(suggest));
        }

        return result;

    }

    public void appSuggest(Integer sid) {
        Optional<SH_Suggest> suggestEntity = ssr.findById(sid);
        suggestEntity.get().setApproved(1);
    }
}
