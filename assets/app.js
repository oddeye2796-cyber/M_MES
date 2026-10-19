/* 자동차부품 제조업 MES — 목업 UI (예시 데이터, 브라우저 안에서만 동작)
   화면 명세: assets/data.js (원본 소스의 메뉴·조회조건·그리드 컬럼), 번역: assets/i18n.js */
(function () {
  'use strict';
  var D = window.MES_DATA, TR = window.MES_I18N || {};
  var TODAY = new Date(2026, 9, 19, 9, 30);
  var root = document.getElementById('root');

  /* ---------------- 저장소 ---------------- */
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 사생활 보호 모드 */ } }
  function ssGet(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 무시 */ } }

  /* ---------------- 다국어 ---------------- */
  var LANG = lsGet('mes.lang', 'ko');
  if (['ko', 'en', 'ja'].indexOf(LANG) < 0) LANG = 'ko';
  var UI = {
    '자동차부품 제조업 MES': ['Auto Parts MES', '自動車部品製造業 MES'],
    '제조실행시스템': ['Manufacturing Execution System', '製造実行システム'],
    '연결된 공장': ['Connected plant', '接続中の工場'], '정상': ['Normal', '正常'], '본사 · 1공장 / 2공장': ['HQ · Plant 1 / Plant 2', '本社・第1工場/第2工場'],
    '메뉴': ['Menu', 'メニュー'], '화면 이름이나 화면 ID로 찾기': ['Find a screen by name or ID', '画面名または画面IDで検索'],
    '찾는 화면이 없습니다': ['No matching screen', '該当する画面がありません'],
    '언어': ['Language', '言語'], '테마 전환': ['Toggle theme', 'テーマ切替'], '알림': ['Notifications', '通知'], '로그아웃': ['Log out', 'ログアウト'], '남음': ['left', '残り'], '인라인': ['Inline', 'インライン'], '측정실': ['Measuring Room', '測定室'], '일시': ['Date/Time', '日時'], '적합/부적합': ['Pass/Fail', '適合/不適合'], '직접입력': ['Direct Input', '直接入力'], '체크': ['Check', 'チェック'],
    '조회 조건': ['Search conditions', '検索条件'], '검색': ['Search', '検索'], '초기화': ['Reset', '初期化'], '전체': ['All', '全体'],
    '전체 : ': ['Total: ', '全体:'], ' 건': [' rows', '件'], '합계': ['Total', '合計'], '조회된 데이터가 없습니다': ['No data found', '該当データがありません'],
    '선택': ['Select', '選択'], '저장': ['Save', '保存'], '취소': ['Cancel', 'キャンセル'], '닫기': ['Close', '閉じる'], '확인': ['OK', '確認'], '삭제': ['Delete', '削除'],
    '등록': ['Register', '登録'], '수정': ['Edit', '修正'], '추가': ['Add', '追加'],
    '행을 먼저 선택하세요': ['Select a row first', '先に行を選択してください'],
    '선택한 행을 삭제할까요?': ['Delete the selected row?', '選択した行を削除しますか?'],
    '목록의 모든 행을 삭제할까요?': ['Delete all rows in the list?', '一覧のすべての行を削除しますか?'],
    '삭제했습니다': ['Deleted', '削除しました'], '저장했습니다': ['Saved', '保存しました'], '등록했습니다': ['Registered', '登録しました'], '수정했습니다': ['Updated', '修正しました'],
    '저장하지 않은 변경을 되돌렸습니다': ['Unsaved changes reverted', '未保存の変更を元に戻しました'],
    '엑셀 파일을 내려받았습니다': ['Excel file downloaded', 'Excelファイルをダウンロードしました'],
    '엑셀 업로드': ['Excel Upload', 'Excelアップロード'], '파일을 선택하세요 (CSV·XLSX)': ['Choose a file (CSV/XLSX)', 'ファイルを選択してください(CSV・XLSX)'],
    '샘플 양식의 컬럼 순서대로 작성한 파일을 올리면 목록에 추가됩니다.': ['Rows from a file written in the sample layout are added to the list.', 'サンプル様式の列順で作成したファイルをアップロードすると一覧に追加されます。'],
    '건을 업로드했습니다': [' rows uploaded', '件をアップロードしました'], '업로드': ['Upload', 'アップロード'],
    '처리할까요?': ['Proceed?', '処理しますか?'], '처리했습니다': ['Done', '処理しました'], '선택한 행': ['Selected row', '選択行'],
    '품목 검색': ['Item Search', '品目検索'], '설비 검색': ['Equipment Search', '設備検索'], '코드나 이름 입력': ['Type a code or name', 'コードまたは名称を入力'],
    '목록': ['List', '一覧'], '상세': ['Detail', '詳細'], '추이': ['Trend', '推移'], '현황 차트': ['Status chart', '現況チャート'],
    '로그인': ['Log in', 'ログイン'], '공정': ['Process', '工程'], '부서': ['Department', '部署'], '부서(공정) 선택': ['Department (process)', '部署(工程)選択'],
    '아이디': ['User ID', 'ユーザーID'], '패스워드': ['Password', 'パスワード'], '패스워드를 입력하세요': ['Enter the password', 'パスワードを入力してください'],
    '계정을 고르고 아무 패스워드나 입력하면 들어갑니다 (목업)': ['Pick an account and type any password (mockup)', 'アカウントを選び任意のパスワードで入れます(モックアップ)'],
    '생산·품질·설비를 한 화면에서': ['Production, quality and equipment in one place', '生産・品質・設備をひとつの画面で'],
    '생산관리자': ['Production manager', '生産管理者'], '시스템 관리자': ['System administrator', 'システム管理者'], '현장 작업자': ['Shop-floor operator', '現場作業者'],
    '계획수량': ['Planned Qty', '計画数量'], '생산수량': ['Produced Qty', '生産数量'], '달성률': ['Achievement', '達成率'], '종합효율(OEE)': ['OEE', '総合効率(OEE)'],
    '오늘': ['Today', '本日'], '전일 대비': ['vs. yesterday', '前日比'], '라인별 생산현황': ['Production by line', 'ライン別生産現況'], '설비 가동현황': ['Equipment operation', '設備稼働現況'],
    '시간대별 생산': ['Hourly production', '時間帯別生産'], '가동': ['Running', '稼働'], '비가동': ['Idle', '非稼働'], '고장': ['Breakdown', '故障'], '계획정지': ['Planned stop', '計画停止'],
    '실시간': ['Live', 'リアルタイム'], '정지됨': ['Paused', '停止中'], '갱신 주기': ['Refresh', '更新周期'], '초': ['s', '秒'],
    '팀별 월 달성률': ['Monthly achievement by team', 'チーム別月間達成率'], '월별 실적': ['Monthly results', '月別実績'], '계획': ['Plan', '計画'],
    '라인선택': ['Line', 'ライン選択'], '설비선택': ['Equipment', '設備選択'], '설비 상세': ['Equipment detail', '設備詳細'], '배치도에서 설비를 누르세요': ['Click equipment on the layout', '配置図で設備をクリックしてください'],
    '현재 작업지시': ['Current work order', '現在の作業指示'], '가동률': ['Utilization', '稼働率'], '상태': ['Status', '状態'], '가공동': ['Machining bay', '加工棟'], '조립동': ['Assembly bay', '組立棟'], '열처리동': ['Heat treatment bay', '熱処理棟'],
    '작업 시작': ['Start Work', '作業開始'], '작업 종료': ['End Work', '作業終了'], '실적 등록': ['Report Output', '実績登録'], '불량 등록': ['Report Defect', '不良登録'], '비가동 등록': ['Report Downtime', '非稼働登録'], '자재 요청': ['Request Parts', '資材要求'],
    '작업 이력': ['Work log', '作業履歴'], '진행 중인 작업지시': ['Active work orders', '進行中の作業指示'], '양품': ['Good', '良品'], '불량': ['Defect', '不良'],
    '작업지시를 고르세요': ['Pick a work order', '作業指示を選択してください'], '작업을 먼저 시작하세요': ['Start the work first', '先に作業を開始してください'],
    '바코드 스캔': ['Scan barcode', 'バーコードスキャン'], '스캔': ['Scan', 'スキャン'], '바코드를 스캔하거나 입력하세요': ['Scan or type a barcode', 'バーコードをスキャンまたは入力'],
    '스캔 목록': ['Scanned items', 'スキャン一覧'], '전송했습니다': ['Sent', '送信しました'], '전송할 항목이 없습니다': ['Nothing to send', '送信する項目がありません'],
    '전송 이력': ['Transmission history', '送信履歴'], '현장 단말 화면': ['Handheld terminal', '現場端末画面'],
    '기대번호': ['Unit No.', '機台番号'], 'PIN 번호': ['PIN No.', 'PIN番号'], '기대합부': ['Unit pass/fail', '機台合否'],
    '정비 등록 대상': ['Unit for maintenance', '整備登録対象'], '바코드를 읽으면 기대 정보가 표시됩니다': ['Read a barcode to show the unit', 'バーコードを読むと機台情報が表示されます'],
    '자동 로그아웃 시간(분)': ['Auto logout (min)', '自動ログアウト時間(分)'], '비밀번호 오류 허용 횟수': ['Allowed password failures', 'パスワード誤り許容回数'],
    '비밀번호 유효기간(일)': ['Password validity (days)', 'パスワード有効期間(日)'], '데이터 수집 주기(초)': ['Data collection interval (s)', 'データ収集周期(秒)'],
    '모니터링 갱신 주기(초)': ['Monitoring refresh (s)', 'モニタリング更新周期(秒)'], '설정을 기본값으로 되돌렸습니다': ['Settings reset to defaults', '設定を既定値に戻しました'],
    '성명': ['Name', '氏名'], '권한그룹': ['Role group', '権限グループ'], '현재 비밀번호': ['Current password', '現在のパスワード'], '새 비밀번호': ['New password', '新しいパスワード'], '새 비밀번호 확인': ['Confirm new password', '新しいパスワード(確認)'],
    '새 비밀번호가 서로 다릅니다': ['New passwords do not match', '新しいパスワードが一致しません'], '비밀번호는 8자 이상이어야 합니다': ['Password must be 8+ characters', 'パスワードは8文字以上にしてください'], '비밀번호를 바꿨습니다': ['Password changed', 'パスワードを変更しました'],
    '근무일': ['Work day', '勤務日'], '휴일': ['Holiday', '休日'], '설비 고장 접수: ': ['Breakdown reported: ', '設備故障受付:'], '부품 요청: ': ['Parts request: ', '部品要求:'], '표준서 개정: ': ['Standard revised: ', '標準書改訂:'],
    '분 전': [' min ago', '分前'], '시간 전': [' h ago', '時間前'], '필수 입력': ['Required', '必須入力'], '입력값을 확인하세요': ['Check the input', '入力値を確認してください'],
    '팝업 차단 없이 이 화면에서 POP를 이어서 씁니다.': ['The POP opens right here, no pop-up window needed.', 'ポップアップなしでこの画面でPOPを続けて使います。'],
    '바코드R': ['Read Barcode', 'バーコード読取'], '사용': ['In use', '使用'], '미사용': ['Not used', '未使用'], '양호': ['Good', '良好'], '조치완료': ['Resolved', '措置完了'], '별도수리': ['Separate repair', '別途修理'],
    '완료': ['Done', '完了'], '미완료': ['Not done', '未完了'], '카운트': ['Count', 'カウント'], '일': ['', '日'],
    '화면 ID': ['Screen ID', '画面ID'], '예시 데이터': ['Sample data', 'サンプルデータ'],
    '생산1팀(가공)': ['Production Team 1 (Machining)', '生産1チーム(加工)'], '생산2팀(조립)': ['Production Team 2 (Assembly)', '生産2チーム(組立)'],
    '건': [' rows', '件'], '분': [' min', '分'], '%': ['%', '%'], '시': [':00', '時']
  };
  function t(s) {
    if (s == null) return '';
    s = String(s);
    if (LANG === 'ko') return s;
    var i = LANG === 'en' ? 0 : 1, d = TR[s] || UI[s] || TR[s.trim()] || UI[s.trim()];
    if (d) return d[i];
    var m = s.match(/^(\d+)일$/); if (m) return LANG === 'en' ? 'D' + m[1] : m[1] + '日';
    m = s.match(/^(\d+)월$/); if (m) return LANG === 'en' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m[1] - 1] : m[1] + '月';
    m = s.match(/^(\d+|TOTAL)_(.+)$/); if (m && (TR[m[2]] || UI[m[2]])) return (m[1] === 'TOTAL' ? t('합계') : t(m[1] + '일')) + ' ' + t(m[2]);
    return s;
  }

  /* ---------------- 공통 함수 ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var a = hash(String(seed)); return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var x = Math.imul(a ^ a >>> 15, 1 | a); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; }; }
  function ri(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function pad(n, w) { n = String(n); while (n.length < (w || 2)) n = '0' + n; return n; }
  function fmtDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fmtDT(d) { return fmtDate(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function nf(n, dig) { return Number(n).toLocaleString(LANG === 'ja' ? 'ja-JP' : LANG === 'en' ? 'en-US' : 'ko-KR', { maximumFractionDigits: dig == null ? 1 : dig }); }
  var toastT;
  function toast(msg, kind) {
    var el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.style.borderColor = kind === 'err' ? 'var(--crit)' : ''; el.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2400);
  }

  /* ---------------- 예시 데이터 어휘 (ko/en/ja) ---------------- */
  var V = {
    item: [['감속기 하우징 A', 'Reducer Housing A', '減速機ハウジングA'], ['감속기 하우징 B', 'Reducer Housing B', '減速機ハウジングB'], ['미션 케이스', 'Transmission Case', 'ミッションケース'], ['입력축 기어', 'Input Shaft Gear', '入力軸ギア'], ['출력축 기어', 'Output Shaft Gear', '出力軸ギア'], ['유성기어 캐리어', 'Planetary Carrier', '遊星キャリア'], ['PTO 샤프트', 'PTO Shaft', 'PTOシャフト'], ['디퍼렌셜 케이스', 'Differential Case', 'デフケース'], ['링 기어', 'Ring Gear', 'リングギア'], ['피니언 기어', 'Pinion Gear', 'ピニオンギア'], ['클러치 하우징', 'Clutch Housing', 'クラッチハウジング'], ['브레이크 드럼', 'Brake Drum', 'ブレーキドラム'], ['메인 샤프트', 'Main Shaft', 'メインシャフト'], ['카운터 기어', 'Counter Gear', 'カウンターギア']],
    line: [['가공1라인', 'Machining Line 1', '加工1ライン'], ['가공2라인', 'Machining Line 2', '加工2ライン'], ['가공3라인', 'Machining Line 3', '加工3ライン'], ['기어가공라인', 'Gear Machining Line', 'ギア加工ライン'], ['열처리라인', 'Heat Treatment Line', '熱処理ライン'], ['조립1라인', 'Assembly Line 1', '組立1ライン'], ['조립2라인', 'Assembly Line 2', '組立2ライン'], ['서브조립라인', 'Sub-assembly Line', 'サブ組立ライン']],
    proc: [['선삭', 'Turning', '旋削'], ['밀링', 'Milling', 'フライス'], ['호빙', 'Hobbing', 'ホブ加工'], ['연삭', 'Grinding', '研削'], ['열처리', 'Heat Treatment', '熱処理'], ['세척', 'Washing', '洗浄'], ['압입', 'Press Fit', '圧入'], ['체결', 'Fastening', '締結'], ['리크테스트', 'Leak Test', 'リークテスト'], ['최종검사', 'Final Inspection', '最終検査']],
    eq: [['CNC 선반 #1', 'CNC Lathe #1', 'CNC旋盤 #1'], ['머시닝센터 #2', 'Machining Center #2', 'マシニングセンタ #2'], ['호빙기 #3', 'Hobbing Machine #3', 'ホブ盤 #3'], ['연삭기 #4', 'Grinder #4', '研削盤 #4'], ['연속로 #5', 'Continuous Furnace #5', '連続炉 #5'], ['세척기 #6', 'Washer #6', '洗浄機 #6'], ['압입기 #7', 'Press-fit Machine #7', '圧入機 #7'], ['너트러너 #8', 'Nutrunner #8', 'ナットランナー #8'], ['리크테스터 #9', 'Leak Tester #9', 'リークテスター #9'], ['컨베이어 #10', 'Conveyor #10', 'コンベヤ #10'], ['리프트 #11', 'Lift #11', 'リフト #11'], ['비전검사기 #12', 'Vision Inspector #12', 'ビジョン検査機 #12']],
    person: [['김민준', 'Kim Min-jun', 'キム・ミンジュン'], ['이서연', 'Lee Seo-yeon', 'イ・ソヨン'], ['박지훈', 'Park Ji-hoon', 'パク・ジフン'], ['최수아', 'Choi Su-a', 'チェ・スア'], ['정도윤', 'Jung Do-yun', 'チョン・ドユン'], ['강하은', 'Kang Ha-eun', 'カン・ハウン'], ['윤시우', 'Yoon Si-woo', 'ユン・シウ'], ['조예린', 'Cho Ye-rin', 'チョ・イェリン'], ['한지호', 'Han Ji-ho', 'ハン・ジホ'], ['오나연', 'Oh Na-yeon', 'オ・ナヨン']],
    dept: [['생산1팀(가공)', 'Production Team 1 (Machining)', '生産1チーム(加工)'], ['생산2팀(조립)', 'Production Team 2 (Assembly)', '生産2チーム(組立)'], ['품질관리팀', 'Quality Control Team', '品質管理チーム'], ['설비보전팀', 'Maintenance Team', '設備保全チーム'], ['생산관리팀', 'Production Control Team', '生産管理チーム'], ['자재팀', 'Materials Team', '資材チーム']],
    wg: [['가공1반', 'Machining Crew 1', '加工1班'], ['가공2반', 'Machining Crew 2', '加工2班'], ['가공3반', 'Machining Crew 3', '加工3班'], ['조립1반', 'Assembly Crew 1', '組立1班'], ['조립2반', 'Assembly Crew 2', '組立2班'], ['검사반', 'Inspection Crew', '検査班']],
    cust: [['고객사 A', 'Customer A', '顧客A'], ['고객사 B', 'Customer B', '顧客B'], ['고객사 C', 'Customer C', '顧客C'], ['협력사 D', 'Supplier D', '協力会社D'], ['협력사 E', 'Supplier E', '協力会社E'], ['외주사 F', 'Subcontractor F', '外注先F']],
    plant: [['1공장', 'Plant 1', '第1工場'], ['2공장', 'Plant 2', '第2工場']],
    status: [['대기', 'Waiting', '待機'], ['진행중', 'In Progress', '進行中'], ['완료', 'Completed', '完了'], ['보류', 'On Hold', '保留']],
    eqst: [['가동', 'Running', '稼働'], ['비가동', 'Idle', '非稼働'], ['고장', 'Breakdown', '故障'], ['계획정지', 'Planned Stop', '計画停止']],
    type: [['가공', 'Machining', '加工'], ['조립', 'Assembly', '組立'], ['검사', 'Inspection', '検査'], ['열처리', 'Heat Treatment', '熱処理']],
    model: [['소형', 'Small', '小型'], ['중형', 'Medium', '中型'], ['대형', 'Large', '大型']],
    defect: [['치수불량', 'Dimension NG', '寸法不良'], ['외관불량', 'Appearance NG', '外観不良'], ['소재불량', 'Material NG', '素材不良'], ['가공불량', 'Machining NG', '加工不良'], ['조립불량', 'Assembly NG', '組立不良'], ['누유', 'Oil Leak', '油漏れ'], ['토크불량', 'Torque NG', 'トルク不良']],
    loss: [['계획정지', 'Planned Stop', '計画停止'], ['설비고장', 'Breakdown', '設備故障'], ['자재대기', 'Waiting for Material', '資材待ち'], ['품질문제', 'Quality Issue', '品質問題'], ['공구교체', 'Tool Change', '工具交換'], ['기종변경', 'Model Change', '機種切替']],
    check: [['오일 레벨 확인', 'Check oil level', 'オイルレベル確認'], ['에어 압력 확인', 'Check air pressure', 'エア圧確認'], ['척 클램프 상태', 'Chuck clamp condition', 'チャッククランプ状態'], ['절삭유 농도', 'Coolant concentration', '切削油濃度'], ['안전커버 작동', 'Safety cover operation', '安全カバー動作'], ['토크 교정값', 'Torque calibration', 'トルク校正値'], ['베어링 소음', 'Bearing noise', 'ベアリング騒音']],
    remark: [['특이사항 없음', 'No issues', '特記事項なし'], ['긴급 오더', 'Rush order', '緊急オーダー'], ['재작업 후 합격', 'Passed after rework', '再作業後合格'], ['공구 교체 완료', 'Tool replaced', '工具交換済み'], ['고객 요청 반영', 'Per customer request', '顧客要望反映'], ['점검 후 정상', 'Normal after check', '点検後正常']],
    wh: [['자재창고', 'Material Warehouse', '資材倉庫'], ['공정창고', 'WIP Warehouse', '工程倉庫'], ['완제품창고', 'Finished Goods Warehouse', '完成品倉庫'], ['출하창고', 'Shipping Warehouse', '出荷倉庫']],
    shift: [['주간', 'Day', '日勤'], ['야간', 'Night', '夜勤'], ['잔업', 'Overtime', '残業']],
    role: [['시스템관리자', 'System Admin', 'システム管理者'], ['생산관리자', 'Production Manager', '生産管理者'], ['품질담당', 'Quality', '品質担当'], ['현장작업자', 'Operator', '現場作業者'], ['설비담당', 'Maintenance', '設備担当']],
    pos: [['팀장', 'Team Lead', 'チーム長'], ['반장', 'Foreman', '班長'], ['사원', 'Staff', '社員'], ['대리', 'Asst. Manager', '代理']],
    week: [['일', 'Sun', '日'], ['월', 'Mon', '月'], ['화', 'Tue', '火'], ['수', 'Wed', '水'], ['목', 'Thu', '木'], ['금', 'Fri', '金'], ['토', 'Sat', '土']],
    use: [['사용', 'In use', '使用'], ['미사용', 'Not used', '未使用']],
    screen: [['월별생산계획 등록', 'Monthly Plan', '月別生産計画登録'], ['작업지시 현황(가공)', 'Work Orders (Machining)', '作業指示現況(加工)'], ['LOT추적', 'LOT Trace', 'LOT追跡'], ['설비 마스터 관리', 'Equipment Master', '設備マスタ管理'], ['품목관리', 'Items', '品目管理']],
    work: [['조회', 'View', '照会'], ['등록', 'Create', '登録'], ['수정', 'Update', '修正'], ['삭제', 'Delete', '削除'], ['엑셀 다운로드', 'Excel Download', 'Excelダウンロード']]
  };
  var LI = LANG === 'ko' ? 0 : LANG === 'en' ? 1 : 2;
  function vt(k, i) { var a = V[k]; return a ? a[i % a.length][LI] : ''; }
  function tok(k, i) { return '§' + k + ':' + i; }
  function show(v) {
    if (v === true) return '✓';
    if (v === false || v == null) return '';
    if (typeof v === 'number') return nf(v);
    if (typeof v === 'string' && v.charAt(0) === '§') { var p = v.slice(1).split(':'); return vt(p[0], +p[1]); }
    if (typeof v === 'string' && v.charAt(0) === '¶') return t(v.slice(1));
    return String(v);
  }
  function itemCode(i) { return 'GT-' + pad(24 + (i % 3), 2) + ['A', 'B', 'C', 'D'][i % 4] + '-' + pad(101 + i * 7, 4); }
  function lineCode(i) { return (i < 5 ? 'LM' : 'LA') + pad(i + 1, 2); }
  function procCode(i) { return 'P' + pad((i + 1) * 10, 3); }
  function eqCode(i) { return 'EQ-' + pad(i + 1, 3); }

  /* ---------------- 컬럼 종류 판별 ---------------- */
  function kindOf(lab, type, en) {
    var L = lab.replace(/\s+/g, '');
    if (en) return 'enum';
    if (type === 'Bool') return 'bool';
    if (/^(No\.?|NO\.?|순번|순서|항목순서|생산순번|처리순번|지시순번|표시순서)$/.test(L)) return 'idx';
    if (/^(\d+|TOTAL)_/.test(L) || /^\d+일$/.test(L) || /^\d+월$/.test(L)) return 'qty';
    if (/요일/.test(L)) return 'week';
    if (/(율|률|%|OEE|효율)/.test(L) && !/코드/.test(L)) return 'rate';
    if (/(금액|가격|임율)/.test(L)) return 'money';
    if (/^(\(\d\d\)|[①-⑫]|Pn_|Do_|●|■)/.test(L) || /입고$/.test(L)) return 'date';
    if (/(일시|시각$|^작업(시작|종료)$|(고장|비가동|공정|지연시간_)(시작|종료)|^지연 (시작|종료)시간$|^(시작|종료)시간$|요청일시|작업지시시각)/.test(L)) return 'dt';
    if (/년월/.test(L)) return 'ym';
    if (/(년도|생산년도)/.test(L)) return 'year';
    if (/(일자|날짜|일$|착수일|교체일|예정일|검사일|제작일)/.test(L) && !/(주기|여부)/.test(L)) return 'date';
    if (/(시간|분\)|^경과분$|공수|손실|지각|외출|조퇴)/.test(L) && !/(코드|명|명칭|사유|구분)/.test(L)) return 'dur';
    if (/(수량|량$|실적$|계획$|^생산|양품|불량수량|대수|인원|건수|L\/O|LineOut|잔량|작업자수|체크수량|기어비)/.test(L) && !/(코드|명$|유형|원인|내역|여부)/.test(L)) return 'qty';
    if (/(전송여부|처리여부|완료여부|승인여부|보전팀여부|담당여부|정비여부|검사대상|보전대상|^Y\/N$|^대표$|열처리$|BOP확인|합부)/.test(L)) return 'yn';
    if (/(검사결과|TEST결과|판정)$/.test(L)) return 'okng';
    if (/사용여부|사용유무/.test(L)) return 'use';
    if (/(품목코드|품번|제품코드|자품코드|부품코드|미부착부품코드|지연품목$|제품번호|항목코드)/.test(L)) return 'icode';
    if (/(품목명|품명|제품명|자품명|부품명|미부착부품|지연품목명|모델명|^제품$|항목명|금형이름)/.test(L)) return 'item';
    if (/(도면번호|도번)/.test(L)) return 'draw';
    if (/라인코드/.test(L)) return 'lcode';
    if (/(라인명|^라인$|작업라인|대표라인|물리라인)/.test(L)) return 'line';
    if (/(공정코드)/.test(L)) return 'pcode';
    if (/(공정명|^공정$|공정구분)/.test(L)) return 'proc';
    if (/(설비코드|설비번호|장비코드|장비ID|자산번호)/.test(L)) return 'ecode';
    if (/(설비명|장비명|^설비$|설비위치)/.test(L)) return 'eq';
    if (/(작업지시번호|보전지시번호|지시번호)/.test(L)) return 'wo';
    if (/(기대번호|^기대|엔진번호|일련번호|PIN|검사번호|ODM)/.test(L)) return 'serial';
    if (/차량번호/.test(L)) return 'vin';
    if (/LOT|Lot/.test(L)) return 'lot';
    if (/바코드/.test(L)) return 'barcode';
    if (/(고장접수번호|관리번호)/.test(L)) return 'docno';
    if (/(거래처코드|사유업체$|업체코드)/.test(L)) return 'ccode';
    if (/(거래처|고객|공급처|업체|제작회사|귀책처명|출하처)/.test(L)) return 'cust';
    if (/(사번|사원코드|등록사원$|수정사원$|사용자ID|작업자ID)/.test(L)) return 'emp';
    if (/(작업자|담당자|등록자|작성자|처리자|승인자|요청자|사원명|성명|이름|사용자$|사용자명)/.test(L)) return 'person';
    if (/부서코드/.test(L)) return 'dcode';
    if (/(부서|팀$|대상팀)/.test(L)) return 'dept';
    if (/작업반코드/.test(L)) return 'wcode';
    if (/작업반/.test(L)) return 'wg';
    if (/(공장|사업장)/.test(L)) return 'plant';
    if (/창고코드/.test(L)) return 'whcode';
    if (/창고/.test(L)) return 'wh';
    if (/로케이션|위치/.test(L)) return 'loc';
    if (/(비가동명|고장명칭|비가동명칭|손실유형)/.test(L)) return 'loss';
    if (/(비가동코드|고장코드|^코드$|상위코드|화면ID|ERP)/.test(L)) return 'code';
    if (/(불량|결함|문제|원인)/.test(L)) return 'defect';
    if (/(상태|진행|처리결과)/.test(L)) return 'status';
    if (/(기종)/.test(L)) return 'model';
    if (/(구분|유형|분류)/.test(L)) return 'type';
    if (/(점검|검사항목|관리기준|확인|부위|측정|체크)/.test(L)) return 'check';
    if (/(근무)/.test(L)) return 'shift';
    if (/(권한)/.test(L)) return 'role';
    if (/직책/.test(L)) return 'pos';
    if (/화면명/.test(L)) return 'screen';
    if (/작업내용/.test(L)) return 'work';
    if (/(SPEC|기준값|최대값|최소값)/.test(L)) return 'spec';
    if (/IP/.test(L)) return 'ip';
    if (/(연락처)/.test(L)) return 'tel';
    if (/(이메일)/.test(L)) return 'mail';
    if (/(비고|사유|조치|참고|내역|내용|정보|메모)/.test(L)) return 'remark';
    if (/모드/.test(L)) return 'mode';
    if (/(가로|세로|높이|두께|폭|피치|단위|주기)/.test(L)) return 'qty';
    if (type === 'Float' || type === 'Int') return 'qty';
    if (type === 'Date') return 'date';
    return 'text';
  }
  var TOKEN_KIND = { item: 'item', line: 'line', proc: 'proc', eq: 'eq', person: 'person', dept: 'dept', wg: 'wg', cust: 'cust', plant: 'plant', status: 'status', type: 'type', model: 'model', defect: 'defect', loss: 'loss', check: 'check', remark: 'remark', wh: 'wh', shift: 'shift', role: 'role', pos: 'pos', week: 'week', use: 'use', screen: 'screen', work: 'work' };
  var NUMK = { idx: 1, qty: 1, rate: 1, money: 1, dur: 1 };

  function colsOf(g) {
    return g.c.map(function (c) { return { lab: c[0], type: c[1], align: c[2], w: c[4], en: c[5], kind: kindOf(c[0], c[1], c[5]) }; });
  }
  function enumOpts(en) { return en ? en.slice(1).split(en.charAt(0)).filter(Boolean) : []; }

  function cellValue(col, ctx, r, i) {
    var k = col.kind;
    switch (k) {
      case 'idx': return i + 1;
      case 'enum': var o = enumOpts(col.en); return o.length ? '¶' + o[ri(r, 0, o.length - 1)] : '';
      case 'bool': return r() < 0.6;
      case 'yn': return r() < 0.7 ? 'Y' : 'N';
      case 'okng': return r() < 0.92 ? 'OK' : 'NG';
      case 'use': return tok('use', r() < 0.85 ? 0 : 1);
      case 'qty': var base = /계획|지시/.test(col.lab) ? ctx.plan : /불량|미부착|L\/O/.test(col.lab) ? ri(r, 0, 9) : /인원|작업자수|대수/.test(col.lab) ? ri(r, 1, 14) : /가로|세로|높이|두께|폭|피치/.test(col.lab) ? ri(r, 5, 480) : /^\d+일$|^\d+_|^\d+월$/.test(col.lab) ? ri(r, 0, 60) : Math.round(ctx.plan * (0.82 + r() * 0.18));
        return base;
      case 'rate': return Math.round((62 + r() * 36) * 10) / 10;
      case 'money': return ri(r, 12, 980) * 1000;
      case 'dur': return /시간\(분\)|분/.test(col.lab) ? ri(r, 5, 480) : Math.round((0.5 + r() * 9) * 10) / 10;
      case 'date': var d = new Date(TODAY); d.setDate(d.getDate() - ri(r, 0, 29)); return fmtDate(d);
      case 'dt': var d2 = new Date(TODAY); d2.setDate(d2.getDate() - ri(r, 0, 20)); d2.setHours(ri(r, 6, 22), ri(r, 0, 59)); return fmtDT(d2);
      case 'ym': return '2026-' + pad(ri(r, 1, 10));
      case 'year': return String(ri(r, 2015, 2026));
      case 'week': return tok('week', ri(r, 0, 6));
      case 'icode': return itemCode(ctx.item);
      case 'item': return tok('item', ctx.item);
      case 'draw': return 'DW-' + itemCode(ctx.item).slice(3);
      case 'lcode': return lineCode(ctx.line);
      case 'line': return tok('line', ctx.line);
      case 'pcode': return procCode(ctx.proc);
      case 'proc': return tok('proc', ctx.proc);
      case 'ecode': return eqCode(ctx.eq);
      case 'eq': return tok('eq', ctx.eq);
      case 'wo': return 'WO261' + pad(ri(r, 0, 19), 3).slice(1) + '-' + pad(ri(r, 1, 999), 4);
      case 'serial': return 'K26' + pad(ri(r, 1000, 99999), 6);
      case 'vin': return 'VN' + pad(ri(r, 100000, 999999), 7);
      case 'lot': return 'LT2610' + pad(ri(r, 1, 19)) + '-' + pad(ri(r, 1, 80), 3);
      case 'barcode': return '880' + pad(ri(r, 1, 9999999), 9);
      case 'docno': return 'BR2610-' + pad(ri(r, 1, 300), 4);
      case 'ccode': return 'C' + pad(ctx.cust + 1, 4);
      case 'emp': return 'E2' + pad(ctx.person * 37 + 104, 4);
      case 'dcode': return 'D' + pad(100 + ctx.dept * 10, 3);
      case 'wcode': return 'WG' + pad(ctx.wg + 1, 3);
      case 'whcode': return 'WH' + pad(ri(r, 1, 4));
      case 'loc': return ['A', 'B', 'C'][ri(r, 0, 2)] + '-' + pad(ri(r, 1, 12)) + '-' + pad(ri(r, 1, 5));
      case 'code': return 'CD' + pad(ri(r, 1, 99), 3);
      case 'spec': return '±0.0' + ri(r, 1, 5);
      case 'ip': return '10.20.' + ri(r, 1, 9) + '.' + ri(r, 10, 250);
      case 'tel': return '010-' + pad(ri(r, 1000, 9999), 4) + '-' + pad(ri(r, 1000, 9999), 4);
      case 'mail': return 'user' + pad(ctx.person + 1) + '@example.com';
      case 'mode': return 'MODE-' + pad(ri(r, 1, 4));
      case 'text': return 'T-' + pad(ri(r, 1, 999), 3);
      default:
        if (TOKEN_KIND[k]) { var key = TOKEN_KIND[k]; var idx = ctx[key] != null ? ctx[key] : ri(r, 0, V[key].length - 1); return tok(key, idx); }
        return '';
    }
  }
  function genRows(seed, cols, n) {
    var r = rng(seed), rows = [];
    var tree = cols.tree;
    for (var i = 0; i < n; i++) {
      var ctx = { item: ri(r, 0, V.item.length - 1), line: ri(r, 0, V.line.length - 1), proc: ri(r, 0, V.proc.length - 1), eq: ri(r, 0, V.eq.length - 1), person: ri(r, 0, V.person.length - 1), dept: ri(r, 0, V.dept.length - 1), wg: ri(r, 0, V.wg.length - 1), cust: ri(r, 0, V.cust.length - 1), plan: ri(r, 6, 80) * 10 };
      var cells = cols.map(function (c) { return cellValue(c, ctx, r, i); });
      rows.push({ id: seed + '#' + i, lvl: tree ? [0, 1, 2, 2, 1, 2][i % 6] : 0, c: cells });
    }
    return rows;
  }

  /* ---------------- 상태 ---------------- */
  var S = { user: ssGet('mes.user'), route: '', open: lsGet('mes.navopen', {}), timers: [], grids: {}, active: null, search: {}, notif: false, q: '' };
  var SCREENS = D.screens;
  var ORDER = [];
  D.menu.forEach(function (g) { g[1].forEach(function (it) { ORDER.push(it[0]); }); });
  function groupOf(id) { for (var i = 0; i < D.menu.length; i++) for (var j = 0; j < D.menu[i][1].length; j++) if (D.menu[i][1][j][0] === id) return D.menu[i][0]; return ''; }
  function clearTimers() { S.timers.forEach(function (x) { clearInterval(x); clearTimeout(x); }); S.timers = []; }

  /* ---------------- 아이콘 ---------------- */
  var IC = {
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>'
  };
  var GICON = {
    '모니터링': '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    '생산관리': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
    '생산실적': '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    '추적성(LOT)': '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8.5 8.5 15.5 15.5"/>',
    '설비관리 · 설비점검': '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    '성과분석(KPI)': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    '설비 데이터 수집': '<path d="M2 12h4l3-8 4 16 3-8h6"/>',
    '현장 단말(PDA)': '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
    '기준정보': '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    '표준·품질': '<path d="M9 12l2 2 4-4"/><path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5z"/>',
    '시스템관리': '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
  };
  function gicon(g) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (GICON[g] || GICON['기준정보']) + '</svg>'; }

  /* ---------------- 셸 ---------------- */
  var USERS = [{ id: 'mgr01', p: 4, role: '생산관리자', dept: 0 }, { id: 'admin', p: 1, role: '시스템 관리자', dept: 4 }, { id: 'op101', p: 2, role: '현장 작업자', dept: 1 }];
  function langSw() {
    return '<div class="langsw" role="group" aria-label="' + esc(t('언어')) + '">' + IC.globe +
      ['ko', 'en', 'ja'].map(function (l) { return '<button type="button" data-act="lang" data-v="' + l + '" class="' + (LANG === l ? 'on' : '') + '" aria-pressed="' + (LANG === l) + '">' + { ko: 'KO', en: 'EN', ja: 'JA' }[l] + '</button>'; }).join('') + '</div>';
  }
  function themeBtn() {
    var light = document.documentElement.dataset.theme === 'light';
    return '<button class="iconbtn" type="button" data-act="theme" aria-label="' + esc(t('테마 전환')) + '" title="' + esc(t('테마 전환')) + '">' + (light ? IC.moon : IC.sun) + '</button>';
  }
  function brand() { return '<div class="brand"><span class="logo" aria-hidden="true">' + IC.logo + '</span><span class="bt"><b>' + esc(t('자동차부품 제조업 MES')) + '</b><span>' + esc(t('제조실행시스템')) + '</span></span></div>'; }

  function renderLogin() {
    clearTimers();
    document.documentElement.lang = LANG;
    var mode = S.loginMode || 'p';
    root.innerHTML = '<div class="login"><form class="card" id="loginForm" autocomplete="off">' +
      '<div class="top">' + langSw() + themeBtn() + '</div>' + brand() +
      '<h1>' + esc(t('로그인')) + '</h1><p class="lede">' + esc(t('생산·품질·설비를 한 화면에서')) + '</p>' +
      '<div class="fld"><label>' + esc(t('부서(공정) 선택')) + '</label><div class="seg">' +
      '<button type="button" data-act="lmode" data-v="p" class="' + (mode === 'p' ? 'on' : '') + '">' + esc(t('공정')) + '</button>' +
      '<button type="button" data-act="lmode" data-v="d" class="' + (mode === 'd' ? 'on' : '') + '">' + esc(t('부서')) + '</button></div></div>' +
      '<div class="fld"><label for="lgDept">' + esc(t(mode === 'p' ? '공정' : '부서')) + '</label><select id="lgDept" class="input">' +
      (mode === 'p' ? V.line : V.dept).map(function (x, i) { return '<option value="' + i + '">' + esc(x[LI]) + '</option>'; }).join('') + '</select></div>' +
      '<div class="fld"><label for="lgUser">' + esc(t('아이디')) + '</label><select id="lgUser" class="input">' +
      USERS.map(function (u, i) { return '<option value="' + i + '">' + u.id + ' · ' + esc(vt('person', u.p)) + ' (' + esc(t(u.role)) + ')</option>'; }).join('') + '</select></div>' +
      '<div class="fld"><label for="lgPw">' + esc(t('패스워드')) + '</label><input id="lgPw" type="password" class="input" placeholder="' + esc(t('패스워드를 입력하세요')) + '"></div>' +
      '<button class="btn primary" type="submit">' + esc(t('로그인')) + '</button>' +
      '<p class="hint" style="margin-top:12px">' + esc(t('계정을 고르고 아무 패스워드나 입력하면 들어갑니다 (목업)')) + '</p></form></div>';
    document.getElementById('loginForm').onsubmit = function (e) {
      e.preventDefault();
      if (!document.getElementById('lgPw').value) { toast(t('패스워드를 입력하세요'), 'err'); return; }
      S.user = USERS[+document.getElementById('lgUser').value]; ssSet('mes.user', S.user);
      location.hash = '#/P0001'; render();
    };
  }

  function navHtml() {
    var cur = S.route;
    return D.menu.map(function (g, gi) {
      var has = g[1].some(function (x) { return x[0] === cur; });
      var open = S.q ? true : (S.open[g[0]] != null ? S.open[g[0]] : has);
      return '<div class="nav"><button type="button" class="grp' + (has ? ' cur' : '') + '" data-act="grp" data-v="' + esc(g[0]) + '" aria-expanded="' + open + '">' + gicon(g[0]) + '<span>' + esc(t(g[0])) + '</span><span class="cnt">' + g[1].length + '</span>' + IC.chev + '</button>' +
        (open ? '<div class="sub">' + g[1].map(function (it) {
          return '<a href="#/' + it[0] + '"' + (it[0] === cur ? ' aria-current="page"' : '') + '><span class="nl"><span>' + esc(t(it[1])) + '</span><small>' + it[0] + '</small></span></a>';
        }).join('') + '</div>' : '') + '</div>';
    }).join('');
  }
  function shell(content, sc) {
    var u = S.user, g = groupOf(S.route);
    return '<div class="app"><aside class="rail">' + brand() +
      '<div class="tenant"><div class="tl1"><span>' + esc(t('연결된 공장')) + '</span><span class="ok">' + IC.ok + esc(t('정상')) + '</span></div><div class="tl2">' + esc(t('본사 · 1공장 / 2공장')) + '</div></div>' +
      '<div class="navwrap">' + navHtml() + '</div>' +
      '<div class="scope"><div class="who"><span class="avatar">' + esc(vt('person', u.p).charAt(0)) + '</span><span class="wn"><b>' + esc(vt('person', u.p)) + '</b><small>' + esc(vt('dept', u.dept)) + ' · ' + esc(t(u.role)) + '</small></span></div>' +
      '<button type="button" class="lo" data-act="logout">' + esc(t('로그아웃')) + '</button></div></aside>' +
      '<div class="main-col"><header class="topbar"><div class="crumb">' + IC.home + '<span>' + esc(t(g)) + '</span><span>/</span><b>' + esc(t(sc.name)) + '</b></div>' +
      '<div class="tsearch">' + IC.search + '<input id="tsq" type="search" autocomplete="off" placeholder="' + esc(t('화면 이름이나 화면 ID로 찾기')) + '" aria-label="' + esc(t('화면 이름이나 화면 ID로 찾기')) + '"><div class="sresults" id="sres" hidden></div></div>' +
      '<div class="tacts">' + langSw() + themeBtn() +
      '<button class="iconbtn" type="button" data-act="notif" aria-label="' + esc(t('알림')) + '">' + IC.bell + '<span class="dot"></span></button>' +
      (S.notif ? notifHtml() : '') + '</div></header><main id="main">' + content + '</main></div></div>';
  }
  function notifHtml() {
    var a = [['--crit', t('설비 고장 접수: ') + vt('eq', 3), '12' + t('분 전')], ['--warn', t('부품 요청: ') + vt('item', 4) + ' · ' + vt('line', 5), '35' + t('분 전')], ['--info', t('표준서 개정: ') + vt('proc', 7) + ' · ' + vt('line', 6), '2' + t('시간 전')]];
    return '<div class="notif" role="dialog" aria-label="' + esc(t('알림')) + '"><h4>' + esc(t('알림')) + '</h4>' + a.map(function (x) { return '<div class="it" style="--sc:var(' + x[0] + ')"><i></i><div>' + esc(x[1]) + '<small>' + esc(x[2]) + '</small></div></div>'; }).join('') + '</div>';
  }
  function head(id, sc, acts) {
    return '<div class="head"><div><h1>' + esc(t(sc.name)) + '<span class="idpill">' + id + '</span></h1><p class="lede">' + esc(t(D.purpose[id] || '')) + '</p></div>' + (acts ? '<div class="hacts">' + acts + '</div>' : '') + '</div>';
  }

  /* ---------------- 조회 조건 ---------------- */
  function fieldKind(type, lab) {
    if (/DateTimePicker/.test(type)) return 'range';
    if (/MonthPicker/.test(type)) return 'month';
    if (/YearPicker/.test(type)) return 'yearsel';
    if (/RadioGroup/.test(type)) return 'radio';
    if (/Select/.test(type)) return 'select';
    if (/AutoComplete/.test(type)) return 'auto';
    return 'text';
  }
  function optionsFor(lab) {
    var k = kindOf(lab, 'Text', '');
    var key = TOKEN_KIND[k] || ({ lcode: 'line', icode: 'item', pcode: 'proc', ecode: 'eq', dcode: 'dept', wcode: 'wg', ccode: 'cust' })[k];
    if (/REFRESH/.test(lab)) return [['10', '10' + t('초')], ['30', '30' + t('초')], ['60', '60' + t('초')]];
    if (/여부|유무/.test(lab)) return [['Y', 'Y'], ['N', 'N']];
    if (key) return V[key].map(function (x, i) { return [tok(key, i), x[LI]]; });
    return [['§type:0', vt('type', 0)], ['§type:1', vt('type', 1)]];
  }
  function searchHtml(id, sc) {
    var st = S.search[id] || (S.search[id] = {});
    var seen = {};
    var f = sc.labels.filter(function (l) { if (seen[l[1]]) return false; seen[l[1]] = 1; return true; });
    if (!f.length && !sc.grids.length) return '';
    var html = f.map(function (l, i) {
      var key = 'f' + i, k = fieldKind(l[0], l[1]), v = st[key] == null ? '' : st[key], lab = esc(t(l[1]));
      if (k === 'range') {
        var a = st[key + 'a'] || fmtDate(new Date(TODAY.getTime() - 29 * 864e5)), b = st[key + 'b'] || fmtDate(TODAY);
        return '<div class="fld wide"><label>' + lab + '</label><div class="range"><input class="input" type="date" data-f="' + key + 'a" value="' + a + '"><span class="muted">~</span><input class="input" type="date" data-f="' + key + 'b" value="' + b + '"></div></div>';
      }
      if (k === 'month') return '<div class="fld"><label>' + lab + '</label><input class="input" type="month" data-f="' + key + '" value="' + (v || '2026-10') + '"></div>';
      if (k === 'yearsel') return '<div class="fld"><label>' + lab + '</label><select class="input" data-f="' + key + '">' + [2026, 2025, 2024, 2023].map(function (y) { return '<option' + (String(y) === String(v || 2026) ? ' selected' : '') + '>' + y + '</option>'; }).join('') + '</select></div>';
      if (k === 'select' || k === 'radio') return '<div class="fld"><label>' + lab + '</label><select class="input" data-f="' + key + '"><option value="">' + esc(t('전체')) + '</option>' + optionsFor(l[1]).map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === v ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></div>';
      var dl = k === 'auto' ? optionsFor(l[1]) : null;
      return '<div class="fld"><label>' + lab + '</label><input class="input" type="text" data-f="' + key + '" value="' + esc(v) + '"' + (dl ? ' list="dl-' + id + '-' + i + '"' : '') + '>' + (dl ? '<datalist id="dl-' + id + '-' + i + '">' + dl.map(function (o) { return '<option value="' + esc(o[1]) + '">'; }).join('') + '</datalist>' : '') + '</div>';
    }).join('');
    return '<section class="panel" style="margin-bottom:16px"><form class="search" data-search="' + id + '">' + html +
      '<div class="sacts"><button type="button" class="btn" data-act="reset">' + esc(t('초기화')) + '</button><button type="submit" class="btn primary">' + IC.search.replace('<svg', '<svg width="15" height="15"') + esc(t('검색')) + '</button></div></form></section>';
  }
  function readSearch(id) {
    var st = S.search[id] = {}, form = document.querySelector('[data-search="' + id + '"]');
    if (!form) return st;
    form.querySelectorAll('[data-f]').forEach(function (el) { st[el.getAttribute('data-f')] = el.value; });
    return st;
  }
  function norm(s) { return String(s).replace(/\s+/g, '').replace(/[()]/g, '').toLowerCase(); }
  /* 조회 조건 하나를 그리드 컬럼에 맞춘다: 같은 이름 → 같은 종류 → 포함 관계 */
  function matchCol(cols, lab) {
    var n = norm(lab), k = kindOf(lab, 'Text', '');
    var i = cols.findIndex(function (c) { return norm(c.lab) === n; });
    if (i < 0 && k !== 'text' && k !== 'type' && k !== 'remark') i = cols.findIndex(function (c) { return c.kind === k; });
    if (i < 0) i = cols.findIndex(function (c) { var m = norm(c.lab); return m.length > 1 && (m.indexOf(n) >= 0 || n.indexOf(m) >= 0); });
    return i;
  }
  function applyFilter(id, sc, cols, rows) {
    var st = S.search[id] || {}, f = sc.labels;
    var seen = {}, list = f.filter(function (l) { if (seen[l[1]]) return false; seen[l[1]] = 1; return true; });
    return rows.filter(function (row) {
      for (var i = 0; i < list.length; i++) {
        var key = 'f' + i, k = fieldKind(list[i][0], list[i][1]);
        if (k === 'range') {
          var a = st[key + 'a'], b = st[key + 'b'];
          if (!a && !b) continue;
          var di = cols.findIndex(function (c) { return c.kind === 'date' || c.kind === 'dt'; });
          if (di < 0) continue;
          var dv = String(row.c[di]).slice(0, 10);
          if ((a && dv < a) || (b && dv > b)) return false;
          continue;
        }
        if (k === 'month' || k === 'yearsel') continue;
        var v = st[key]; if (!v) continue;
        var ci = matchCol(cols, list[i][1]); if (ci < 0) continue;
        var cell = row.c[ci];
        if (k === 'select' || k === 'radio') { if (String(v).charAt(0) === '§' ? (String(cell).split(':')[0] === v.split(':')[0] && cell !== v) : show(cell) !== v) return false; }
        else if (norm(show(cell)).indexOf(norm(v)) < 0) return false;
      }
      return true;
    });
  }
  function periodSeed(id) { var st = S.search[id] || {}, s = ''; Object.keys(st).forEach(function (k) { var el = document.querySelector('[data-search="' + id + '"] [data-f="' + k + '"]'); if (el && (el.type === 'month' || (el.tagName === 'SELECT' && /^\d{4}$/.test(st[k])))) s += st[k]; }); return s; }

  /* ---------------- 그리드 ---------------- */
  function gridKey(gid, masterKey) { return 'mes.g.' + gid + (masterKey ? '|' + masterKey : ''); }
  function getGrid(id, sc, gi, masterKey) {
    var g = sc.grids[gi], key = gridKey(g.id, masterKey) + '|' + periodSeed(id);
    var cols = colsOf(g); cols.tree = g.tree;
    var G = S.grids[key];
    if (!G) {
      var saved = lsGet(key, null);
      var n = gi === 0 ? 16 : 8;
      if (/C210030|C210100/.test(id) && gi === 1) n = 6;
      G = S.grids[key] = { key: key, sid: id, gi: gi, g: g, cols: cols, rows: saved || genRows(key, cols, n), sel: 0, sort: null, dirty: false, master: masterKey };
    }
    return G;
  }
  function viewRows(G, sc) {
    var rows = G.gi === 0 ? applyFilter(G.sid, sc, G.cols, G.rows) : G.rows.slice();
    if (G.sort) {
      var ci = G.sort[0], dir = G.sort[1];
      rows.sort(function (a, b) { var x = a.c[ci], y = b.c[ci]; if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir; return String(show(x)).localeCompare(String(show(y))) * dir; });
    }
    return rows;
  }
  function align(c) { if (NUMK[c.kind] && c.kind !== 'idx') return 'num'; if (c.align === 'left') return ''; return 'c'; }
  function gridHtml(G, sc, title, btns) {
    var rows = viewRows(G, sc), cols = G.cols;
    var sums = cols.map(function (c) { return (c.kind === 'qty' || c.kind === 'money' || c.kind === 'dur') ? rows.reduce(function (s, r) { return s + (typeof r.c[c.i] === 'number' ? r.c[c.i] : 0); }, 0) : null; });
    cols.forEach(function (c, i) { c.i = i; });
    sums = cols.map(function (c, i) { return (c.kind === 'qty' || c.kind === 'money' || c.kind === 'dur') ? rows.reduce(function (s, r) { return s + (typeof r.c[i] === 'number' ? r.c[i] : 0); }, 0) : null; });
    var hasSum = sums.some(function (x) { return x != null; });
    var active = S.active === G.key;
    var th = cols.map(function (c, i) { var s = G.sort && G.sort[0] === i ? (G.sort[1] > 0 ? '▲' : '▼') : '↕'; return '<th class="' + align(c) + '" data-act="sort" data-g="' + esc(G.key) + '" data-v="' + i + '">' + esc(t(c.lab)) + '<span class="sort">' + s + '</span></th>'; }).join('');
    var body = rows.length ? rows.map(function (r) {
      var sel = G.rows.indexOf(r) === G.sel;
      return '<tr data-act="row" data-g="' + esc(G.key) + '" data-v="' + G.rows.indexOf(r) + '"' + (sel ? ' class="sel" aria-selected="true"' : '') + '>' + r.c.map(function (v, i) {
        var c = cols[i], txt = show(v);
        if (i === 0 && G.cols.tree && r.lvl) txt = '<span class="tree-i">' + new Array(r.lvl + 1).join('　') + '└ </span>' + esc(txt); else txt = esc(txt);
        if (c.kind === 'bool' && v === true) txt = '<span class="chk">✓</span>';
        if (c.kind === 'rate') txt += '%';
        if (/status|eqst/.test(c.kind) || (c.kind === 'yn' && /전송|완료|처리/.test(c.lab))) txt = pillFor(v, txt);
        return '<td class="' + align(c) + '">' + txt + '</td>';
      }).join('') + '</tr>';
    }).join('') : '<tr><td colspan="' + cols.length + '" class="gempty">' + esc(t('조회된 데이터가 없습니다')) + '</td></tr>';
    var foot = hasSum && rows.length ? '<tfoot><tr>' + sums.map(function (s, i) { return '<td class="' + align(cols[i]) + '">' + (i === 0 ? esc(t('합계')) : s != null ? nf(s) : '') + '</td>'; }).join('') + '</tr></tfoot>' : '';
    return '<section class="panel gpanel" data-gp="' + esc(G.key) + '"' + (active ? ' style="border-color:color-mix(in srgb,var(--accent) 45%,var(--line))"' : '') + '><header><h2>' + esc(title) + ' <small>' + esc(G.g.id) + '</small></h2><div class="gbtns">' + (btns || '') + '</div></header>' +
      '<div class="gscroll"><table><thead><tr>' + th + '</tr></thead><tbody>' + body + '</tbody>' + foot + '</table></div>' +
      '<div class="gfoot"><span>' + esc(t('전체 : ')) + nf(rows.length) + esc(t(' 건')) + '</span><span>' + esc(t('예시 데이터')) + '</span></div></section>';
  }
  function pillFor(v, txt) {
    var s = String(v);
    var cls = /status:2|eqst:0|^Y$/.test(s) ? 'p-ok' : /status:1|eqst:1/.test(s) ? 'p-warn' : /status:3|eqst:2|^N$/.test(s) ? 'p-crit' : 'p-line';
    return '<span class="pill ' + cls + '">' + txt + '</span>';
  }

  /* 버튼 → 동작 */
  var SKIP = { '닫기': 1, '확인': 1, '검색': 1, '취소': 1 };
  function actOf(b) {
    if (b === '품목검색') return 'pickItem';
    if (b === '설비검색') return 'pickEq';
    if (/엑셀\s*다운|엑셀다운/.test(b)) return /전체/.test(b) ? 'excelAll' : 'excel';
    if (b === '엑셀샘플') return 'sample';
    if (b === '엑셀 업로드') return 'upload';
    if (/^(추가|등록|품목별 라인등록)$/.test(b)) return 'add';
    if (b === '수정') return 'edit';
    if (b === '품목 일괄삭제') return 'delAll';
    if (/삭제/.test(b)) return 'del';
    if (/^저장/.test(b)) return 'save';
    if (/취소/.test(b)) return 'revert';
    return 'proc';
  }
  function btnHtml(b) {
    var a = actOf(b), cls = a === 'save' || a === 'add' ? 'btn primary' : a === 'del' || a === 'delAll' ? 'btn danger' : 'btn';
    return '<button type="button" class="' + cls + '" data-act="btn" data-v="' + esc(b) + '">' + esc(t(b)) + '</button>';
  }

  /* ---------------- 일반 화면 ---------------- */
  var CHART = { C201130: 1, C201190: 1, C201220: 1, C204110: 1, C207030: 1, C207040: 1, C207050: 1, C207060: 1, C207070: 1, C202050: 1, C215010: 1, C215050: 1, C202010: 1, C204040: 1, C201020: 1, C220030: 0 };
  function genericScreen(id, sc) {
    var btns = sc.btns.filter(function (b) { return !SKIP[b] && b !== '초기화'; });
    var html = head(id, sc, btns.map(btnHtml).join('')) + searchHtml(id, sc);
    if (!sc.grids.length) return html;
    var titles = sc.titles.length > 1 ? sc.titles : [];
    var M = getGrid(id, sc, 0, '');
    if (!S.active || S.active.indexOf('mes.g.') !== 0 || !S.grids[S.active] || S.grids[S.active].sid !== id) S.active = M.key;
    var t0 = t(titles[0] || sc.titles[0] || '목록');
    if (CHART[id]) html += '<section class="panel chart" style="margin-bottom:16px"><header><h2>' + esc(t('현황 차트')) + '</h2></header>' + chartFor(M, sc) + '</section>';
    var masterRow = M.rows[M.sel];
    var mk = masterRow ? masterRow.id : '';
    if (sc.grids.length === 1) return html + gridHtml(M, sc, t0);
    var details = sc.grids.slice(1).map(function (g, i) { return getGrid(id, sc, i + 1, mk); });
    var tab = S.tab && S.tab[id] || 0;
    if (tab >= details.length) tab = 0;
    var dTitle = function (i) { return t(titles[i + 1] || (sc.tabs[i] || '') || (t('상세') + ' ' + (i + 1))); };
    if (details.length === 1) return html + '<div class="layout2">' + gridHtml(M, sc, t0) + gridHtml(details[0], sc, dTitle(0)) + '</div>';
    return html + '<div class="stack">' + gridHtml(M, sc, t0) + '<div><div class="tabs" role="tablist">' + details.map(function (d, i) { return '<button type="button" role="tab" data-act="tab" data-v="' + i + '" aria-selected="' + (i === tab) + '">' + esc(dTitle(i)) + '</button>'; }).join('') + '</div>' + gridHtml(details[tab], sc, dTitle(tab)) + '</div></div>';
  }

  /* 차트 (SVG) */
  var COLORS = ['#38BDF8', '#34D399', '#A78BFA', '#FBBF24', '#FB7185', '#22D3EE'];
  function chartFor(G, sc) {
    var cols = G.cols, rows = viewRows(G, sc).slice(0, 10);
    var mon = []; cols.forEach(function (c, i) { if (/^\d+월$/.test(c.lab) || /^\d+_실적$/.test(c.lab) || /^\d+일$/.test(c.lab)) mon.push(i); });
    var cat = cols.findIndex(function (c) { return TOKEN_KIND[c.kind] && c.kind !== 'status' && c.kind !== 'remark'; });
    if (cat < 0) cat = cols.findIndex(function (c) { return !NUMK[c.kind]; });
    if (mon.length >= 6) {
      var series = rows.slice(0, 3).map(function (r, si) { return { name: show(r.c[cat]), v: mon.map(function (i) { return +r.c[i] || 0; }), c: COLORS[si] }; });
      return lineChart(mon.map(function (i) { return t(cols[i].lab).replace(/ .*$/, ''); }), series);
    }
    var nums = cols.map(function (c, i) { return i; }).filter(function (i) { return cols[i].kind === 'rate'; });
    if (!nums.length) nums = cols.map(function (c, i) { return i; }).filter(function (i) { return cols[i].kind === 'qty' || cols[i].kind === 'dur'; });
    nums = nums.slice(0, 3);
    if (!nums.length) return '<p class="muted">' + esc(t('조회된 데이터가 없습니다')) + '</p>';
    return barChart(rows.map(function (r) { return show(r.c[cat]); }), nums.map(function (i, si) { return { name: t(cols[i].lab), v: rows.map(function (r) { return +r.c[i] || 0; }), c: COLORS[si] }; }), cols[nums[0]].kind === 'rate');
  }
  function legend(series) { return '<div class="lg">' + series.map(function (s) { return '<span><i style="background:' + s.c + '"></i>' + esc(s.name) + '</span>'; }).join('') + '</div>'; }
  function barChart(labels, series, pct) {
    var W = 900, H = 240, L = 44, B = 46, n = labels.length || 1, max = pct ? 100 : Math.max.apply(null, series.reduce(function (a, s) { return a.concat(s.v); }, [1])) * 1.1;
    var gw = (W - L - 10) / n, bw = Math.min(26, (gw - 10) / series.length);
    var g = '';
    for (var k = 0; k <= 4; k++) { var y = 10 + (H - B - 10) * k / 4; g += '<line class="gl" x1="' + L + '" x2="' + W + '" y1="' + y + '" y2="' + y + '"/><text class="ax" x="' + (L - 6) + '" y="' + (y + 4) + '" text-anchor="end">' + nf(max * (1 - k / 4), 0) + '</text>'; }
    labels.forEach(function (lb, i) {
      var x0 = L + gw * i + (gw - bw * series.length) / 2;
      series.forEach(function (s, si) { var h = (H - B - 10) * s.v[i] / max; g += '<rect x="' + (x0 + si * bw) + '" y="' + (H - B - h) + '" width="' + (bw - 3) + '" height="' + h + '" rx="3" fill="' + s.c + '"><title>' + esc(lb + ' · ' + s.name + ': ' + nf(s.v[i])) + '</title></rect>'; });
      g += '<text class="ax" x="' + (L + gw * i + gw / 2) + '" y="' + (H - B + 16) + '" text-anchor="middle">' + esc(String(lb).length > 9 ? String(lb).slice(0, 9) + '…' : lb) + '</text>';
    });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img">' + g + '</svg>' + legend(series);
  }
  function lineChart(labels, series) {
    var W = 900, H = 240, L = 44, B = 30, n = labels.length, max = Math.max.apply(null, series.reduce(function (a, s) { return a.concat(s.v); }, [1])) * 1.1;
    var g = '';
    for (var k = 0; k <= 4; k++) { var y = 10 + (H - B - 10) * k / 4; g += '<line class="gl" x1="' + L + '" x2="' + W + '" y1="' + y + '" y2="' + y + '"/><text class="ax" x="' + (L - 6) + '" y="' + (y + 4) + '" text-anchor="end">' + nf(max * (1 - k / 4), 0) + '</text>'; }
    var X = function (i) { return L + 10 + (W - L - 20) * i / Math.max(1, n - 1); }, Y = function (v) { return H - B - (H - B - 10) * v / max; };
    labels.forEach(function (lb, i) { if (n <= 12 || i % 3 === 0) g += '<text class="ax" x="' + X(i) + '" y="' + (H - 10) + '" text-anchor="' + (i === n - 1 ? 'end' : i === 0 ? 'start' : 'middle') + '">' + esc(lb) + '</text>'; });
    series.forEach(function (s) { g += '<polyline fill="none" stroke="' + s.c + '" stroke-width="2.2" points="' + s.v.map(function (v, i) { return X(i) + ',' + Y(v); }).join(' ') + '"/>' + s.v.map(function (v, i) { return '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="3" fill="' + s.c + '"><title>' + esc(s.name + ' ' + labels[i] + ': ' + nf(v)) + '</title></circle>'; }).join(''); });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img">' + g + '</svg>' + legend(series);
  }
  function donut(parts) {
    var tot = parts.reduce(function (s, p) { return s + p.v; }, 0), a = -Math.PI / 2, g = '';
    parts.forEach(function (p) { var b = a + 2 * Math.PI * p.v / tot, l = b - a > Math.PI ? 1 : 0; g += '<path d="M' + (90 + 70 * Math.cos(a)) + ' ' + (90 + 70 * Math.sin(a)) + ' A70 70 0 ' + l + ' 1 ' + (90 + 70 * Math.cos(b)) + ' ' + (90 + 70 * Math.sin(b)) + '" stroke="' + p.c + '" stroke-width="22" fill="none"><title>' + esc(p.name + ' ' + p.v) + '</title></path>'; a = b; });
    return '<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap"><svg viewBox="0 0 180 180" width="170" height="170" style="width:200px;height:200px;flex:none">' + g + '<text x="90" y="86" text-anchor="middle" style="font-size:26px;font-weight:800;fill:var(--ink)">' + Math.round(parts[0].v / tot * 100) + '%</text><text x="90" y="108" text-anchor="middle" class="ax">' + esc(parts[0].name) + '</text></svg>' + legend(parts.map(function (p) { return { name: p.name + ' ' + p.v, c: p.c }; })) + '</div>';
  }

  /* ---------------- 특수 화면 ---------------- */
  function boardData(seed) {
    var r = rng('board' + seed);
    return V.line.map(function (l, i) { var plan = ri(r, 30, 90) * 10, act = Math.round(plan * (0.55 + r() * 0.5)); return { i: i, plan: plan, act: Math.min(act, plan + 40), oee: Math.round((68 + r() * 28) * 10) / 10, st: r() < 0.72 ? 0 : r() < 0.6 ? 1 : r() < 0.5 ? 3 : 2, team: i < 5 ? 0 : 1 }; });
  }
  function kpiTile(label, v, sub, spark) {
    return '<div class="panel kpi"><span class="kl">' + esc(label) + '</span><span class="kv num">' + v + '</span><span class="kd">' + sub + '</span>' + (spark || '') + '</div>';
  }
  function spark(seed, c) { var r = rng(seed), pts = []; for (var i = 0; i < 16; i++) pts.push((i * 20) + ',' + (26 - r() * 22)); return '<svg viewBox="0 0 300 30" preserveAspectRatio="none"><polyline fill="none" stroke="' + c + '" stroke-width="2" points="' + pts.join(' ') + '"/></svg>'; }
  function lineCard(d) {
    var rate = Math.round(d.act / d.plan * 100), sc = ['var(--ok)', 'var(--warn)', 'var(--crit)', 'var(--info)'][d.st];
    return '<div class="lcard" data-act="go" data-v="C205020" data-line="' + d.i + '"><div class="top"><b>' + esc(vt('line', d.i)) + '</b><span class="pill ' + ['p-ok', 'p-warn', 'p-crit', 'p-line'][d.st] + '"><span class="dot" style="--sc:' + sc + '"></span>' + esc(vt('eqst', d.st)) + '</span></div>' +
      '<div class="bar"><i style="width:' + Math.min(100, rate) + '%;--bc:' + (rate >= 90 ? 'var(--ok)' : rate >= 70 ? 'var(--warn)' : 'var(--crit)') + '"></i></div>' +
      '<div class="nums"><span>' + esc(t('계획')) + '<strong>' + nf(d.plan) + '</strong></span><span>' + esc(t('생산수량')) + '<strong>' + nf(d.act) + '</strong></span><span>OEE<strong>' + d.oee + '%</strong></span></div></div>';
  }
  function boardScreen(id, sc) {
    var tick = S.tick || 0, ds = boardData(Math.floor(tick / 3)), r = rng('tick' + tick);
    ds.forEach(function (d) { d.act = Math.min(d.plan + 40, d.act + Math.floor(tick * (1 + r() * 2))); });
    var plan = ds.reduce(function (s, d) { return s + d.plan; }, 0), act = ds.reduce(function (s, d) { return s + d.act; }, 0), oee = ds.reduce(function (s, d) { return s + d.oee; }, 0) / ds.length;
    var hours = [], hv = [], hp = []; var rh = rng('hours'); for (var h = 8; h <= 17; h++) { hours.push(h + t('시')); hp.push(ri(rh, 300, 420)); hv.push(h <= 9 + Math.min(8, tick) ? ri(rh, 240, 430) : 0); }
    var cnt = [0, 0, 0, 0]; ds.forEach(function (d) { cnt[d.st]++; });
    return head(id, sc, '<span class="live">' + esc(t('실시간')) + ' · ' + fmtDT(new Date(TODAY.getTime() + tick * 5000)).slice(11) + '</span>') +
      '<div class="board-kpis" style="margin-bottom:16px">' +
      kpiTile(t('계획수량'), nf(plan), '<span class="muted">' + esc(t('오늘')) + '</span>', spark('a', '#38BDF8')) +
      kpiTile(t('생산수량'), nf(act), '<span class="up">▲ 3.2% ' + esc(t('전일 대비')) + '</span>', spark('b', '#34D399')) +
      kpiTile(t('달성률'), Math.round(act / plan * 1000) / 10 + '%', '<span class="muted">' + nf(plan - act) + ' ' + esc(t('남음') === '남음' ? '' : '') + '</span>', spark('c', '#A78BFA')) +
      kpiTile(t('종합효율(OEE)'), Math.round(oee * 10) / 10 + '%', '<span class="down">▼ 0.8% ' + esc(t('전일 대비')) + '</span>', spark('d', '#FBBF24')) + '</div>' +
      '<div class="grid g2" style="margin-bottom:16px"><section class="panel"><header><h2>' + esc(t('시간대별 생산')) + '</h2></header><div class="chart">' + barChart(hours, [{ name: t('계획'), v: hp, c: '#334155' }, { name: t('생산수량'), v: hv, c: '#38BDF8' }]) + '</div></section>' +
      '<section class="panel"><header><h2>' + esc(t('설비 가동현황')) + '</h2></header><div class="chart">' + donut([{ name: t('가동'), v: 38 + cnt[0], c: '#34D399' }, { name: t('비가동'), v: 6 + cnt[1], c: '#FBBF24' }, { name: t('고장'), v: 1 + cnt[2], c: '#FB7185' }, { name: t('계획정지'), v: 3 + cnt[3], c: '#818CF8' }]) + '</div></section></div>' +
      [0, 1].map(function (tm) { return '<section class="panel" style="margin-bottom:16px"><header><h2>' + esc(vt('dept', tm)) + ' · ' + esc(t('라인별 생산현황')) + '</h2></header><div class="lines">' + ds.filter(function (d) { return d.team === tm; }).map(lineCard).join('') + '</div></section>'; }).join('');
  }
  function teamBoard(id, sc) {
    var st = S.tb || (S.tb = { run: true, sec: '30', team: -1 });
    var tick = S.tick || 0, ds = boardData(Math.floor(tick / 2));
    var months = []; for (var m = 1; m <= 10; m++) months.push(t(m + '월'));
    var r = rng('team');
    var series = [0, 1].map(function (tm) { return { name: vt('dept', tm), v: months.map(function () { return Math.round(78 + r() * 20); }), c: COLORS[tm] }; });
    var list = ds.filter(function (d) { return st.team < 0 || d.team === st.team; });
    return head(id, sc, '<div class="fld" style="min-width:120px;flex:none"><label>' + esc(t('REFRESH 주기')) + '</label><select class="input" data-act="tbsec">' + optionsFor('REFRESH 주기').map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === st.sec ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div>' +
      '<span class="live' + (st.run ? '' : ' off') + '">' + esc(t(st.run ? '실시간' : '정지됨')) + '</span>' + btnHtml('정지') + btnHtml('시작')) +
      '<div class="board-kpis" style="margin-bottom:16px">' + [0, 1].map(function (tm) {
        var dd = ds.filter(function (d) { return d.team === tm; }), p = dd.reduce(function (s, d) { return s + d.plan; }, 0), a = dd.reduce(function (s, d) { return s + d.act; }, 0);
        return kpiTile(vt('dept', tm) + ' · ' + t('달성률'), Math.round(a / p * 1000) / 10 + '%', '<span class="muted">' + nf(a) + ' / ' + nf(p) + '</span>') + kpiTile(vt('dept', tm) + ' · OEE', Math.round(dd.reduce(function (s, d) { return s + d.oee; }, 0) / dd.length * 10) / 10 + '%', '');
      }).join('') + '</div>' +
      '<section class="panel chart" style="margin-bottom:16px"><header><h2>' + esc(t('팀별 월 달성률')) + '</h2></header>' + lineChart(months, series) + '</section>' +
      '<div class="tabs" role="tablist">' + [-1, 0, 1].map(function (tm) { return '<button type="button" role="tab" data-act="tbteam" data-v="' + tm + '" aria-selected="' + (st.team === tm) + '">' + esc(tm < 0 ? t('전체') : vt('dept', tm)) + '</button>'; }).join('') + '</div>' +
      '<div class="lines">' + list.map(lineCard).join('') + '</div>';
  }
  function floorScreen(id, sc) {
    var st = S.fl || (S.fl = { line: '', eq: -1 });
    var r = rng('floor'), eqs = [];
    var zones = [{ n: t('가공동'), x: 20, y: 40, w: 560, h: 300, lines: [0, 1, 2, 3] }, { n: t('열처리동'), x: 600, y: 40, w: 280, h: 300, lines: [4], vert: true }, { n: t('조립동'), x: 20, y: 360, w: 860, h: 190, lines: [5, 6, 7] }];
    zones.forEach(function (z) {
      z.lines.forEach(function (li, k) {
        var cnt = z.lines.length === 1 ? 3 : 4, rowH = (z.h - 30) / z.lines.length;
        for (var e = 0; e < cnt; e++) { var s = r() < 0.7 ? 0 : r() < 0.5 ? 1 : r() < 0.5 ? 2 : 3, vh = (z.h - 36) / cnt; eqs.push(z.vert ? { id: eqs.length, line: li, eqi: (li * 3 + e) % V.eq.length, st: s, x: z.x + 12, y: z.y + 26 + e * vh, w: z.w - 24, h: vh - 10 } : { id: eqs.length, line: li, eqi: (li * 3 + e) % V.eq.length, st: s, x: z.x + 12 + e * ((z.w - 24) / cnt), y: z.y + 26 + k * rowH, w: (z.w - 24) / cnt - 10, h: rowH - 10 }); }
      });
    });
    var SC = ['#34D399', '#FBBF24', '#FB7185', '#818CF8'];
    var svg = zones.map(function (z) { return '<rect x="' + z.x + '" y="' + z.y + '" width="' + z.w + '" height="' + z.h + '" rx="14" fill="var(--surface2)" stroke="var(--line2)"/><text class="zonelab" x="' + (z.x + 12) + '" y="' + (z.y + 18) + '">' + esc(z.n) + '</text>'; }).join('') +
      eqs.map(function (e) {
        var dim = st.line !== '' && String(e.line) !== st.line;
        return '<g class="eq' + (st.eq === e.id ? ' sel' : '') + '" data-act="eq" data-v="' + e.id + '" opacity="' + (dim ? 0.25 : 1) + '"><rect x="' + e.x + '" y="' + e.y + '" width="' + e.w + '" height="' + e.h + '" fill="color-mix(in srgb,' + SC[e.st] + ' 18%,var(--surface))" stroke="' + SC[e.st] + '"/><text x="' + (e.x + 8) + '" y="' + (e.y + 18) + '">' + esc(vt('eq', e.eqi)) + '</text><text x="' + (e.x + 8) + '" y="' + (e.y + 34) + '" style="fill:var(--muted)">' + esc(vt('line', e.line)) + '</text></g>';
      }).join('');
    var sel = eqs[st.eq];
    var det = sel ? (function () { var rr = rng('eqd' + sel.id), p = ri(rr, 200, 600); return '<dl class="kv facts"><dt>' + esc(t('상태')) + '</dt><dd>' + pillFor(tok('eqst', sel.st), esc(vt('eqst', sel.st))) + '</dd><dt>' + esc(t('라인명')) + '</dt><dd>' + esc(vt('line', sel.line)) + '</dd><dt>' + esc(t('현재 작업지시')) + '</dt><dd class="mono">WO2610' + pad(sel.id, 2) + '-' + pad(ri(rr, 1, 99), 4) + '</dd><dt>' + esc(t('품목명')) + '</dt><dd>' + esc(vt('item', sel.id)) + ' <span class="mono muted">' + itemCode(sel.id) + '</span></dd><dt>' + esc(t('계획수량')) + '</dt><dd>' + nf(p) + '</dd><dt>' + esc(t('생산수량')) + '</dt><dd>' + nf(Math.round(p * (0.5 + rr() * 0.45))) + '</dd><dt>' + esc(t('가동률')) + '</dt><dd>' + Math.round(70 + rr() * 28) + '%</dd><dt>' + esc(t('작업자')) + '</dt><dd>' + esc(vt('person', sel.id)) + '</dd></dl>'; })() : '<p class="muted">' + esc(t('배치도에서 설비를 누르세요')) + '</p>';
    return head(id, sc) + '<section class="panel" style="margin-bottom:16px"><div class="search"><div class="fld"><label>' + esc(t('라인선택')) + '</label><select class="input" data-act="flline"><option value="">' + esc(t('전체')) + '</option>' + V.line.map(function (l, i) { return '<option value="' + i + '"' + (String(i) === st.line ? ' selected' : '') + '>' + esc(l[LI]) + '</option>'; }).join('') + '</select></div>' +
      '<div class="fld wide"><label>' + esc(t('설비선택')) + '</label><select class="input" data-act="fleq"><option value="-1">' + esc(t('선택')) + '</option>' + eqs.filter(function (e) { return st.line === '' || String(e.line) === st.line; }).map(function (e) { return '<option value="' + e.id + '"' + (e.id === st.eq ? ' selected' : '') + '>' + esc(vt('eq', e.eqi) + ' · ' + vt('line', e.line)) + '</option>'; }).join('') + '</select></div>' +
      '<div class="lg chart" style="margin-left:auto">' + legend([0, 1, 2, 3].map(function (i) { return { name: vt('eqst', i), c: SC[i] }; })) + '</div></div></section>' +
      '<div class="layout2" style="grid-template-columns:minmax(0,2fr) minmax(0,1fr)"><section class="panel floor"><svg viewBox="0 0 900 560" role="img">' + svg + '</svg></section><section class="panel"><header><h2>' + esc(t('설비 상세')) + '</h2></header>' + det + '</section></div>';
  }
  function popScreen(id, sc) {
    var asm = id === 'C212010', st = S.pop[id] || (S.pop[id] = { wo: -1, run: false, good: 0, bad: 0, log: [] });
    var r = rng('pop' + id), wos = []; for (var i = 0; i < 6; i++) wos.push({ no: 'WO261019-' + pad(i + 1 + (asm ? 40 : 0), 4), item: ri(r, 0, 13), line: asm ? 5 + i % 3 : i % 4, plan: ri(r, 10, 60) * 10 });
    var w = wos[st.wo];
    return head(id, sc, '<span class="pill p-line">' + esc(t('팝업 차단 없이 이 화면에서 POP를 이어서 씁니다.')) + '</span>') +
      '<div class="pop"><div class="layout2"><section class="panel"><header><h2>' + esc(t('진행 중인 작업지시')) + '</h2></header><div class="gscroll"><table><thead><tr><th>' + esc(t('작업지시번호')) + '</th><th>' + esc(t('라인명')) + '</th><th>' + esc(t('품목명')) + '</th><th class="num">' + esc(t('지시수량')) + '</th></tr></thead><tbody>' +
      wos.map(function (x, i) { return '<tr data-act="popwo" data-v="' + i + '"' + (i === st.wo ? ' class="sel"' : '') + '><td class="mono">' + x.no + '</td><td>' + esc(vt('line', x.line)) + '</td><td>' + esc(vt('item', x.item)) + '</td><td class="num">' + nf(x.plan) + '</td></tr>'; }).join('') + '</tbody></table></div></section>' +
      '<section class="panel"><header><h2>' + (w ? esc(w.no) : esc(t('작업지시를 고르세요'))) + '</h2>' + (st.run ? '<span class="live">' + esc(t('가동')) + '</span>' : '') + '</header>' +
      '<div class="grid g2"><div class="kpi"><span class="kl">' + esc(t('양품')) + '</span><span class="counter up">' + nf(st.good) + '</span></div><div class="kpi"><span class="kl">' + esc(t('불량')) + '</span><span class="counter down">' + nf(st.bad) + '</span></div></div>' +
      (w ? '<div class="bar" style="margin-top:10px"><i style="width:' + Math.min(100, (st.good / w.plan) * 100) + '%"></i></div><p class="hint">' + nf(st.good) + ' / ' + nf(w.plan) + '</p>' : '') + '</section></div>' +
      '<div class="bigs">' + [['start', '작업 시작', 1], ['end', '작업 종료'], ['good', '실적 등록', 1], ['bad', '불량 등록'], ['down', '비가동 등록'], ['req', '자재 요청']].map(function (b) { return '<button type="button" class="' + (b[2] ? 'primary' : '') + '" data-act="pop" data-v="' + b[0] + '">' + esc(t(b[1])) + '</button>'; }).join('') + '</div>' +
      '<section class="panel"><header><h2>' + esc(t('작업 이력')) + '</h2></header>' + (st.log.length ? '<ul class="tl">' + st.log.slice(-8).reverse().map(function (l) { return '<li><span>' + esc(t(l[1])) + '</span><span class="muted">' + esc(show(l[2] || '')) + '</span><span class="mono muted">' + l[0] + '</span></li>'; }).join('') + '</ul>' : '<p class="muted">' + esc(t('조회된 데이터가 없습니다')) + '</p>') + '</section></div>';
  }
  var PDA_TABS = [['PDA-1', '추적성관리'], ['PDA-2', '출하완료'], ['PDA-3', '실적관리'], ['PDA-4', 'PIN번호']];
  function pdaScreen(id, sc) {
    var st = S.pda[id] || (S.pda[id] = { list: [], pin: '', yn: 'Y' }), sent = lsGet('mes.pda.' + id, []);
    var extra = id === 'PDA-3' ? '<div class="fld" style="flex:none"><label>' + esc(t('기대합부')) + '</label><div class="seg">' + ['Y', 'N'].map(function (v) { return '<button type="button" data-act="pdayn" data-v="' + v + '" class="' + (st.yn === v ? 'on' : '') + '">' + v + '</button>'; }).join('') + '</div></div>' :
      id === 'PDA-4' ? '<div class="fld" style="flex:none"><label>' + esc(t('PIN 번호')) + '</label><input class="input" id="pdaPin" value="' + esc(st.pin) + '" inputmode="numeric"></div>' : '';
    return head(id, sc) + '<div class="devwrap"><div class="pda" aria-label="' + esc(t('현장 단말 화면')) + '"><div class="scr"><div class="ttl"><span>' + esc(t(sc.name)) + '</span><span class="mono" style="font-size:11px">' + fmtDT(TODAY).slice(11) + '</span></div>' +
      '<div class="tabsm">' + PDA_TABS.map(function (p) { return '<button type="button" data-act="go" data-v="' + p[0] + '" class="' + (p[0] === id ? 'on' : '') + '">' + esc(t(p[1])) + '</button>'; }).join('') + '</div>' +
      '<label class="small muted" for="pdaScan">' + esc(t('바코드 스캔')) + '</label><div class="scan"><input class="input" id="pdaScan" placeholder="' + esc(t('바코드를 스캔하거나 입력하세요')) + '"><button type="button" class="btn primary" data-act="pdascan">' + esc(t('스캔')) + '</button></div>' + extra +
      '<div class="small muted">' + esc(t('스캔 목록')) + ' · ' + st.list.length + '</div><div class="list">' + (st.list.length ? st.list.map(function (x, i) { return '<div data-act="pdasel" data-v="' + i + '" style="' + (st.sel === i ? 'background:var(--accent-soft)' : '') + '"><span class="mono">' + esc(x.code) + '</span><span>' + esc(vt('item', x.item)) + '</span></div>'; }).join('') : '<div class="muted">' + esc(t('조회된 데이터가 없습니다')) + '</div>') + '</div>' +
      '<div class="bigbtns">' + ['저장', '삭제', '전송'].map(function (b) { return '<button type="button" class="btn' + (b === '전송' ? ' primary' : b === '삭제' ? ' danger' : '') + '" data-act="pdabtn" data-v="' + b + '">' + esc(t(b)) + '</button>'; }).join('') + '</div></div></div>' +
      '<section class="panel"><header><h2>' + esc(t('전송 이력')) + '</h2></header><div class="gscroll"><table><thead><tr><th>' + esc(t('일시')) + '</th><th>' + esc(t('기대번호')) + '</th><th>' + esc(t('품목명')) + '</th><th>' + esc(t('상태')) + '</th></tr></thead><tbody>' +
      (sent.length ? sent.slice().reverse().map(function (x) { return '<tr><td class="mono">' + x.at + '</td><td class="mono">' + esc(x.code) + '</td><td>' + esc(vt('item', x.item)) + '</td><td>' + pillFor('Y', esc(t('완료'))) + '</td></tr>'; }).join('') : '<tr><td colspan="4" class="gempty">' + esc(t('조회된 데이터가 없습니다')) + '</td></tr>') + '</tbody></table></div></section></div>';
  }
  function gmeScreen(id, sc) {
    var st = S.gme || (S.gme = { code: '' });
    var html = head(id, sc, btnHtml('결함/정비 관리')) + '<section class="panel" style="margin-bottom:16px"><div class="search"><div class="fld wide"><label>' + esc(t('정비 등록 대상')) + '</label><input class="input" id="gmeCode" value="' + esc(st.code) + '" placeholder="K26xxxxxx"></div><div class="sacts"><button type="button" class="btn primary" data-act="btn" data-v="바코드R">' + esc(t('바코드R')) + '</button></div></div>' +
      (st.code ? (function () { var r = rng(st.code); return '<dl class="kv facts" style="margin-top:14px"><dt>' + esc(t('기대번호')) + '</dt><dd class="mono">' + esc(st.code) + '</dd><dt>' + esc(t('품목명')) + '</dt><dd>' + esc(vt('item', ri(r, 0, 13))) + '</dd><dt>' + esc(t('라인명')) + '</dt><dd>' + esc(vt('line', ri(r, 5, 7))) + '</dd><dt>' + esc(t('상태')) + '</dt><dd>' + pillFor(tok('status', 1), esc(vt('status', 1))) + '</dd></dl>'; })() : '<p class="hint" style="margin-top:10px">' + esc(t('바코드를 읽으면 기대 정보가 표시됩니다')) + '</p>') + '</section>';
    var G = getGrid(id, sc, 0, st.code || 'none'); S.active = G.key;
    return html + gridHtml(G, sc, t(sc.name), ['추가', '삭제', '저장', '취소'].map(btnHtml).join(''));
  }
  var SET_FIELDS = [['자동 로그아웃 시간(분)', 60], ['비밀번호 오류 허용 횟수', 5], ['비밀번호 유효기간(일)', 90], ['데이터 수집 주기(초)', 10], ['모니터링 갱신 주기(초)', 60]];
  function settingsScreen(id, sc) {
    var v = lsGet('mes.settings', {});
    return head(id, sc, btnHtml('초기화') + '<button type="button" class="btn primary" data-act="setsave">' + esc(t('저장')) + '</button>') +
      '<section class="panel"><form class="setform" id="setForm">' + SET_FIELDS.map(function (f, i) { return '<div class="fld"><label for="sf' + i + '">' + esc(t(f[0])) + '</label><input id="sf' + i + '" class="input" type="number" min="1" value="' + (v[i] != null ? v[i] : f[1]) + '"></div>'; }).join('') + '</form></section>';
  }
  function profileScreen(id, sc) {
    var u = S.user;
    var ro = [['아이디', u.id], ['성명', vt('person', u.p)], ['부서', vt('dept', u.dept)], ['권한그룹', t(u.role)]];
    return head(id, sc, '<button type="button" class="btn primary" data-act="pwsave">' + esc(t('저장')) + '</button>') + '<section class="panel"><form class="setform" id="pwForm">' +
      ro.map(function (x) { return '<div class="fld"><label>' + esc(t(x[0])) + '</label><input class="input" value="' + esc(x[1]) + '" disabled></div>'; }).join('') +
      ['현재 비밀번호', '새 비밀번호', '새 비밀번호 확인'].map(function (x, i) { return '<div class="fld"><label for="pw' + i + '">' + esc(t(x)) + '</label><input id="pw' + i + '" class="input" type="password" autocomplete="new-password"></div>'; }).join('') + '</form></section>';
  }
  function workdayScreen(id, sc) {
    var html = genericScreen(id, sc);
    var st = S.wd || (S.wd = { day: TODAY.getDate() });
    var first = new Date(2026, 9, 1).getDay(), cells = '';
    for (var b = 0; b < first; b++) cells += '<button type="button" class="blank" tabindex="-1"></button>';
    for (var d = 1; d <= 31; d++) { var dow = (first + d - 1) % 7, off = dow === 0 || dow === 6 || d === 3 || d === 9; cells += '<button type="button" data-act="wday" data-v="' + d + '" class="' + (off ? 'off ' : '') + (st.day === d ? 'sel' : '') + '"><b>' + d + '</b><small>' + esc(t(off ? '휴일' : '근무일')) + '</small>' + (off ? '' : '<small>' + ri(rng('wd' + d), 18, 26) + ' / 480' + esc(t('분')) + '</small>') + '</button>'; }
    var cal = '<section class="panel" style="margin-bottom:16px"><header><h2>2026-10</h2></header><div class="cal">' + V.week.map(function (w) { return '<span class="dw">' + esc(w[LI]) + '</span>'; }).join('') + cells + '</div></section>';
    var i = html.indexOf('<section class="panel gpanel');
    return html.slice(0, i) + cal + html.slice(i);
  }

  /* ---------------- 대화상자 ---------------- */
  function modal(title, body, foot, sm) {
    closeModal();
    var bg = document.createElement('div'); bg.className = 'modal-bg'; bg.id = 'modal';
    bg.innerHTML = '<div class="modal' + (sm ? ' sm' : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><header><h2>' + esc(title) + '</h2><button type="button" class="x" data-act="mclose" aria-label="' + esc(t('닫기')) + '">×</button></header>' + body + '<footer>' + foot + '</footer></div>';
    document.body.appendChild(bg);
    bg.addEventListener('mousedown', function (e) { if (e.target === bg) closeModal(); });
    var f = bg.querySelector('input,select,button.btn'); if (f) f.focus();
    return bg;
  }
  function closeModal() { var m = document.getElementById('modal'); if (m) m.remove(); }
  function confirmBox(msg, ok) {
    var m = modal(t('확인'), '<p>' + esc(msg) + '</p>', '<button type="button" class="btn" data-act="mclose">' + esc(t('취소')) + '</button><button type="button" class="btn primary" id="mok">' + esc(t('확인')) + '</button>', true);
    m.querySelector('#mok').onclick = function () { closeModal(); ok(); };
  }
  function inputFor(c, v, i) {
    var k = c.kind, key = TOKEN_KIND[k];
    if (key) return '<select class="input" data-i="' + i + '">' + V[key].map(function (x, j) { var tv = tok(key, j); return '<option value="' + tv + '"' + (tv === v ? ' selected' : '') + '>' + esc(x[LI]) + '</option>'; }).join('') + '</select>';
    if (k === 'enum') return '<select class="input" data-i="' + i + '">' + enumOpts(c.en).map(function (o) { return '<option value="¶' + esc(o) + '"' + ('¶' + o === v ? ' selected' : '') + '>' + esc(t(o)) + '</option>'; }).join('') + '</select>';
    if (k === 'yn') return '<select class="input" data-i="' + i + '"><option' + (v === 'Y' ? ' selected' : '') + '>Y</option><option' + (v === 'N' ? ' selected' : '') + '>N</option></select>';
    if (k === 'bool') return '<select class="input" data-i="' + i + '"><option value="1"' + (v ? ' selected' : '') + '>✓</option><option value="0"' + (!v ? ' selected' : '') + '>-</option></select>';
    if (k === 'date') return '<input class="input" type="date" data-i="' + i + '" value="' + esc(v || fmtDate(TODAY)) + '">';
    if (k === 'dt') return '<input class="input" type="datetime-local" data-i="' + i + '" value="' + esc(String(v || fmtDT(TODAY)).replace(' ', 'T')) + '">';
    if (NUMK[k]) return '<input class="input" type="number" step="any" data-i="' + i + '" value="' + (v == null ? '' : v) + '">';
    return '<input class="input" type="text" data-i="' + i + '" value="' + esc(v == null ? '' : v) + '">';
  }
  function rowForm(G, row, isNew) {
    var cols = G.cols, base = row || genRows(G.key + '+' + Date.now(), cols, 1)[0];
    if (isNew) cols.forEach(function (c, i) { if (c.kind === 'idx') base.c[i] = G.rows.length + 1; });
    var body = '<form class="form" id="rowForm">' + cols.map(function (c, i) { return c.kind === 'idx' ? '' : '<div class="fld"><label>' + esc(t(c.lab)) + (i < 3 ? ' *' : '') + '</label>' + inputFor(c, base.c[i], i) + '</div>'; }).join('') + '</form>';
    var m = modal(t(isNew ? '등록' : '수정') + ' · ' + t(SCREENS[G.sid].name), body, '<button type="button" class="btn" data-act="mclose">' + esc(t('취소')) + '</button><button type="button" class="btn primary" id="mok">' + esc(t('저장')) + '</button>');
    m.querySelector('#mok').onclick = function () {
      var vals = base.c.slice(), bad = false;
      m.querySelectorAll('[data-i]').forEach(function (el) {
        var i = +el.getAttribute('data-i'), c = cols[i], v = el.value;
        if (i < 3 && c.kind !== 'idx' && v === '') { bad = true; el.style.borderColor = 'var(--crit)'; }
        if (NUMK[c.kind]) v = v === '' ? 0 : +v; else if (c.kind === 'bool') v = v === '1'; else if (c.kind === 'dt') v = v.replace('T', ' ');
        vals[i] = v;
      });
      if (bad) { toast(t('입력값을 확인하세요'), 'err'); return; }
      if (isNew) { G.rows.unshift({ id: G.key + '#n' + Date.now(), lvl: 0, c: vals }); G.sel = 0; } else row.c = vals;
      G.dirty = true; persist(G); closeModal(); renderMain(); toast(t(isNew ? '등록했습니다' : '수정했습니다'));
    };
  }
  function persist(G) { lsSet(G.key, G.rows); G.dirty = false; }
  function pickModal(kind, onPick) {
    var key = kind === 'eq' ? 'eq' : 'item';
    var draw = function (q) {
      return V[key].map(function (x, i) { return { i: i, code: key === 'eq' ? eqCode(i) : itemCode(i), name: x[LI] }; }).filter(function (o) { return !q || norm(o.code + o.name).indexOf(norm(q)) >= 0; })
        .map(function (o) { return '<tr data-pick="' + o.i + '"><td class="mono">' + o.code + '</td><td>' + esc(o.name) + '</td></tr>'; }).join('') || '<tr><td colspan="2" class="gempty">' + esc(t('조회된 데이터가 없습니다')) + '</td></tr>';
    };
    var m = modal(t(key === 'eq' ? '설비 검색' : '품목 검색'), '<div class="toolbar"><input class="input grow" id="pq" placeholder="' + esc(t('코드나 이름 입력')) + '"></div><div class="gscroll" style="max-height:360px"><table><thead><tr><th>' + esc(t(key === 'eq' ? '설비코드' : '품목코드')) + '</th><th>' + esc(t(key === 'eq' ? '설비명' : '품목명')) + '</th></tr></thead><tbody id="pbody">' + draw('') + '</tbody></table></div>', '<button type="button" class="btn" data-act="mclose">' + esc(t('닫기')) + '</button>');
    m.querySelector('#pq').oninput = function (e) { m.querySelector('#pbody').innerHTML = draw(e.target.value); };
    m.querySelector('#pbody').onclick = function (e) { var tr = e.target.closest('[data-pick]'); if (!tr) return; var i = +tr.getAttribute('data-pick'); closeModal(); onPick(i, key === 'eq' ? eqCode(i) : itemCode(i), vt(key, i)); };
  }
  function uploadModal(G) {
    var m = modal(t('엑셀 업로드'), '<p>' + esc(t('샘플 양식의 컬럼 순서대로 작성한 파일을 올리면 목록에 추가됩니다.')) + '</p><div class="drop" style="margin-top:12px"><input type="file" id="upf" accept=".csv,.xlsx,.xls"><div class="hint">' + esc(t('파일을 선택하세요 (CSV·XLSX)')) + '</div></div>', '<button type="button" class="btn" data-act="mclose">' + esc(t('취소')) + '</button><button type="button" class="btn primary" id="mok">' + esc(t('업로드')) + '</button>');
    m.querySelector('#mok').onclick = function () {
      var f = m.querySelector('#upf').files[0];
      var done = function (rows) { rows.forEach(function (r) { G.rows.unshift(r); }); persist(G); closeModal(); renderMain(); toast(rows.length + t('건을 업로드했습니다')); };
      var fallback = function () { done(genRows(G.key + 'up' + Date.now(), G.cols, 3)); };
      if (!f || !/\.csv$/i.test(f.name)) { fallback(); return; }
      var rd = new FileReader();
      rd.onload = function () {
        var lines = String(rd.result).replace(/^﻿/, '').split(/\r?\n/).filter(Boolean).slice(1);
        var rows = lines.map(function (ln, n) { var p = ln.split(','); return { id: G.key + '#u' + Date.now() + n, lvl: 0, c: G.cols.map(function (c, i) { var v = p[i] == null ? '' : p[i].replace(/^"|"$/g, ''); return NUMK[c.kind] ? (+v || 0) : v; }) }; });
        if (rows.length) done(rows); else fallback();
      };
      rd.readAsText(f, 'utf-8');
    };
  }
  function download(name, text) {
    var blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function csvCell(s) { s = String(s == null ? '' : s); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  function exportGrid(G, all, headerOnly) {
    var sc = SCREENS[G.sid], rows = headerOnly ? [] : all ? G.rows : viewRows(G, sc);
    var txt = G.cols.map(function (c) { return csvCell(t(c.lab)); }).join(',') + '\n' + rows.map(function (r) { return r.c.map(function (v, i) { return csvCell(G.cols[i].kind === 'rate' ? v : show(v)); }).join(','); }).join('\n');
    download(t(sc.name).replace(/[\\/:*?"<>|]/g, '_') + (headerOnly ? '_sample' : '_' + fmtDate(TODAY)) + '.csv', txt);
    toast(t('엑셀 파일을 내려받았습니다'));
  }
  function setField(id, re, val) {
    var form = document.querySelector('[data-search="' + id + '"]'); if (!form) return false;
    var sc = SCREENS[id], seen = {}, ok = false;
    sc.labels.filter(function (l) { if (seen[l[1]]) return false; seen[l[1]] = 1; return true; }).forEach(function (l, i) { if (re.test(l[1])) { var el = form.querySelector('[data-f="f' + i + '"]'); if (el) { el.value = val; ok = true; } } });
    return ok;
  }
  function doBtn(b) {
    var id = S.route, sc = SCREENS[id], G = S.grids[S.active];
    var a = actOf(b);
    if (b === '정지' || b === '시작') { S.tb.run = b === '시작'; startTimers(); renderMain(); return; }
    if (b === '초기화' && id === 'C210040') { confirmBox(t('처리할까요?'), function () { lsSet('mes.settings', {}); renderMain(); toast(t('설정을 기본값으로 되돌렸습니다')); }); return; }
    if (b === '바코드R') { var el = document.getElementById('gmeCode'); S.gme.code = (el && el.value.trim()) || 'K26' + pad(ri(rng(Date.now()), 1000, 99999), 6); renderMain(); return; }
    if (b === '결함/정비 관리') { var g2 = getGrid(id, sc, 1, S.gme.code || 'none'); modal(t(b), gridHtml(g2, sc, t(b)), '<button type="button" class="btn" data-act="mclose">' + esc(t('닫기')) + '</button>'); return; }
    if (a === 'pickItem' || a === 'pickEq') {
      pickModal(a === 'pickEq' ? 'eq' : 'item', function (i, code, name) {
        var hit = a === 'pickEq' ? setField(id, /설비(번호|코드)/, code) | setField(id, /설비명/, name) : setField(id, /(품목코드|품번|제품코드)/, code) | setField(id, /(품목명|품명|제품명)/, name);
        if (!hit && G) { var ci = G.cols.findIndex(function (c) { return c.kind === (a === 'pickEq' ? 'ecode' : 'icode'); }); if (ci >= 0) { G.rows.forEach(function (r, k) { if (k % 3 === 0) r.c[ci] = code; }); } }
        readSearch(id); renderMain();
      });
      return;
    }
    if (!G) { toast(t('처리했습니다')); return; }
    if (a === 'excel' || a === 'excelAll') return exportGrid(G, a === 'excelAll');
    if (a === 'sample') return exportGrid(G, false, true);
    if (a === 'upload') return uploadModal(G);
    if (a === 'add') return rowForm(G, null, true);
    var row = G.rows[G.sel];
    if (a === 'edit') { if (!row) return toast(t('행을 먼저 선택하세요'), 'err'); return rowForm(G, row, false); }
    if (a === 'del') { if (!row) return toast(t('행을 먼저 선택하세요'), 'err'); return confirmBox(t('선택한 행을 삭제할까요?'), function () { G.rows.splice(G.sel, 1); G.sel = Math.max(0, G.sel - 1); persist(G); renderMain(); toast(t('삭제했습니다')); }); }
    if (a === 'delAll') return confirmBox(t('목록의 모든 행을 삭제할까요?'), function () { G.rows = []; G.sel = 0; persist(G); renderMain(); toast(t('삭제했습니다')); });
    if (a === 'save') { persist(G); if (/전송/.test(b)) markSent(G); toast(t('저장했습니다')); return; }
    if (a === 'revert') { delete S.grids[G.key]; S.active = null; renderMain(); toast(t('저장하지 않은 변경을 되돌렸습니다')); return; }
    confirmBox(t(b) + ' — ' + t('처리할까요?'), function () { markSent(G); toast(t(b) + ' · ' + t('처리했습니다')); });
  }
  function markSent(G) {
    var row = G.rows[G.sel]; if (!row) return;
    G.cols.forEach(function (c, i) { if (c.kind === 'yn' && /전송|처리|완료|승인/.test(c.lab)) row.c[i] = 'Y'; if (c.kind === 'status') row.c[i] = tok('status', 2); });
    persist(G); renderMain();
  }

  /* ---------------- 렌더링 ---------------- */
  function screenHtml(id) {
    var sc = SCREENS[id];
    if (id === 'P0001') return boardScreen(id, sc);
    if (id === 'C205010') return teamBoard(id, sc);
    if (id === 'C205020') return floorScreen(id, sc);
    if (id === 'C211010' || id === 'C212010') return popScreen(id, sc);
    if (/^PDA-/.test(id)) return pdaScreen(id, sc);
    if (id === 'GME_CRE') return gmeScreen(id, sc);
    if (id === 'C210040') return settingsScreen(id, sc);
    if (id === 'C902003') return profileScreen(id, sc);
    if (id === 'C201060') return workdayScreen(id, sc);
    return genericScreen(id, sc);
  }
  S.pop = {}; S.pda = {};
  function startTimers() {
    clearTimers();
    if (S.route === 'P0001') S.timers.push(setInterval(function () { S.tick = (S.tick || 0) + 1; renderMain(); }, 5000));
    if (S.route === 'C205010' && S.tb && S.tb.run) S.timers.push(setInterval(function () { S.tick = (S.tick || 0) + 1; renderMain(); }, (+S.tb.sec || 30) * 1000 / 10));
  }
  function renderMain() {
    var m = document.getElementById('main'); if (!m) return render();
    var y = window.scrollY, sc = {}; m.querySelectorAll('.gscroll').forEach(function (g, i) { sc[i] = [g.scrollTop, g.scrollLeft]; });
    m.innerHTML = screenHtml(S.route);
    m.querySelectorAll('.gscroll').forEach(function (g, i) { if (sc[i]) { g.scrollTop = sc[i][0]; g.scrollLeft = sc[i][1]; } });
    window.scrollTo(0, y);
  }
  function render() {
    document.documentElement.lang = LANG;
    LI = LANG === 'ko' ? 0 : LANG === 'en' ? 1 : 2;
    document.title = t('자동차부품 제조업 MES');
    if (!S.user) return renderLogin();
    var id = (location.hash.match(/^#\/(.+)$/) || [])[1];
    if (!id || !SCREENS[id]) { id = 'P0001'; history.replaceState(null, '', '#/P0001'); }
    if (id !== S.route) { S.route = id; S.active = null; S.notif = false; }
    var navEl = document.querySelector('.navwrap'), ns = navEl ? navEl.scrollTop : 0;
    root.innerHTML = shell(screenHtml(id), SCREENS[id]);
    var nv = document.querySelector('.navwrap'); if (nv) { nv.scrollTop = ns; var cur = nv.querySelector('[aria-current="page"]'); if (cur && !ns) cur.scrollIntoView({ block: 'center' }); }
    document.title = t(SCREENS[id].name) + ' · ' + t('자동차부품 제조업 MES');
    startTimers();
  }

  /* ---------------- 이벤트 ---------------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]'); if (!el) { if (S.notif && !e.target.closest('.notif')) { S.notif = false; render(); } return; }
    var act = el.getAttribute('data-act'), v = el.getAttribute('data-v');
    switch (act) {
      case 'lang': LANG = v; lsSet('mes.lang', v); render(); break;
      case 'theme': var nt = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'; document.documentElement.dataset.theme = nt; lsSet('mes.theme', nt); render(); break;
      case 'lmode': S.loginMode = v; renderLogin(); break;
      case 'logout': S.user = null; ssSet('mes.user', null); clearTimers(); renderLogin(); break;
      case 'grp': var g = D.menu.find(function (x) { return x[0] === v; }), has = g[1].some(function (x) { return x[0] === S.route; }); var cur = S.open[v] != null ? S.open[v] : has; S.open[v] = !cur; lsSet('mes.navopen', S.open); render(); break;
      case 'notif': S.notif = !S.notif; render(); break;
      case 'go': if (el.getAttribute('data-line') != null) S.fl = { line: el.getAttribute('data-line'), eq: -1 }; location.hash = '#/' + v; break;
      case 'reset': var sid = S.route; S.search[sid] = {}; Object.keys(S.grids).forEach(function (k) { if (S.grids[k].sid === sid) S.grids[k].sort = null; }); renderMain(); break;
      case 'sort': var G = S.grids[el.getAttribute('data-g')]; if (G) { var i = +v; G.sort = G.sort && G.sort[0] === i ? (G.sort[1] > 0 ? [i, -1] : null) : [i, 1]; S.active = G.key; inModal(el) ? refreshModal(G) : renderMain(); } break;
      case 'row': var G2 = S.grids[el.getAttribute('data-g')]; if (G2) { G2.sel = +v; S.active = G2.key; inModal(el) ? refreshModal(G2) : renderMain(); } break;
      case 'tab': S.tab = S.tab || {}; S.tab[S.route] = +v; S.active = null; renderMain(); break;
      case 'btn': doBtn(v); break;
      case 'mclose': closeModal(); break;
      case 'tbteam': S.tb.team = +v; renderMain(); break;
      case 'eq': S.fl.eq = +v; renderMain(); break;
      case 'wday': S.wd.day = +v; var G3 = S.grids[S.active]; if (G3) { var di = G3.cols.findIndex(function (c) { return c.kind === 'date' || c.lab === '날짜'; }); var target = '2026-10-' + pad(+v); var k = G3.rows.findIndex(function (r) { return String(r.c[di]).slice(0, 10) === target; }); if (k < 0 && di >= 0 && G3.rows[0]) { G3.rows[0].c[di] = target; k = 0; } G3.sel = Math.max(0, k); } renderMain(); break;
      case 'popwo': S.pop[S.route].wo = +v; renderMain(); break;
      case 'pop': popAct(v); break;
      case 'pdascan': pdaScan(); break;
      case 'pdasel': S.pda[S.route].sel = +v; renderMain(); break;
      case 'pdayn': S.pda[S.route].yn = v; renderMain(); break;
      case 'pdabtn': pdaAct(v); break;
      case 'setsave': var vals = {}; SET_FIELDS.forEach(function (f, i) { vals[i] = +document.getElementById('sf' + i).value || f[1]; }); lsSet('mes.settings', vals); toast(t('저장했습니다')); break;
      case 'pwsave': var p = [0, 1, 2].map(function (i) { return document.getElementById('pw' + i).value; }); if (!p[0]) return toast(t('필수 입력') + ': ' + t('현재 비밀번호'), 'err'); if (p[1].length < 8) return toast(t('비밀번호는 8자 이상이어야 합니다'), 'err'); if (p[1] !== p[2]) return toast(t('새 비밀번호가 서로 다릅니다'), 'err'); [0, 1, 2].forEach(function (i) { document.getElementById('pw' + i).value = ''; }); toast(t('비밀번호를 바꿨습니다')); break;
    }
  });
  function inModal(el) { return !!el.closest('#modal'); }
  function refreshModal(G) { var m = document.querySelector('#modal .modal'); if (!m) return; var sc = SCREENS[G.sid], p = m.querySelector('.gpanel'); if (p) p.outerHTML = gridHtml(G, sc, t('결함/정비 관리')); }
  document.addEventListener('change', function (e) {
    var el = e.target, act = el.getAttribute('data-act');
    if (act === 'tbsec') { S.tb.sec = el.value; startTimers(); renderMain(); }
    if (act === 'flline') { S.fl.line = el.value; S.fl.eq = -1; renderMain(); }
    if (act === 'fleq') { S.fl.eq = +el.value; renderMain(); }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-search]'); if (!f) return;
    e.preventDefault(); var id = f.getAttribute('data-search'); readSearch(id);
    Object.keys(S.grids).forEach(function (k) { if (S.grids[k].sid === id) S.grids[k].sel = 0; });
    renderMain();
  });
  document.addEventListener('input', function (e) {
    if (e.target.id !== 'tsq') return;
    var q = norm(e.target.value), box = document.getElementById('sres');
    if (!q) { box.hidden = true; return; }
    var hits = ORDER.filter(function (id) { return norm(id + t(SCREENS[id].name) + SCREENS[id].name).indexOf(q) >= 0; }).slice(0, 12);
    box.innerHTML = hits.length ? hits.map(function (id, i) { return '<button type="button" data-act="go" data-v="' + id + '" class="' + (i === 0 ? 'on' : '') + '"><span>' + esc(t(SCREENS[id].name)) + ' <span class="muted small">· ' + esc(t(groupOf(id))) + '</span></span><small>' + id + '</small></button>'; }).join('') : '<div class="empty">' + esc(t('찾는 화면이 없습니다')) + '</div>';
    box.hidden = false;
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); var b = document.getElementById('sres'); if (b) b.hidden = true; }
    if (e.key === 'Enter' && e.target.id === 'tsq') { var f = document.querySelector('#sres button[data-v]'); if (f) { e.preventDefault(); location.hash = '#/' + f.getAttribute('data-v'); } }
    if (e.key === 'Enter' && e.target.id === 'pdaScan') { e.preventDefault(); pdaScan(); }
    if (e.key === 'Enter' && e.target.id === 'gmeCode') { e.preventDefault(); doBtn('바코드R'); }
  });
  function popAct(v) {
    var st = S.pop[S.route], now = fmtDT(new Date()).slice(11);
    if (v === 'req') { st.log.push([now, '자재 요청', tok('item', 3)]); toast(t('자재 요청') + ' · ' + t('처리했습니다')); return renderMain(); }
    if (st.wo < 0) return toast(t('작업지시를 고르세요'), 'err');
    if (v === 'start') { st.run = true; st.log.push([now, '작업 시작', '']); }
    else if (!st.run && v !== 'end') return toast(t('작업을 먼저 시작하세요'), 'err');
    if (v === 'end') { st.run = false; st.log.push([now, '작업 종료', nf(st.good) + ' / ' + nf(st.bad)]); }
    if (v === 'good') { st.good += 10; st.log.push([now, '실적 등록', '+10']); }
    if (v === 'bad') { st.bad += 1; st.log.push([now, '불량 등록', tok('defect', st.bad % 7)]); }
    if (v === 'down') { st.log.push([now, '비가동 등록', tok('loss', st.log.length % 6)]); }
    renderMain();
  }
  function pdaScan() {
    var st = S.pda[S.route], el = document.getElementById('pdaScan'), code = (el && el.value.trim()) || ('K26' + pad(ri(rng(Date.now()), 1000, 99999), 6));
    var pin = document.getElementById('pdaPin'); if (pin) st.pin = pin.value;
    st.list.push({ code: code, item: hash(code) % V.item.length }); st.sel = st.list.length - 1; renderMain();
    var ne = document.getElementById('pdaScan'); if (ne) ne.focus();
  }
  function pdaAct(b) {
    var id = S.route, st = S.pda[id];
    if (b === '저장') { lsSet('mes.pdaDraft.' + id, st.list); return toast(t('저장했습니다')); }
    if (b === '삭제') { if (st.sel == null || !st.list[st.sel]) return toast(t('행을 먼저 선택하세요'), 'err'); st.list.splice(st.sel, 1); st.sel = null; renderMain(); return toast(t('삭제했습니다')); }
    if (!st.list.length) return toast(t('전송할 항목이 없습니다'), 'err');
    var sent = lsGet('mes.pda.' + id, []), at = fmtDT(new Date());
    st.list.forEach(function (x) { sent.push({ at: at, code: x.code, item: x.item }); });
    lsSet('mes.pda.' + id, sent.slice(-30)); st.list = []; renderMain(); toast(t('전송했습니다'));
  }
  window.addEventListener('hashchange', render);
  render();
})();
