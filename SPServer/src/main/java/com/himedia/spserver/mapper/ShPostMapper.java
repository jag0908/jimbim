package com.himedia.spserver.mapper;

import com.himedia.spserver.dto.MemberDTO;
import com.himedia.spserver.dto.ShMemberDto;
import com.himedia.spserver.dto.ShPostResDto;
import com.himedia.spserver.entity.SH.SH_post;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ShPostMapper {
    public ShPostResDto toResDto (SH_post post) {
        ShPostResDto resDto = new ShPostResDto();
        resDto.setPostId(post.getPostId());
        resDto.setTitle(post.getTitle());
        resDto.setContent(post.getContent());
        resDto.setPrice(post.getPrice());
        resDto.setCategoryId(post.getCategoryId());
        resDto.setDirectYN(post.getDirectYN());
        resDto.setDeliveryYN(post.getDeliveryYN());
        resDto.setDeliveryPrice(post.getDeliveryPrice());
        resDto.setViewCount(post.getViewCount());
        resDto.setIndate(post.getIndate());
        resDto.setUpdateDate(post.getUpdateDate());

        return resDto;
    }

    public ShPostResDto toResDto (Optional<SH_post> post) {
        ShPostResDto resDto = new ShPostResDto();
        resDto.setPostId(post.get().getPostId());
        resDto.setTitle(post.get().getTitle());
        resDto.setContent(post.get().getContent());
        resDto.setPrice(post.get().getPrice());
        resDto.setCategoryId(post.get().getCategoryId());
        resDto.setDirectYN(post.get().getDirectYN());
        resDto.setDeliveryYN(post.get().getDeliveryYN());
        resDto.setDeliveryPrice(post.get().getDeliveryPrice());
        resDto.setViewCount(post.get().getViewCount());
        resDto.setIndate(post.get().getIndate());
        resDto.setUpdateDate(post.get().getUpdateDate());

        ShMemberDto mdto = new ShMemberDto();
        mdto.setEmail(post.get().getMember().getEmail());
        mdto.setName(post.get().getMember().getName());
        mdto.setBlacklist(post.get().getMember().getBlacklist());
        mdto.setProvider(post.get().getMember().getProvider());
        mdto.setPhone(post.get().getMember().getPhone());
        mdto.setMemberId(post.get().getMember().getMember_id());
        mdto.setUserid(post.get().getMember().getUserid());
        mdto.setIndate(post.get().getMember().getIndate());
        mdto.setTerms_agree(post.get().getMember().getTerms_agree());
        mdto.setPersonal_agree(post.get().getMember().getPersonal_agree());
        mdto.setProfileImg(post.get().getMember().getProfileImg());

        resDto.setMember(mdto);

        return resDto;
    }
}
