"use client";

// useState 외에 필요한 컴포넌트들을 mui에서 import 합니다.
import { useState, useEffect } from "react";
import {
    Box, Typography, Stack, CardMedia, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    CircularProgress
} from "@mui/material";

export default function MyPageView() {
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- 모달 관련 상태 추가 ---
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태
    const [editingWork, setEditingWork] = useState(null); // 현재 수정 중인 작품 데이터

    // ⭐ 로그인 체크 및 데이터 로드
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        // 로그인하지 않은 경우 리디렉션
        if (!user || !user.userId) {
            alert("로그인 후 이용 가능합니다.");
            window.location.href = "/login";
            return;
        }

        // 도서 목록 가져오기
        const fetchBooks = async () => {
            try {
                const response = await fetch("http://localhost:8080/book/list");
                if (!response.ok) {
                    throw new Error("도서 목록을 가져오는데 실패했습니다.");
                }
                const allBooks = await response.json();

                // 현재 사용자의 도서만 필터링
                const myBooks = allBooks.filter(book => book.user?.userId === user.userId);
                setWorks(myBooks);
            } catch (error) {
                console.error("도서 목록 조회 오류:", error);
                alert("도서 목록을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // 삭제 처리 함수
    const handleDelete = async (idToDelete) => {
        // 사용자에게 삭제 여부 재확인
        if (!window.confirm(`'${works.find(w => w.bookId === idToDelete)?.title}' 작품을 정말 삭제하시겠습니까?`)) {
            return; // 사용자가 '취소'를 누르면 함수 종료
        }

        try {
            // 1. 백엔드에 삭제 요청 
            const response = await fetch(`http://localhost:8080/book/delete/${idToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('작품 삭제에 실패했습니다.');
            }

            // 2. 백엔드 요청 성공 시, 프론트엔드 상태 업데이트
            setWorks(currentWorks => currentWorks.filter(work => work.bookId !== idToDelete));
            alert("작품이 삭제되었습니다.");

        } catch (error) {
            console.error("삭제 처리 중 오류:", error);
            alert(error.message);
        }
    };


    // 수정 버튼 클릭 시 모달 열기
    const handleOpenEditModal = (work) => {
        setEditingWork({ ...work }); // 원본 데이터 수정을 방지하기 위해 복사본을 상태에 저장
        setIsModalOpen(true);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingWork(null); // 수정 상태 초기화
    };

    // 모달 내 폼 필드 변경 시 호출될 함수
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditingWork(prev => ({ ...prev, [name]: value }));
    };

    // '저장' 버튼 클릭 시
    const handleSaveChanges = async () => {
        if (!editingWork) return;

        try {
            // 1. 백엔드에 수정 요청 (PUT /book/update/{bookId})
            const response = await fetch(`http://localhost:8080/book/update/${editingWork.bookId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingWork),
            });
            if (!response.ok) throw new Error('작품 수정에 실패했습니다.');

            // 2. 프론트엔드 상태 업데이트
            setWorks(currentWorks =>
                currentWorks.map(work =>
                    work.bookId === editingWork.bookId ? editingWork : work
                )
            );

            alert("변경사항이 저장되었습니다.");
            handleCloseModal(); // 모달 닫기

        } catch (error) {
            console.error("수정 중 오류:", error);
            alert(error.message);
        }
    };


    return (
        <Box sx={{ width: "100%", mt: 6, mb: 10 }}>

            {/* 제목 */}
            <Typography
                variant="h4"
                sx={{ fontWeight: 700, textAlign: "center", mb: 6 }}
            >
                내 작품 관리
            </Typography>

            {/* 로딩 상태 */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                    <CircularProgress />
                </Box>
            ) : works.length === 0 ? (
                <Typography sx={{ textAlign: "center", color: "#888", py: 10 }}>
                    등록된 작품이 없습니다.
                </Typography>
            ) : (
                /* 작품 리스트 */
                <Stack spacing={5} sx={{ px: 6 }}>
                    {works.map((item) => (
                        <Box
                            key={item.bookId}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 4,
                                p: 3,
                                borderRadius: 2,
                                backgroundColor: "#f7f4f2",
                            }}
                        >
                            {/* 표지 이미지 */}
                            <CardMedia
                                component="img"
                                image={item.coverImageUrl}
                                alt={item.title}
                                sx={{
                                    width: 140,
                                    height: 200,
                                    borderRadius: 2,
                                    objectFit: "cover",
                                }}
                            />

                            {/* 텍스트 + 버튼 */}
                            <Box sx={{ flex: 1 }}>

                                {/* 제목 + 버튼 (가로 정렬) */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 1,
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {item.title}
                                    </Typography>

                                    {/* 수정/삭제 버튼 */}
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        {/* 수정 버튼에 handleOpenEditModal 연결 */}
                                        <Button variant="text" size="small" sx={{ color: "#555" }} onClick={() => handleOpenEditModal(item)}>
                                            수정
                                        </Button>
                                        <Typography>|</Typography>
                                        <Button variant="text" size="small" sx={{ color: "#555" }} onClick={() => handleDelete(item.bookId)}>
                                            삭제
                                        </Button>
                                    </Box>
                                </Box>

                                {/* 설명 */}
                                <Typography sx={{ color: "#555", lineHeight: 1.6 }}>
                                    {item.content}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            )}

            {/* --- 수정 모달 (Dialog) 추가 --- */}
            {editingWork && (
                <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ fontWeight: 700 }}>작품 정보 수정</DialogTitle>
                    <DialogContent>
                        {/* 작품 제목 (수정 불가) */}
                        <TextField
                            label="작품 제목"
                            value={editingWork.title}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true }}
                        />
                        {/* 저자 */}
                        <TextField
                            name="author"
                            label="저자"
                            value={editingWork.author || ""}
                            onChange={handleFormChange}
                            fullWidth
                            margin="normal"
                        />
                        {/* 등록일 (수정 불가) */}
                        <TextField
                            label="등록일"
                            value={editingWork.createdAt ? new Date(editingWork.createdAt).toLocaleDateString() : ""}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true }}
                        />
                        {/* 책 표지 URL */}
                        <TextField
                            name="coverImageUrl"
                            label="책 표지 URL"
                            value={editingWork.coverImageUrl || ""}
                            onChange={handleFormChange}
                            fullWidth
                            margin="normal"
                        />
                        {/* 책 요약/줄거리 */}
                        <TextField
                            name="content"
                            label="책 요약 / 줄거리"
                            value={editingWork.content || ""}
                            onChange={handleFormChange}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleCloseModal}>취소</Button>
                        <Button onClick={handleSaveChanges} variant="contained">저장</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
}