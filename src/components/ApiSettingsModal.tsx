import React, { useState } from 'react';
import {
  DEFAULT_GAS_ENDPOINT,
  getEndpointUrl,
  saveEndpointUrl,
  resetEndpointUrl,
  resetLocalBooks,
} from '../services/libraryApi';
import { X, Globe, RefreshCw, CheckCircle, RotateCcw, Copy, ExternalLink, Code2 } from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [url, setUrl] = useState(getEndpointUrl());
  const [testStatus, setTestStatus] = useState<null | 'testing' | 'success' | 'gas_error' | 'error'>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveEndpointUrl(url);
    onSave();
    onClose();
  };

  const handleResetToDefault = () => {
    resetEndpointUrl();
    setUrl(DEFAULT_GAS_ENDPOINT);
  };

  const handleResetData = () => {
    if (window.confirm('도서 목록 및 예약 내역을 초기 데모 상태로 초기화하시겠습니까?')) {
      resetLocalBooks();
      onSave();
      onClose();
    }
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setStatusMessage('Google Apps Script 엔드포인트 연결 테스트 중...');

    try {
      const res = await fetch(url.trim(), {
        method: 'GET',
        redirect: 'follow',
      });
      const text = await res.text();

      if (text.includes('Illegal spreadsheet id or key')) {
        setTestStatus('gas_error');
        setStatusMessage('Apps Script 응답 성공! 단, 스크립트 내 구글 스프레드시트 ID가 미설정 상태입니다.');
      } else if (text.startsWith('<html') || text.includes('<!DOCTYPE html>')) {
        setTestStatus('gas_error');
        setStatusMessage('Apps Script에서 HTML 페이지를 반환했습니다 (권한 또는 오류 확인 필요).');
      } else {
        try {
          const parsed = JSON.parse(text);
          setTestStatus('success');
          const count = Array.isArray(parsed) ? parsed.length : (parsed.books?.length || parsed.data?.length || 0);
          setStatusMessage(`연결 성공! 유효한 도서 데이터 ${count}건을 수신했습니다.`);
        } catch {
          setTestStatus('gas_error');
          setStatusMessage('응답을 수신했으나 JSON 파싱에 실패했습니다.');
        }
      }
    } catch (err: any) {
      setTestStatus('error');
      setStatusMessage(`CORS 또는 네트워크 연결 오류: ${err.message || '요청 실패'}`);
    }
  };

  const gasSampleCode = `// Google Apps Script (Code.gs)
// 1. 여기에 실제 구글 스프레드시트 ID를 입력하세요.
var SPREADSHEET_ID = "여기에_스프레드시트_ID_입력";

var SHEET_NAME_BOOKS = "도서목록";
var SHEET_NAME_RESERVATIONS = "예약내역";

// GET 요청 처리: 도서 목록 반환
function doGet(e) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var bookSheet = ss.getSheetByName(SHEET_NAME_BOOKS) || ss.getSheets()[0];
    var data = bookSheet.getDataRange().getValues();
    if (data.length <= 1) return createJsonResponse([]);

    var headers = data[0].map(function(h) { return String(h).trim().toLowerCase(); });
    var books = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0] && !row[1]) continue;

      var bookObj = {};
      for (var col = 0; col < headers.length; col++) {
        bookObj[headers[col]] = String(row[col] !== null ? row[col] : "");
      }
      if (!bookObj.book_id && row[0]) bookObj.book_id = String(row[0]);
      if (!bookObj.title && row[1]) bookObj.title = String(row[1]);
      if (!bookObj.author && row[2]) bookObj.author = String(row[2]);
      if (!bookObj.category && row[3]) bookObj.category = String(row[3]);
      if (!bookObj.status && row[4]) bookObj.status = String(row[4]);
      if (!bookObj.location && row[5]) bookObj.location = String(row[5]);
      books.push(bookObj);
    }

    return createJsonResponse(books);
  } catch (error) {
    return createJsonResponse({ error: error.toString() });
  }
}

// POST 요청 처리: 도서 예약 접수
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var bookId = String(payload.book_id || "").trim();
    var userName = String(payload.user_name || "").trim();
    var phone = String(payload.phone || "").trim();

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var bookSheet = ss.getSheetByName(SHEET_NAME_BOOKS) || ss.getSheets()[0];
    var resSheet = ss.getSheetByName(SHEET_NAME_RESERVATIONS) || ss.insertSheet(SHEET_NAME_RESERVATIONS);

    // 도서 상태를 '예약중'으로 변경
    var bookData = bookSheet.getDataRange().getValues();
    var title = "";
    for (var r = 1; r < bookData.length; r++) {
      if (String(bookData[r][0]).trim() === bookId) {
        title = bookData[r][1];
        bookSheet.getRange(r + 1, 5).setValue("예약중"); // 상태 열(E열)
        break;
      }
    }

    // 예약 내역 시트에 행 추가
    var nowStr = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
    var resId = "RES-" + Utilities.formatDate(new Date(), "Asia/Seoul", "yyMMdd") + "-" + Math.floor(1000 + Math.random() * 9000);
    resSheet.appendRow([resId, bookId, title, userName, phone, nowStr, "예약접수"]);

    return createJsonResponse({ success: true, reservation_id: resId });
  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gasSampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FBFBFA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Google Apps Script 연동 설정</h3>
              <p className="text-xs text-stone-500">API 엔드포인트 URL 및 연동 상태 관리</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Endpoint Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="gas_url" className="font-semibold text-stone-700">
                Google Apps Script Web App URL
              </label>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-stone-400 hover:text-stone-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>기본 URL 복원</span>
              </button>
            </div>
            <textarea
              id="gas_url"
              rows={2}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full p-2.5 bg-white border border-stone-200 rounded-xl font-mono text-[11px] text-stone-800 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all resize-none"
            />
          </div>

          {/* Test Connection Button & Status */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-700">엔드포인트 실시간 통신 테스트</span>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className="px-3 py-1.5 rounded-lg bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
                <span>연결 테스트</span>
              </button>
            </div>

            {testStatus && (
              <div
                className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                  testStatus === 'success'
                    ? 'bg-emerald-100/60 text-emerald-900 border border-emerald-200'
                    : testStatus === 'gas_error'
                    ? 'bg-amber-100/60 text-amber-900 border border-amber-200'
                    : testStatus === 'error'
                    ? 'bg-rose-100/60 text-rose-900 border border-rose-200'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {statusMessage}
              </div>
            )}
          </div>

          {/* Apps Script Guide Accordion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-700" />
                Google Apps Script 작성 권장 템플릿
              </span>
              <button
                onClick={handleCopyCode}
                className="text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? '복사됨!' : '코드 복사'}</span>
              </button>
            </div>
            <pre className="p-3 bg-stone-900 text-stone-100 rounded-xl font-mono text-[10px] sm:text-[11px] overflow-x-auto leading-relaxed max-h-48 border border-stone-700">
              {gasSampleCode}
            </pre>
          </div>

          {/* Reset local storage button */}
          <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-stone-500">
            <span>로컬 캐시 및 예약 데이터 초기화</span>
            <button
              onClick={handleResetData}
              className="text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
            >
              초기 상태로 리셋
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FAF9F6] border-t border-stone-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            설정 저장
          </button>
        </div>
      </div>
    </div>
  );
};
