"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, HeartHandshake } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between luxury-card-surface rounded-full px-5 sm:px-8 py-3.5 border border-[#D4AF37]/30 shadow-2xl">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#947425] via-[#D4AF37] to-[#F7E1A0] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="text-base font-bold text-[#1E1A16]">⚜️</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="font-ruqaa font-bold text-xl sm:text-2xl text-ivory-100 group-hover:text-gold-light transition-colors leading-tight">
              مِراسيم
            </span>
            <span className="text-[10px] text-ivory-300/60 font-sans tracking-wide">
              دعوات الأعراس والمعايدات الفاخرة
            </span>
          </div>
        </Link>

        {/* Center Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-ivory-200/80">
          <a href="#wedding-showcase" className="hover:text-gold-light transition-colors">
            دعوات الأعراس
          </a>
          <a href="#greeting-showcase" className="hover:text-gold-light transition-colors">
            بطاقات المعايدة
          </a>
          <a href="#features" className="hover:text-gold-light transition-colors">
            المميزات والـ RSVP
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#B8902A] to-[#8C6D23] hover:from-[#E5C378] hover:to-[#A37E26] text-[#16120E] font-bold text-xs sm:text-sm shadow-lg shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>صمم دعوتك</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
