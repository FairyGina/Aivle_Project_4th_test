"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Box,
    Typography,
    CardMedia,
    CircularProgress,
    Divider,
    Container,
    Stack,
} from "@mui/material";

export default function BookDetailPage() {
    // 1. URL에서 bookid 추출
    const params = useParams();
    const bookid = params?.bookid; // /books/3 → "3"

    // 2. 상태 관리
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    // 3. 백엔드에서 도서 상세 가져오기
    useEffect(() => {
        if (!bookid) return;

        const fetchDetail = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `http://localhost:8080/book/detail/${bookid}`
                );

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(
                        text || `HTTP error! status: ${res.status}`
                    );
                }

                const result = await res.json();
                console.log("📗 /book/detail 응답:", result);

                // ApiResponse 형태: { status, data, message }
                const data = Array.isArray(result) ? result[0] : result.data;

                if (!data) {
                    throw new Error("도서 정보를 찾을 수 없습니다.");
                }

                // 백엔드 BookInfo → 화면에서 쓸 형태로 매핑
                setBook({
                    id: data.bookId,
                    title: data.title,
                    author: data.author || "알 수 없음",
                    regDate: data.createdAt
                        ? data.createdAt.substring(0, 10)
                        : "알 수 없음",
                    image:
                        data.coverImageUrl ||
                        "https://via.placeholder.com/200x300?text=No+Image",
                    // content를 요약/줄거리 둘 다에 재사용
                    summary: data.content || "요약 정보가 없습니다.",
                    plot: data.content || "줄거리 정보가 없습니다.",
                });
            } catch (err) {
                console.error("도서 상세 불러오기 오류:", err);
                setBook(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [bookid]);

    // 4. 로딩 UI
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    // 5. 데이터 없음 UI
    if (!book) {
        return (
            <Box sx={{ textAlign: "center", mt: 10 }}>
                <Typography variant="h5">
                    도서 정보를 찾을 수 없습니다.
                </Typography>
            </Box>
        );
    }

    // 6. 메인 UI (읽기 전용 상세 페이지)
    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            {/* 상단 헤더 영역 */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                }}
            >
                {/* 제목 및 저자 정보 */}
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 2,
                            mb: 1,
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                            책 제목 : {book.title}
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        저자 : {book.author} &nbsp;/&nbsp; 등록일 : {book.regDate}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* 본문 영역 */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                }}
            >
                {/* 좌측: 이미지 */}
                <Box sx={{ flex: "0 0 350px" }}>
                    <CardMedia
                        component="img"
                        image={book.image}
                        alt={book.title}
                        sx={{
                            width: "100%",
                            height: "auto",
                            borderRadius: 3,
                            boxShadow: 3,
                            backgroundColor: "#f5f5f5",
                        }}
                    />
                </Box>

                {/* 우측: 요약/줄거리 */}
                <Box sx={{ flex: 1 }}>
                    <Stack spacing={4}>
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold", mb: 1 }}
                            >
                                책 요약
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ lineHeight: 1.8, color: "#333" }}
                            >
                                {book.summary}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold", mb: 1 }}
                            >
                                줄거리
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ lineHeight: 1.8, color: "#333" }}
                            >
                                {book.plot}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
}
