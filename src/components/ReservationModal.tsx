import React, { useState, useEffect } from 'react';
import { Book, ReservationPayload } from '../types/book';
import { X, BookOpen, User, Phone, CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';

interface ReservationModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ReservationPayload) => Promise<void>;
  isSubmitting: boolean;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  book,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Reset state when opening with new book
  useEffect(() => {
    if (isOpen) {
      setUserName('');
      setPhone('');
      setErrorMessage('');
    }
  }, [isOpen, book]);

  // Handle phone auto-formatting (010-XXXX-XXXX)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    let formatted = raw;

    if (raw.length <= 3) {
      formatted = raw;
    } else if (raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }

    setPhone(formatted);
    if (errorMessage) setErrorMessage('');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    const trimmedName = userName.trim();
    const cleanPhone = phone.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('예약자 성함을 2자 이상 입력해 주세요.');
      return;
    }

    const digitsOnly = cleanPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || digitsOnly.length < 10) {
      setErrorMessage('연락처(휴대폰 번호)를 올바르게 입력해 주세요. (예: 010-1234-5678)');
      return;
    }

    try {
      await onSubmit({
        book_id: book.book_id,
        user_name: trimmedName,
        phone: cleanPhone,
      });
    } catch (err: any) {
      setErrorMessage(err.message || '예약 처리 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
        className="relative bg-white rounded-2xl max-w-lg w-full border border-stone-200/80 shadow-xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FBFBFA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 id="modal-headline" className="text-base font-bold text-stone-900">
                도서 예약 신청
              </h3>
              <p className="text-xs text-stone-500">
                예약 정보를 확인하고 신청서를 작성해 주세요.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Book Summary Box */}
        <div className="px-6 pt-5">
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                도서번호 {book.book_id}
              </span>
              <span className="text-stone-500">{book.category}</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-stone-900 line-clamp-2">
              {book.title}
            </h4>
            <p className="text-xs text-stone-600">
              저자: <span className="font-medium">{book.author}</span>
              {book.publisher && <span> · {book.publisher}</span>}
            </p>
            {book.location && (
              <p className="text-[11px] text-stone-500 pt-0.5">
                소장위치: {book.location}
              </p>
            )}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* User Name input */}
          <div className="space-y-1.5">
            <label htmlFor="user_name" className="block text-xs font-semibold text-stone-700">
              예약자 이름 <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="user_name"
                type="text"
                required
                autoFocus
                value={userName}
                onChange={handleNameChange}
                placeholder="예: 홍길동"
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all text-stone-900 placeholder-stone-400"
              />
            </div>
          </div>

          {/* Phone Number input */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-xs font-semibold text-stone-700">
              연락처 (휴대폰 번호) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={handlePhoneChange}
                placeholder="예: 010-1234-5678"
                maxLength={13}
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all text-stone-900 placeholder-stone-400 tabular-nums"
              />
            </div>
            <p className="text-[11px] text-stone-400">
              * 예약 완료 및 수령 안내 알림톡/문자 발송에 사용됩니다.
            </p>
          </div>

          {/* Information Notice */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-[11px] text-stone-600 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-stone-700">
              <Info className="w-3.5 h-3.5 text-stone-500" />
              <span>도서관 예약 안내사항</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-stone-500 pl-1">
              <li>예약 후 3일 이내에 도서관 대출 데스크에서 수령하셔야 합니다.</li>
              <li>기한 내 미수령 시 예약은 자동으로 취소되며 다음 대기자에게 넘어갑니다.</li>
            </ul>
          </div>

          {/* Buttons Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>예약 처리 중...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>예약 확정하기</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
