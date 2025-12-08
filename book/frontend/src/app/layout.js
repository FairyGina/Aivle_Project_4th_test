import "./globals.css";
import AppLayout from "./AppLayout"; // 새로 만들 클라이언트 컴포넌트

export const metadata = {
    title: "도서 관리 시스템",
    description: "Book Management System",
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
        <body>
        <AppLayout>{children}</AppLayout>
        </body>
        </html>
    );
}