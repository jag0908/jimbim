package com.himedia.spserver.controller;

import com.himedia.spserver.dto.NotificationDTO;
import com.himedia.spserver.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

