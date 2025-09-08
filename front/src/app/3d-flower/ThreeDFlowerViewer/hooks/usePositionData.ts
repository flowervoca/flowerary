import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

interface PositionData {
  flowerPositions: any[];
  wrapperPosition: any | null;
  decorationPosition: any | null;
}

interface UsePositionDataProps {
  ready: boolean;
  flowerModelId?: string;
  decorationModelId?: string;
  fetchFlowerPositions: (id: string) => Promise<any[]>;
  fetchFixedWrapper: () => Promise<any | null>;
  fetchDecorationPositions: (
    id: string,
  ) => Promise<any | null>;
}

export const usePositionData = ({
  ready,
  flowerModelId,
  decorationModelId,
  fetchFlowerPositions,
  fetchFixedWrapper,
  fetchDecorationPositions,
}: UsePositionDataProps) => {
  const [positionData, setPositionData] =
    useState<PositionData>({
      flowerPositions: [],
      wrapperPosition: null,
      decorationPosition: null,
    });

  const [loading, setLoading] = useState(false);
  const lastKeyRef = useRef<string | null>(null);

  const loadPositionData = useCallback(async () => {
    if (!ready) return;

    setLoading(true);
    const key = `${flowerModelId || ''}|${decorationModelId || ''}`;
    lastKeyRef.current = key;

    try {
      const [
        flowerPositions,
        wrapperPosition,
        decorationPosition,
      ] = await Promise.all([
        flowerModelId
          ? fetchFlowerPositions(flowerModelId)
          : Promise.resolve([]),
        fetchFixedWrapper(),
        decorationModelId
          ? fetchDecorationPositions(decorationModelId)
          : Promise.resolve(null),
      ]);

      setPositionData({
        flowerPositions: flowerPositions || [],
        wrapperPosition,
        decorationPosition,
      });
    } catch (error) {
      console.error('Error loading position data:', error);
    } finally {
      setLoading(false);
    }
  }, [
    ready,
    flowerModelId,
    decorationModelId,
    fetchFlowerPositions,
    fetchFixedWrapper,
    fetchDecorationPositions,
  ]);

  useEffect(() => {
    // flower/decoration ID가 바뀔 때마다 새로 로드
    setPositionData({
      flowerPositions: [],
      wrapperPosition: null,
      decorationPosition: null,
    });
    loadPositionData();
  }, [loadPositionData, flowerModelId, decorationModelId]);

  return {
    positionData,
    loading,
  };
};
