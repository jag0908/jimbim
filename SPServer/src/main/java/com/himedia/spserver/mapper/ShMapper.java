package com.himedia.spserver.mapper;

import com.himedia.spserver.dto.ShFileDto;
import com.himedia.spserver.dto.ShPostDto;
import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.SH.SH_post;

public class ShMapper {

    public static ShPostDto toDto(SH_post post) {
        ShPostDto dto = new ShPostDto();
        dto.setPostId(post.getPostId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setPrice(post.getPrice());
        dto.setCategory(post.getCategory());
        dto.setViewCount(post.getViewCount());
        dto.setIndate(post.getIndate());
        dto.setDirect_yn(post.getDirect_yn());
        dto.setDelivery_yn(post.getDelivery_yn());
        dto.setDelivery_price(post.getDelivery_price());

        dto.setMember_id(post.getMember().getMember_id());
        dto.setMember_name(post.getMember().getName());
        dto.setMember_profileImg(post.getMember().getProfileImg());
        dto.setMember_profileMsg(post.getMember().getProfileMsg());
        dto.setMember_blacklist(post.getMember().getBlacklist());

        // 대표 파일이 존재하면 DTO로 변환
        if (post.getRepresentFile() != null) {
            File f = post.getRepresentFile();
            ShFileDto fileDto = new ShFileDto(
                    f.getFile_id(),
                    f.getOriginalname(),
                    f.getSize(),
                    f.getPath(),
                    f.getContentType(),
                    f.getIndate()
            );
            dto.setRepresentFile(fileDto);
        }

        return dto;
    }
}
