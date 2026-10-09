import React from 'react';
import { Clock, MapPin, Sparkles } from 'lucide-react';
import heroImage from '../assets/images/library_hero_banner_1791533183932.jpg';

interface HeroBannerProps {
  totalBooks: number;
  availableBooks: number;
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  totalBooks,
  availableBooks,
  onExploreClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F6F2] via-[#FAF9F5] to-[#FBFBFA] border-b border-stone-200/60 pt-6 pb-10 sm:pt-10 sm:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/60 border border-emerald-200/80 text-emerald-800 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>실시간 도서관 대출 및 예약 시스템</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 tracking-tight leading-tight">
              책과 머무는 시간,<br />
              <span className="text-emerald-800 font-serif font-normal italic">오늘의 한 권을</span> 예약하세요
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl">
              소장 중인 인문, IT, 문학, 과학 등 다양한 분야의 도서를 실시간으로 확인하고 간편하게 예약할 수 있습니다. 
              예약 후 3일 이내에 도서관 대출데스크에서 편리하게 수령하세요.
            </p>

            {/* Utility Ribbon */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-500 pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>운영시간: 09:00 - 21:00 (월~일)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>1층 종합자료실 & 2층 디지털자료실</span>
              </div>
            </div>

            {/* Action & Metrics Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium transition-all shadow-xs hover:shadow-sm cursor-pointer whitespace-nowrap"
              >
                도서 검색 및 예약하기
              </button>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-stone-600 bg-white/70 border border-stone-200/70 rounded-xl px-4 py-2">
                <div>
                  소장 도서 <strong className="text-stone-900 font-semibold tabular-nums">{totalBooks}</strong>권
                </div>
                <span className="text-stone-300">·</span>
                <div>
                  예약 가능 <strong className="text-emerald-700 font-semibold tabular-nums">{availableBooks}</strong>권
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Frame Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm bg-stone-100 aspect-16/10 lg:aspect-4/3 group">
              <img
                src={heroImage}
                alt="밝고 따뜻한 늘푸른 도서관 열람실 풍경"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-white/90 text-xs px-2.5 py-1.5 rounded-lg backdrop-blur-xs bg-stone-900/20 border border-white/15 flex items-center justify-between">
                <span>자연 채광의 열린 도서 공간</span>
                <span className="font-mono text-[11px] opacity-80">Evergreen Library</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
