'use client';

import { useEffect, useState } from "react";
import { Grid, TextField, Typography, Button, MenuItem, Box, Card, CardMedia, FormControl, InputLabel, Select } from "@mui/material";

export default function CreateWork() {

    // 페이지 진입 시 로그인 체크
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("로그인 후 이용 가능합니다."); //alert 두번 뜨는 문제가 있으나 작동은 정상 작동 하는 듯
            window.location.href = "/login";
        }
    }, []);

    const [form, setForm] = useState({
        title: "",
        author: "",
        category: "",
        content: "",
    });

    const [model, setModel] = useState("");
    const [imageUrl, setImageUrl] = useState(null);

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleModelChange = (e) => {
        setModel(e.target.value);
    };

    const handleSubmit = async () => {
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("id");

        if (!form.title || !form.author || !form.content) {
            alert("제목과 저자명, 내용을 입력해야 합니다.");
            return;
        }

        let coverUrl = imageUrl;
        if (!imageUrl) {
            const proceed = confirm("표지 이미지가 없습니다. 이미지 없이 작품을 등록할까요?");
            if (!proceed) return;
            coverUrl = null;
        }

        try {
            const response = await fetch("http://localhost:8080/book/insert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    user: { userId: Number(userId) },   // 유저 아이디!!!
                    title: form.title,
                    content: form.content,
                    author: form.author,
                    coverImageUrl: coverUrl
                }),
            });

            if (!response.ok) {
                alert("등록 실패! 서버 오류가 발생했습니다.");
                return;
            }

            const result = await response.json();
            console.log("등록 결과:", result);

            alert("작품이 성공적으로 등록되었습니다!");
            window.location.href = "/mainpage";

        } catch (error) {
            console.error("등록 오류:", error);
            alert("요청 중 문제가 발생했습니다.");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                mt: 5,
            }}
        >
            <Grid
                container
                spacing={6}
                sx={{
                    maxWidth: "1200px",
                    px: 2,
                }}
            >
                {/* 왼쪽 화면 */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                        새 작품 등록
                    </Typography>

                    <Typography sx={{ fontWeight: 600, mb: 1 }}>작품 제목</Typography>
                    <TextField
                        name="title"
                        fullWidth
                        placeholder="작품 제목을 입력하세요"
                        value={form.title}
                        onChange={handleFormChange}
                        sx={{ mb: 3 }}
                    />

                    <Typography sx={{ fontWeight: 600, mb: 1 }}>작가명</Typography>
                    <TextField
                        name="author"
                        fullWidth
                        placeholder="작가명을 입력하세요"
                        value={form.author}
                        onChange={handleFormChange}
                        sx={{ mb: 3 }}
                    />

                    <Typography sx={{ fontWeight: 600, mb: 1 }}>카테고리</Typography>
                    <TextField
                        name="category"
                        fullWidth
                        placeholder="예: 동화, 소설, 에세이..."
                        value={form.category}
                        onChange={handleFormChange}
                        sx={{ mb: 3 }}
                    />

                    <Typography sx={{ fontWeight: 600, mb: 1 }}>내용</Typography>
                    <TextField
                        name="content"
                        fullWidth
                        multiline
                        minRows={6}
                        placeholder="작품 내용을 입력하세요"
                        value={form.content}
                        onChange={handleFormChange}
                        sx={{ mb: 3 }}
                    />

                    <Button variant="contained" size="large" onClick={handleSubmit}>
                        작품 등록하기
                    </Button>
                </Grid>

                {/* 오른쪽 화면 */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                        해당 내용으로 표지 생성하기
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="model-select-label">그림 생성 모델 선택</InputLabel>
                        <Select
                            labelId="model-select-label"
                            label="그림 생성 모델 선택"
                            value={model}
                            onChange={handleModelChange}
                        >
                            <MenuItem value="dall-e">Dall-E</MenuItem>
                            <MenuItem value="gpt-image">GPT Image</MenuItem>
                            <MenuItem value="stablediffusion">Stable Diffusion</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="outlined" size="large">
                        이미지 생성하기
                    </Button>

                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        생성 결과
                    </Typography>

                    {imageUrl ? (
                        <Card sx={{ maxWidth: 300 }}>
                            <CardMedia component="img" src={imageUrl} />
                        </Card>
                    ) : (
                        <Box
                            sx={{
                                width: 300,
                                height: 300,
                                backgroundColor: "#eeeeee",
                                borderRadius: 2,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#999",
                                mb: 2,
                            }}
                        >
                            이미지 없음
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
