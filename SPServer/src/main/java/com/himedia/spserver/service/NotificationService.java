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

import static org.apache.catalina.manager.StatusTransformer.formatTime;

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
                .type(NotificationType.STYLE_FOLLOW)
                .message(follower.getUserid() + "님이 회원님을 팔로우했습니다.")
                .linkUrl("/styleUser/" + follower.getUserid())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(noti);
    }

    /** 댓글 알림 */
    public void sendReplyNotification(Member targetMember, Long postId, Member sender) {
        Notification noti = Notification.builder()
                .receiver(targetMember)
                .type(NotificationType.REPLY)
                .message(sender.getUserid() + "님이 회원님의 게시글에 댓글을 남겼습니다.")
                .linkUrl("/style/" + postId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(noti);
    }

    /** 좋아요 알림 */
    public void sendLikeNotification(Member targetMember, Long styleId, Member sender) {
        Notification noti = Notification.builder()
                .receiver(targetMember)
                .type(NotificationType.LIKE)
                .message(sender.getUserid() + "님이 회원님의 게시글을 좋아합니다.")
                .linkUrl("/style/" + styleId)
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
                        .build()
                ).toList();
    }
}

