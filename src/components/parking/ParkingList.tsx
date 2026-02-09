import { useState, useMemo } from 'react';
import type { ParkingLot } from '../../types';
import ParkingListItem from './ParkingListItem';
import { calculateDistance } from '../../utils/distanceCalculator';

interface ParkingListProps {
  parkingLots: ParkingLot[];
  onSelect: (parking: ParkingLot) => void;
  mapCenter: [number, number];
}

export default function ParkingList({ parkingLots, onSelect, mapCenter }: ParkingListProps) {
  const [sortType, setSortType] = useState<'price' | 'distance'>('price');

  // 정렬된 주차장 목록
  const sortedParkingLots = useMemo(() => {
    const sorted = [...parkingLots];

    if (sortType === 'price') {
      return sorted.sort((a, b) => a.minPrice - b.minPrice);
    } else {
      return sorted.sort((a, b) =>
        calculateDistance(mapCenter, a) - calculateDistance(mapCenter, b)
      );
    }
  }, [parkingLots, sortType, mapCenter]);

  if (parkingLots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-gray-500">주변에 주차장이 없습니다</p>
      </div>
    );
  }

  return (
    <div>
      {/* 결과 개수 및 정렬 */}
      <div className="px-4 pt-12 pb-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          주변 주차장 <span className="font-semibold text-gray-900">{parkingLots.length}개</span>
        </span>

        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setSortType('price')}
            className={sortType === 'price' ? 'font-bold text-gray-900' : 'text-gray-400'}
          >
            가격순
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setSortType('distance')}
            className={sortType === 'distance' ? 'font-bold text-gray-900' : 'text-gray-400'}
          >
            거리순
          </button>
        </div>
      </div>

      {/* 리스트 */}
      <div>
        {sortedParkingLots.map((parking) => (
          <ParkingListItem
            key={parking.id}
            parking={parking}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
