"use client";

// useState 외에 필요한 컴포넌트들을 mui에서 import 합니다.
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { 
    Box, Typography, Stack, CardMedia, Button, 
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    CircularProgress // For loading indicator when fetching list
} from "@mui/material";

// TODO: 로그인 구현 후 실제 accessToken으로 교체해야 합니다.
const FAKE_ACCESS_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function MyPageView() {
    const router = useRouter();
    const [works, setWorks] = useState([]); // 초기 상태를 빈 배열로 변경
    const [loading, setLoading] = useState(true); // 목록 로딩 상태 추가
    
    // --- 모달 관련 상태 추가 ---
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [editingWork, setEditingWork] = useState(null); 
    const alertShown = useRef(false);

    // --- 작품 목록 불러오기 (GET /book/list) ---
    useEffect(() => {
        const user = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        const isLoggedIn = !!user;

        if (!isLoggedIn) {
            // 여기서는 굳이 alert 안 띄우고 조용히 보내도 됨 (AppBar에서 이미 안내했으니까)
            if (!alertShown.current) {
                // 필요하면 한 번만 안내
                alert("로그인이 필요한 서비스입니다.");
                alertShown.current = true;
            }
            router.replace("/login");   // 뒤로가기 눌러도 안 돌아오도록 replace
            return;
        }
        // --- 로그인 확인 끝 ---

        const fetchWorks = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:8080/book/list", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        // 'Authorization': FAKE_ACCESS_TOKEN,
                    },
                });

                if (!response.ok) {
                    const errorBody = await response.text();
                    let errorMessage = `HTTP error! status: ${response.status}`;
                    try {
                        const errorJson = JSON.parse(errorBody);
                        errorMessage = errorJson.message || JSON.stringify(errorJson);
                    } catch (e) {
                        errorMessage = errorBody || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                console.log("📘 /book/list 응답:", result);

                // 1) ApiResponse 형태: { status, data, message } 인지 확인
                let list = null;
                if (Array.isArray(result)) {
                    // 혹시 배열로 바로 오는 경우
                    list = result;
                } else if (result && Array.isArray(result.data)) {
                    list = result.data;
                } else {
                    throw new Error("리스트 응답 형식이 올바르지 않습니다.");
                }

                // 2) null / undefined 항목 제거
                const cleaned = list.filter((item) => item != null);

                // 3) 여기서부터는 item 이 무조건 객체라고 가정
                const fetchedWorks = cleaned.map((item) => ({
                    // 백엔드에서 bookId 라고 오면 bookId, 혹시 id 라고 오면 id 둘 다 시도
                    id: item.bookId ?? item.id,
                    title: item.title ?? "제목 없음",
                    author: item.author || "알 수 없음",
                    createdAt: item.createdAt
                        ? item.createdAt.substring(0, 10)
                        : "알 수 없음",
                    description: item.content ?? "",
                    image:
                        item.coverImageUrl ||
                        "https://via.placeholder.com/140x200?text=No+Image",
                }));

                setWorks(fetchedWorks);
            } catch (error) {
                console.error("작품 목록 불러오기 오류:", error);
                if (!alertShown.current) {
                    alert("작품 목록을 불러오지 못했습니다.");
                    alertShown.current = true;
                }
                setWorks([]);   // ✅ 더 이상 목업 안 씀
            } finally {
                setLoading(false);
            }
        };

        fetchWorks();
    }, [router]);

    // 삭제 처리 함수
    const handleDelete = async (idToDelete) => {
        const target = works.find((w) => w.id === idToDelete);
        if (!window.confirm(`'${target?.title}' 작품을 정말 삭제하시겠습니까?`)) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/book/delete/${idToDelete}`,
                {
                    method: "DELETE",
                    // 백엔드에서 아직 토큰 안 쓰면 헤더는 생략해도 됨
                    headers: {
                        // 'Authorization': FAKE_ACCESS_TOKEN,
                    },
                }
            );

            if (!response.ok) {
                const errorBody = await response.text();
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorJson = JSON.parse(errorBody);
                    errorMessage = errorJson.message || JSON.stringify(errorJson);
                } catch (e) {
                    errorMessage = errorBody || errorMessage;
                }
                throw new Error(errorMessage);
            }

            // 성공
            setWorks((currentWorks) =>
                currentWorks.filter((work) => work.id !== idToDelete)
            );
            alert("작품이 삭제되었습니다.");
        } catch (error) {
            console.error("삭제 처리 중 오류:", error.message);
            alert(`삭제 처리 중 오류: ${error.message}`);
        }
    };

    // 수정 버튼 클릭 시 모달 열기
    const handleOpenEditModal = (work) => {
        setEditingWork({ ...work });
        setIsModalOpen(true);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingWork(null);
    };

    // 모달 내 폼 필드 변경 시 호출될 함수
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditingWork(prev => ({ ...prev, [name]: value }));
    };

    // '저장' 버튼 클릭 시
    // '저장' 버튼 클릭 시
    const handleSaveChanges = async () => {
        if (!editingWork) return;

        try {
            const response = await fetch(
                `http://localhost:8080/book/update/simple/${editingWork.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: editingWork.title,
                        content: editingWork.description,
                        author: editingWork.author,
                        coverImageUrl: editingWork.image,
                    }),
                }
            );

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(errorBody || `HTTP error! status: ${response.status}`);
            }

            // 백엔드 응답(JSON) 확인 (원하면 사용)
            const result = await response.json();
            console.log("✅ 수정 응답:", result);

            // 화면에 들고 있는 works 상태를 직접 업데이트
            setWorks((currentWorks) =>
                currentWorks.map((work) =>
                    work.id === editingWork.id
                        ? {
                            ...work,
                            // editingWork 내용으로 갈아끼우기
                            title: editingWork.title,
                            author: editingWork.author,
                            description: editingWork.description,
                            image: editingWork.image,
                            // createdAt 은 기존 값 유지
                        }
                        : work
                )
            );

            alert("변경사항이 저장되었습니다.");
            handleCloseModal(); // 모달 닫기

        } catch (error) {
            console.error("수정 중 오류:", error);
            alert(`수정 중 오류: ${error.message}`);
        }
    };


    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (works.length === 0 && !loading) {
        return (
            <Box sx={{ textAlign: "center", mt: 10 }}>
                <Typography variant="h5">등록된 작품이 없습니다.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", mt: 6, mb: 10 }}>

            <Typography
                variant="h4"
                sx={{ fontWeight: 700, textAlign: "center", mb: 6 }}
            >
                내 작품 관리
            </Typography>

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
                        <CardMedia
                            component="img"
                            image={item.image}
                            alt={item.title}
                            sx={{
                                width: 140,
                                height: 200,
                                borderRadius: 2,
                                objectFit: "cover",
                            }}
                        />

                        <Box sx={{ flex: 1 }}>

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

                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Button variant="text" size="small" sx={{ color: "#555" }} onClick={() => handleOpenEditModal(item)}>
                                        수정
                                    </Button>
                                    <Typography>|</Typography>
                                    <Button variant="text" size="small" sx={{ color: "#555" }} onClick={() => handleDelete(item.id)}>
                                        삭제
                                    </Button>
                                </Box>
                            </Box>

                            <Typography sx={{ color: "#555", lineHeight: 1.6 }}>
                                {item.description}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Stack>
            
            {editingWork && (
                <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ fontWeight: 700 }}>작품 정보 수정</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="작품 제목"
                            value={editingWork.title}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true }}
                        />
                        <TextField
                            name="author"
                            label="저자"
                            value={editingWork.author}
                            onChange={handleFormChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="등록일"
                            value={editingWork.createdAt}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true }}
                        />
                        <TextField
                            name="image"
                            label="책 표지 URL"
                            value={editingWork.image}
                            onChange={handleFormChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            name="description"
                            label="책 요약 / 줄거리"
                            value={editingWork.description}
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
