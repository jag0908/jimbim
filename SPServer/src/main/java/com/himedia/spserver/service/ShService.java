package com.himedia.spserver.service;

import com.himedia.spserver.dto.*;
import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.entity.SH.SH_File;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.entity.SH.ShViewHistory;
import com.himedia.spserver.mapper.ShPostMapper;
import com.himedia.spserver.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ShService {

    private final ShCategoryRepository scr;
    private final ShPostRepository spr;
    private final S3UploadService sus;
    private final ShFileRepository sfr;
    private final ShViewRepository svr;
    private final ShMemberRepository smr;


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

    public List<ShPostResDto> getPostList() {
        List<SH_post> posts = spr.findAllByOrderByIndateDesc();
        List<ShPostResDto> result = new ArrayList<>();

        for (SH_post post : posts) {

            ShPostResDto mapper = spm.toResDto(post);

            // 파일 최신 1개만 조회
            SH_File firstFile = sfr.findTop1ByPost_PostIdOrderByIndateDesc(mapper.getPostId());
            if (firstFile != null) {
                mapper.setFirstFilePath(firstFile.getPath());
            }

            result.add(mapper);
        }
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

//        SH_post postEntity = spr.findByPostId(id);
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
            result.add(fileDto);
        }

        mapperDto.setFiles(result);

        return mapperDto;
    }

}
