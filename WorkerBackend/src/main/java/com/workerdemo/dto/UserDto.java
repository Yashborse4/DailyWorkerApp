package com.workerdemo.dto;

import com.workerdemo.entity.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String displayName;
    private Role role;
    private boolean isEmailVerified;
    private boolean isDealerVerified;
}
