package com.demo.backendtrainingproject.service;

import com.demo.backendtrainingproject.io.ProfileRequest;
import com.demo.backendtrainingproject.io.ProfileResponse;

public interface ProfileService {

    ProfileResponse createProfile(ProfileRequest request);

    ProfileResponse getProfile(String email);

    void sendResetOtp(String email);

    void resetPassword(String email,String otp, String newPassword);

    void sendOtp(String email);

    void verifyOtp(String email, String  otp);

    void checkOtp(String email, String  otp);

}
