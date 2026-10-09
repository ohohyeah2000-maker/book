/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Book, ReservationPayload, ReservationRecord } from './types/book';
import {
  fetchBooks,
  reserveBook,
  getSavedReservations,
  cancelReservation,
} from './services/libraryApi';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ApiNoticeBanner } from './components/ApiNoticeBanner';
import { SearchAndFilter } from './components/SearchAndFilter';
import { BookCard } from './components/BookCard';
import { ReservationModal } from './components/ReservationModal';
import { ReservationSuccessModal } from './components/ReservationSuccessModal';
import { MyReservationsModal } from './components/MyReservationsModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { BookOpen, RefreshCw, AlertCircle, Sparkles, BookMarked } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isMockFallback, setIsMockFallback] = useState<boolean>(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  // Modals
  const [selectedBookForReservation, setSelectedBookForReservation] = useState<Book | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState<boolean>(false);
  const [lastSuccessRecord, setLastSuccessRecord] = useState<ReservationRecord | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isMyReservationsOpen, setIsMyReservationsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Reservation records
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);

  const bookListRef = useRef<HTMLDivElement>(null);

  // Load books on initial mount
  const loadBooks = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetchBooks();
      if (response.data) {
        setBooks(response.data);
      }
      setIsMockFallback(Boolean(response.isMockFallback));
      if (response.message) {
        setErrorMessage(response.message);
      }
    } catch (err: any) {
      console.error('Failed to load books:', err);
      setErrorMessage(err.message || '도서 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      // Sync reservations from storage
      setReservations(getSavedReservations());
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Compute unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Category filter
      if (selectedCategory !== 'all' && book.category !== selectedCategory) {
        return false;
      }

      // Available only filter
      if (onlyAvailable && book.status !== '예약가능') {
        return false;
      }

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = book.title.toLowerCase().includes(q);
        const authorMatch = book.author.toLowerCase().includes(q);
        const idMatch = book.book_id.toLowerCase().includes(q);
        const catMatch = book.category.toLowerCase().includes(q);
        const pubMatch = book.publisher?.toLowerCase().includes(q) ?? false;
        if (!titleMatch && !authorMatch && !idMatch && !catMatch && !pubMatch) {
          return false;
        }
      }

      return true;
    });
  }, [books, selectedCategory, onlyAvailable, searchQuery]);

  // Counts
  const totalCount = books.length;
  const availableCount = useMemo(() => {
    return books.filter((b) => b.status === '예약가능').length;
  }, [books]);

  // Open reservation modal
  const handleOpenReservation = (book: Book) => {
    setSelectedBookForReservation(book);
    setIsReservationModalOpen(true);
  };

  // Submit reservation form
  const handleReservationSubmit = async (payload: ReservationPayload) => {
    setIsSubmitting(true);
    try {
      // Send POST request with JSON body: book_id, user_name, phone
      await reserveBook(payload);

      // Refresh reservations list
      const updatedReservations = getSavedReservations();
      setReservations(updatedReservations);

      const latestRecord = updatedReservations.find(
        (r) => r.book_id === payload.book_id && r.phone === payload.phone
      ) || updatedReservations[0];

      // Close reservation input modal
      setIsReservationModalOpen(false);
      setSelectedBookForReservation(null);

      // Open success receipt modal
      if (latestRecord) {
        setLastSuccessRecord(latestRecord);
        setIsSuccessModalOpen(true);
      }

      // Requirement: "처리 완료 후 도서 목록을 다시 불러와 화면을 갱신해야 합니다."
      await loadBooks();
    } catch (err: any) {
      console.error('Reservation submission error:', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel reservation
  const handleCancelReservation = (reservationId: string, bookId: string) => {
    cancelReservation(reservationId, bookId);
    setReservations(getSavedReservations());
    loadBooks();
  };

  const handleScrollToBooks = () => {
    if (bookListRef.current) {
      bookListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    handleScrollToBooks();
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-stone-800 flex flex-col font-sans">
      {/* Header */}
      <Header
        onRefresh={loadBooks}
        isLoading={isLoading}
        reservationCount={reservations.filter((r) => r.status !== '취소됨').length}
        onOpenReservations={() => setIsMyReservationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNavClick={handleNavCategoryClick}
      />

      {/* Notice Banner when GAS spreadsheet error is detected */}
      <ApiNoticeBanner
        isMockFallback={isMockFallback}
        message={errorMessage}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Hero Section */}
      <HeroBanner
        totalBooks={totalCount}
        availableBooks={availableCount}
        onExploreClick={handleScrollToBooks}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={bookListRef}>
        {/* Search, Filter Tabs & Available Toggle */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          onlyAvailable={onlyAvailable}
          onOnlyAvailableChange={setOnlyAvailable}
          totalFilteredCount={filteredBooks.length}
        />

        {/* Book Grid / States */}
        <section className="pt-6">
          {isLoading ? (
            <div className="py-24 text-center">
              <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-stone-700">도서 목록을 불러오는 중입니다...</p>
              <p className="text-xs text-stone-400 mt-1">Google Apps Script API와 통신하고 있습니다.</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-stone-200/80 p-8 shadow-2xs">
              <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3 stroke-[1.5]" />
              <h3 className="text-base font-bold text-stone-800">조건에 맞는 도서가 없습니다</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                검색어를 변경하거나 필터를 초기화해 보세요.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setOnlyAvailable(false);
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors cursor-pointer"
              >
                검색 조건 초기화
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.book_id}
                  book={book}
                  onReserve={handleOpenReservation}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200/80 py-8 mt-12 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              늘
            </div>
            <span className="font-semibold text-stone-800">늘푸른 도서관 정보서비스</span>
            <span className="text-stone-300">·</span>
            <span>Google Apps Script API 연동</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>서울특별시 마포구 독서로 102</span>
            <span>·</span>
            <span>문의: 02-123-4567</span>
          </div>
        </div>
      </footer>

      {/* Reservation Input Modal */}
      <ReservationModal
        book={selectedBookForReservation}
        isOpen={isReservationModalOpen}
        onClose={() => {
          setIsReservationModalOpen(false);
          setSelectedBookForReservation(null);
        }}
        onSubmit={handleReservationSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Reservation Success Receipt Modal */}
      <ReservationSuccessModal
        record={lastSuccessRecord}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onViewAll={() => {
          setIsSuccessModalOpen(false);
          setIsMyReservationsOpen(true);
        }}
      />

      {/* My Reservations List Modal */}
      <MyReservationsModal
        reservations={reservations}
        isOpen={isMyReservationsOpen}
        onClose={() => setIsMyReservationsOpen(false)}
        onCancelReservation={handleCancelReservation}
      />

      {/* API Endpoint & Debug Settings Modal */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={() => loadBooks()}
      />
    </div>
  );
}
