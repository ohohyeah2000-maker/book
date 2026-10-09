/**
 * ==============================================================================
 * 늘푸른 도서관 예약 시스템 - Google Apps Script (Code.gs)
 * ==============================================================================
 * 
 * [설정 안내]
 * 1. 구글 드라이브(https://drive.google.com)에서 새 구글 스프레드시트를 생성합니다.
 * 2. 스프레드시트 URL에서 ID를 확인합니다:
 *    예: https://docs.google.com/spreadsheets/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/edit
 *    -> 여기서 "1aBcDeFgHiJkLmNoPqRsTuVwXyZ" 부분이 SPREADSHEET_ID 입니다.
 * 3. 아래 SPREADSHEET_ID 변수에 해당 ID를 입력하세요.
 * 4. 스프레드시트에 다음 2개의 시트 탭을 생성하세요:
 *    - 시트 1 이름: "도서목록"
 *      1행(헤더): book_id | title | author | category | status | location | publisher | published_year | description
 *    - 시트 2 이름: "예약내역"
 *      1행(헤더): reservation_id | book_id | title | user_name | phone | reserved_at | status
 * 5. 상단 메뉴 [배포] -> [새 배포] -> 유형 선택: [웹 앱]
 *    - 설명: 도서관 예약 API v1
 *    - 다음 사용자 권한으로 실행: '나(내 계정)'
 *    - 액세스 권한이 있는 사용자: '모든 사용자(Anyone)' (※ 로그인 없이 요청 가능)
 * 6. 생성된 웹 앱 URL(exec로 끝남)을 웹앱에 연동합니다.
 */

// ⚠️ 여기에 실제 구글 스프레드시트 ID를 입력하세요.
var SPREADSHEET_ID = "여기에_스프레드시트_ID_입력";

var SHEET_NAME_BOOKS = "도서목록";
var SHEET_NAME_RESERVATIONS = "예약내역";

/**
 * GET 요청 처리: 도서 목록 반환
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var bookSheet = ss.getSheetByName(SHEET_NAME_BOOKS);

    // 시트가 없으면 기본 샘플 데이터와 함께 자동 생성
    if (!bookSheet) {
      bookSheet = initSampleSheets(ss);
    }

    var data = bookSheet.getDataRange().getValues();
    if (data.length <= 1) {
      return createJsonResponse([]);
    }

    var headers = data[0].map(function(h) { return String(h).trim().toLowerCase(); });
    var books = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0] && !row[1]) continue; // 빈 행 건너뛰기

      var bookObj = {};
      for (var col = 0; col < headers.length; col++) {
        var key = headers[col];
        var val = row[col];

        // 날짜/숫자 포맷팅 처리
        if (val instanceof Date) {
          val = Utilities.formatDate(val, "Asia/Seoul", "yyyy-MM-dd");
        }
        bookObj[key] = val !== null && val !== undefined ? String(val) : "";
      }

      // 필수 키 정규화
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
    return createJsonResponse({
      success: false,
      error: error.toString(),
      message: "도서 목록을 불러오는 중 오류가 발생했습니다. 스프레드시트 ID 및 시트명을 확인하세요."
    });
  }
}

/**
 * POST 요청 처리: 도서 예약 접수
 * Body: { book_id: string, user_name: string, phone: string }
 */
function doPost(e) {
  try {
    var contents = "";
    if (e && e.postData && e.postData.contents) {
      contents = e.postData.contents;
    }

    if (!contents) {
      return createJsonResponse({
        success: false,
        message: "요청 본문(Body) 데이터가 없습니다."
      });
    }

    var payload = JSON.parse(contents);
    var bookId = String(payload.book_id || "").trim();
    var userName = String(payload.user_name || "").trim();
    var phone = String(payload.phone || "").trim();

    if (!bookId || !userName || !phone) {
      return createJsonResponse({
        success: false,
        message: "book_id, user_name, phone은 필수 입력 항목입니다."
      });
    }

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var bookSheet = ss.getSheetByName(SHEET_NAME_BOOKS);
    var resSheet = ss.getSheetByName(SHEET_NAME_RESERVATIONS);

    if (!resSheet) {
      resSheet = ss.insertSheet(SHEET_NAME_RESERVATIONS);
      resSheet.appendRow(["reservation_id", "book_id", "title", "user_name", "phone", "reserved_at", "status"]);
      resSheet.setFrozenRows(1);
    }

    var bookData = bookSheet.getDataRange().getValues();
    var headers = bookData[0].map(function(h) { return String(h).trim().toLowerCase(); });
    
    var idColIdx = headers.indexOf("book_id");
    if (idColIdx === -1) idColIdx = 0;

    var statusColIdx = headers.indexOf("status");
    if (statusColIdx === -1) statusColIdx = 4;

    var titleColIdx = headers.indexOf("title");
    if (titleColIdx === -1) titleColIdx = 1;

    var targetRowIdx = -1;
    var targetBookTitle = "";

    // 예약 대상 도서 찾기
    for (var r = 1; r < bookData.length; r++) {
      if (String(bookData[r][idColIdx]).trim() === bookId) {
        targetRowIdx = r + 1; // 1-based index in Sheet
        targetBookTitle = String(bookData[r][titleColIdx] || "");
        var currentStatus = String(bookData[r][statusColIdx] || "").trim();
        
        if (currentStatus !== "예약가능" && currentStatus !== "대출가능" && currentStatus !== "") {
          return createJsonResponse({
            success: false,
            message: "해당 도서는 현재 이미 대출 또는 예약 중이어서 예약할 수 없습니다. (현재 상태: " + currentStatus + ")"
          });
        }
        break;
      }
    }

    if (targetRowIdx === -1) {
      return createJsonResponse({
        success: false,
        message: "일치하는 도서 번호(" + bookId + ")를 찾을 수 없습니다."
      });
    }

    // 도서 상태를 '예약중'으로 변경
    bookSheet.getRange(targetRowIdx, statusColIdx + 1).setValue("예약중");

    // 예약 번호 및 일시 생성
    var now = new Date();
    var nowStr = Utilities.formatDate(now, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
    var resId = "RES-" + Utilities.formatDate(now, "Asia/Seoul", "yyMMdd") + "-" + Math.floor(1000 + Math.random() * 9000);

    // 예약 내역 시트에 행 추가
    resSheet.appendRow([
      resId,
      bookId,
      targetBookTitle,
      userName,
      phone,
      nowStr,
      "예약접수"
    ]);

    return createJsonResponse({
      success: true,
      message: "도서 예약이 정상적으로 접수되었습니다.",
      reservation_id: resId,
      book_id: bookId,
      title: targetBookTitle,
      user_name: userName,
      reserved_at: nowStr
    });
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString(),
      message: "예약 처리 중 오류가 발생했습니다: " + error.message
    });
  }
}

/**
 * JSON 응답 생성 헬퍼 (CORS 및 UTF-8 지원)
 */
function createJsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * 시트가 비어있을 때 기초 샘플 도서 데이터를 자동 생성해주는 함수
 */
function initSampleSheets(ss) {
  var bookSheet = ss.getSheetByName(SHEET_NAME_BOOKS) || ss.insertSheet(SHEET_NAME_BOOKS);
  bookSheet.clear();
  
  // 헤더 생성
  bookSheet.appendRow([
    "book_id", "title", "author", "category", "status", "location", "publisher", "published_year", "description"
  ]);

  // 기본 도서 목록 데이터 추가
  var sampleBooks = [
    ["BK-1001", "클린 코드 (Clean Code)", "로버트 C. 마틴", "IT/기술", "예약가능", "2층 디지털자료실 [005.1 마887]", "인사이트", "2013", "애자일 소프트웨어 장인 정신을 구현하는 깨끗한 코드 작성법."],
    ["BK-1002", "모던 자바스크립트 Deep Dive", "이웅모", "IT/기술", "예약가능", "2층 디지털자료실 [005.138 이67]", "위키북스", "2020", "자바스크립트 기본 개념과 동작 원리를 심도 있게 다루는 기본서."],
    ["BK-1003", "소년이 온다", "한강", "문학/소설", "대출중", "1층 종합자료실 [813.7 한19]", "창비", "2014", "인간의 존엄성과 상처를 섬세한 문체로 응시하는 노벨문학상 수상 작가의 대표작."],
    ["BK-1004", "채식주의자", "한강", "문학/소설", "예약가능", "1층 종합자료실 [813.7 한19c]", "창비", "2022", "식물이 되고자 했던 여성의 고투를 그린 연작 소설."],
    ["BK-1005", "사피엔스 (Sapiens)", "유발 하라리", "인문/역사", "예약가능", "3층 인문사회실 [909 하294]", "김영사", "2015", "유인원에서 우주 탐사선까지 인류 역사의 거대한 질문들."],
    ["BK-1006", "코스모스 (Cosmos)", "칼 세이건", "과학/자연", "예약중", "3층 자연과학실 [440.4 세68]", "사이언스북스", "2006", "우주와 인류의 기원을 탐험하는 위대한 과학 고전."],
    ["BK-1007", "불편한 편의점", "김호연", "문학/소설", "예약가능", "1층 종합자료실 [813.7 김95]", "나무옆의자", "2021", "동네 작은 편의점에서 오고 가는 따뜻한 위로와 치유의 이야기."],
    ["BK-1008", "도둑맞은 집중력", "요한 하리", "인문/사회", "예약가능", "3층 인문사회실 [331.54 하298]", "어크로스", "2023", "현대 사회에서 집중력을 되찾기 위한 심층 분석과 해법."]
  ];

  sampleBooks.forEach(function(row) {
    bookSheet.appendRow(row);
  });

  bookSheet.setFrozenRows(1);
  return bookSheet;
}
