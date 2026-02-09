import { useRef, useEffect, ReactNode } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import type { BottomSheetState } from '../../types';

interface BottomSheetProps {
  children: ReactNode;
  state: BottomSheetState;
  onStateChange: (state: BottomSheetState) => void;
  title?: string;
  onClose?: () => void;
}

// 바텀시트 높이 설정 (픽셀)
const SHEET_HEIGHTS = {
  closed: 0,
  peek: 200,    // 미리보기 높이
  half: 400,    // 절반 높이
  full: window.innerHeight - 60, // 전체 (상단 여백 60px)
};

export default function BottomSheet({
  children,
  state,
  onStateChange,
  title,
  onClose,
}: BottomSheetProps) {
  const controls = useAnimation();
  const sheetRef = useRef<HTMLDivElement>(null);

  // 상태에 따른 높이 설정
  useEffect(() => {
    const height = SHEET_HEIGHTS[state];
    controls.start({
      height,
      transition: { type: 'spring', damping: 30, stiffness: 300 },
    });
  }, [state, controls]);

  // 드래그 종료 핸들러
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    // 빠른 스와이프 감지
    if (velocity > 500 || offset > 100) {
      // 아래로 스와이프
      if (state === 'full') {
        onStateChange('half');
      } else if (state === 'half') {
        onStateChange('peek');
      } else {
        onStateChange('closed');
        onClose?.();
      }
    } else if (velocity < -500 || offset < -100) {
      // 위로 스와이프
      if (state === 'peek') {
        onStateChange('half');
      } else if (state === 'half') {
        onStateChange('full');
      }
    }
  };

  if (state === 'closed') {
    return null;
  }

  return (
    <motion.div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-sheet z-[999] safe-area-bottom"
      initial={{ height: 0 }}
      animate={controls}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      {/* 핸들 영역 */}
      <div className="relative flex justify-center cursor-grab active:cursor-grabbing">
        <div className="bottom-sheet-handle" />
      </div>

      {/* 헤더 (선택적) */}
      {title && (
        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      )}

      {/* 내용 */}
      <div className="overflow-y-auto hide-scrollbar" style={{ height: 'calc(100% - 50px)' }}>
        {children}
      </div>
    </motion.div>
  );
}
