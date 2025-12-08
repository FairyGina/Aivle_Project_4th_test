package com.aivle0102.book.controller;

import com.aivle0102.book.domain.BookInfo;
import com.aivle0102.book.dto.ApiResponse;
import com.aivle0102.book.service.BookInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/book")
@RequiredArgsConstructor
public class BookInfoController {

    private final BookInfoService bookInfoService;

    // 1. 도서 목록
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<BookInfo>>> getBookList() {
        List<BookInfo> list = bookInfoService.getBookList();
        // 프론트에서 기대하는 형태: { status: "success", data: [...] }
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    // 1-2. 내 도서 목록 (userId 기준)
    @GetMapping("/list/my")
    public ResponseEntity<ApiResponse<List<BookInfo>>> getMyBookList(
            @RequestParam Long userId
    ) {
        List<BookInfo> list = bookInfoService.getBookListByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    // 2. 도서 상세
    @GetMapping("/detail/{id}")
    public ResponseEntity<ApiResponse<BookInfo>> getBookDetail(@PathVariable Long id) {
        BookInfo detail = bookInfoService.getBookDetail(id);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    // 3. 도서 등록
    @PostMapping(value = "/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<BookInfo>> insertBook(
            @RequestPart("book") BookInfo book,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam Long userId
    ) throws IOException {
        BookInfo saved = bookInfoService.insertBook(book, userId, file);
        return ResponseEntity.ok(ApiResponse.success(saved));
    }

    // 4. 도서 수정
    @PutMapping("/update/simple/{bookId}")
    public ResponseEntity<ApiResponse<BookInfo>> updateBookSimple(
            @PathVariable long bookId,
            @RequestBody BookInfo bookInfo
    ) throws IOException {
        // 필요하다면 userId는 BookInfo 안에서 꺼내거나, 임시로 1L 같은 값 사용
        BookInfo updated = bookInfoService.updateBook(bookId, bookInfo, /*userId*/ 1L, null);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    // 5. 도서 삭제
    @DeleteMapping("/delete/{bookId}")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable long bookId) {
        bookInfoService.deleteBook(bookId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // 6. AI 표지 이미지 URL 저장
    @PatchMapping("/createImg/{bookId}")
    public ResponseEntity<ApiResponse<BookInfo>> updateCoverUrl(
            @PathVariable Long bookId,
            @RequestBody BookInfo book
    ){
        BookInfo updated = bookInfoService.updateCoverUrl(bookId, book.getCoverImageUrl());
        return ResponseEntity.ok(ApiResponse.success(updated));
    }
}