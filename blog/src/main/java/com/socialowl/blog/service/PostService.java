package com.socialowl.blog.service;

import com.socialowl.blog.dto.PostDto;
import com.socialowl.blog.entity.Category;
import com.socialowl.blog.entity.Post;
import com.socialowl.blog.entity.User;
import com.socialowl.blog.repository.CategoryRepository;
import com.socialowl.blog.repository.PostRepository;
import com.socialowl.blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<PostDto> getAllPosts(String status, Long categoryId, String search, Pageable pageable) {
        Specification<Post> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (search != null && !search.isEmpty()) {
                String likePattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), likePattern),
                        cb.like(cb.lower(root.get("content")), likePattern)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return postRepository.findAll(spec, pageable)
                .map(this::convertToDto);
    }

    public PostDto getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return convertToDto(post);
    }

    public PostDto createPost(PostDto postDto, Long authorId) {
        if (postRepository.existsBySlug(postDto.getSlug())) {
            throw new RuntimeException("Slug already exists");
        }

        Category category = categoryRepository.findById(postDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setSlug(postDto.getSlug());
        post.setContent(postDto.getContent());
        post.setStatus(postDto.getStatus());
        post.setCategory(category);
        post.setAuthor(author);

        Post savedPost = postRepository.save(post);
        return convertToDto(savedPost);
    }

    public PostDto updatePost(Long id, PostDto postDto, Long authorId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if user owns the post or is admin
        if (!post.getAuthor().getId().equals(authorId)) {
            throw new RuntimeException("Not authorized to update this post");
        }

        if (!post.getSlug().equals(postDto.getSlug()) &&
                postRepository.existsBySlug(postDto.getSlug())) {
            throw new RuntimeException("Slug already exists");
        }

        Category category = categoryRepository.findById(postDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        post.setTitle(postDto.getTitle());
        post.setSlug(postDto.getSlug());
        post.setContent(postDto.getContent());
        post.setStatus(postDto.getStatus());
        post.setCategory(category);

        Post updatedPost = postRepository.save(post);
        return convertToDto(updatedPost);
    }

    public void deletePost(Long id, Long authorId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if user owns the post or is admin
        if (!post.getAuthor().getId().equals(authorId)) {
            throw new RuntimeException("Not authorized to delete this post");
        }

        postRepository.delete(post);
    }

    private PostDto convertToDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setSlug(post.getSlug());
        dto.setContent(post.getContent());
        dto.setStatus(post.getStatus());
        dto.setCategoryId(post.getCategory().getId());
        dto.setCategoryName(post.getCategory().getName());
        dto.setAuthorId(post.getAuthor().getId());
        dto.setAuthorName(post.getAuthor().getName());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }
}