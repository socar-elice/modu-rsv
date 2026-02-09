// 상품 타입 분류
export type ProductDurationType = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'OVERNIGHT' | 'DAYTIME';

// 구매 불가 사유
export type PurchasableReason = 'SOLD_OUT' | 'DISCONTINUED' | 'NOT_YET_OPEN' | 'TIME_CONSTRAINT_NOT_MET';

// 단기권 가격 정책 타입
export interface ShortTermPricingPolicy {
  // 특정일 요금 (최우선)
  specificDates?: Record<string, number>; // { '2026-02-14': 20000 }

  // 공휴일 요금 (두번째 우선순위)
  holidays?: Record<string, number>; // { '2026-01-01': 15000 }

  // 요일별 요금 (기본)
  weekdayRates: Record<string, number>; // { 'MON': 5000, 'TUE': 5000, ..., 'SAT': 8000, 'SUN': 8000 }

  // 최소 요금
  minimumFee: number;
}

// 주차장 상품 타입
export interface ParkingProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  available?: boolean; // 하위 호환성 유지

  // 상품 분류 및 기간
  durationType: ProductDurationType;
  durationMinutes: number; // 이용 가능 시간 (분 단위)

  // 시간대 제약이 있는 상품 (심야권, 야간권, 당일권)
  timeConstraint?: {
    startTime: string; // HH:mm 형식 (예: "22:00")
    endTime: string;   // HH:mm 형식 (예: "07:00")
  };

  // 구매 가능 여부
  purchasable: boolean;
  purchasableReason?: PurchasableReason;
  saleOpenTime?: string; // ISO string - 판매 오픈 시간 (NOT_YET_OPEN인 경우)

  // 단기권(기간형) 가격 정책
  pricingPolicy?: ShortTermPricingPolicy;
}

// 주차장 타입
export interface ParkingLot {
  id: number;
  name: string;
  type: '제휴' | '공영' | '민영';
  lat: number;
  lng: number;
  address: string;
  distance?: string;
  totalSpots: number;
  availableSpots?: number;
  minPrice: number;
  hourlyRate: number; // 시간당 현장요금 (원)
  dailyRate?: number; // 일주차 현장요금 (원) - 선택적
  dailyMaxRate?: number; // 하루 최대요금 (원) - 선택적
  products: ParkingProduct[];
  notices: string[];
  info: string[];
  images?: string[];
  displayProductName?: string; // 검색 조건에 따라 표시될 상품명
  isPurchasable?: boolean; // 구매 가능 여부 (계산된 값)
  purchasableReason?: string; // 구매 불가 사유
  durationUnit?: string; // 기간 단위 (예: "2일", "3시간", "월")
  isOnSiteRate?: boolean; // 현장요금 표시 여부
}

// 결제 수단 타입
export interface PaymentMethod {
  id: number;
  type: 'card' | 'kakao' | 'naver' | 'toss';
  name: string;
  lastFourDigits?: string;
  icon?: string;
}

// 쿠폰 타입
export interface Coupon {
  id: number;
  name: string;
  discount: number;
  discountType: 'percent' | 'fixed';
  expireDate: string;
}

// 차량 정보 타입
export interface Vehicle {
  plateNumber: string;
  nickname?: string;
}

// 바텀시트 상태
export type BottomSheetState = 'closed' | 'peek' | 'half' | 'full';

// 내비게이션 탭
export type NavTab = 'share' | 'favorite' | 'ticket';

// 탐색 기준
export type SearchBasis = 'NOW' | 'FUTURE';

// 주차 유형
export type ParkingType = 'HOURLY' | 'DAILY' | 'MULTI_DAY' | 'MONTHLY';

// 검색 조건
export interface SearchCondition {
  basis: SearchBasis;

  // NOW 기준
  type?: ParkingType;
  hours?: number;        // HOURLY일 때
  date?: string;         // DAILY일 때 (YYYY-MM-DD)
  startDate?: string;    // MULTI_DAY일 때
  endDate?: string;      // MULTI_DAY일 때
  month?: string;        // MONTHLY일 때 (YYYY-MM)

  // FUTURE 기준
  startDateTime?: string; // ISO string
  endDateTime?: string;   // ISO string
}

// 지도 모드
export type MapMode = 'NORMAL' | 'MONTHLY' | 'FUTURE';
