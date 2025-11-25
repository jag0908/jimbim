package com.himedia.spserver.controller;

import com.himedia.spserver.dto.MemberDTO;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.repository.FollowRepository;
import com.himedia.spserver.repository.MemberRepository;
import com.himedia.spserver.service.StyleFollowService;
import com.himedia.spserver.service.StyleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/style/follow")
@RequiredArgsConstructor
public class StyleFollowController {

    private final StyleFollowService styleFollowService;
    private final MemberRepository memberRepository;
    private final FollowRepository followRepository;


    @PostMapping
    public ResponseEntity<?> toggleFollow(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal MemberDTO memberDTO) {

        if (memberDTO == null) {
            return ResponseEntity.status(401).body(Map.of("error", "REQUIRE_LOGIN"));
        }

        String targetUserid = body.get("targetUserid");
        boolean followed = styleFollowService.toggleFollow(memberDTO.getUserid(), targetUserid);

        return ResponseEntity.ok(Map.of(
                "followed", followed,
                "message", followed ? "팔로우 성공" : "팔로우 취소"
        ));
    }

    @GetMapping("/{targetUserid}")
    public ResponseEntity<?> checkFollow(@PathVariable String targetUserid,
                                         @AuthenticationPrincipal MemberDTO memberDTO) {
        if (memberDTO == null) {
            return ResponseEntity.ok(Map.of("followed", false));
        }

        boolean followed = styleFollowService.isFollowing(memberDTO.getUserid(), targetUserid);
        return ResponseEntity.ok(Map.of("followed", followed));
    }

    @GetMapping("/list/followers/{memberId}")
    public ResponseEntity<?> getFollowers(@PathVariable Integer memberId) {
        Member member = memberRepository.findById(memberId).orElse(null);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "사용자를 찾을 수 없습니다."));
        }

        // followRepository에서 팔로워 조회
        List<Member> followers = followRepository.findByEndMember(member)
                .stream()
                .map(f -> f.getStartMember()) // 팔로워(시작 멤버) 가져오기
                .toList();

        // DTO 형태로 반환
        List<Map<String, Object>> result = followers.stream()
                .map(f -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("userid", f.getUserid());
                    map.put("nickname", f.getName());
                    map.put("profileImg", f.getProfileImg());
                    map.put("isFollowing", styleFollowService.isFollowing(member.getUserid(), f.getUserid()));
                    return map;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    // 팔로잉 리스트
    @GetMapping("/list/following/{memberId}")
    public ResponseEntity<?> getFollowing(@PathVariable Integer memberId) {
        Member member = memberRepository.findById(memberId).orElse(null);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "사용자를 찾을 수 없습니다."));
        }

        List<Member> following = followRepository.findByStartMember(member)
                .stream()
                .map(f -> f.getEndMember()) // 팔로잉(끝 멤버) 가져오기
                .toList();

        List<Map<String, Object>> result = following.stream()
                .map(f -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("userid", f.getUserid());
                    map.put("nickname", f.getName());
                    map.put("profileImg", f.getProfileImg());
                    map.put("isFollowing", styleFollowService.isFollowing(member.getUserid(), f.getUserid()));
                    return map;
                })
                .toList();

        return ResponseEntity.ok(result);
    }
}
