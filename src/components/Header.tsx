import React from 'react';
import { BookOpen, BookmarkCheck, RefreshCw, Settings } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  reservationCount: number;
  onOpenReservations: () => void;
  onOpenSettings: () => void;
  onNavClick: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isLoading,
  reservationCount,
  onOpenReservations,
  onOpenSettings,
  onNavClick,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/80 border border-emerald-200/70 flex items-center justify-center text-emerald-800 shadow-xs">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <a
              href="#"
              className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap hover:text-emerald-800 transition-colors"
            >
              늘푸른 도서관
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <button
              onClick={() => onNavClick('all')}
              className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              전체 도서
            </button>
            <button
              onClick={() => onNavClick('IT/기술')}
              className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              IT/기술
            </button>
            <button
              onClick={() => onNavClick('문학/소설')}
              className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              문학/소설
            </button>
            <button
              onClick={() => onNavClick('인문/역사')}
              className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              인문/사회
            </button>
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="도서 목록 새로고침"
              className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100/80 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-700' : ''}`} />
            </button>

            {/* API settings */}
            <button
              onClick={onOpenSettings}
              title="연동 설정"
              className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100/80 rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Reservations modal button */}
            <button
              onClick={onOpenReservations}
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-emerald-900 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-200/80 rounded-xl transition-all shadow-2xs whitespace-nowrap cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4 text-emerald-700" />
              <span>내 예약 내역</span>
              {reservationCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[11px] font-bold bg-emerald-600 text-white rounded-full tabular-nums">
                  {reservationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
