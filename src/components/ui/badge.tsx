import React from "react";

interface BadgeProps {
  variant: "success" | "warning" | "error" | "info" | "neutral";
  children: React.ReactNode;
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  children,
  size = "md",
}) => {
  const variants = {
    success: "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]",
    warning: "bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]",
    error: "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]",
    info: "bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]",
    neutral: "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]",
  };

  const sizes = {
    sm: "px-2 py-1 text-[11px]",
    md: "px-3 py-1 text-[13px]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
};
