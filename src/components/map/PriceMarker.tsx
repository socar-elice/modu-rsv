import { Marker } from 'react-leaflet';
import L from 'leaflet';
import type { ParkingLot } from '../../types';

interface PriceMarkerProps {
  parking: ParkingLot;
  isSelected?: boolean;
  onClick?: (parking: ParkingLot) => void;
}

// 가격 포맷팅 (천 단위 콤마, ₩ 기호와 단위 제거)
function formatPrice(price: number): string {
  return price.toLocaleString();
}

// 커스텀 마커 아이콘 생성
function createPriceIcon(parking: ParkingLot, isSelected: boolean): L.DivIcon {
  const priceText = formatPrice(parking.minPrice); // ₩ 기호와 / 단위 제거
  const productName = parking.displayProductName || parking.products[0]?.name || '';
  const isPurchasable = parking.isPurchasable !== false; // undefined는 true로 처리

  const isPublic = parking.type === '공영';
  const isOnSiteRate = parking.isOnSiteRate === true;
  const hasProduct = productName && productName !== '현장요금';

  // 선택된 마커 스타일 (크기 확대 + 그림자 + 테두리)
  const selectedStyle = isSelected
    ? 'transform: scale(1.15); box-shadow: 0 0 0 3px rgba(0, 145, 255, 0.3), 0 8px 24px rgba(0, 0, 0, 0.3); z-index: 1000; transition: all 0.2s ease-in-out;'
    : 'transition: all 0.2s ease-in-out;';
  const selectedClass = isSelected ? 'marker-selected' : '';

  // 공영 주차장이지만 구매 가능한 상품이 있는 경우 → 주차권 마커로 표시
  if (isPublic && hasProduct && isPurchasable) {
    // 공영이지만 상품이 있으면 주차권 마커로 표시
    const bgColor = isSelected ? '#005ACC' : '#0091FF'; // 선택시 더 진한 파란색
    const textColor = '#FFFFFF';
    const width = priceText.length > 8 ? 100 : 80;
    const label = productName.substring(0, 8);

    return L.divIcon({
      className: `price-marker-wrapper ${selectedClass}`,
      html: `
        <div class="marker-container" style="${selectedStyle}">
          <div class="marker-body" style="background: ${bgColor}; color: ${textColor}; min-width: ${width}px;">
            <div class="marker-label">${label}</div>
            <div class="marker-price">${priceText}</div>
            <div class="marker-arrow" style="border-top-color: ${bgColor}"></div>
          </div>
        </div>
      `,
      iconSize: [width, 34],
      iconAnchor: [width / 2, 34],
    });
  }

  // 공영 주차장 또는 현장요금 주차장은 흰색 둥근 마커
  if (isPublic || isOnSiteRate) {
    // 공영 주차장 / 현장요금 마커
    // 제휴 주차장이면서 현장요금인 경우 '제휴' 라벨 추가
    const isPartnership = parking.type === '제휴' && isOnSiteRate;
    const displayText = isPartnership ? `제휴 ${priceText}` : priceText;
    const baseWidth = priceText.length > 10 ? 90 : 70;
    const width = isPartnership ? baseWidth + 30 : baseWidth; // 제휴 텍스트 공간 추가

    // 선택시 배경색과 텍스트 색상 변경
    const bgColor = isSelected ? '#005ACC' : '#FFFFFF';
    const textColor = isSelected ? '#FFFFFF' : '#1F2937';
    const arrowClass = isSelected ? 'marker-arrow' : 'marker-arrow-white';
    const arrowStyle = isSelected ? `style="border-top-color: ${bgColor}"` : '';

    return L.divIcon({
      className: `price-marker-wrapper ${selectedClass}`,
      html: `
        <div class="marker-container" style="${selectedStyle}">
          <div class="marker-body-white" style="min-width: ${width}px; background: ${bgColor};">
            <div class="marker-price-dark" style="color: ${textColor};">${displayText}</div>
            <div class="${arrowClass}" ${arrowStyle}></div>
          </div>
        </div>
      `,
      iconSize: [width, 40],
      iconAnchor: [width / 2, 40],
    });
  }

  // 제휴/민영 주차장 마커
  const bgColor = isPurchasable
    ? (isSelected ? '#005ACC' : '#0091FF') // 선택시 더 진한 파란색
    : '#9CA3AF'; // 구매 불가시 회색
  const textColor = isPurchasable ? '#FFFFFF' : '#6B7280';
  const width = priceText.length > 8 ? 100 : 80;
  const label = productName.substring(0, 8);

  return L.divIcon({
    className: `price-marker-wrapper ${selectedClass}`,
    html: `
      <div class="marker-container" style="${selectedStyle}">
        <div class="marker-body" style="background: ${bgColor}; color: ${textColor}; min-width: ${width}px;">
          <div class="marker-label">${label}</div>
          <div class="marker-price">${priceText}</div>
          <div class="marker-arrow" style="border-top-color: ${bgColor}"></div>
        </div>
      </div>
    `,
    iconSize: [width, 34],
    iconAnchor: [width / 2, 34],
  });
}

export default function PriceMarker({ parking, isSelected = false, onClick }: PriceMarkerProps) {
  const icon = createPriceIcon(parking, isSelected);

  return (
    <Marker
      position={[parking.lat, parking.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onClick?.(parking),
      }}
    />
  );
}
