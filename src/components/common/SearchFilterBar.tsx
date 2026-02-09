import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import type { SearchCondition } from '../../types';

interface SearchFilterBarProps {
  onSearch?: (query: string) => void;
  condition: SearchCondition;
  onConditionChange: (condition: SearchCondition) => void;
  onConfirm: () => void;
}

export default function SearchFilterBar({
  onSearch,
  condition,
  onConditionChange,
  onConfirm
}: SearchFilterBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState<'normal' | 'monthly'>('normal');
  const [activeQuickOption, setActiveQuickOption] = useState<string | null>('2시간');
  const [showMonthlyOptions, setShowMonthlyOptions] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);

  const QUICK_TIME_OPTIONS = [
    { label: '1시간', hours: 1 },
    { label: '2시간', hours: 2 },
    { label: '4시간', hours: 4 },
    { label: '6시간', hours: 6 }
  ];

  const QUICK_DAY_OPTIONS = [
    { label: '일주차', days: 1 },
    { label: '2일', days: 2 },
    { label: '3일', days: 3 },
    { label: '7일', days: 7 }
  ];

  useEffect(() => {
    if (!condition.startDateTime) {
      const now = new Date();
      // 10분 단위로 반올림
      const minutes = now.getMinutes();
      const roundedMinutes = Math.ceil(minutes / 10) * 10;
      now.setMinutes(roundedMinutes, 0, 0);

      const defaultEnd = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      onConditionChange({
        basis: 'FUTURE',
        startDateTime: now.toISOString(),
        endDateTime: defaultEnd.toISOString()
      });
    }
  }, []);

  // PickerPortal이 이제 외부 클릭을 처리하므로 여기서는 불필요

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const formatDateTime = (isoString: string | undefined) => {
    if (!isoString) return { date: '', time: '', displayTime: '' };
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;

    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      time: date.toTimeString().slice(0, 5),
      displayTime: `${period} ${displayHours}:${String(minutes).padStart(2, '0')}`
    };
  };

  const parseDateString = (dateStr: string, currentYear?: number) => {
    // Parse MM/DD format
    const parts = dateStr.split('/');
    if (parts.length !== 2) return null;

    const month = parseInt(parts[0]) - 1; // 0-indexed
    const day = parseInt(parts[1]);

    if (isNaN(month) || isNaN(day) || month < 0 || month > 11 || day < 1 || day > 31) {
      return null;
    }

    const year = currentYear || new Date().getFullYear();
    const date = new Date(year, month, day);

    // Validate that the date is correct (handles invalid dates like 2/30)
    if (date.getMonth() !== month || date.getDate() !== day) {
      return null;
    }

    return date;
  };

  const handleStartChange = (dateStr: string, time: string) => {
    const parsedDate = parseDateString(dateStr);
    if (!parsedDate) return; // Invalid date format

    const [hours, minutes] = time.split(':').map(Number);
    parsedDate.setHours(hours, minutes, 0, 0);
    const startDateTime = parsedDate.toISOString();

    onConditionChange({
      basis: 'FUTURE',
      startDateTime,
      endDateTime: condition.endDateTime || new Date(parsedDate.getTime() + 2 * 60 * 60 * 1000).toISOString()
    });
    setActiveQuickOption(null);
    setShowMonthlyOptions(false);
    setActiveTab('normal');
  };

  const handleEndChange = (dateStr: string, time: string) => {
    const parsedDate = parseDateString(dateStr);
    if (!parsedDate) return; // Invalid date format

    const [hours, minutes] = time.split(':').map(Number);
    parsedDate.setHours(hours, minutes, 0, 0);
    const endDateTime = parsedDate.toISOString();

    // 종료일시가 시작일시보다 앞서지 않도록 검증
    if (condition.startDateTime && new Date(endDateTime) <= new Date(condition.startDateTime)) {
      return; // 시작일시보다 이전이면 업데이트하지 않음
    }

    onConditionChange({
      basis: 'FUTURE',
      endDateTime
    });
    setActiveQuickOption(null);
    setShowMonthlyOptions(false);
    setActiveTab('normal');
  };

  const handleQuickHours = (hours: number, label: string) => {
    // 월주차 모드에서도 동작하도록 기본값 생성
    let start: Date;
    if (!condition.startDateTime) {
      start = new Date();
      const minutes = start.getMinutes();
      const roundedMinutes = Math.ceil(minutes / 10) * 10;
      start.setMinutes(roundedMinutes, 0, 0);
    } else {
      start = new Date(condition.startDateTime);
    }
    const end = new Date(start.getTime() + hours * 60 * 60 * 1000);

    onConditionChange({
      basis: 'FUTURE',
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString()
    });
    setActiveQuickOption(label);
    setShowMonthlyOptions(false);
    setActiveTab('normal');
  };

  const handleQuickDays = (days: number, label: string) => {
    // 월주차 모드에서도 동작하도록 기본값 생성
    let start: Date;
    if (!condition.startDateTime) {
      start = new Date();
      const minutes = start.getMinutes();
      const roundedMinutes = Math.ceil(minutes / 10) * 10;
      start.setMinutes(roundedMinutes, 0, 0);
    } else {
      start = new Date(condition.startDateTime);
    }
    const end = new Date(start);
    // 시작일 포함한 days일의 마지막 날 23:59로 설정
    end.setDate(start.getDate() + (days - 1));
    end.setHours(23, 59, 0, 0);

    onConditionChange({
      basis: 'FUTURE',
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString()
    });
    setActiveQuickOption(label);
    setShowMonthlyOptions(false);
    setActiveTab('normal');
  };

  const handleStartDateSelect = (date: Date) => {
    const currentStart = condition.startDateTime ? new Date(condition.startDateTime) : new Date();
    date.setHours(currentStart.getHours(), currentStart.getMinutes(), 0, 0);

    onConditionChange({
      basis: 'FUTURE',
      startDateTime: date.toISOString(),
      endDateTime: condition.endDateTime || new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString()
    });
    setActiveQuickOption(null);
    setShowMonthlyOptions(false);
    setActiveTab('normal');
    setShowStartDatePicker(false);
    setShowStartTimePicker(true);
  };

  const handleStartTimeSelect = (time: string) => {
    const currentStart = condition.startDateTime ? new Date(condition.startDateTime) : new Date();
    const [hours, minutes] = time.split(':').map(Number);
    currentStart.setHours(hours, minutes, 0, 0);

    onConditionChange({
      basis: 'FUTURE',
      startDateTime: currentStart.toISOString()
    });
    setActiveQuickOption(null);
    setShowMonthlyOptions(false);
    setActiveTab('normal');
    setShowStartTimePicker(false);
  };

  const handleEndTimeSelect = (time: string) => {
    const currentEnd = condition.endDateTime ? new Date(condition.endDateTime) : new Date();
    const [hours, minutes] = time.split(':').map(Number);
    currentEnd.setHours(hours, minutes, 0, 0);

    // 종료일시가 시작일시보다 앞서지 않도록 검증
    if (condition.startDateTime && currentEnd <= new Date(condition.startDateTime)) {
      return;
    }

    onConditionChange({
      basis: 'FUTURE',
      endDateTime: currentEnd.toISOString()
    });
    setActiveQuickOption(null);
    setShowMonthlyOptions(false);
    setActiveTab('normal');
    setShowEndTimePicker(false);
  };

  const handleEndDateSelect = (date: Date) => {
    const currentEnd = condition.endDateTime ? new Date(condition.endDateTime) : new Date();
    date.setHours(currentEnd.getHours(), currentEnd.getMinutes(), 0, 0);

    // 종료일시가 시작일시보다 앞서지 않도록 검증
    if (condition.startDateTime && date <= new Date(condition.startDateTime)) {
      return; // 시작일시보다 이전이면 업데이트하지 않음
    }

    onConditionChange({
      basis: 'FUTURE',
      endDateTime: date.toISOString()
    });
    setActiveQuickOption(null);
    setShowMonthlyOptions(false);
    setActiveTab('normal');
    setShowEndDatePicker(false);
  };

  const handleTomorrowClick = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 내일 오전 9시로 설정

    const end = new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000); // 2시간 후

    onConditionChange({
      basis: 'FUTURE',
      startDateTime: tomorrow.toISOString(),
      endDateTime: end.toISOString()
    });
    setActiveQuickOption('내일');
    setShowMonthlyOptions(false);
    setActiveTab('normal');
  };

  const handleMonthlyClick = () => {
    setShowMonthlyOptions(true);
    setActiveQuickOption('월주차');
    setActiveTab('monthly');
  };

  const handleMonthSelect = (monthOffset: 0 | 1) => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthOffset);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    onConditionChange({
      basis: 'FUTURE',
      type: 'MONTHLY',
      month
    });
    setActiveQuickOption('월주차');
  };

  const getMonthLabel = (offset: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return `${offset === 0 ? '이번달' : '다음달'} (${date.getMonth() + 1}월)`;
  };

  const handleConfirm = () => {
    setIsFilterExpanded(false);
    onConfirm();
  };

  const handleReset = () => {
    // 초기 상태로 리셋: 지금부터 2시간
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 10) * 10;
    now.setMinutes(roundedMinutes, 0, 0);

    const defaultEnd = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    onConditionChange({
      basis: 'FUTURE',
      startDateTime: now.toISOString(),
      endDateTime: defaultEnd.toISOString()
    });

    setActiveQuickOption('2시간');
    setActiveTab('normal');
    setShowMonthlyOptions(false);

    // 열려있는 피커 모두 닫기
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    setShowStartTimePicker(false);
    setShowEndTimePicker(false);
  };

  // 축소 상태 표시 텍스트
  const getDisplayText = () => {
    // 월주차 선택
    if (condition.type === 'MONTHLY' && condition.month) {
      const monthNum = parseInt(condition.month.split('-')[1]);
      return `${monthNum}월 월주차`;
    }

    // 날짜/시간 기반 선택
    if (condition.startDateTime && condition.endDateTime) {
      const start = new Date(condition.startDateTime);
      const end = new Date(condition.endDateTime);
      const hoursDiff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));

      // 요일 구하기
      const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][start.getDay()];

      // 일주차 빠른 선택인 경우 (24시간 이하이고 activeQuickOption이 '일주차')
      if (activeQuickOption === '일주차' && hoursDiff <= 24) {
        return `${start.getMonth() + 1}/${start.getDate()}(${dayOfWeek}) 일주차`;
      }

      // 오늘인지 확인
      const today = new Date();
      const isToday = start.getDate() === today.getDate() &&
                      start.getMonth() === today.getMonth() &&
                      start.getFullYear() === today.getFullYear();

      // 지금부터인지 확인 (현재 시간과 15분 이내 차이)
      const now = new Date();
      const timeDiff = Math.abs(start.getTime() - now.getTime());
      const isNow = timeDiff < 15 * 60 * 1000; // 15분 이내

      if (hoursDiff < 24) {
        const datePrefix = isToday ? '오늘' : `${start.getMonth() + 1}/${start.getDate()}(${dayOfWeek})`;
        const timeStr = `${start.getHours()}:${String(start.getMinutes()).padStart(2, '0')}`;
        const startText = isNow ? '지금부터' : `${datePrefix} ${timeStr} 부터`;
        return `${startText} ${hoursDiff}시간`;
      } else {
        const endDayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][end.getDay()];
        return `${start.getMonth() + 1}/${start.getDate()}(${dayOfWeek}) ~ ${end.getMonth() + 1}/${end.getDate()}(${endDayOfWeek})`;
      }
    }

    return '시간 선택';
  };

  return (
    <div className="absolute top-3 left-3 right-3 z-[1001]">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* 검색 영역 */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3">
          {/* 햄버거 메뉴 */}
          <button type="button" className="flex-shrink-0 p-1 relative">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              N
            </span>
          </button>

          {/* 구분선 */}
          <div className="w-px h-6 bg-gray-200" />

          {/* 검색 입력 */}
          <div className="flex-1 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="목적지 또는 주소 검색"
              className="flex-1 text-gray-900 placeholder-gray-400 text-sm focus:outline-none bg-transparent"
            />
          </div>

          {/* 마이크 버튼 */}
          <button type="button" className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
        </form>

        {/* 필터바 - 축소 상태 */}
        {!isFilterExpanded && (
          <div className="px-4 pb-3 border-t border-gray-100 flex items-center gap-3 py-2">
            {/* 필터 설정 버튼 */}
            <button
              type="button"
              onClick={() => navigate('/filter')}
              className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>

            {/* 시간 선택 버튼 */}
            <button
              onClick={() => setIsFilterExpanded(true)}
              className="flex-1 flex items-center justify-end gap-2"
            >
              <span className="text-base text-gray-700 font-medium">{getDisplayText()}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* 시간 필터 확장 영역 */}
        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-100"
            >
              {/* 본문: 조건 선택 UI */}
              <div className="p-4 space-y-4">
                {/* 날짜/시간 입력 */}
                <div>
                  {/* 시작 일시 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="start-date" className="text-sm text-gray-600 cursor-pointer">
                        시작
                      </label>
                      <button
                        onClick={handleReset}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        초기화
                      </button>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1" ref={startDateRef}>
                        <div className="flex items-center px-3 py-3 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-primary cursor-pointer bg-white">
                          <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <input
                            id="start-date"
                            type="text"
                            placeholder="MM/DD"
                            value={formatDateTime(condition.startDateTime).date}
                            onChange={(e) => handleStartChange(e.target.value, formatDateTime(condition.startDateTime).time || '00:00')}
                            onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                            className="flex-1 text-sm focus:outline-none cursor-pointer bg-transparent"
                          />
                          <div className="w-px h-4 bg-gray-200 mx-2" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTomorrowClick();
                            }}
                            className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                              activeQuickOption === '내일'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            내일
                          </button>
                        </div>
                        <DatePicker
                          isOpen={showStartDatePicker}
                          selectedDate={condition.startDateTime ? new Date(condition.startDateTime) : undefined}
                          onSelect={handleStartDateSelect}
                          onClose={() => setShowStartDatePicker(false)}
                          minDate={new Date()} // 오늘부터
                          maxDate={(() => {
                            const maxDate = new Date();
                            maxDate.setMonth(maxDate.getMonth() + 1); // 오늘 기준 1개월 후까지
                            return maxDate;
                          })()}
                          triggerRef={startDateRef}
                        />
                      </div>
                      <div className="relative" ref={startTimeRef}>
                        <button
                          onClick={() => setShowStartTimePicker(!showStartTimePicker)}
                          className="flex items-center px-4 py-2.5 border border-gray-200 rounded-xl hover:border-primary transition-colors bg-white"
                        >
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">
                            {formatDateTime(condition.startDateTime).displayTime}
                          </span>
                        </button>
                        <TimePicker
                          isOpen={showStartTimePicker}
                          selectedTime={formatDateTime(condition.startDateTime).time}
                          onSelect={handleStartTimeSelect}
                          onClose={() => setShowStartTimePicker(false)}
                          triggerRef={startTimeRef}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 종료 일시 */}
                  <div>
                    <label htmlFor="end-date" className="text-sm text-gray-600 block mb-2 cursor-pointer">
                      종료
                    </label>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1" ref={endDateRef}>
                        <div className="flex items-center px-3 py-3 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-primary cursor-pointer bg-white">
                          <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <input
                            id="end-date"
                            type="text"
                            placeholder="MM/DD"
                            value={formatDateTime(condition.endDateTime).date}
                            onChange={(e) => handleEndChange(e.target.value, formatDateTime(condition.endDateTime).time || '00:00')}
                            onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                            className="flex-1 text-sm focus:outline-none cursor-pointer bg-transparent"
                          />
                        </div>
                        <DatePicker
                          isOpen={showEndDatePicker}
                          selectedDate={condition.endDateTime ? new Date(condition.endDateTime) : undefined}
                          onSelect={handleEndDateSelect}
                          onClose={() => setShowEndDatePicker(false)}
                          minDate={condition.startDateTime ? new Date(condition.startDateTime) : new Date()} // 시작일부터
                          maxDate={(() => {
                            if (!condition.startDateTime) return undefined;
                            const maxDate = new Date(condition.startDateTime);
                            maxDate.setDate(maxDate.getDate() + 29); // 시작일 기준 +29일까지
                            return maxDate;
                          })()}
                          triggerRef={endDateRef}
                        />
                      </div>
                      <div className="relative" ref={endTimeRef}>
                        <button
                          onClick={() => setShowEndTimePicker(!showEndTimePicker)}
                          className="flex items-center px-4 py-2.5 border border-gray-200 rounded-xl hover:border-primary transition-colors bg-white"
                        >
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">
                            {formatDateTime(condition.endDateTime).displayTime}
                          </span>
                        </button>
                        <TimePicker
                          isOpen={showEndTimePicker}
                          selectedTime={formatDateTime(condition.endDateTime).time}
                          onSelect={handleEndTimeSelect}
                          onClose={() => setShowEndTimePicker(false)}
                          triggerRef={endTimeRef}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 빠른 선택 */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">빠른 선택</p>
                  <div className="space-y-2">
                    {/* 시간 단위 */}
                    <div className="grid grid-cols-4 gap-2">
                      {QUICK_TIME_OPTIONS.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => handleQuickHours(option.hours, option.label)}
                          className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeQuickOption === option.label
                              ? 'bg-blue-50 text-gray-900 border-2 border-blue-200'
                              : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {/* 일 단위 */}
                    <div className="grid grid-cols-4 gap-2">
                      {QUICK_DAY_OPTIONS.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => handleQuickDays(option.days, option.label)}
                          className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeQuickOption === option.label
                              ? 'bg-blue-50 text-gray-900 border-2 border-blue-200'
                              : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {/* 월 단위 */}
                    <div>
                      <button
                        onClick={handleMonthlyClick}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                          activeQuickOption === '월주차'
                            ? 'bg-blue-50 text-gray-900 border-2 border-blue-200'
                            : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        월주차
                      </button>
                      {showMonthlyOptions && activeQuickOption === '월주차' && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <button
                            onClick={() => handleMonthSelect(0)}
                            className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                              condition.type === 'MONTHLY' && condition.month?.endsWith(String(new Date().getMonth() + 1).padStart(2, '0'))
                                ? 'bg-blue-50 text-gray-900 border-2 border-blue-200'
                                : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                            }`}
                          >
                            {getMonthLabel(0)}
                          </button>
                          <button
                            onClick={() => handleMonthSelect(1)}
                            className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                              condition.type === 'MONTHLY' && condition.month?.endsWith(String(new Date().getMonth() + 2).padStart(2, '0'))
                                ? 'bg-blue-50 text-gray-900 border-2 border-blue-200'
                                : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                            }`}
                          >
                            {getMonthLabel(1)}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단: 확인 버튼 */}
              <div className="px-4 pb-4">
                <button
                  onClick={handleConfirm}
                  className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
                >
                  확인
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
