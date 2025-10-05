package com.demo.backendtrainingproject.controller;

import com.demo.backendtrainingproject.io.AuthRequest;
import com.demo.backendtrainingproject.io.AuthResponse;
import com.demo.backendtrainingproject.io.ResetPasswordRequest;
import com.demo.backendtrainingproject.io.VerifyOtpRequest;
import com.demo.backendtrainingproject.service.AppUserDetailsService;
import com.demo.backendtrainingproject.service.ProfileService;
import com.demo.backendtrainingproject.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final JwtUtil jwtUtil;
    private final ProfileService profileService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request){
            try {
                authenticate(request.getEmail(),request.getPassword());
                final UserDetails userDetails = appUserDetailsService.loadUserByUsername(request.getEmail());
                final String jwtToken = jwtUtil.generateToken(userDetails);
                ResponseCookie cookie = ResponseCookie.from("jwt",jwtToken)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(Duration.ofDays(1))
                        .sameSite("strict")
                        .build();
                return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                        .body(new AuthResponse(request.getEmail(),jwtToken));
            }catch (BadCredentialsException ex){
                Map<String, Object> error = new HashMap<>();
                error.put("error",true);
                error.put("message","Email or Password is incorrect");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }catch (DisabledException ex){
                Map<String, Object> error = new HashMap<>();
                error.put("error",true);
                error.put("message","Account is disabled");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }catch (Exception ex){
                Map<String, Object> error = new HashMap<>();
                error.put("error",true);
                error.put("message","Authentication Failed");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
    }

    private void authenticate(String email, String password) {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email,password));
    }

    @GetMapping("/is-authenticated")
    public ResponseEntity<Boolean> isAuthenticated(@CurrentSecurityContext(expression = "authentication?.name") String email){
            return ResponseEntity.ok(email != null);
    }

    @PostMapping("/send-reset-otp")
    public void sendResetOtp(@RequestParam String email){
        try{
            profileService.sendResetOtp(email);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @PostMapping("/verify-reset-otp")
    public void verifyResetOtp(@RequestBody @Valid VerifyOtpRequest request) {
        try {
            profileService.checkOtp(request.getEmail(), request.getOtp());
            // If no exception is thrown, OTP is valid and nothing else needs to be returned
        } catch (UsernameNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request){
        try{
            profileService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        } catch (UsernameNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/send-otp")
    public void sendVerifyOtp(@CurrentSecurityContext(expression = "authentication?.name") String email){
        try {
            profileService.sendOtp(email);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public void verifyEmail(@RequestBody Map<String, Object> request,
    @CurrentSecurityContext(expression = "authentication?.name")String email){
        if (request.get("otp").toString() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing Details");
        }
        try {
             profileService.verifyOtp(email, request.get("otp").toString());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response){
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

                return ResponseEntity.ok()
                        .header(HttpHeaders.SET_COOKIE, cookie.toString())
                        .body("Logged out successfully !");
    }
}
