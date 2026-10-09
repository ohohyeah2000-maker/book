import React from 'react';
import { Book } from '../types/book';
import { BookOpen, Calendar, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onReserve: (book: Book) => void;
}

// Category palette helper for soft pastel accents
function getCategoryColor(category: string) {
  if (category.includes('IT') || category.includes('기술')) {
    return {
      bg: 'bg-sky-50',
      border: 'border-sky-200/80',
      text: 'text-sky-800',
      spine: 'from-sky-100 to-sky-200/80',
    };
  }
  if (category.includes('문학') || category.includes('소설')) {
    return {
      bg: 'bg-rose-50',
      border: 'border-rose-200/80',
      text: 'text-rose-800',
      spine: 'from-rose-100 to-rose-200/80',
    };
  }
  if (category.includes('인문') || category.includes('역사') || category.includes('사회')) {
    return {
      bg: 'bg-amber-50',
      border: 'border-amber-200/80',
      text: 'text-amber-800',
      spine: 'from-amber-100 to-amber-200/80',
    };
  }
  if (category.includes('과학') || category.includes('자연')) {
    return {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200/80',
      text: 'text-emerald-800',
      spine: 'from-emerald-100 to-emerald-200/80',
    };
  }
  return {
    bg: 'bg-violet-50',
    border: 'border-violet-200/80',
    text: 'text-violet-800',
    spine: 'from-violet-100 to-violet-200/80',
  };
}

export const BookCard: React.FC<BookCardProps> = ({ book, onReserve }) => {
  const isAvailable = book.status === '예약가능';
  const isLoaned = book.status === '대출중';
  const isReserved = book.status === '예약중';

  const catColors = getCategoryColor(book.category);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 hover:border-emerald-200/90 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Section with Book Cover Spine & Metadata */}
      <div className="p-5">
        <div className="flex gap-4 items-start">
          {/* Stylized Pastel Book Spine Cover */}
          <div
            className={`w-16 sm:w-20 aspect-3/4 rounded-xl bg-gradient-to-br ${catColors.spine} border ${catColors.border} p-2 flex flex-col justify-between shrink-0 shadow-2xs relative overflow-hidden`}
          >
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-stone-900/10" />
            <div className="text-[10px] font-mono font-medium text-stone-600 truncate pl-1">
              {book.book_id}
            </div>
            <div className="my-auto text-center px-0.5">
              <BookOpen className="w-5 h-5 mx-auto text-stone-700/60 stroke-[1.8]" />
            </div>
            <div className="text-[9px] text-stone-500 font-medium truncate text-right">
              {book.category}
            </div>
          </div>

          {/* Book Header & Title */}
          <div className="flex-1 min-w-0">
            {/* Unboxed Metadata (Zero-Pill discipline) */}
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span className={`font-medium ${catColors.text}`}>{book.category}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="font-mono text-stone-400">{book.book_id}</span>
              {book.published_year && (
                <>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="tabular-nums">{book.published_year}년</span>
                </>
              )}
            </div>

            <h3
              className="text-base sm:text-lg font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-emerald-900 transition-colors"
              title={book.title}
            >
              {book.title}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 mt-1 line-clamp-1 font-medium">
              {book.author}
              {book.publisher && <span className="text-stone-400 font-normal"> · {book.publisher}</span>}
            </p>
          </div>
        </div>

        {/* Description Snippet if present */}
        {book.description && (
          <p className="mt-3.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        )}

        {/* Shelf location */}
        {book.location && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-stone-500 bg-stone-50/80 px-2.5 py-1.5 rounded-lg border border-stone-200/50">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{book.location}</span>
          </div>
        )}
      </div>

      {/* Bottom Action Footer with Status & Reservation Button */}
      <div className="px-5 py-3.5 bg-[#FAF9F6] border-t border-stone-100 flex items-center justify-between gap-3">
        {/* Status display */}
        <div className="flex items-center gap-1.5">
          {isAvailable && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-md">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              예약가능
            </span>
          )}
          {isLoaned && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-100/60 border border-amber-200/80 px-2.5 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              대출중
            </span>
          )}
          {isReserved && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-800 bg-violet-100/60 border border-violet-200/80 px-2.5 py-1 rounded-md">
              <AlertCircle className="w-3.5 h-3.5 text-violet-600" />
              예약중
            </span>
          )}
          {!isAvailable && !isLoaned && !isReserved && (
            <span className="text-xs text-stone-500 font-medium px-2 py-1">
              {book.status}
            </span>
          )}
        </div>

        {/* Action Button */}
        {isAvailable ? (
          <button
            onClick={() => onReserve(book)}
            className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 transition-all shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap"
          >
            예약하기
          </button>
        ) : (
          <button
            disabled
            className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-stone-400 bg-stone-100 border border-stone-200/60 cursor-not-allowed whitespace-nowrap"
          >
            {isLoaned ? '대출 불가' : '예약 마감'}
          </button>
        )}
      </div>
    </div>
  );
};
