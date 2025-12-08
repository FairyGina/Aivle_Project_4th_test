"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Stack, CardMedia } from "@mui/material";

export default function MainPage() {
    const [books, setBooks] = useState([]);

    // 백엔드에서 도서 목록 가져오기
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch("http://localhost:8080/book/list");
                if (!res.ok) {
                    console.error("서버 오류");
                    return;
                }

                const data = await res.json();
                console.log("불러온 도서 목록:", data);
                setBooks(data); // 상태 저장
            } catch (err) {
                console.error("통신 오류:", err);
            }
        };

        fetchBooks();
    }, []);

    return (
        <Box sx={{ width: "100%", mt: 5 }}>
            {/* 페이지 제목 */}
            <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 4, ml: 2 }}
            >
                작품 목록
            </Typography>

            {/* 작품 리스트 */}
            <Stack spacing={4} sx={{ px: 2 }}>
                {books.length === 0 ? (
                    <Typography sx={{ ml: 2, color: "#777" }}>
                        등록된 작품이 없습니다.
                    </Typography>
                ) : (
                    books.map((item) => (
                        <Box
                            key={item.bookId}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 3,
                                alignItems: "center",
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: "#f8f4f2",
                            }}
                        >
                            {/* 왼쪽 이미지 */}
                            <CardMedia
                                component="img"
                                image={item.coverImageUrl || "https://via.placeholder.com/130x190?text=No+Image"}
                                alt={item.title}
                                sx={{
                                    width: 130,
                                    height: 190,
                                    borderRadius: 2,
                                    objectFit: "cover",
                                }}
                            />

                            {/* 오른쪽 텍스트 */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    {item.title}
                                </Typography>

                                <Typography sx={{ color: "#555", lineHeight: 1.5 }}>
                                    {item.content?.slice(0, 80) || "내용 없음"}...
                                </Typography>

                                {item.author && (
                                    <Typography sx={{ color: "#888", mt: 1 }}>
                                        저자: {item.author}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    ))
                )}
            </Stack>
        </Box>
    );
}
