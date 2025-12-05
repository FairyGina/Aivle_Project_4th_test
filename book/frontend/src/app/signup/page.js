export default function SignupPage() {
    return (
        <div style={styles.page}>
            {/* 회원가입 카드 */}
            <div style={styles.card}>
                <h2 style={styles.title}>회원가입</h2>
                <p style={styles.subtitle}>서비스 이용을 위한 정보를 입력해주세요.</p>

                {/* 이름 */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>이름</label>
                    <input type="text" placeholder="실명을 입력해주세요" style={styles.input} />
                </div>

                {/* 이메일(ID) */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>ID (이메일)</label>
                    <input type="email" placeholder="사용할 이메일 주소 입력" style={styles.input} />
                </div>

                {/* 비밀번호 */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>비밀번호</label>
                    <input type="password" placeholder="8자 이상, 영문/숫자 포함" style={styles.input} />
                </div>

                {/* 비밀번호 확인 */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>비밀번호 확인</label>
                    <input type="password" placeholder="비밀번호를 다시 입력해주세요" style={styles.input} />
                </div>

                {/* 전화번호 */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>전화번호</label>
                    <input type="text" placeholder="'-' 없이 숫자만 입력" style={styles.input} />
                </div>

                <button style={styles.submitButton}>가입 완료</button>

                <p style={styles.footerText}>
                    이미 계정이 있으신가요? <span style={styles.loginLink}>로그인 페이지로 돌아가기</span>
                </p>
            </div>

        </div>
    );
}
const styles = {
    page: {
        width: "100%",
        backgroundColor: "#f0f0f0",       // 회색 박스
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",         // ★ 위쪽 정렬
        paddingTop: "40px",               // ★ 회색 박스 세로 줄이고 카드 올리기
        overflow: "hidden",               // 스크롤 제거
    },

    card: {
        width: "430px",
        backgroundColor: "white",
        padding: "28px 32px",
        borderRadius: "12px",
        boxShadow: "0 0 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",

        transform: "translateY(-20px)",   // ★ 회원가입 카드 더 위로 올림
    },

    title: {
        fontSize: "22px",              // ⭐ 제목도 살짝 줄임
        fontWeight: "700",
        textAlign: "center",
        marginBottom: "8px",
    },

    subtitle: {
        textAlign: "center",
        fontSize: "13px",
        color: "#666",
        marginBottom: "25px",
    },

    inputGroup: {
        marginBottom: "15px",
    },

    label: {
        display: "block",
        fontSize: "13px",
        color: "#333",
        marginBottom: "6px",
        fontWeight: "600",
    },

    input: {
        width: "400px",
        padding: "10px",               // 기존 12px → 10px
        fontSize: "13px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        outline: "none",
    },

    submitButton: {
        marginTop: "18px",
        width: "100%",
        padding: "12px",              // 기존 14px → 12px
        backgroundColor: "#497ff5",
        color: "white",
        fontSize: "15px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
    },

    footerText: {
        marginTop: "18px",
        fontSize: "12px",
        textAlign: "center",
        color: "#666",
    },

    loginLink: {
        color: "#497ff5",
        cursor: "pointer",
        marginLeft: "4px",
        fontWeight: "600",
    },
};
