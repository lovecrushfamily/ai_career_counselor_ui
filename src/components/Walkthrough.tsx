import { useEffect } from "react";
import { driver, type Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const TOUR_KEY = "acc-tour-completed-v1";

/**
 * Tour tương tác chạy 1 lần cho user mới.
 * - Trên Landing: giới thiệu nav + CTA + Live Market Data.
 * - Trên /analyze: hướng dẫn nhập câu hỏi, sidebar phiên chat.
 * Người dùng có thể chạy lại từ /guide bất cứ lúc nào.
 */
export const Walkthrough = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(TOUR_KEY) === "1") return;

    // Chỉ auto-chạy ở Landing và /analyze
    if (pathname !== "/" && pathname !== "/analyze") return;

    const t = setTimeout(() => {
      const d = buildDriver(pathname, !!user);
      d.drive();
    }, 600);
    return () => clearTimeout(t);
  }, [pathname, user]);

  return null;
};

const buildDriver = (pathname: string, isAuthed: boolean): Driver => {
  const steps =
    pathname === "/analyze"
      ? [
          {
            element: '[data-tour="chat-input"]',
            popover: {
              title: "Nhập câu hỏi nghề nghiệp",
              description:
                "Hỏi bất cứ điều gì về thị trường tuyển dụng: kỹ năng đang hot, mức lương, lộ trình chuyển ngành...",
            },
          },
          {
            element: '[data-tour="sessions-list"]',
            popover: {
              title: "Lịch sử phiên chat",
              description: "Mọi cuộc trò chuyện được lưu tự động. Bấm để mở lại bất cứ lúc nào.",
            },
          },
          {
            element: '[data-tour="market-data"]',
            popover: {
              title: "Live Market Data",
              description:
                "Số liệu aggregate cập nhật mỗi tuần — chỉ tổng hợp, không lưu JD gốc.",
            },
          },
        ]
      : [
          {
            element: '[data-tour="hero-cta"]',
            popover: {
              title: "Chào mừng bạn 👋",
              description: isAuthed
                ? "Bấm 'Phân tích ngay' để mở giao diện chat AI."
                : "Đăng ký miễn phí (Google hoặc email) để bắt đầu trò chuyện với AI.",
            },
          },
          {
            element: '[data-tour="nav-analyze"]',
            popover: {
              title: "Trang Phân tích",
              description: "Nơi bạn chat với AI Career Advisor Assistant — và xem Market Dashboard.",
            },
          },
          {
            element: '[data-tour="nav-faq"]',
            popover: {
              title: "FAQ",
              description: "Câu hỏi thường gặp về cách dùng & nguồn dữ liệu.",
            },
          },
        ];

  return driver({
    showProgress: true,
    nextBtnText: "Tiếp →",
    prevBtnText: "← Quay lại",
    doneBtnText: "Bắt đầu",
    progressText: "{{current}} / {{total}}",
    onDestroyed: () => {
      localStorage.setItem(TOUR_KEY, "1");
    },
    steps,
  });
};

/** Khởi động lại tour (gọi từ /guide) */
export const restartTour = (pathname = "/") => {
  localStorage.removeItem(TOUR_KEY);
  buildDriver(pathname, false).drive();
};
