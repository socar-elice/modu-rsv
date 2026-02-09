import type { ParkingLot, PaymentMethod, Coupon, Vehicle } from '../types';
import { purchaseStatusTestCases } from './testCasesData';

// 서울 강남/성수 지역 주차장 목업 데이터
// 총 80개: 파란색(제휴/민영) 32개, 흰색(공영) 48개
export const parkingLots: ParkingLot[] = [
  // ===== 파란색 마커 (제휴/민영) - 32개 =====
  {
    id: 1,
    name: '서울숲디타워 주차장',
    type: '제휴',
    lat: 37.5446,
    lng: 127.0447,
    address: '서울 성동구 서울숲2길 32-14',
    distance: '350m',
    totalSpots: 150,
    availableSpots: 23,
    minPrice: 3000,
    hourlyRate: 1800,
    products: [
      {
        id: 1,
        name: '평일 심야권',
        price: 3000,
        description: '22:00 ~ 07:00 (최대 9시간)',
        available: true,
        durationType: 'OVERNIGHT' as const,
        durationMinutes: 540,
        timeConstraint: {
          startTime: '22:00',
          endTime: '07:00'
        },
        purchasable: true
      },
      {
        id: 2,
        name: '평일 5시간권',
        price: 5000,
        description: '최대 5시간 사용 가능',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 300,
        purchasable: true
      },
      {
        id: 100,
        name: '정기권',
        price: 150000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 200,
        name: '일주차권',
        price: 35000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 300,
        name: '24시간권',
        price: 33000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      },
    ],
    notices: ['입차 후 30분 내 출차 시 무료입니다'],
    info: ['지하 2층~지상 3층 (150면)'],
  },
  {
    id: 4,
    name: '갤러리아 포레 주차장',
    type: '제휴',
    lat: 37.5401,
    lng: 127.0438,
    address: '서울 성동구 서울숲2길 44',
    distance: '450m',
    totalSpots: 300,
    availableSpots: 67,
    minPrice: 4000,
    hourlyRate: 2400,
    products: [
      {
        id: 10,
        name: '3시간권',
        price: 4000,
        description: '최대 3시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 180,
        purchasable: true
      },
      {
        id: 101,
        name: '정기권',
        price: 180000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 201,
        name: '일주차권',
        price: 28000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 301,
        name: '24시간권',
        price: 26500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      },
      {
        id: 401,
        name: '단기권(기간형)',
        price: 10000,
        description: '입차~출차 기간에 따라 일자별 요금 합산. 평일 기본요금 적용, 주말/공휴일/특정일은 별도 요금',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 2880, // 예시: 2일 기준
        purchasable: true,
        pricingPolicy: {
          // 특정일 요금 (최우선 - 발렌타인데이 예시)
          specificDates: {
            '2026-02-14': 20000
          },
          // 공휴일 요금 (두번째 우선순위 - 신정 예시)
          holidays: {
            '2026-01-01': 15000
          },
          // 요일별 기본 요금
          weekdayRates: {
            'MON': 4000,
            'TUE': 4000,
            'WED': 4000,
            'THU': 4000,
            'FRI': 4000,
            'SAT': 6000,
            'SUN': 6000
          },
          // 최소 요금 (평일 2일 = 8000원보다 높게 설정)
          minimumFee: 10000
        }
      },
    ],
    notices: ['갤러리아 포레 입주민 우선'],
    info: ['지하 주차장 (300면)'],
  },
  {
    id: 6,
    name: '아크로 서울포레스트',
    type: '제휴',
    lat: 37.5468,
    lng: 127.0412,
    address: '서울 성동구 서울숲4길 18',
    distance: '200m',
    totalSpots: 180,
    availableSpots: 32,
    minPrice: 5000,
    hourlyRate: 3000,
    products: [
      {
        id: 15,
        name: '4시간권',
        price: 5000,
        description: '최대 4시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 240,
        purchasable: true
      },
      {
        id: 102,
        name: '정기권',
        price: 170000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 203,
        name: '일주차권',
        price: 35000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 303,
        name: '24시간권',
        price: 33500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      },
    ],
    notices: ['입주민 우선'],
    info: ['지하 주차장 (180면)'],
  },
  {
    id: 7,
    name: '트리마제 주차장',
    type: '제휴',
    lat: 37.5392,
    lng: 127.0485,
    address: '서울 성동구 서울숲6길 33',
    distance: '380m',
    totalSpots: 250,
    availableSpots: 45,
    minPrice: 4500,
    hourlyRate: 2700,
    products: [
      {
        id: 16,
        name: '3시간권',
        price: 4500,
        description: '최대 3시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 180,
        purchasable: true
      },
      {
        id: 103,
        name: '정기권',
        price: 160000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 204,
        name: '일주차권',
        price: 31500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 304,
        name: '24시간권',
        price: 30000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      },
    ],
    notices: ['방문객 등록 필수'],
    info: ['지하 주차장 (250면)'],
  },
  {
    id: 10,
    name: '뚝섬역 파크원',
    type: '제휴',
    lat: 37.5355,
    lng: 127.0512,
    address: '서울 성동구 아차산로 33',
    distance: '600m',
    totalSpots: 90,
    availableSpots: 22,
    minPrice: 2800,
    hourlyRate: 1700,
    products: [
      {
        id: 19,
        name: '2시간권',
        price: 2800,
        description: '최대 2시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 120,
        purchasable: true
      },
      {
        id: 104,
        name: '정기권',
        price: 120000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 207,
        name: '일주차권',
        price: 19600,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 307,
        name: '24시간권',
        price: 18000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      },
    ],
    notices: ['선착순 입차'],
    info: ['지상 주차장 (90면)'],
  },
  {
    id: 11,
    name: '성수 SK V1 주차장',
    type: '제휴',
    lat: 37.5462,
    lng: 127.0605,
    address: '서울 성동구 성수이로 78',
    distance: '680m',
    totalSpots: 200,
    availableSpots: 38,
    minPrice: 3200,
    hourlyRate: 1900,
    products: [
      {
        id: 20,
        name: '3시간권',
        price: 3200,
        description: '최대 3시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 180,
        purchasable: true
      },
      {
        id: 105,
        name: '정기권',
        price: 140000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 208,
        name: '일주차권',
        price: 22400,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 308,
        name: '24시간권',
        price: 21000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      },
    ],
    notices: ['입주사 우선'],
    info: ['지하 주차장 (200면)'],
  },
  {
    id: 14,
    name: '서울숲 푸르지오 주차장',
    type: '제휴',
    lat: 37.5378,
    lng: 127.0422,
    address: '서울 성동구 서울숲8길 55',
    distance: '500m',
    totalSpots: 150,
    availableSpots: 28,
    minPrice: 3800,
    hourlyRate: 2300,
    products: [
      {
        id: 23,
        name: '4시간권',
        price: 3800,
        description: '최대 4시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 240,
        purchasable: true
      },
      {
        id: 106,
        name: '정기권',
        price: 155000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 211,
        name: '일주차권',
        price: 26600,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 310,
        name: '24시간권',
        price: 25000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      },
    ],
    notices: ['방문객 등록 필수'],
    info: ['지하 주차장 (150면)'],
  },

  // ===== 흰색 마커 (공영) - 18개 =====
  {
    id: 2,
    name: '성수역 공영주차장',
    type: '공영',
    lat: 37.5445,
    lng: 127.0557,
    address: '서울 성동구 성수이로 51',
    distance: '120m',
    totalSpots: 80,
    availableSpots: 12,
    minPrice: 2000,
    hourlyRate: 1200,
    products: [
      {
        id: 5,
        name: '1시간권',
        price: 2000,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 107,
        name: '정기권',
        price: 90000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 212,
        name: '일주차권',
        price: 14000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 311,
        name: '24시간권',
        price: 13000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      },
    ],
    notices: ['공영주차장은 선착순 입차입니다'],
    info: ['노외 주차장 (80면)'],
  },
  {
    id: 3,
    name: '뚝섬유원지 주차장',
    type: '공영',
    lat: 37.5312,
    lng: 127.0660,
    address: '서울 광진구 자양동 700',
    distance: '800m',
    totalSpots: 200,
    availableSpots: 45,
    minPrice: 1500,
    hourlyRate: 900,
    products: [
      {
        id: 8,
        name: '기본요금 (30분)',
        price: 1500,
        description: '30분 기준',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 30,
        purchasable: true
      },
      {
        id: 213,
        name: '일주차권',
        price: 10500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 312,
        name: '24시간권',
        price: 9500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      },
    ],
    notices: ['한강공원 이용객 우선'],
    info: ['노외 주차장 (200면)'],
  },
  {
    id: 15,
    name: '성동구청 공영주차장',
    type: '공영',
    lat: 37.5512,
    lng: 127.0410,
    address: '서울 성동구 고산자로 270',
    distance: '420m',
    totalSpots: 100,
    availableSpots: 25,
    minPrice: 1800,
    hourlyRate: 1100,
    products: [
      {
        id: 24,
        name: '1시간권',
        price: 1800,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 108,
        name: '정기권',
        price: 80000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 214,
        name: '일주차권',
        price: 12600,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 313,
        name: '24시간권',
        price: 11500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      },
    ],
    notices: ['민원인 할인 가능'],
    info: ['지하 주차장 (100면)'],
  },
  {
    id: 16,
    name: '응봉역 공영주차장',
    type: '공영',
    lat: 37.5488,
    lng: 127.0332,
    address: '서울 성동구 응봉동 112',
    distance: '580m',
    totalSpots: 60,
    availableSpots: 18,
    minPrice: 1500,
    hourlyRate: 900,
    products: [
      {
        id: 25,
        name: '30분권',
        price: 1500,
        description: '30분 기준',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 30,
        purchasable: true
      },
      {
        id: 215,
        name: '일주차권',
        price: 10500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
    ],
    notices: ['24시간 운영'],
    info: ['노외 주차장 (60면)'],
  },
  {
    id: 17,
    name: '서울숲 공영주차장',
    type: '공영',
    lat: 37.5432,
    lng: 127.0378,
    address: '서울 성동구 성수동1가 685',
    distance: '250m',
    totalSpots: 150,
    availableSpots: 42,
    minPrice: 2000,
    hourlyRate: 1200,
    products: [
      {
        id: 26,
        name: '1시간권',
        price: 2000,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 109,
        name: '정기권',
        price: 95000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 216,
        name: '일주차권',
        price: 14000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 314,
        name: '24시간권',
        price: 13000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      },
    ],
    notices: ['서울숲 방문객 우선'],
    info: ['노외 주차장 (150면)'],
  },
  {
    id: 18,
    name: '왕십리역 공영주차장',
    type: '공영',
    lat: 37.5618,
    lng: 127.0368,
    address: '서울 성동구 왕십리광장로 17',
    distance: '950m',
    totalSpots: 200,
    availableSpots: 55,
    minPrice: 1800,
    hourlyRate: 1100,
    products: [
      {
        id: 27,
        name: '1시간권',
        price: 1800,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 110,
        name: '정기권',
        price: 85000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 217,
        name: '일주차권',
        price: 12600,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 315,
        name: '24시간권',
        price: 11500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      },
    ],
    notices: ['지하철 이용객 할인'],
    info: ['지하 주차장 (200면)'],
  },
  {
    id: 19,
    name: '독서당로 공영주차장',
    type: '공영',
    lat: 37.5365,
    lng: 127.0395,
    address: '서울 성동구 독서당로 85',
    distance: '380m',
    totalSpots: 50,
    availableSpots: 8,
    minPrice: 1600,
    hourlyRate: 1000,
    products: [
      {
        id: 28,
        name: '1시간권',
        price: 1600,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 218,
        name: '일주차권',
        price: 11200,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
    ],
    notices: ['선착순 입차'],
    info: ['노상 주차장 (50면)'],
  },
  {
    id: 20,
    name: '행당역 공영주차장',
    type: '공영',
    lat: 37.5572,
    lng: 127.0295,
    address: '서울 성동구 행당동 168',
    distance: '850m',
    totalSpots: 80,
    availableSpots: 22,
    minPrice: 1700,
    hourlyRate: 1000,
    products: [
      {
        id: 29,
        name: '1시간권',
        price: 1700,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 219,
        name: '일주차권',
        price: 11900,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
    ],
    notices: ['야간 할인'],
    info: ['노외 주차장 (80면)'],
  },
  {
    id: 21,
    name: '금호역 공영주차장',
    type: '공영',
    lat: 37.5545,
    lng: 127.0188,
    address: '서울 성동구 금호동3가 778',
    distance: '1.1km',
    totalSpots: 70,
    availableSpots: 15,
    minPrice: 1500,
    hourlyRate: 900,
    products: [
      {
        id: 30,
        name: '1시간권',
        price: 1500,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 220,
        name: '일주차권',
        price: 10500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
    ],
    notices: ['지하철역 인근'],
    info: ['노외 주차장 (70면)'],
  },
  {
    id: 22,
    name: '옥수동 공영주차장',
    type: '공영',
    lat: 37.5455,
    lng: 127.0142,
    address: '서울 성동구 옥수동 240',
    distance: '1.3km',
    totalSpots: 90,
    availableSpots: 28,
    minPrice: 1600,
    hourlyRate: 1000,
    products: [
      {
        id: 31,
        name: '1시간권',
        price: 1600,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 221,
        name: '일주차권',
        price: 11200,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
    ],
    notices: ['경차 할인'],
    info: ['지상 주차장 (90면)'],
  },
  {
    id: 23,
    name: '성수2가 제1공영주차장',
    type: '공영',
    lat: 37.5398,
    lng: 127.0555,
    address: '서울 성동구 성수이로 115',
    distance: '320m',
    totalSpots: 45,
    availableSpots: 10,
    minPrice: 1800,
    hourlyRate: 1100,
    products: [
      {
        id: 32,
        name: '1시간권',
        price: 1800,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 222,
        name: '일주차권',
        price: 12600,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
    ],
    notices: ['소형차 전용'],
    info: ['노외 주차장 (45면)'],
  },
  {
    id: 24,
    name: '성수2가 제2공영주차장',
    type: '공영',
    lat: 37.5425,
    lng: 127.0612,
    address: '서울 성동구 성수이로22길 22',
    distance: '480m',
    totalSpots: 55,
    availableSpots: 12,
    minPrice: 1700,
    hourlyRate: 1000,
    products: [
      {
        id: 33,
        name: '1시간권',
        price: 1700,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 223,
        name: '일주차권',
        price: 11900,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
    ],
    notices: ['24시간 운영'],
    info: ['노외 주차장 (55면)'],
  },
  {
    id: 25,
    name: '송정동 공영주차장',
    type: '공영',
    lat: 37.5502,
    lng: 127.0498,
    address: '서울 성동구 송정동 85',
    distance: '550m',
    totalSpots: 65,
    availableSpots: 18,
    minPrice: 1500,
    hourlyRate: 900,
    products: [
      {
        id: 34,
        name: '30분권',
        price: 1500,
        description: '30분 기준',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 30,
        purchasable: true
      },
      {
        id: 224,
        name: '일주차권',
        price: 10500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
    ],
    notices: ['야간 무료'],
    info: ['노상 주차장 (65면)'],
  },
  {
    id: 26,
    name: '성수1가 공영주차장',
    type: '공영',
    lat: 37.5478,
    lng: 127.0388,
    address: '서울 성동구 성수동1가 656',
    distance: '180m',
    totalSpots: 40,
    availableSpots: 7,
    minPrice: 2000,
    hourlyRate: 1200,
    products: [
      {
        id: 35,
        name: '1시간권',
        price: 2000,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 225,
        name: '일주차권',
        price: 14000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
    ],
    notices: ['공원 이용객 우선'],
    info: ['노외 주차장 (40면)'],
  },
  {
    id: 27,
    name: '서울숲역 공영주차장',
    type: '공영',
    lat: 37.5416,
    lng: 127.0452,
    address: '서울 성동구 서울숲2길 51',
    distance: '220m',
    totalSpots: 85,
    availableSpots: 20,
    minPrice: 1900,
    hourlyRate: 1100,
    products: [
      {
        id: 36,
        name: '1시간권',
        price: 1900,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 226,
        name: '일주차권',
        price: 13300,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 316,
        name: '24시간권',
        price: 12000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      },
    ],
    notices: ['지하철 이용객 할인'],
    info: ['지하 주차장 (85면)'],
  },
  {
    id: 28,
    name: '뚝섬역 공영주차장',
    type: '공영',
    lat: 37.5315,
    lng: 127.0468,
    address: '서울 성동구 서울숲로 58',
    distance: '550m',
    totalSpots: 75,
    availableSpots: 22,
    minPrice: 1800,
    hourlyRate: 1100,
    products: [
      {
        id: 37,
        name: '1시간권',
        price: 1800,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 227,
        name: '일주차권',
        price: 12600,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
    ],
    notices: ['역사 이용객 우선'],
    info: ['노외 주차장 (75면)'],
  },
  {
    id: 29,
    name: '자양동 공영주차장',
    type: '공영',
    lat: 37.5342,
    lng: 127.0715,
    address: '서울 광진구 자양동 552',
    distance: '920m',
    totalSpots: 110,
    availableSpots: 35,
    minPrice: 1600,
    hourlyRate: 1000,
    products: [
      {
        id: 38,
        name: '1시간권',
        price: 1600,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 228,
        name: '일주차권',
        price: 11200,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
    ],
    notices: ['대형차 주차 가능'],
    info: ['노외 주차장 (110면)'],
  },
  {
    id: 30,
    name: '건대입구역 공영주차장',
    type: '공영',
    lat: 37.5401,
    lng: 127.0702,
    address: '서울 광진구 능동로 120',
    distance: '1km',
    totalSpots: 130,
    availableSpots: 40,
    minPrice: 1800,
    hourlyRate: 1100,
    products: [
      {
        id: 39,
        name: '1시간권',
        price: 1800,
        description: '최대 1시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 60,
        purchasable: true
      },
      {
        id: 229,
        name: '일주차권',
        price: 12600,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
    ],
    notices: ['환승 할인'],
    info: ['지하 주차장 (130면)'],
  },

  // ===== 추가 파란색 마커 (제휴/민영) - 20개 =====
  {
    id: 31,
    name: '성수 S타워',
    type: '제휴',
    lat: 37.5452,
    lng: 127.0518,
    address: '서울 성동구',
    distance: '200m',
    totalSpots: 100,
    availableSpots: 15,
    minPrice: 2800,
    hourlyRate: 1700,
    products: [
      {
        id: 40,
        name: '2시간권',
        price: 2800,
        description: '최대 2시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 120,
        purchasable: true
      },
      {
        id: 111,
        name: '정기권',
        price: 135000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 230,
        name: '일주차권',
        price: 19600,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 317,
        name: '24시간권',
        price: 18000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      }
    ],
    notices: ['입주사 우선'],
    info: ['지하 주차장']
  },
  {
    id: 33,
    name: '성수 파크뷰',
    type: '제휴',
    lat: 37.5472,
    lng: 127.0425,
    address: '서울 성동구',
    distance: '250m',
    totalSpots: 120,
    availableSpots: 20,
    minPrice: 3500,
    hourlyRate: 2100,
    products: [
      {
        id: 42,
        name: '4시간권',
        price: 3500,
        description: '최대 4시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 240,
        purchasable: true
      },
      {
        id: 112,
        name: '정기권',
        price: 145000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 232,
        name: '일주차권',
        price: 24500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 319,
        name: '24시간권',
        price: 23000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      }
    ],
    notices: ['방문 등록 필수'],
    info: ['지하 주차장']
  },
  {
    id: 35,
    name: '서울숲 리버뷰',
    type: '제휴',
    lat: 37.5385,
    lng: 127.0462,
    address: '서울 성동구',
    distance: '320m',
    totalSpots: 150,
    availableSpots: 25,
    minPrice: 4000,
    hourlyRate: 2400,
    products: [
      {
        id: 44,
        name: '4시간권',
        price: 4000,
        description: '최대 4시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 240,
        purchasable: true
      },
      {
        id: 113,
        name: '정기권',
        price: 165000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 234,
        name: '일주차권',
        price: 28000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 321,
        name: '24시간권',
        price: 26500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      }
    ],
    notices: ['입주민 우선'],
    info: ['지하 주차장']
  },
  {
    id: 37,
    name: '왕십리 파크타워',
    type: '제휴',
    lat: 37.5595,
    lng: 127.0385,
    address: '서울 성동구',
    distance: '850m',
    totalSpots: 200,
    availableSpots: 45,
    minPrice: 3000,
    hourlyRate: 1800,
    products: [
      {
        id: 46,
        name: '3시간권',
        price: 3000,
        description: '최대 3시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 180,
        purchasable: true
      },
      {
        id: 114,
        name: '정기권',
        price: 130000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 236,
        name: '일주차권',
        price: 21000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 323,
        name: '24시간권',
        price: 19500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      }
    ],
    notices: ['입주사 우선'],
    info: ['지하 주차장']
  },
  {
    id: 39,
    name: '옥수 힐타운',
    type: '제휴',
    lat: 37.5472,
    lng: 127.0158,
    address: '서울 성동구',
    distance: '1.1km',
    totalSpots: 100,
    availableSpots: 22,
    minPrice: 2800,
    hourlyRate: 1700,
    products: [
      {
        id: 48,
        name: '3시간권',
        price: 2800,
        description: '최대 3시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 180,
        purchasable: true
      },
      {
        id: 238,
        name: '일주차권',
        price: 19600,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 325,
        name: '24시간권',
        price: 18000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      }
    ],
    notices: ['입주민 우선'],
    info: ['지하 주차장']
  },
  {
    id: 41,
    name: '자양 타워빌',
    type: '제휴',
    lat: 37.5365,
    lng: 127.0685,
    address: '서울 광진구',
    distance: '720m',
    totalSpots: 110,
    availableSpots: 28,
    minPrice: 2900,
    hourlyRate: 1700,
    products: [
      {
        id: 50,
        name: '3시간권',
        price: 2900,
        description: '최대 3시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 180,
        purchasable: true
      },
      {
        id: 115,
        name: '정기권',
        price: 125000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 240,
        name: '일주차권',
        price: 20300,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 327,
        name: '24시간권',
        price: 19000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      }
    ],
    notices: ['방문 등록 필수'],
    info: ['지하 주차장']
  },
  {
    id: 43,
    name: '송정 비즈센터',
    type: '제휴',
    lat: 37.5518,
    lng: 127.0528,
    address: '서울 성동구',
    distance: '550m',
    totalSpots: 80,
    availableSpots: 12,
    minPrice: 2700,
    hourlyRate: 1600,
    products: [
      {
        id: 52,
        name: '2시간권',
        price: 2700,
        description: '최대 2시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 120,
        purchasable: true
      },
      {
        id: 242,
        name: '일주차권',
        price: 18900,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 329,
        name: '24시간권',
        price: 17500,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      }
    ],
    notices: ['입주사 우선'],
    info: ['지하 주차장']
  },
  {
    id: 45,
    name: '행당 센트럴파크',
    type: '제휴',
    lat: 37.5558,
    lng: 127.0325,
    address: '서울 성동구',
    distance: '780m',
    totalSpots: 130,
    availableSpots: 32,
    minPrice: 3200,
    hourlyRate: 1900,
    products: [
      {
        id: 54,
        name: '4시간권',
        price: 3200,
        description: '최대 4시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 240,
        purchasable: true
      },
      {
        id: 116,
        name: '정기권',
        price: 140000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 244,
        name: '일주차권',
        price: 22400,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 330,
        name: '24시간권',
        price: 21000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      }
    ],
    notices: ['입주민 우선'],
    info: ['지하 주차장']
  },
  {
    id: 47,
    name: '서울숲 벨라',
    type: '제휴',
    lat: 37.5368,
    lng: 127.0438,
    address: '서울 성동구',
    distance: '380m',
    totalSpots: 140,
    availableSpots: 28,
    minPrice: 3800,
    hourlyRate: 2300,
    products: [
      {
        id: 56,
        name: '4시간권',
        price: 3800,
        description: '최대 4시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 240,
        purchasable: true
      },
      {
        id: 117,
        name: '정기권',
        price: 160000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      },
      {
        id: 246,
        name: '일주차권',
        price: 26600,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        timeConstraint: {
          startTime: '07:00',
          endTime: '23:59'
        },
        purchasable: true
      },
      {
        id: 332,
        name: '24시간권',
        price: 25000,
        description: '24시간 이용권',
        available: true,
        durationType: 'DAILY' as const,
        durationMinutes: 1440,
        purchasable: true
      }
    ],
    notices: ['방문 등록 필수'],
    info: ['지하 주차장']
  },
  {
    id: 49,
    name: '성수 아트센터',
    type: '제휴',
    lat: 37.5478,
    lng: 127.0502,
    address: '서울 성동구',
    distance: '220m',
    totalSpots: 100,
    availableSpots: 18,
    minPrice: 3300,
    hourlyRate: 2000,
    products: [
      {
        id: 58,
        name: '3시간권',
        price: 3300,
        description: '최대 3시간',
        available: true,
        durationType: 'HOURLY' as const,
        durationMinutes: 180,
        purchasable: true
      },
      {
        id: 118,
        name: '정기권',
        price: 135000,
        description: '1개월 이용권',
        available: true,
        durationType: 'MONTHLY' as const,
        durationMinutes: 43200,
        purchasable: true
      }
    ],
    notices: ['입주사 우선'],
    info: ['지하 주차장']
  },

  // ===== 추가 흰색 마커 (공영) - 30개 =====
  { id: 51, name: '성수1동 제3공영', type: '공영', lat: 37.5465, lng: 127.0435, address: '서울 성동구', distance: '150m', totalSpots: 45, availableSpots: 8, minPrice: 1700, hourlyRate: 1000, products: [{ id: 60, name: '1시간권', price: 1700, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['선착순'], info: ['노외 주차장'] },
  { id: 52, name: '성수2동 제3공영', type: '공영', lat: 37.5418, lng: 127.0575, address: '서울 성동구', distance: '350m', totalSpots: 55, availableSpots: 12, minPrice: 1600, hourlyRate: 1000, products: [{ id: 61, name: '1시간권', price: 1600, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['24시간'], info: ['노외 주차장'] },
  { id: 53, name: '서울숲 제2공영', type: '공영', lat: 37.5438, lng: 127.0398, address: '서울 성동구', distance: '220m', totalSpots: 80, availableSpots: 18, minPrice: 1800, hourlyRate: 1100, products: [{ id: 62, name: '1시간권', price: 1800, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['공원 이용객 우선'], info: ['노외 주차장'] },
  { id: 54, name: '뚝섬 제2공영', type: '공영', lat: 37.5328, lng: 127.0525, address: '서울 성동구', distance: '480m', totalSpots: 60, availableSpots: 15, minPrice: 1500, hourlyRate: 900, products: [{ id: 63, name: '30분권', price: 1500, description: '30분 기준', available: true, durationType: 'HOURLY' as const, durationMinutes: 30, purchasable: true }], notices: ['야간 무료'], info: ['노상 주차장'] },
  { id: 55, name: '왕십리 제2공영', type: '공영', lat: 37.5602, lng: 127.0398, address: '서울 성동구', distance: '880m', totalSpots: 100, availableSpots: 25, minPrice: 1700, hourlyRate: 1000, products: [{ id: 64, name: '1시간권', price: 1700, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['지하철 할인'], info: ['지하 주차장'] },
  { id: 56, name: '금호동 제2공영', type: '공영', lat: 37.5538, lng: 127.0225, address: '서울 성동구', distance: '980m', totalSpots: 50, availableSpots: 10, minPrice: 1600, hourlyRate: 1000, products: [{ id: 65, name: '1시간권', price: 1600, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['경차 할인'], info: ['노외 주차장'] },
  { id: 57, name: '옥수동 제2공영', type: '공영', lat: 37.5462, lng: 127.0178, address: '서울 성동구', distance: '1.2km', totalSpots: 70, availableSpots: 18, minPrice: 1500, hourlyRate: 900, products: [{ id: 66, name: '1시간권', price: 1500, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['야간 할인'], info: ['노외 주차장'] },
  { id: 58, name: '행당동 제2공영', type: '공영', lat: 37.5565, lng: 127.0312, address: '서울 성동구', distance: '820m', totalSpots: 65, availableSpots: 15, minPrice: 1700, hourlyRate: 1000, products: [{ id: 67, name: '1시간권', price: 1700, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['24시간'], info: ['노외 주차장'] },
  { id: 59, name: '응봉동 제2공영', type: '공영', lat: 37.5498, lng: 127.0358, address: '서울 성동구', distance: '550m', totalSpots: 40, availableSpots: 8, minPrice: 1600, hourlyRate: 1000, products: [{ id: 68, name: '1시간권', price: 1600, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['선착순'], info: ['노상 주차장'] },
  { id: 60, name: '송정동 제2공영', type: '공영', lat: 37.5515, lng: 127.0468, address: '서울 성동구', distance: '480m', totalSpots: 55, availableSpots: 12, minPrice: 1800, hourlyRate: 1100, products: [{ id: 69, name: '1시간권', price: 1800, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['공원 이용객 우선'], info: ['노외 주차장'] },
  { id: 61, name: '자양동 제2공영', type: '공영', lat: 37.5358, lng: 127.0695, address: '서울 광진구', distance: '850m', totalSpots: 90, availableSpots: 22, minPrice: 1600, hourlyRate: 1000, products: [{ id: 70, name: '1시간권', price: 1600, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['대형차 가능'], info: ['노외 주차장'] },
  { id: 62, name: '구의동 공영', type: '공영', lat: 37.5375, lng: 127.0752, address: '서울 광진구', distance: '950m', totalSpots: 75, availableSpots: 18, minPrice: 1700, hourlyRate: 1000, products: [{ id: 71, name: '1시간권', price: 1700, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['환승 할인'], info: ['지하 주차장'] },
  { id: 63, name: '성수역 제2공영', type: '공영', lat: 37.5448, lng: 127.0542, address: '서울 성동구', distance: '180m', totalSpots: 50, availableSpots: 10, minPrice: 1900, hourlyRate: 1100, products: [{ id: 72, name: '1시간권', price: 1900, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['지하철 이용객 할인'], info: ['노외 주차장'] },
  { id: 64, name: '뚝섬역 제2공영', type: '공영', lat: 37.5322, lng: 127.0485, address: '서울 성동구', distance: '520m', totalSpots: 60, availableSpots: 14, minPrice: 1700, hourlyRate: 1000, products: [{ id: 73, name: '1시간권', price: 1700, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['역사 이용객 우선'], info: ['노외 주차장'] },
  { id: 65, name: '서울숲역 제2공영', type: '공영', lat: 37.5422, lng: 127.0468, address: '서울 성동구', distance: '250m', totalSpots: 70, availableSpots: 16, minPrice: 1800, hourlyRate: 1100, products: [{ id: 74, name: '1시간권', price: 1800, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['공원 연계 할인'], info: ['지하 주차장'] },
  { id: 66, name: '성수1가 제2공영', type: '공영', lat: 37.5485, lng: 127.0408, address: '서울 성동구', distance: '200m', totalSpots: 35, availableSpots: 6, minPrice: 1900, hourlyRate: 1100, products: [{ id: 75, name: '1시간권', price: 1900, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['소형차 전용'], info: ['노상 주차장'] },
  { id: 67, name: '성수2가 제3공영', type: '공영', lat: 37.5405, lng: 127.0595, address: '서울 성동구', distance: '420m', totalSpots: 45, availableSpots: 10, minPrice: 1700, hourlyRate: 1000, products: [{ id: 76, name: '1시간권', price: 1700, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['24시간'], info: ['노외 주차장'] },
  { id: 68, name: '성수2가 제4공영', type: '공영', lat: 37.5432, lng: 127.0622, address: '서울 성동구', distance: '500m', totalSpots: 40, availableSpots: 8, minPrice: 1600, hourlyRate: 1000, products: [{ id: 77, name: '1시간권', price: 1600, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['야간 무료'], info: ['노외 주차장'] },
  { id: 69, name: '독서당로 제2공영', type: '공영', lat: 37.5358, lng: 127.0418, address: '서울 성동구', distance: '350m', totalSpots: 55, availableSpots: 12, minPrice: 1700, hourlyRate: 1000, products: [{ id: 78, name: '1시간권', price: 1700, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['선착순'], info: ['노상 주차장'] },
  { id: 70, name: '서울숲 제3공영', type: '공영', lat: 37.5412, lng: 127.0385, address: '서울 성동구', distance: '280m', totalSpots: 65, availableSpots: 15, minPrice: 1800, hourlyRate: 1100, products: [{ id: 79, name: '1시간권', price: 1800, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['공원 이용객 우선'], info: ['노외 주차장'] },
  { id: 71, name: '응봉산 공영', type: '공영', lat: 37.5475, lng: 127.0315, address: '서울 성동구', distance: '620m', totalSpots: 50, availableSpots: 12, minPrice: 1500, hourlyRate: 900, products: [{ id: 80, name: '30분권', price: 1500, description: '30분 기준', available: true, durationType: 'HOURLY' as const, durationMinutes: 30, purchasable: true }], notices: ['등산객 우선'], info: ['노외 주차장'] },
  { id: 72, name: '왕십리광장 공영', type: '공영', lat: 37.5625, lng: 127.0345, address: '서울 성동구', distance: '980m', totalSpots: 120, availableSpots: 30, minPrice: 1700, hourlyRate: 1000, products: [{ id: 81, name: '1시간권', price: 1700, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['환승 할인'], info: ['지하 주차장'] },
  { id: 73, name: '금호시장 공영', type: '공영', lat: 37.5552, lng: 127.0198, address: '서울 성동구', distance: '1km', totalSpots: 40, availableSpots: 8, minPrice: 1600, hourlyRate: 1000, products: [{ id: 82, name: '1시간권', price: 1600, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['시장 이용객 할인'], info: ['노외 주차장'] },
  { id: 74, name: '옥수역 공영', type: '공영', lat: 37.5442, lng: 127.0165, address: '서울 성동구', distance: '1.2km', totalSpots: 80, availableSpots: 20, minPrice: 1700, hourlyRate: 1000, products: [{ id: 83, name: '1시간권', price: 1700, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['지하철 할인'], info: ['지하 주차장'] },
  { id: 75, name: '행당시장 공영', type: '공영', lat: 37.5578, lng: 127.0278, address: '서울 성동구', distance: '880m', totalSpots: 35, availableSpots: 6, minPrice: 1600, hourlyRate: 1000, products: [{ id: 84, name: '1시간권', price: 1600, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['시장 이용객 할인'], info: ['노상 주차장'] },
  { id: 76, name: '뚝섬유원지 제2공영', type: '공영', lat: 37.5298, lng: 127.0678, address: '서울 광진구', distance: '850m', totalSpots: 150, availableSpots: 38, minPrice: 1500, hourlyRate: 900, products: [{ id: 85, name: '30분권', price: 1500, description: '30분 기준', available: true, durationType: 'HOURLY' as const, durationMinutes: 30, purchasable: true }], notices: ['한강공원 이용객 우선'], info: ['노외 주차장'] },
  { id: 77, name: '자양시장 공영', type: '공영', lat: 37.5348, lng: 127.0728, address: '서울 광진구', distance: '920m', totalSpots: 45, availableSpots: 10, minPrice: 1600, hourlyRate: 1000, products: [{ id: 86, name: '1시간권', price: 1600, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['시장 이용객 할인'], info: ['노외 주차장'] },
  { id: 78, name: '성수 IT밸리 공영', type: '공영', lat: 37.5428, lng: 127.0598, address: '서울 성동구', distance: '380m', totalSpots: 60, availableSpots: 14, minPrice: 1800, hourlyRate: 1100, products: [{ id: 87, name: '1시간권', price: 1800, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['24시간'], info: ['노외 주차장'] },
  { id: 79, name: '성수 카페거리 공영', type: '공영', lat: 37.5445, lng: 127.0528, address: '서울 성동구', distance: '160m', totalSpots: 30, availableSpots: 5, minPrice: 2000, hourlyRate: 1200, products: [{ id: 88, name: '1시간권', price: 2000, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['주말 혼잡'], info: ['노상 주차장'] },
  { id: 80, name: '서울숲 동문 공영', type: '공영', lat: 37.5455, lng: 127.0418, address: '서울 성동구', distance: '180m', totalSpots: 75, availableSpots: 18, minPrice: 1900, hourlyRate: 1100, products: [{ id: 89, name: '1시간권', price: 1900, description: '최대 1시간', available: true, durationType: 'HOURLY' as const, durationMinutes: 60, purchasable: true }], notices: ['공원 연계 할인'], info: ['노외 주차장'] },

  // 구매 상태별 테스트 케이스 추가
  ...purchaseStatusTestCases,
];

// 결제 수단 목업
export const paymentMethods: PaymentMethod[] = [
  { id: 1, type: 'card', name: '신한카드', lastFourDigits: '1234' },
  { id: 2, type: 'card', name: '삼성카드', lastFourDigits: '5678' },
  { id: 3, type: 'kakao', name: '카카오페이' },
  { id: 4, type: 'naver', name: '네이버페이' },
  { id: 5, type: 'toss', name: '토스페이' },
];

// 쿠폰 목업
export const coupons: Coupon[] = [
  { id: 1, name: '첫 결제 20% 할인', discount: 20, discountType: 'percent', expireDate: '2026-03-31' },
  { id: 2, name: '2,000원 할인쿠폰', discount: 2000, discountType: 'fixed', expireDate: '2026-02-28' },
];

// 등록 차량 목업
export const vehicles: Vehicle[] = [
  { plateNumber: '12가 3456', nickname: '내 차' },
  { plateNumber: '34나 7890', nickname: '회사 차' },
];

// 충전금 잔액
export const balance = 15000;
