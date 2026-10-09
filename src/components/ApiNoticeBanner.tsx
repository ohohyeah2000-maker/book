import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, ExternalLink, Settings, CheckCircle2 } from 'lucide-react';

interface ApiNoticeBannerProps {
  isMockFallback: boolean;
  message?: string;
  onOpenSettings: () => void;
}

export const ApiNoticeBanner: React.FC<ApiNoticeBannerProps> = ({
  isMockFallback,
  message,
  onOpenSettings,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isMockFallback && !message) {
    return null;
  }

  const isSpreadsheetIdError = message?.includes('스프레드시트 ID') || message?.includes('Illegal spreadsheet id');

  return (
    <div className="bg-amber-50/70 border-b border-amber-200/60 px-4 py-3 sm:px-6 text-xs text-amber-900 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-start sm:items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <span className="font-semibold text-amber-950">
              {isSpreadsheetIdError ? 'Google Apps Script 설정 안내:' : '안내:'}
            </span>{' '}
            <span className="text-amber-900/90">
              {isSpreadsheetIdError
                ? 'Apps Script 코드 내에 실제 Google 스프레드시트 ID가 연결되지 않은 상태입니다. 현재는 테스트용 도서 데이터로 예약 및 조회가 원활히 동작합니다.'
                : (message || '로컬 백업 데이터를 사용 중입니다.')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-amber-800 hover:text-amber-950 font-medium px-2 py-1 rounded hover:bg-amber-100/60 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? '접기' : '자세히 보기'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200/80 text-amber-950 font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-amber-800" />
            <span>엔드포인트 설정</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-amber-200/60 text-amber-900/90 leading-relaxed space-y-2">
          <div className="bg-white/80 p-3 rounded-lg border border-amber-200/70 text-[11px] sm:text-xs">
            <h4 className="font-semibold text-amber-950 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              실제 Google 스프레드시트와 실시간 연동하는 방법
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-stone-700">
              <li>Google Drive에서 신규 스프레드시트를 생성하고 시트 URL의 <code className="bg-amber-100/70 px-1 py-0.5 rounded text-amber-900 font-mono">/d/스프레드시트ID/edit</code> 부분의 ID를 복사합니다.</li>
              <li>Google Apps Script 편집기(Code.gs) 6번째 줄의 <code className="bg-amber-100/70 px-1 py-0.5 rounded text-amber-900 font-mono">"여기에_스프레드시트_ID_입력"</code>을 복사한 ID로 교체합니다.</li>
              <li>[배포] &gt; [새 배포] &gt; [웹 앱]으로 다시 배포한 후, 생성된 URL을 '엔드포인트 설정'에 입력하면 실시간 시트 데이터가 즉시 연동됩니다.</li>
            </ol>
            <p className="mt-2 text-stone-500 text-[11px]">
              * 현재 모드에서도 화면에서 '예약하기'를 누르면 요청 규격에 맞춰 Apps Script로 실제 POST를 전송하고, 화면의 도서 상태도 즉시 '예약중'으로 갱신됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
