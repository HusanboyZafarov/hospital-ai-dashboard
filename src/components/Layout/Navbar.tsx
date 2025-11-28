import React from 'react';
import { User } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <div 
      className="h-[64px] bg-white border-b border-[#E2E8F0] flex items-center justify-end px-12"
      style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
          <User size={20} className="text-[#2563EB]" />
        </div>
        <div className="text-right">
          <div className="text-[#0F172A]">Dr. Sarah Johnson</div>
          <div className="text-[#475569] text-[13px]">Administrator</div>
        </div>
      </div>
    </div>
  );
};
