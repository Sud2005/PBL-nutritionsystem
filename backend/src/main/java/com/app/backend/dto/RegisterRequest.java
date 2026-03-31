package com.app.backend.dto;
import com.app.backend.model.Role;
import lombok.Data;
@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}
