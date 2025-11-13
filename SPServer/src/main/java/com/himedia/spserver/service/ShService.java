package com.himedia.spserver.service;

import com.himedia.spserver.dto.ShFileDto;
import com.himedia.spserver.dto.ShPostDto;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

}


