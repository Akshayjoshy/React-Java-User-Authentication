package com.demo.backendtrainingproject.service;

import com.demo.backendtrainingproject.entity.UserEntity;
import com.demo.backendtrainingproject.io.ProfileRequest;
import com.demo.backendtrainingproject.io.ProfileResponse;
import com.demo.backendtrainingproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public ProfileResponse createProfile(ProfileRequest request) {
       UserEntity newProfile = convertToUserEntity(request);
       if(!userRepository.existsByEmail(request.getEmail())){
           newProfile = userRepository.save(newProfile);
           return convertToProfileResponse(newProfile);
       }
       throw new ResponseStatusException(HttpStatus.CONFLICT, "Email Already Exist");
    }

    @Override
    public ProfileResponse getProfile(String email) {
      UserEntity existingUser = userRepository.findByEmail(email)
              .orElseThrow(() -> new UsernameNotFoundException("User name not found:-"+email));
              return convertToProfileResponse(existingUser);
    }

    @Override
    public void sendResetOtp(String email) {
      UserEntity existingEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("user not found:-"+email));

      //Generate 6 digit otp
      String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

      //Calculate expire time of (Current time + 15 minutes in millisecond)
        long expireTime = System.currentTimeMillis() + (15 * 60 * 1000);

        //Update the profile/user
        existingEntity.setResetOtp(otp);
        existingEntity.setRestOtpExpiredAt(expireTime);

        //Save into the database
        userRepository.save(existingEntity);

        try{
           emailService.sendResetOtpEmail(existingEntity.getEmail(), otp);
        }catch (Exception ex){
            throw new RuntimeException("unable to send email");
        }
    }

    // ProfileServiceImpl.java
    @Override
    public void checkOtp(String email, String otp) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("user not found: " + email));

        if (existingUser.getResetOtp() == null || !existingUser.getResetOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (existingUser.getRestOtpExpiredAt() < System.currentTimeMillis()) {
            throw new RuntimeException("OTP Expired");
        }
    }

    @Override
    public void resetPassword(String email, String otp, String newPassword) {
      UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new  UsernameNotFoundException("user not found:-"+email));

      if(existingUser.getResetOtp() == null || !existingUser.getResetOtp().equals(otp)){
          throw new RuntimeException("Invalid OTP");
      }

      if(existingUser.getRestOtpExpiredAt() < System.currentTimeMillis()){
          throw new RuntimeException("OTP Expired");
      }

      existingUser.setPassword(passwordEncoder.encode(newPassword));
      existingUser.setResetOtp(null);
      existingUser.setRestOtpExpiredAt(0L);
      userRepository.save(existingUser);
    }

    @Override
    public void sendOtp(String email) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("user not found:-"+email));

        if (existingUser.isAccountVerified()){
            return;
        }
        //Generate 6 digit otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        //Calculate expire time of (Current time + 24 hours in millisecond)
        long expireTime = System.currentTimeMillis() + (24 * 60 * 60 * 1000);

        //update the user entity
        existingUser.setVerifyOtp(otp);
        existingUser.setVerifyOtpExpireAt(expireTime);

        //save to database
        userRepository.save(existingUser);

        try{
            emailService.sendOtpEmail(existingUser.getEmail(), otp);
        } catch (Exception e) {
            throw new RuntimeException("Unable to send email");
        }
    }

    @Override
    public void verifyOtp(String email, String otp) {
        UserEntity existingUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found:-"+email));
        if (existingUser.getVerifyOtp() == null || !existingUser.getVerifyOtp().equals(otp)){
            throw new RuntimeException("Invalid OTP");
        }
        if (existingUser.getVerifyOtpExpireAt() < System.currentTimeMillis()){
            throw new RuntimeException("OTP Expired");
        }

        existingUser.setAccountVerified(true);
        existingUser.setVerifyOtp(null);
        existingUser.setVerifyOtpExpireAt(0L);

        userRepository.save(existingUser);
    }

    private ProfileResponse convertToProfileResponse(UserEntity newProfile) {
       return ProfileResponse.builder()
                .name(newProfile.getName())
                .email(newProfile.getEmail())
                .userId(newProfile.getUserId())
                .isAccountVerified(newProfile.isAccountVerified())
                .build();

    }

    private UserEntity convertToUserEntity(ProfileRequest request){
        return UserEntity.builder()
                .email(request.getEmail())
                .userId(UUID.randomUUID().toString())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .isAccountVerified(false)
                .restOtpExpiredAt(0L)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .resetOtp(null)
                .build();
    }
}
