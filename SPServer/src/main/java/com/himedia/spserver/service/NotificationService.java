package com.himedia.spserver.service;

import com.himedia.spserver.dto.NotificationDTO;
import com.himedia.spserver.dto.NotificationType;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.Notification;
import com.himedia.spserver.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private String formatTime(LocalDateTime time) {
        return time.toString().replace("T", " ");
    }

    /** 팔로우 알림 */
    public void sendFollowNotification(Member targetMember, Member follower) {
        Notification noti = Notification.builder()
                .receiver(targetMember)
                .sender(follower)
                .type(NotificationType.STYLE_FOLLOW)
                .message(follower.getUserid() + "님이 회원님을 팔로우했습니다.")
                .linkUrl("/styleUser/" + follower.getUserid())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(noti);
    }

    /** 댓글/대댓글 알림 */
    public void sendReplyNotification(
            Member targetMember,
            Long postId,
            Member sender,
            boolean isReplyToComment,   // ⭐ 댓글에 대한 답글인지 여부
            String replyContent
    ) {
        if (targetMember == null) return;

        // 댓글 내용은 너무 길면 30자만 표시
        String preview = replyContent.length() > 30
                ? replyContent.substring(0, 30) + "..."
                : replyContent;

        String message;

        if (isReplyToComment) {
            message = sender.getUserid() + "님이 회원님의 댓글에 답글을 남겼습니다: \"" + preview + "\"";
        } else {
            message = sender.getUserid() + "님이 회원님의 게시글에 댓글을 남겼습니다: \"" + preview + "\"";
        }

        Notification noti = Notification.builder()
                .receiver(targetMember)
                .sender(sender)
                .type(NotificationType.REPLY)
                .message(message)
                .linkUrl("/style/" + postId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(noti);
    }

    /** 게시글 좋아요 알림 */
    public void sendPostLikeNotification(Member targetMember, Long postId, Member sender) {
        Notification noti = Notification.builder()
                .receiver(targetMember)
                .sender(sender)
                .type(NotificationType.LIKE)
                .message(sender.getUserid() + "님이 회원님의 게시글을 좋아합니다.")
                .linkUrl("/style/" + postId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(noti);
    }



    /** 댓글 좋아요 알림 */
    public void sendCommentLikeNotification(Member targetMember, Long postId, Long replyId, Member sender) {
        Notification noti = Notification.builder()
                .receiver(targetMember)
                .sender(sender)
                .type(NotificationType.LIKE)
                .message(sender.getUserid() + "님이 회원님의 댓글에 좋아요를 눌렀습니다.")
                .linkUrl("/style/" + postId + "?replyId=" + replyId)  // 댓글 위치로 이동도 가능
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(noti);
    }




    public List<NotificationDTO> getNotifications(Integer memberId) {
        return notificationRepository
                .findNotifications(memberId)
                .stream()
                .map(noti -> NotificationDTO.builder()
                        .id(noti.getId())
                        .message(noti.getMessage())
                        .type(noti.getType().name())
                        .linkUrl(noti.getLinkUrl())
                        .read(noti.isRead())
                        .time(formatTime(noti.getCreatedAt()))
                        .senderProfileImg(
                                noti.getSender() != null ? noti.getSender().getProfileImg() : null
                        )
                        .build()
                ).toList();
    }

    /** 커뮤니티 게시글 좋아요 알림 */
    public void sendCommunityPostLikeNotification(Member targetMember, Long postId, Member sender) {
        if (targetMember.getMember_id().equals(sender.getMember_id())) return; // 자기 글엔 알림 X

        Notification noti = Notification.builder()
                .receiver(targetMember)
                .sender(sender)
                .type(NotificationType.LIKE) // 기존 LIKE 타입 그대로 사용 가능
                .message(sender.getUserid() + "님이 회원님의 커뮤니티 게시글을 추천했습니다.")
                .linkUrl("/communityView/" + postId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(noti);
    }

    /** 커뮤니티 댓글/답글 알림 */
    public void sendCommunityReplyNotification(
            Member targetMember,
            Long postId,
            Member sender,
            boolean isReplyToComment,
            String replyContent
    ) {
        if (targetMember.getMember_id().equals(sender.getMember_id())) return; // 자기 댓글 X

        String preview = replyContent.length() > 30
                ? replyContent.substring(0, 30) + "..."
                : replyContent;

        String message = isReplyToComment
                ? sender.getUserid() + "님이 회원님의 댓글에 답글을 남겼습니다: \"" + preview + "\""
                : sender.getUserid() + "님이 회원님의 커뮤니티 게시판에 댓글을 남겼습니다: \"" + preview + "\"";

        Notification noti = Notification.builder()
                .receiver(targetMember)
                .sender(sender)
                .type(NotificationType.REPLY)
                .message(message)
                .linkUrl("/communityView/" + postId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(noti);
    }

    /** 커뮤니티 댓글 좋아요 알림 */
    public void sendCommunityCommentLikeNotification(Member targetMember, Long postId, Long replyId, Member sender) {
        if (targetMember.getMember_id().equals(sender.getMember_id())) return;

        Notification noti = Notification.builder()
                .receiver(targetMember)
                .sender(sender)
                .type(NotificationType.LIKE)
                .message(sender.getUserid() + "님이 회원님의 커뮤니티 댓글에 좋아요를 눌렀습니다.")
                .linkUrl("/communityView/" + postId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(noti);
    }

    public void markAsRead(Integer id) {
        Notification noti = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        noti.setRead(true);
    }

    public void delete(Integer id) {
        Notification noti = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.delete(noti);
    }
}

