"use client";

import Link from "next/link";
import { AppBar, Toolbar, Typography, Container, Button, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import "@fontsource/nanum-gothic";
import "@fontsource/gowun-dodum";

const theme = createTheme({
    typography: {
        fontFamily: "Gowun Dodum, sans-serif",
        h6: {
            fontFamily: "Nanum Gothic, sans-serif",
            fontWeight: 700,
        },
        button: {
            fontFamily: "Nanum Gothic, sans-serif",
            fontWeight: 700,
        },
    },
});

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
        <body>
        <ThemeProvider theme={theme}>
            <AppBar position="static" sx={{ boxShadow: 2 }}>
                <Toolbar
                    sx={{
                        minHeight: 80,
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    {/* 왼쪽 타이틀: 눌렀을때 mainpage로 돌아가줌*/}
                    <Link href="/mainpage" passHref>
                        <Button color="inherit" sx={{ fontSize: 18, fontWeight: 700 }}>
                            도서 관리 시스템
                        </Button>
                    </Link>


                    {/* 오른쪽 메뉴 버튼들 */}
                    <Box sx={{ display: "flex", gap: 2 }}>

                        {/* 로그인 버튼 */}
                        <Link href="/login" passHref>
                            <Button color="inherit">로그인</Button>
                        </Link>

                        {/* 내 작품 관리 */}
                        <Link href="/userpage/view" passHref>
                            <Button color="inherit">내 작품 관리</Button>
                        </Link>

                        {/* 새 작품 등록 */}
                        <Link href="/userpage/create" passHref>
                            <Button color="inherit">새 작품 등록</Button>
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* 페이지 컨테이너 */}
            <Container maxWidth="md" sx={{ mt: 4 }}>
                {children}
            </Container>
        </ThemeProvider>
        </body>
        </html>
    );
}
