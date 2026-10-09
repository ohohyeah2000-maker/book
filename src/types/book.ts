export type BookStatus = '예약가능' | '대출중' | '예약중' | string;

export interface Book {
  book_id: string;
  title: string;
  author: string;
  category: string;
  status: BookStatus;
  published_year?: string | number;
  publisher?: string;
  location?: string;
  isbn?: string;
  cover_image?: string;
  description?: string;
}

export interface ReservationPayload {
  book_id: string;
  user_name: string;
  phone: string;
}

export interface ReservationRecord {
  reservation_id: string;
  book_id: string;
  book_title: string;
  book_author?: string;
  user_name: string;
  phone: string;
  reserved_at: string;
  pickup_deadline: string;
  status: '예약접수' | '수령대기' | '수령완료' | '취소됨';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  isMockFallback?: boolean;
  rawError?: string;
}
