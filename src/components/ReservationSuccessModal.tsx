import React from 'react';
import { ReservationRecord } from '../types/book';
import { CheckCircle2, Calendar, MapPin, User, BookOpen, X, BookmarkCheck } from 'lucide-react';

interface ReservationSuccessModalProps {
  record: ReservationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onViewAll: () => void;
}

export const ReservationSuccessModal: React.FC<ReservationSuccessModalProps> = ({
  record,
  isOpen,
  onClose,
  onViewAll,
}) => {
  if (!isOpen || !record) return null;

  const deadlineDate = new Date(record.pickup_deadline);
  const formattedDeadline = deadlineDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Ribbon */}
        <div className="bg-emerald-700 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-100 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
            <CheckCircle2 className="w-7 h-7 text-emerald-200" />
          </div>
          <h3 className="text-lg font-bold">도서 예약이 완료되었습니다</h3>
          <p className="text-xs text-emerald-100 mt-1">
            예약 번호: <span className="font-mono font-bold tracking-wider">{record.reservation_id}</span>
          </p>
        </div>

        {/* Receipt Ticket Details */}
        <div className="p-6 space-y-4">
          <div className="border border-stone-200/80 rounded-xl p-4 bg-stone-50/60 divide-y divide-stone-200/60 text-xs">
            {/* Book info */}
            <div className="pb-3 space-y-1">
              <span className="text-[11px] text-stone-400 font-mono">도서 정보</span>
              <h4 className="font-bold text-sm text-stone-900 line-clamp-1">{record.book_title}</h4>
              {record.book_author && (
                <p className="text-stone-600 text-xs">{record.book_author}</p>
              )}
            </div>

            {/* User & Pickup info */}
            <div className="py-3 space-y-2 text-stone-600">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">신청인</span>
                <span className="font-medium text-stone-900">{record.user_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">연락처</span>
                <span className="font-medium text-stone-900 tabular-nums">{record.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">수령 기한</span>
                <span className="font-bold text-emerald-800">{formattedDeadline} 21:00까지</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">수령 장소</span>
                <span className="text-stone-800">1층 종합자료실 대출데스크</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 text-[11px] text-emerald-900 leading-relaxed">
            💡 방문 시 본인 확인을 위해 신분증 또는 모바일 대출증을 지참해 주시기 바랍니다. 기한 내 미수령 시 예약은 자동으로 취소됩니다.
          </div>

          {/* Action buttons */}
          <div className="pt-1 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                onViewAll();
              }}
              className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>내 예약 목록</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors cursor-pointer text-center"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
