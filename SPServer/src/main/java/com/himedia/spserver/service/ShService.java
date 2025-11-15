package com.himedia.spserver.service;

import com.himedia.spserver.dto.ShFileDto;
import com.himedia.spserver.dto.ShPostDto;
import com.himedia.spserver.dto.ShPostUpdateReqDTO;
import com.himedia.spserver.dto.ShPostUpdateResDTO;
import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.entity.SH.SH_post;

import com.himedia.spserver.entity.SH.ShViewHistory;
import com.himedia.spserver.mapper.ShMapper;
import com.himedia.spserver.repository.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ShService {

    private final ShRepository sr;           // 자동으로 생성자 주입
    private final ShCategoryRepository sc;   // 두 개 Repository도 가능
    private final SH_file_repository sfr;
    private final FileRepository fr;
    private final ShViewRepository svr;

    private final ShRepository shRepository;

    public List<ShPostDto> getShList() {
        // fetch join으로 대표 파일까지 한 번에 조회
        List<SH_post> posts = shRepository.findAllWithRepresentFile();

        // 엔티티 → DTO 변환
        return posts.stream()
                .map(ShMapper::toDto)
                .toList();
    }


    public ArrayList<SH_Category> getShCategorys() {
        ArrayList<SH_Category> shCategorys = (ArrayList<SH_Category>) sc.findAll();

        return shCategorys;
    }


    public SH_post insertShPost(Member member_id, String title, String content, Integer price, String categoryId, String directYN, String deliveryYN, Integer deliveryPrice) {

        SH_post post = new SH_post();
        post.setMember(member_id);
        post.setTitle(title);
        post.setContent(content);
        post.setPrice(price);
        post.setCategory(categoryId);
        post.setDirect_yn(directYN);
        post.setDelivery_yn(deliveryYN);
        post.setDelivery_price(deliveryPrice);

        sr.save(post);

        return post;
    }


    public File insertFiles(SH_post post, String originalFilename, String path, Long size, String type) {
        File file = new File();
        file.setShPost(post);
        file.setOriginalname(originalFilename);
        file.setPath(path);
        file.setSize(size);
        file.setContentType(type);
        fr.save(file);
        return file;
    }

    // 대표 이미지로 설정
    public void updateRepresentFile(SH_post post, File file) {
        post.setRepresentFile(file);
        sr.save(post); // 변경된 대표이미지 저장
    }


    public void addViewCount(Integer postId, Integer memberId) {
        // 이미 조회했는지 체크
        boolean alreadyViewed = svr.existsByPostIdAndMemberId(postId, memberId);
        if (alreadyViewed) return;

        // 조회수 증가
        SH_post shPost = sr.findByPostId(postId);
        shPost.setViewCount(shPost.getViewCount() + 1);

        // 기록 저장
        ShViewHistory vh = new ShViewHistory();
        vh.setPostId(postId);
        vh.setMemberId(memberId);
        svr.save(vh);
    }

    public ShPostDto getShPost(Integer id) {
        SH_post post = sr.findByPostId(id);

        List<File> files = sfr.findAllByShPost(post);
        List<ShFileDto> fileDtos = files.stream() // stream은 map() 함수를 쓸수있게 변환해줌
                .map(file -> new ShFileDto(
                        file.getFile_id(),
                        file.getOriginalname(),
                        file.getSize(),
                        file.getPath(),
                        file.getContentType(),
                        file.getIndate()
                ))
                .collect(Collectors.toList()); // 다시 원래 기본배열로 변경해줌

        ShPostDto postDto = ShMapper.toDto(post);  // 매퍼로 DTO 변환
        postDto.setFiles(fileDtos);

        return postDto;
    }








    @Autowired
    S3UploadService sus;

    public ShPostUpdateReqDTO updatePost(ShPostUpdateReqDTO reqDto) {
        // 1. 기존 게시글 조회
        SH_post post = sr.findByPostId(reqDto.getPostId());
        if(post == null) throw new RuntimeException("게시글이 존재하지 않습니다");

        // 2. 게시글 정보 업데이트
        post.setCategory(reqDto.getCategoryId());
        post.setTitle(reqDto.getTitle());
        post.setContent(reqDto.getContent());
        post.setPrice(reqDto.getPrice());
        post.setDirect_yn(reqDto.getDirectYN());
        post.setDelivery_yn(reqDto.getDeliveryYN());
        post.setDelivery_price(reqDto.getDeliveryPrice());

        // 3. 삭제할 파일 처리
        if(reqDto.getRmFiles() != null) {
            for(Integer fileId : reqDto.getRmFiles()) {
                File fileEntity = sfr.findById(fileId).orElse(null);
                if(fileEntity != null) {
                    // S3 삭제는 현재 생략
                    sfr.delete(fileEntity);
                }
            }
        }

        // 4. 새로운 파일 업로드
        List<MultipartFile> files = reqDto.getFiles();
        if(files != null && !files.isEmpty()) {
            boolean isFirstFile = post.getRepresentFile() == null; // 기존 대표 이미지 없으면 첫 파일을 대표로
            for(MultipartFile file : files) {
                try {
                    // S3에 저장
                    String savedFilePath = sus.saveFile(file);

                    // DB에 저장
                    File newFile = new File();
                    newFile.setShPost(post);
                    newFile.setPath(savedFilePath);
                    newFile.setOriginalname(file.getOriginalFilename());
                    sfr.save(newFile);

                    // 대표 이미지 설정
                    if(isFirstFile) {
                        post.setRepresentFile(newFile);
                        isFirstFile = false;
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        // 5. 게시글 저장 (대표 이미지 포함)
        sr.save(post);

        return reqDto;
    }

}


