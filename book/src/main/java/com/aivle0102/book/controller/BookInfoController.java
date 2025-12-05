package com.aivle0102.book.controller;

import com.aivle0102.book.domain.BookInfo;
import com.aivle0102.book.service.BookInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/book")
public class BookInfoController {

    private final BookInfoService bookInfoService;

    public BookInfoController(BookInfoService bookInfoService) {
        this.bookInfoService = bookInfoService;
    }

    // 1. 도서 목록
    @GetMapping("/list")
    public List<BookInfo> getBookList() {
        return bookInfoService.getBookList();
    }

    // 2. 도서 상세
    @GetMapping("/detail/{id}")
    public BookInfo getBookDetail(@PathVariable Long id) {
        return bookInfoService.getBookDetail(id);
    }

    // 3. 도서 등록
    @PostMapping("/insert")
    public BookInfo insertBook(@RequestBody BookInfo book) {
        BookInfo saved = bookInfoService.insertBook(book);
        return saved;
    }

    // 4. 도서 수정
    @PutMapping("/update/{bookId}")
    public BookInfo updateBook(@PathVariable long bookId, @RequestBody BookInfo bookInfo){
        return bookInfoService.updateBook(bookId, bookInfo);
    }

    // 5. 도서 삭제
    @DeleteMapping("/delete/{bookId}")
    public void deleteBook(@PathVariable long bookId) {
        bookInfoService.deleteBook(bookId);
    }
}
