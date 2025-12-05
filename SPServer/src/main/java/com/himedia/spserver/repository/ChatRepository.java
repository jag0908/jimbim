package com.himedia.spserver.repository;


import com.himedia.spserver.dto.ChatRoomUnreadDto;
import com.himedia.spserver.entity.SH.ChatRoom;
import com.himedia.spserver.entity.SH.ChatRoom_Msg;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<ChatRoom, Integer> {

    Optional<ChatRoom> findBySellerIdAndBuyerId(Integer sellerId, Integer buyerId);

    ChatRoom findByChatRoomId(Integer chatRoomId);

    List<ChatRoom> findAllBySellerIdOrBuyerId(Integer memberId, Integer memberId1);

    ChatRoom findByPostIdAndSellerIdAndBuyerId(Integer postId, Integer sellerId, Integer buyerId);


    List<ChatRoom> findAllByPostId(Integer postId);



//    @EntityGraph(attributePaths = {"chatMsg"})
    List<ChatRoom> findAllBySellerId(Integer id);

    @Query("""
    SELECT new com.himedia.spserver.dto.ChatRoomUnreadDto(
        r.chatRoomId,
        r.sellerId,
        r.sellerName,
        r.sellerProfileImg,
        r.buyerId,
        r.buyerName,
        r.buyerProfileImg,
        r.postId,
        r.postTitle,
        COUNT(m),
        last.content,
        last.updateDate
    )
    FROM ChatRoom r
    LEFT JOIN r.chatMsg m 
        ON m.sellerReadMsg = 0
    LEFT JOIN ChatLast_Msg last
        ON last.chatRoomId = r.chatRoomId
    WHERE r.sellerId = :sellerId
    GROUP BY r.chatRoomId, last.content, last.updateDate,
             r.sellerId, r.sellerName, r.sellerProfileImg,
             r.buyerId, r.buyerName, r.buyerProfileImg,
             r.postId, r.postTitle
    ORDER BY last.updateDate DESC
""")
    List<ChatRoomUnreadDto> findRoomsWithUnreadCount(@Param("sellerId") Integer sellerId);

    @Query("""
    SELECT new com.himedia.spserver.dto.ChatRoomUnreadDto(
        r.chatRoomId,
        r.sellerId,
        r.sellerName,
        r.sellerProfileImg,
        r.buyerId,
        r.buyerName,
        r.buyerProfileImg,
        r.postId,
        r.postTitle,
        COUNT(m),
        last.content,
        last.updateDate
    )
    FROM ChatRoom r
    LEFT JOIN r.chatMsg m 
        ON m.buyerReadMsg = 0
    LEFT JOIN ChatLast_Msg last
        ON last.chatRoomId = r.chatRoomId
    WHERE r.buyerId = :buyerId
    GROUP BY r.chatRoomId, last.content, last.updateDate,
             r.sellerId, r.sellerName, r.sellerProfileImg,
             r.buyerId, r.buyerName, r.buyerProfileImg,
             r.postId, r.postTitle
    ORDER BY last.updateDate DESC
""")
    List<ChatRoomUnreadDto> findRoomsWithUnreadCountByBuyer(@Param("buyerId") Integer buyerId);
}
