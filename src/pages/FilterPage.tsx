import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FilterState {
  public: boolean;              // 공영 주차장
  excludeMechanical: boolean;   // 기계식 제외
  cafe: boolean;                // 카페
  restaurant: boolean;          // 식당
  mart: boolean;                // 마트
  evCharging: boolean;          // 전기차 충전소
}

const FILTER_STORAGE_KEY = 'parking-filters';

export default function FilterPage() {
  const navigate = useNavigate();

  // localStorage에서 필터 상태 불러오기
  const loadFilters = (): FilterState => {
    try {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
    // 기본값
    return {
      public: true,
      excludeMechanical: false,
      cafe: true,
      restaurant: true,
      mart: true,
      evCharging: true,
    };
  };

  const [filters, setFilters] = useState<FilterState>(loadFilters());

  const handleToggle = (key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleComplete = () => {
    // 필터 상태를 localStorage에 저장
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Failed to save filters:', error);
    }
    navigate(-1);
  };

  const handleReset = () => {
    const defaultFilters: FilterState = {
      public: true,
      excludeMechanical: false,
      cafe: true,
      restaurant: true,
      mart: true,
      evCharging: true,
    };
    setFilters(defaultFilters);
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">검색조건 설정</h1>
        </div>
        <button onClick={handleReset} className="text-gray-500 text-sm hover:text-gray-700">초기화</button>
      </header>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* 안내 문구 */}
        <p className="px-4 py-4 text-gray-700 font-medium">
          지도에 표시될 주차장 조건을 선택하세요
        </p>

        {/* 주차장 조건 */}
        <div className="mx-4 mb-3 bg-white rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">주차장 조건</h3>
            </div>
          </div>

          <div className="space-y-3 pl-2">
            <Checkbox
              label="공영"
              checked={filters.public}
              onChange={() => handleToggle('public')}
            />
            <Checkbox
              label="기계식 제외"
              checked={filters.excludeMechanical}
              onChange={() => handleToggle('excludeMechanical')}
            />
          </div>
        </div>

        {/* 편의시설 주차장 */}
        <div className="mx-4 mb-3 bg-white rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">P</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">편의시설 주차장</h3>
              <p className="text-sm text-gray-400">고객 무료 주차</p>
            </div>
          </div>

          <div className="space-y-3 pl-2">
            <ToggleRow label="카페" checked={filters.cafe} onChange={() => handleToggle('cafe')} />
            <ToggleRow label="식당" checked={filters.restaurant} onChange={() => handleToggle('restaurant')} />
            <ToggleRow label="마트" checked={filters.mart} onChange={() => handleToggle('mart')} />
          </div>
        </div>

        {/* 전기차 충전소 */}
        <div className="mx-4 mb-3 bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">전기차 충전소</h3>
              </div>
            </div>
            <Toggle checked={filters.evCharging} onChange={() => handleToggle('evCharging')} />
          </div>
        </div>
      </div>

      {/* 하단 완료 버튼 - 플로팅 라운드 */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-10">
        <button
          onClick={handleComplete}
          className="px-5 py-2 bg-primary text-white font-semibold rounded-full text-base shadow-lg"
        >
          완료
        </button>
      </div>
    </div>
  );
}

// 토글 컴포넌트
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-7 rounded-full transition-colors relative ${
        checked ? 'bg-primary' : 'bg-gray-300'
      }`}
    >
      <div
        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// 체크박스 컴포넌트
function Checkbox({
  label,
  checked,
  onChange,
  hasInfo,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  hasInfo?: boolean;
}) {
  return (
    <button onClick={onChange} className="flex items-center gap-2">
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          checked ? 'bg-primary border-primary' : 'border-gray-300'
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-gray-600">{label}</span>
      {hasInfo && (
        <div className="w-5 h-5 rounded-full border border-primary text-primary text-xs flex items-center justify-center">
          ?
        </div>
      )}
    </button>
  );
}

// 토글 행 컴포넌트
function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-gray-700">{label}</span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
