import React from 'react';
import { ReservationRecord } from '../types/book';
import { X, BookmarkCheck, Calendar, Phone, User, BookOpen, Trash2 } from 'lucide-react';

interface MyReservationsModalProps {
  reservations: ReservationRecord[];
  isOpen: boolean;
  onClose: () => void;
  onCancelReservation: (reservationId: string, bookId: string) => void;
}

export const MyReservationsModal: React.FC<MyReservationsModalProps> = ({
  reservations,
  isOpen,
  onClose,
  onCancelReservation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FBFBFA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">내 예약 내역</h3>
              <p className="text-xs text-stone-500">
                총 <span className="font-semibold text-emerald-800">{reservations.length}</span>건의 도서 예약이 접수되어 있습니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {reservations.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-stone-300 stroke-[1.5]" />
              <p className="text-sm font-medium text-stone-600">아직 예약된 도서가 없습니다.</p>
              <p className="text-xs text-stone-400 mt-1">
                원하시는 도서의 &lsquo;예약하기&rsquo; 버튼을 눌러 간편하게 신청해 보세요.
              </p>
            </div>
          ) : (
            reservations.map((item) => {
              const deadlineDate = new Date(item.pickup_deadline).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
                weekday: 'short',
              });

              const isCancelled = item.status === '취소됨';

              return (
                <div
                  key={item.reservation_id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCancelled
                      ? 'bg-stone-50/60 border-stone-200/50 opacity-60'
                      : 'bg-white border-stone-200/90 hover:border-emerald-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-stone-400 font-semibold">
                          {item.reservation_id}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            isCancelled
                              ? 'bg-stone-100 text-stone-500'
                              : 'bg-emerald-100/70 text-emerald-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-stone-900 truncate">
                        {item.book_title}
                      </h4>
                      {item.book_author && (
                        <p className="text-xs text-stone-500">{item.book_author}</p>
                      )}
                    </div>

                    {!isCancelled && (
                      <button
                        onClick={() => onCancelReservation(item.reservation_id, item.book_id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="예약 취소"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-500 gap-2">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>{item.user_name} ({item.phone})</span>
                    </div>
                    {!isCancelled && (
                      <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>수령 기한: {deadlineDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FAF9F6] border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
