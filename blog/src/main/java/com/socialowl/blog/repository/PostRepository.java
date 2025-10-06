package com.socialowl.blog.repository;

import com.socialowl.blog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {
        Optional<Post> findBySlug(String slug);

        Boolean existsBySlug(String slug);
}