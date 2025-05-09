package com.paf.chat.playload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequest {

    private String id;
    private String content;
    private String sender;
    private String roomId;
    private String fileUrl;
    private String fileType;
    private String fileName;
    private boolean isUpdate;
    private boolean isDelete;

}
