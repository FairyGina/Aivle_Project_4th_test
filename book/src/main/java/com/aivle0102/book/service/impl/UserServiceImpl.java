package com.aivle0102.book.service.impl;

import com.aivle0102.book.domain.UserInfo;
import com.aivle0102.book.dto.UserSignUpRequest;
import com.aivle0102.book.repository.UserInfoRepository;
import com.aivle0102.book.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserInfoRepository userInfoRepository;

    @Override
    @Transactional
    public UserInfo signUp(UserSignUpRequest request) {

        // 1) 이메일 중복 체크
        boolean exists = userInfoRepository.findByEmail(request.getEmail()).isPresent();
        if (exists) {
            // 400 응답으로 내려줄 메시지
            throw new IllegalStateException("이미 가입된 이메일입니다.");
        }

        // 2) 엔티티 생성
        UserInfo user = new UserInfo();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setName(request.getName());
        user.setPhone(request.getPhone());

        // 3) 저장 후 리턴
        return userInfoRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserInfo findByNameAndPhone(String name, String phone) {
        return userInfoRepository.findByNameAndPhone(name, phone)
                .orElse(null);
    }

    @Override
    @Transactional
    public String resetPassword(String email, String name, String phone) {

        UserInfo user = userInfoRepository
                .findByEmailAndNameAndPhone(email, name, phone)
                .orElseThrow(() -> new IllegalArgumentException("일치하는 사용자 정보가 없습니다."));

        // 임시 비밀번호 생성 (8자리)
        String tempPassword = UUID.randomUUID().toString().substring(0, 8);

        // 비밀번호 변경 (지금은 평문이지만, 나중에 암호화 가능)
        user.setPassword(tempPassword);
        userInfoRepository.save(user);

        return tempPassword;
    }
}
