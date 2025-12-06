package com.himedia.spserver.controller;

import com.himedia.spserver.dto.NotificationDTO;
import com.himedia.spserver.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notification")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/{memberId}")
    public List<NotificationDTO> getNotifications(@PathVariable Integer memberId) {
        return notificationService.getNotifications(memberId);
    }

    @PostMapping("/markRead/{id}")
    public void markNotificationRead(@PathVariable Integer id) {
        notificationService.markAsRead(id);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Integer id) {
        notificationService.delete(id);
    }
}

