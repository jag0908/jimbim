package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    @Query("SELECT n FROM Notification n WHERE n.receiver.member_id = :memberId ORDER BY n.createdAt DESC")
    List<Notification> findNotifications(@Param("memberId") Integer memberId);
}
