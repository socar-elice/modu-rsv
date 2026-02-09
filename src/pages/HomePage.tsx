import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/map/MapView';
import BottomNav from '../components/common/BottomNav';
import MapControls from '../components/common/MapControls';
import BottomSheet from '../components/common/BottomSheet';
import ParkingList from '../components/parking/ParkingList';
import ParkingDetail from '../components/parking/ParkingDetail';
import SearchFilterBar from '../components/common/SearchFilterBar';
import ProductDetailHeader from '../components/product/ProductDetailHeader';
import SelectedProductInfo from '../components/product/SelectedProductInfo';
import ParkingImages from '../components/product/ParkingImages';
import OtherProductsList from '../components/product/OtherProductsList';
import NoticeSection from '../components/product/NoticeSection';
import ParkingInfoSection from '../components/product/ParkingInfoSection';
import PurchaseButton from '../components/product/PurchaseButton';
import { parkingLots } from '../data/mockData';
import { mockProductDetail } from '../data/productDetailMockData';
import { selectPrimaryProduct, selectMonthlyProduct } from '../utils/productSelection';
import type { ParkingLot, ParkingProduct, BottomSheetState, NavTab, SearchCondition, MapMode } from '../types';

interface FilterState {
  public: boolean;
  excludeMechanical: boolean;
  cafe: boolean;
  restaurant: boolean;
  mart: boolean;
  evCharging: boolean;
}

const FILTER_STORAGE_KEY = 'parking-filters';

export default function HomePage() {
  const navigate = useNavigate();

  // 상태 관리
  const [activeTab, setActiveTab] = useState<NavTab>('share');
  const [selectedParking, setSelectedParking] = useState<ParkingLot | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ParkingProduct | null>(null);
  const [sheetState, setSheetState] = useState<BottomSheetState>('closed');
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'product-detail'>('list');

  // 검색 조건 상태
  const [searchCondition, setSearchCondition] = useState<SearchCondition>({
    basis: 'NOW',
    type: 'HOURLY',
    hours: 3
  });
  const [mapMode, setMapMode] = useState<MapMode>('NORMAL');

  // 지도 상태
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.5446, 127.0520]);
  const [mapZoom, setMapZoom] = useState(17);

  // 지도 필터 상태
  const [showShare, setShowShare] = useState(false);
  const [showTicket, setShowTicket] = useState(true);
  const [showMonthly, setShowMonthly] = useState(false);

  // 주차장 필터 상태 (localStorage에서 로드)
  const [filters, setFilters] = useState<FilterState>(() => {
    try {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
    return {
      public: true,
      excludeMechanical: false,
      cafe: true,
      restaurant: true,
      mart: true,
      evCharging: true,
    };
  });

  // 검색 조건이 변경되면 선택된 주차장 리셋
  useEffect(() => {
    // 상세 페이지가 열려있으면 닫기
    if (selectedParking && viewMode === 'detail') {
      setSelectedParking(null);
      setViewMode('list');
    }
  }, [searchCondition.startDateTime, searchCondition.endDateTime, searchCondition.type]);

  // 페이지가 포커스될 때마다 필터 상태 재로드 (FilterPage에서 돌아올 때)
  useEffect(() => {
    const handleFocus = () => {
      try {
        const saved = localStorage.getItem(FILTER_STORAGE_KEY);
        if (saved) {
          setFilters(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to reload filters:', error);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // GPS 내 위치로 이동
  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setMapZoom(18);
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          alert('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        }
      );
    } else {
      alert('이 브라우저에서는 위치 서비스를 지원하지 않습니다.');
    }
  };

  // 마커 클릭 핸들러 → 상품 상세로 바로 이동
  const handleParkingClick = (parking: ParkingLot) => {
    // 대표 상품 선택 (첫 번째 상품)
    const primaryProduct = parking.products[0];
    setSelectedParking(parking);
    setSelectedProduct(primaryProduct);
    setViewMode('product-detail');
    setSheetState('full');
  };

  // 리스트에서 주차권 선택 → 모달 내에서 상품 상세 표시
  const handleSelectFromList = (parking: ParkingLot) => {
    // 대표 상품 선택 (첫 번째 상품)
    const primaryProduct = parking.products[0];
    setSelectedParking(parking);
    setSelectedProduct(primaryProduct);
    setViewMode('product-detail');
    setSheetState('full');
  };

  // 상품 선택 → 모달 내에서 상품 상세 표시
  const handleProductSelect = (parking: ParkingLot, product: ParkingProduct) => {
    setSelectedParking(parking);
    setSelectedProduct(product);
    setViewMode('product-detail');
    setSheetState('full');
  };

  // 바텀시트 닫기
  const handleSheetClose = () => {
    setSelectedParking(null);
    setSelectedProduct(null);
    setViewMode('list');
  };

  // 상품 상세에서 다른 상품 선택
  const handleProductSelectInDetail = (productId: number) => {
    if (selectedParking) {
      const product = selectedParking.products.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
      }
    }
  };

  // 구매하기
  const handlePurchase = () => {
    if (selectedParking && selectedProduct) {
      navigate('/payment', {
        state: { parking: selectedParking, product: selectedProduct }
      });
    }
  };

  // 상품 상세에서 뒤로 가기 → 리스트로 이동
  const handleBackFromProductDetail = () => {
    setSelectedParking(null);
    setSelectedProduct(null);
    setViewMode('list');
    setSheetState('half');
  };

  // 검색 핸들러
  const handleSearch = (query: string) => {
    console.log('검색:', query);
  };

  // 주변 주차장 보기 버튼 클릭
  const handleShowNearbyParking = () => {
    setViewMode('list');
    setSheetState('half');
  };

  // 필터 확인 핸들러
  const handleFilterConfirm = () => {
    // 검색 조건 변경 시 선택된 주차장 리셋 (상세 페이지 닫기)
    setSelectedParking(null);
    setViewMode('list');
    setSheetState('closed');

    // 지도 모드 전환
    if (searchCondition.type === 'MONTHLY') {
      // 월주차 모드: 줌 아웃, 정기권만 표시
      setMapMode('MONTHLY');
      setShowShare(false);
      setShowTicket(false);
      setShowMonthly(true);
      setMapZoom(14); // 줌 아웃
    } else if (searchCondition.basis === 'FUTURE') {
      setMapMode('FUTURE');
      setShowShare(false);
      setShowMonthly(false);
      setShowTicket(true);
      setMapZoom(17);
    } else {
      setMapMode('NORMAL');
      setShowShare(false);
      setShowTicket(true);
      setShowMonthly(false);
      setMapZoom(17);
    }
  };

  // 줌 인/아웃 핸들러
  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 10));
  };

  // 바텀시트 높이 계산
  const getBottomSheetHeight = (state: BottomSheetState): number => {
    const heights = {
      closed: 0,
      peek: 200,
      half: 400,
      full: window.innerHeight - 100,
    };
    return heights[state];
  };

  // 검색 조건에 따른 가격 및 상품 계산 (새로운 로직 사용)
  const calculatePriceAndProduct = (lot: ParkingLot): {
    price: number;
    productName: string;
    isPurchasable: boolean;
    reason?: string;
    durationUnit?: string; // 기간 단위 (예: "2일", "3시간", "월")
    hasValidProduct: boolean; // 적합한 상품이 있는지 여부
    isOnSiteRate?: boolean; // 현장요금 여부
  } => {
    // 월주차 모드
    if (searchCondition.type === 'MONTHLY') {
      const result = selectMonthlyProduct(lot.products);
      if (result) {
        return {
          price: result.price,
          productName: result.productName,
          isPurchasable: result.isPurchasable,
          reason: result.reason,
          durationUnit: result.durationUnit,
          hasValidProduct: true
        };
      }
      return {
        price: lot.minPrice,
        productName: '',
        isPurchasable: true,
        hasValidProduct: false
      };
    }

    // FUTURE 기준: startDateTime과 endDateTime 사용
    if (searchCondition.startDateTime && searchCondition.endDateTime) {
      const start = new Date(searchCondition.startDateTime);
      const end = new Date(searchCondition.endDateTime);
      const requestedMinutes = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60));

      const result = selectPrimaryProduct(lot.products, requestedMinutes, start, end);
      if (result) {
        // 검색 조건에 맞는 표시 단위 결정
        let contextualDurationUnit = result.durationUnit;
        const requestedDays = requestedMinutes / 1440; // 1440 = 24시간

        // 1일 검색 (8~24시간): '일주차' 표시
        if (requestedMinutes >= 480 && requestedMinutes <= 1440) {
          contextualDurationUnit = '일주차';
        }
        // 7일 검색: '7일' 표시
        else if (requestedDays >= 6.5 && requestedDays <= 7.5) {
          contextualDurationUnit = '7일';
        }
        // 2-6일: '2일', '3일' 등으로 표시
        else if (requestedDays >= 2 && requestedDays < 7) {
          contextualDurationUnit = `${Math.round(requestedDays)}일`;
        }

        return {
          price: result.price,
          productName: result.productName,
          isPurchasable: result.isPurchasable,
          reason: result.reason,
          durationUnit: contextualDurationUnit,
          hasValidProduct: true
        };
      }

      // 적합한 상품이 없는 경우: 24시간 이하면 현장요금 계산
      const requestedHours = requestedMinutes / 60;
      if (requestedHours <= 24) {
        const calculatedRate = lot.hourlyRate * requestedHours;
        const finalPrice = lot.dailyMaxRate
          ? Math.min(calculatedRate, lot.dailyMaxRate)
          : calculatedRate;

        return {
          price: Math.ceil(finalPrice),
          productName: '현장요금',
          isPurchasable: false,
          reason: '현장에서 결제 가능',
          hasValidProduct: true,
          isOnSiteRate: true
        };
      }

      // 24시간 초과면 지도에 표시하지 않음
      return {
        price: 0,
        productName: '',
        isPurchasable: false,
        hasValidProduct: false
      };
    }

    // NOW 기준: type별 처리
    if (searchCondition.type === 'HOURLY' && searchCondition.hours) {
      // 시간권
      const requestedMinutes = searchCondition.hours * 60;
      const result = selectPrimaryProduct(lot.products, requestedMinutes);
      if (result) {
        return {
          price: result.price,
          productName: result.productName,
          isPurchasable: result.isPurchasable,
          reason: result.reason,
          hasValidProduct: true
        };
      }
      // 적합한 상품이 없으면 현장요금 계산
      const calculatedRate = lot.hourlyRate * searchCondition.hours;
      const finalPrice = lot.dailyMaxRate
        ? Math.min(calculatedRate, lot.dailyMaxRate)
        : calculatedRate;

      return {
        price: finalPrice,
        productName: '현장요금',
        isPurchasable: false,
        reason: '현장에서 결제 가능',
        hasValidProduct: true,
        isOnSiteRate: true
      };
    }

    if (searchCondition.type === 'DAILY' && searchCondition.date) {
      // 당일권 (24시간)
      const requestedMinutes = 24 * 60;
      const result = selectPrimaryProduct(lot.products, requestedMinutes);
      if (result) {
        return {
          price: result.price,
          productName: result.productName,
          isPurchasable: result.isPurchasable,
          reason: result.reason,
          hasValidProduct: true
        };
      }
      // 적합한 상품이 없으면 현장요금 계산 (24시간)
      const calculatedRate = lot.hourlyRate * 24;
      const finalPrice = lot.dailyMaxRate
        ? Math.min(calculatedRate, lot.dailyMaxRate)
        : calculatedRate;

      return {
        price: finalPrice,
        productName: '현장요금',
        isPurchasable: false,
        reason: '현장에서 결제 가능',
        hasValidProduct: true,
        isOnSiteRate: true
      };
    }

    if (searchCondition.type === 'MULTI_DAY' && searchCondition.startDate && searchCondition.endDate) {
      // 연박주차 (2일 이상)
      const start = new Date(searchCondition.startDate);
      const end = new Date(searchCondition.endDate);
      // 날짜의 시작(00:00)부터 끝(23:59)까지로 계산
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      const requestedMinutes = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60));

      const result = selectPrimaryProduct(lot.products, requestedMinutes, start, end);
      if (result) {
        return {
          price: result.price,
          productName: result.productName,
          isPurchasable: result.isPurchasable,
          reason: result.reason,
          hasValidProduct: true
        };
      }
      // 적합한 상품이 없으면 표시하지 않음
      return {
        price: 0,
        productName: '',
        isPurchasable: false,
        hasValidProduct: false
      };
    }

    // 기본값: 가장 저렴한 상품 사용
    const cheapest = [...lot.products].sort((a, b) => a.price - b.price)[0];
    return {
      price: cheapest?.price || lot.minPrice,
      productName: cheapest?.name || '',
      isPurchasable: cheapest?.purchasable ?? true,
      hasValidProduct: true
    };
  };

  // 필터 적용 함수
  const applyFilters = (lot: ParkingLot): boolean => {
    // 1. 공영 주차장 필터
    if (!filters.public && lot.type === '공영') {
      return false;
    }

    // 2. 기계식 제외 필터
    if (filters.excludeMechanical && lot.isMechanical) {
      return false;
    }

    // 3. 편의시설 주차장 필터 (하나라도 true면 해당 편의시설만 표시)
    const hasAnyAmenityFilter = filters.cafe || filters.restaurant || filters.mart;
    if (hasAnyAmenityFilter) {
      const matchesAmenity =
        (filters.cafe && lot.hasCafe) ||
        (filters.restaurant && lot.hasRestaurant) ||
        (filters.mart && lot.hasMart);

      // 편의시설이 하나도 없는 주차장은 항상 표시
      const hasAnyAmenity = lot.hasCafe || lot.hasRestaurant || lot.hasMart;
      if (hasAnyAmenity && !matchesAmenity) {
        return false;
      }
    }

    // 4. 전기차 충전소 필터
    if (!filters.evCharging && lot.hasEvCharging) {
      return false;
    }

    return true;
  };

  // 월주차 모드일 때 정기권이 있는 제휴/민영 주차장만 필터링하고 정기권 가격으로 표시
  const filteredParkingLots = mapMode === 'MONTHLY'
    ? parkingLots
        .filter(lot => applyFilters(lot)) // 필터 적용
        .filter(lot =>
          lot.type !== '공영' && // 공영 주차장 제외
          lot.products.some(product => product.durationType === 'MONTHLY')
        )
        .map(lot => {
          const result = calculatePriceAndProduct(lot);
          const monthlyProduct = lot.products.find(product => product.durationType === 'MONTHLY');
          return {
            ...lot,
            minPrice: result.price,
            displayProductName: result.productName,
            isPurchasable: result.isPurchasable,
            purchasableReason: result.reason,
            durationUnit: result.durationUnit,
            products: monthlyProduct ? [monthlyProduct] : lot.products // 정기권만 표시
          };
        })
    : parkingLots
        .filter(lot => applyFilters(lot)) // 필터 적용
        .map(lot => {
          const result = calculatePriceAndProduct(lot);
          // 적합한 상품이 없으면 null 반환 (지도에 표시하지 않음)
          if (!result.hasValidProduct) {
            return null;
          }

          // 기간 단위 표시: 7일, 2일 등은 기간으로 표시하고, 시간권/현장요금은 상품명 표시
          const shouldUseDurationUnit = result.durationUnit &&
            (result.durationUnit.includes('일') || result.durationUnit === '월');

          // 구매 가능한 제휴상품: 실제 상품명 표시 (예: '일주차권', '종일권')
          // 현장요금 or 구매 불가: 검색 조건 기반 기간 표시 (예: '일주차', '7일')
          const displayName = (result.isPurchasable && !result.isOnSiteRate)
            ? (result.productName || result.durationUnit || '상품') // 구매 가능한 제휴상품: 상품명 표시
            : shouldUseDurationUnit
              ? (result.durationUnit || result.productName || '상품') // 기간 단위 표시 (현장요금 등)
              : (result.productName || result.durationUnit || '상품'); // 시간권 등

          return {
            ...lot,
            minPrice: result.price,
            displayProductName: displayName,
            isPurchasable: result.isPurchasable,
            purchasableReason: result.reason,
            durationUnit: result.durationUnit,
            isOnSiteRate: result.isOnSiteRate
          };
        })
        .filter((lot): lot is NonNullable<typeof lot> => lot !== null); // null 제거

  return (
    <div className="relative h-full w-full">
      {/* 지도 */}
      <MapView
        parkingLots={filteredParkingLots}
        selectedParking={selectedParking}
        onParkingClick={handleParkingClick}
        center={mapCenter}
        zoom={mapZoom}
      />

      {/* 검색 및 필터 통합 바 */}
      <SearchFilterBar
        onSearch={handleSearch}
        condition={searchCondition}
        onConditionChange={setSearchCondition}
        onConfirm={handleFilterConfirm}
      />

      {/* 지도 컨트롤 (좌측/우측 버튼들) */}
      <MapControls
        showShare={showShare}
        showTicket={showTicket}
        showMonthly={showMonthly}
        onToggleShare={mapMode === 'MONTHLY' ? () => {} : () => setShowShare(!showShare)}
        onToggleTicket={mapMode === 'MONTHLY' ? () => {} : () => setShowTicket(!showTicket)}
        onToggleMonthly={() => setShowMonthly(!showMonthly)}
        onLocate={handleLocate}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        bottomSheetHeight={getBottomSheetHeight(sheetState)}
      />

      {/* NAVER 로고 (모의) */}
      <div className="naver-logo">NAVER</div>

      {/* 내 주변 주차권 버튼 */}
      {sheetState === 'closed' && (
        <button
          onClick={handleShowNearbyParking}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[1000] px-3.5 py-2 bg-[#1a1f36]/90 text-white text-sm rounded-full shadow-lg font-medium flex items-center gap-1.5"
        >
          <div className="w-4 h-4 bg-primary rounded flex items-center justify-center text-[8px] font-bold">
            P
          </div>
          주차권 목록보기
        </button>
      )}

      {/* 바텀시트 */}
      <BottomSheet
        state={sheetState}
        onStateChange={setSheetState}
        onClose={handleSheetClose}
      >
        {viewMode === 'list' ? (
          <ParkingList
            parkingLots={filteredParkingLots}
            onSelect={handleSelectFromList}
            mapCenter={mapCenter}
          />
        ) : viewMode === 'detail' && selectedParking ? (
          <ParkingDetail
            parking={selectedParking}
            onProductSelect={handleProductSelect}
            onBack={() => setViewMode('list')}
            searchCondition={searchCondition}
          />
        ) : viewMode === 'product-detail' && selectedParking && selectedProduct ? (
          <div className="h-full overflow-y-auto bg-white">
            {/* 헤더 */}
            <ProductDetailHeader
              parkingName={selectedParking.name}
              operatingHours="오늘 08:00~24:00 주차"
              onBack={handleBackFromProductDetail}
            />

            {/* 선택된 상품 정보 */}
            <SelectedProductInfo
              productName={selectedProduct.name}
              price={selectedProduct.price}
            />

            {/* 주차장 이미지 */}
            <ParkingImages images={selectedParking.images || mockProductDetail.parking.images} />

            {/* 이 주차장의 다른 주차권 */}
            {selectedParking.products.length > 0 && (
              <OtherProductsList
                products={selectedParking.products.map(p => ({
                  id: p.id,
                  name: p.name,
                  timeRange: p.timeConstraint
                    ? `${p.timeConstraint.startTime} ~ ${p.timeConstraint.endTime} 이용가능`
                    : "00:00 ~ 23:59 이용가능",
                  price: p.price
                }))}
                currentProductId={selectedProduct.id}
                onProductSelect={handleProductSelectInDetail}
              />
            )}

            {/* 필수 결제 전 유의사항 */}
            <NoticeSection
              title="결제 전 유의사항"
              items={mockProductDetail.requiredNotices}
              isRequired={true}
            />

            {/* 입출차 주의사항 */}
            {selectedParking.notices && selectedParking.notices.length > 0 && (
              <NoticeSection
                title="입출차 주의사항"
                items={selectedParking.notices}
              />
            )}

            {/* 주차장 정보 */}
            <ParkingInfoSection
              parkingName={selectedParking.name}
              address={selectedParking.address}
              basicRate={`기본 30분 ${selectedParking.hourlyRate ? Math.round(selectedParking.hourlyRate / 2).toLocaleString() : '1,000'}원`}
              additionalRate={`추가 30분 ${selectedParking.hourlyRate ? Math.round(selectedParking.hourlyRate / 2).toLocaleString() : '2,000'}원`}
            />

            {/* 주차권 공통 안내사항 */}
            <NoticeSection
              title="주차권 공통 안내사항"
              items={selectedParking.info && selectedParking.info.length > 0 ? selectedParking.info : mockProductDetail.commonNotices}
              className="border-t border-gray-100"
            />

            {/* 구매 버튼 */}
            <PurchaseButton onClick={handlePurchase} />
          </div>
        ) : null}
      </BottomSheet>

      {/* 하단 내비게이션 */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
