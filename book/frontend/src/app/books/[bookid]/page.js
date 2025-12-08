"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

export default function BookPage() {
    const params = useParams();
    const router = useRouter();
    const bookId = params.bookid; // URL에서 bookId 추출 (폴더명이 [bookid]이므로 소문자)

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ⭐ 책 상세 정보 가져오기
    useEffect(() => {
        if (!bookId) return;

        const fetchBook = async () => {
            try {
                // 백엔드 API: GET /book/detail/{id}
                const response = await fetch(`http://localhost:8080/book/detail/${bookId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("해당 책을 찾을 수 없습니다.");
                    }
                    throw new Error("책 정보를 가져오는데 실패했습니다.");
                }

                const data = await response.json();
                setBook(data);
            } catch (err) {
                console.error("책 상세 조회 오류:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    // 삭제 처리
    const handleDelete = async () => {
        if (!window.confirm(`'${book?.title}' 책을 삭제하시겠습니까?`)) return;

        try {
            const response = await fetch(`http://localhost:8080/book/delete/${bookId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('삭제에 실패했습니다.');

            alert("삭제되었습니다.");
            router.push("/mainpage");
        } catch (err) {
            alert(err.message);
        }
    };

    // 로딩 상태
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h5" color="error">{error}</Typography>
                <Button onClick={() => router.push("/mainpage")} sx={{ mt: 3 }}>
                    메인으로 돌아가기
                </Button>
            </Box>
        );
    }

    // 책 정보가 없는 경우
    if (!book) {
        return (
            <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h5">책 정보를 불러올 수 없습니다.</Typography>
            </Box>
        );
    }

    return (
        <div style={styles.container}>
            {/* 오른쪽 위에 버튼 배치 */}
            <div style={styles.buttonBox}>
                <button style={styles.editBtn} onClick={() => router.push(`/books/${bookId}/edit`)}>
                    수정
                </button>
                <button style={styles.deleteBtn} onClick={handleDelete}>
                    삭제
                </button>
            </div>

            <h1 style={styles.title}>책 제목 : {book.title}</h1>
            <p style={styles.author}>
                저자 : {book.author || "미상"} / 등록일 : {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : "-"}
            </p>

            <div style={styles.contentBox}>
                <img
                    src={book.coverImageUrl || "https://via.placeholder.com/350x450?text=No+Image"}
                    alt={book.title}
                    style={styles.bookImage}
                />

                <div style={styles.infoSection}>
                    <h2 style={styles.sectionTitle}>책 내용</h2>
                    <p style={styles.text}>{book.content || "내용이 없습니다."}</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        width: "1000px",
        margin: "40px auto",
        fontFamily: "Noto Sans KR, sans-serif",
        position: "relative"
    },
    buttonBox: {
        display: "flex",
        gap: "10px",
        justifyContent: "flex-end",
        marginTop: "40px",
        position: "relative"
    },
    title: {
        fontSize: "28px",
        fontWeight: "bold"
    },
    author: {
        fontSize: "15px",
        color: "#555",
        marginBottom: "20px"
    },
    contentBox: {
        display: "flex",
        gap: "40px"
    },
    bookImage: {
        width: "350px",
        height: "450px",
        borderRadius: "8px",
        objectFit: "cover"
    },
    infoSection: {
        flex: 1,
        marginLeft: "40px"
    },
    sectionTitle: {
        fontSize: "20px",
        fontWeight: "600"
    },
    text: {
        whiteSpace: "pre-wrap",
        lineHeight: "1.5",
        marginTop: "10px"
    },
    editBtn: {
        padding: "8px 16px",
        backgroundColor: "#5c8ef7",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },
    deleteBtn: {
        padding: "8px 16px",
        backgroundColor: "#e85858",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    }
};
