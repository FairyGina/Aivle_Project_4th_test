"use client";

// useState 외에 필요한 컴포넌트들을 mui에서 import 합니다.
import { useState } from "react";
import { 
    Box, Typography, Stack, CardMedia, Button, 
    Dialog, DialogTitle, DialogContent, DialogActions, TextField 
} from "@mui/material";

const mockMyWorks = [ //나중에 백엔드에서 user가 등록한 작품 목록 가져와야함. 현재는 임시 데이터
    {
        id: 1,
        title: "그해 여름이야기",
        author: "작가 A", // '저자' 필드 추가
        createdAt: "2023-00-00", // '등록일' 필드 추가
        content:
            "이 사건은 깨끗한 물을 공급하는 시설을 더 필요하게 만든 사람이 나중에 쓸 돈을 이미 있는 깨끗한 물 공급 시설 짓는 비용으로 내야 하는지...",
        coverImageUrl: "https://image.yes24.com/goods/123456?random=1",
    },
    {
        id: 2,
        title: "엄마가 보고 싶어",
        author: "작가 B",
        createdAt: "2023-00-00",
        content:
            "이 사건은 깨끗한 물을 공급하는 시설을 더 필요하게 만든 사람이 나중에 쓸 돈을 이미 있는 깨끗한 물 공급 시설 짓는 비용으로 내야 하는지...",
        coverImageUrl: "https://image.yes24.com/goods/987654?random=1",
    },
];

export default function MyPageView() {
    const [works, setWorks] = useState(mockMyWorks);
    
    // --- 모달 관련 상태 추가 ---
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태
    const [editingWork, setEditingWork] = useState(null); // 현재 수정 중인 작품 데이터

    // 삭제 처리 함수 (기존 코드)
    const handleDelete = async (idToDelete) => {
        // ... (기존 삭제 로직은 그대로 유지) ...
        // 사용자에게 삭제 여부 재확인
        if (!window.confirm(`'${works.find(w => w.id === idToDelete)?.title}' 작품을 정말 삭제하시겠습니까?`)) {
            return; // 사용자가 '취소'를 누르면 함수 종료
        }

        try {
            // 1. 백엔드에 삭제 요청 
            const response = await fetch(`/book/delete/${idToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                // 실제 백엔드 연동 시, 여기서 에러 처리를 해야 합니다.
                throw new Error('작품 삭제에 실패했습니다.');
            }

            // 2. 백엔드 요청 성공 시, 프론트엔드 상태 업데이트
            setWorks(currentWorks => currentWorks.filter(work => work.id !== idToDelete));
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
            const response = await fetch(`/book/update/${editingWork.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingWork),
            });
            if (!response.ok) throw new Error('작품 수정에 실패했습니다.');
            
            // 2. 프론트엔드 상태 업데이트
            setWorks(currentWorks => 
                currentWorks.map(work => 
                    work.id === editingWork.id ? editingWork : work
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

            {/* 작품 리스트 */}
            <Stack spacing={5} sx={{ px: 6 }}>
                {works.map((item) => (
                    <Box
                        key={item.id}
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
                                    <Button variant="text" size="small" sx={{ color: "#555" }} onClick={() => handleDelete(item.id)}>
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
                            value={editingWork.author}
                            onChange={handleFormChange}
                            fullWidth
                            margin="normal"
                        />
                        {/* 등록일 (수정 불가) */}
                        <TextField
                            label="등록일"
                            value={editingWork.createdAt}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true }}
                        />
                        {/* 책 표지 URL */}
                        <TextField
                            name="coverImageUrl"
                            label="책 표지 URL"
                            value={editingWork.coverImageUrl}
                            onChange={handleFormChange}
                            fullWidth
                            margin="normal"
                        />
                         {/* 책 요약/줄거리 */}
                        <TextField
                            name="content"
                            label="책 요약 / 줄거리"
                            value={editingWork.content}
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