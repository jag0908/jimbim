package com.himedia.spserver.service;

import com.himedia.spserver.dto.AlramZzimReqDto;
import com.himedia.spserver.dto.ShMemberDto;
import com.himedia.spserver.dto.ShZzimDto;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.AlramZzim;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.repository.AlramZzimRepository;
import com.himedia.spserver.repository.ShMemberRepository;
import com.himedia.spserver.repository.ShPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AlramService {

    private final ShMemberRepository smr;
    private final ShPostRepository spr;
    private final AlramZzimRepository azr;

    //정진
    public void insertAlramZzim(ShZzimDto shzzimdto) {
        Optional<Member> memberEntity = smr.findById(shzzimdto.getMemberId());
        Optional<SH_post> postEntity = spr.findById(shzzimdto.getPostId());

        AlramZzim alramZzimEntity = new AlramZzim();
        alramZzimEntity.setMember(memberEntity.get());
        alramZzimEntity.setEndUserId(postEntity.get().getMember().getUserid());
        alramZzimEntity.setTargetId(postEntity.get().getPostId());
        alramZzimEntity.setTargetType("SH_POST");
        azr.save(alramZzimEntity);
    }

}
