package com.himedia.spserver.mapper;

import com.himedia.spserver.dto.ShSuggestDto;
import com.himedia.spserver.entity.SH.SH_Suggest;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ShSuggestMapper {

    public ShSuggestDto toReqDto(Map<String, Object> claims, ShSuggestDto reqDto) {
        reqDto.setMemberId((Integer) claims.get("member_id"));
        reqDto.setUserId(claims.get("userid").toString());
        reqDto.setMemberName(claims.get("name").toString());
        reqDto.setMemberProfileImg(claims.get("profileImg").toString());

        return reqDto;
    }

    public ShSuggestDto toResDto(SH_Suggest suggest) {
        ShSuggestDto resDto = new ShSuggestDto();
        resDto.setMemberId(suggest.getMemberId());
        resDto.setUserId(suggest.getUserId());
        resDto.setMemberName(suggest.getMemberName());
        resDto.setMemberProfileImg(suggest.getMemberProfileImg());
        resDto.setPostId(suggest.getPostId());
        resDto.setSuggest_id(suggest.getSuggest_id());
        resDto.setSuggest_price(suggest.getSuggest_price());

        return resDto;
    }
}
