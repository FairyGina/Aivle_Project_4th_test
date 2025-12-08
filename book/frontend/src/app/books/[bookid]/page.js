"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Box,
    Typography,
    CardMedia,
    CircularProgress,
    Button,
    Stack,
    Divider,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";

export default function BookDetailPage() {
    // 1. URL에서 bookid 추출
    const params = useParams();
    const bookid = params?.bookid; // /books/3 → "3"

    const router = useRouter();

    // 2. 상태 관리
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    // 수정 모달용 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

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
                    // 우선 content를 summary/plot 둘 다에 재사용 (필요하면 필드 분리)
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

    // ===========================
    // 삭제 버튼 동작
    // ===========================
    const handleDelete = async () => {
        if (!book) return;
        if (!window.confirm(`'${book.title}' 작품을 정말 삭제하시겠습니까?`)) {
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:8080/book/delete/${book.id}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `HTTP error! status: ${res.status}`);
            }

            alert("작품이 삭제되었습니다.");
            router.push("/mainpage"); // 메인 페이지로 이동
        } catch (err) {
            console.error("상세페이지 삭제 중 오류:", err);
            alert(`삭제 중 오류: ${err.message}`);
        }
    };

    // ===========================
    // 수정 버튼 동작 (모달 열기)
    // ===========================
    const handleOpenEditModal = () => {
        if (!book) return;
        setEditingBook({ ...book }); // 현재 book 내용을 복사
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBook(null);
    };

    const handleEditFieldChange = (e) => {
        const { name, value } = e.target;
        setEditingBook((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ===========================
    // 수정 저장 (백엔드 호출)
    // ===========================
    const handleSaveChanges = async () => {
        if (!editingBook) return;

        try {
            const res = await fetch(
                `http://localhost:8080/book/update/simple/${editingBook.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: editingBook.title,
                        content: editingBook.summary, // content 에 summary 사용
                        author: editingBook.author,
                        coverImageUrl: editingBook.image,
                    }),
                }
            );

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `HTTP error! status: ${res.status}`);
            }

            const result = await res.json();
            console.log("✅ 상세 수정 응답:", result);

            // 화면에 보이는 book 상태도 업데이트
            setBook((prev) => ({
                ...prev,
                title: editingBook.title,
                author: editingBook.author,
                image: editingBook.image,
                summary: editingBook.summary,
                plot: editingBook.summary, // 지금은 content 하나라 동일하게
            }));

            alert("변경사항이 저장되었습니다.");
            handleCloseModal();
        } catch (err) {
            console.error("상세 수정 중 오류:", err);
            alert(`수정 중 오류: ${err.message}`);
        }
    };

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

    // 6. 메인 UI
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

                {/* 수정/삭제 버튼 */}
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        color="inherit"
                        sx={{ backgroundColor: "#b0a9a9", color: "#fff" }}
                        onClick={handleOpenEditModal}
                    >
                        수정
                    </Button>
                    <Button
                        variant="contained"
                        color="inherit"
                        sx={{ backgroundColor: "#b0a9a9", color: "#fff" }}
                        onClick={handleDelete}
                    >
                        삭제
                    </Button>
                </Stack>
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

            {/* 수정 모달 */}
            {editingBook && (
                <Dialog
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle sx={{ fontWeight: 700 }}>
                        작품 정보 수정
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            label="작품 제목"
                            name="title"
                            value={editingBook.title}
                            onChange={handleEditFieldChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="저자"
                            name="author"
                            value={editingBook.author}
                            onChange={handleEditFieldChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="책 표지 URL"
                            name="image"
                            value={editingBook.image}
                            onChange={handleEditFieldChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="책 요약 / 줄거리"
                            name="summary"
                            value={editingBook.summary}
                            onChange={handleEditFieldChange}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleCloseModal}>취소</Button>
                        <Button onClick={handleSaveChanges} variant="contained">
                            저장
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
}