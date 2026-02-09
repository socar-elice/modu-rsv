/**
 * Haversine 공식을 사용하여 두 좌표 간의 거리를 계산합니다.
 * @param center 지도 중심 좌표 [위도, 경도]
 * @param parking 주차장 정보 { lat, lng }
 * @returns 거리 (미터)
 */
export function calculateDistance(
  center: [number, number],
  parking: { lat: number; lng: number }
): number {
  const [lat1, lng1] = center;
  const { lat: lat2, lng: lng2 } = parking;

  // 지구 반지름 (미터)
  const R = 6371000;

  // 라디안으로 변환
  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // 거리 계산 (미터)
  const distance = R * c;

  return distance;
}
