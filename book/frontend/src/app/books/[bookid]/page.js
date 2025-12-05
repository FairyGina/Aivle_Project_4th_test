export default function BookPage() {
    const book = {
        title: "엄마가 보고싶어",
        author: "김미리",
        date: "2000.01.02",
        image: "https://image.yes24.com/goods/123456?random=1",
        summary: `2022두60073 원인자부담금부과처분취소 ...`,
        story: `2022두60073 원인자부담금부과처분취소 ...`
    };

    return (
        <div style={styles.container}>
            {/* 🔥 오른쪽 위에 버튼 배치 */}
            <div style={styles.buttonBox}>
                <button style={styles.editBtn}>수정</button>
                <button style={styles.deleteBtn}>삭제</button>
            </div>

            <h1 style={styles.title}>책 제목 : {book.title}</h1>
            <p style={styles.author}>
                저자 : {book.author} / 등록일 : {book.date}
            </p>

            <div style={styles.contentBox}>
                <img src={book.image} alt="book" style={styles.bookImage} />

                <div style={styles.infoSection}>
                    <h2 style={styles.sectionTitle}>책 요약</h2>
                    <p style={styles.text}>{book.summary}</p>

                    <h2 style={{ ...styles.sectionTitle, marginTop: 30 }}>줄거리</h2>
                    <p style={styles.text}>{book.story}</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        width: "1000px",
        margin: "40px 0",
        fontFamily: "Noto Sans KR, sans-serif",
        position: "relative"
    },

    /* 🔥 오른쪽 상단 버튼 스타일 */
    buttonBox: {
        display: "flex",
        gap: "10px",
        justifyContent: "flex-end",
        marginTop: "40px",   // ← 이제 정상 작동함
        position: "relative" // ← 필요 시 이렇게만!
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
        gap: "40px"   // 🔥 기존 20px → 40px로 넓힘
    },
    bookImage: {
        width: "350px",
        height: "450px",
        borderRadius: "8px",
        objectFit: "cover"
    },
    infoSection: {
        flex: 1,
        marginLeft: "40px"   // 20px → 40px
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
