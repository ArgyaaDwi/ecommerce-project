package com.design_pattern_ecommerce.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.design_pattern_ecommerce.backend.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findBySessionKey(String sessionKey);
}
