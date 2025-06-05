'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    kakao: any;
  }
}

// 장소 타입 정의 (카카오 API 결과에서 필요한 필드만)
type PlaceType = {
  place_name: string;
  road_address_name: string;
  address_name: string;
  phone: string;
};

export function Maps() {
  const mapRef = useRef<HTMLDivElement>(null); // 지도 DOM 참조
  const keywordRef = useRef<HTMLInputElement>(null); // 검색 입력창 참조

  // 상태 정의
  const [places, setPlaces] = useState<PlaceType[]>([]); // 검색된 장소 목록
  const [pagination, setPagination] = useState<any>(null); // 페이지네이션 객체
  const [selectedPlace, setSelectedPlace] =
    useState<PlaceType | null>(null); // 모달로 띄울 선택된 장소
  const [mapLoaded, setMapLoaded] = useState(false); // 카카오 스크립트 로딩 확인

  // 카카오 맵 로드 후 실행
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      console.log('✅ initMap 호출');
      initMap();
    }
  }, [mapLoaded]);

  // 지도 초기화 및 검색 기능 설정
  const initMap = () => {
    const kakao = (window as any).kakao;

    // 지도 생성
    const mapContainer = mapRef.current;
    const mapOption = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 초기 중심 좌표 (서울)
      level: 3,
    };
    const map = new kakao.maps.Map(mapContainer, mapOption);

    // 장소 검색 객체 생성
    const ps = new kakao.maps.services.Places();

    // 인포윈도우 (마커 hover용)
    const infowindow = new kakao.maps.InfoWindow({
      zIndex: 1,
    });

    // 마커 저장 배열
    const markers: any[] = [];

    // 키워드로 장소 검색하는 함수
    const searchPlaces = () => {
      const keyword = keywordRef.current?.value.trim();
      if (!keyword) {
        alert('키워드를 입력해주세요!');
        return;
      }

      // 키워드로 검색 요청
      ps.keywordSearch(
        keyword,
        (data: any, status: any, pagination: any) => {
          if (status === kakao.maps.services.Status.OK) {
            setPlaces(data); // 검색 결과 저장
            setPagination(pagination); // 페이지 정보 저장
            displayPlaces(data); // 지도와 목록에 표시
          } else {
            alert(
              status ===
                kakao.maps.services.Status.ZERO_RESULT
                ? '검색 결과가 없습니다.'
                : '검색 중 오류가 발생했습니다.',
            );
          }
        },
      );
    };

    // 검색된 장소 목록과 마커 표시
    const displayPlaces = (places: any[]) => {
      const bounds = new kakao.maps.LatLngBounds(); // 지도 범위 재설정용
      removeMarkers(); // 이전 마커 제거

      places.forEach((place, i) => {
        const position = new kakao.maps.LatLng(
          place.y,
          place.x,
        );
        const marker = addMarker(position, i);
        markers.push(marker);
        bounds.extend(position);

        // 마커 클릭 시 모달 표시
        kakao.maps.event.addListener(
          marker,
          'click',
          () => {
            setSelectedPlace(place);
          },
        );

        // 마커 hover 시 인포윈도우 열기
        kakao.maps.event.addListener(
          marker,
          'mouseover',
          () => {
            infowindow.setContent(
              `<div style="padding:5px;">${place.place_name}</div>`,
            );
            infowindow.open(map, marker);
          },
        );

        // 마커 hover 해제 시 인포윈도우 닫기
        kakao.maps.event.addListener(
          marker,
          'mouseout',
          () => {
            infowindow.close();
          },
        );
      });

      // 마커 범위로 지도 확대
      map.setBounds(bounds);
    };

    // 마커 생성 함수
    const addMarker = (position: any, idx: number) => {
      const imageSrc =
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
      const imageSize = new kakao.maps.Size(36, 37);
      const imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691),
        spriteOrigin: new kakao.maps.Point(
          0,
          idx * 46 + 10,
        ),
        offset: new kakao.maps.Point(13, 37),
      };
      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imgOptions,
      );
      const marker = new kakao.maps.Marker({
        position,
        image: markerImage,
      });
      marker.setMap(map);
      return marker;
    };

    // 마커 모두 제거
    const removeMarkers = () => {
      markers.forEach((marker) => marker.setMap(null));
      markers.length = 0;
    };

    // 초기 키워드로 자동 검색
    keywordRef.current!.value = '광주 꽃집';
    searchPlaces();

    // 검색 폼 이벤트 연결
    document.getElementById('searchForm')!.onsubmit = (
      e,
    ) => {
      e.preventDefault();
      searchPlaces();
    };
  };

  return (
    <section className='w-full'>
      {/* 카카오맵 SDK Script 동적 로딩 */}
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&autoload=false&libraries=services`}
        strategy='afterInteractive'
        onLoad={() => {
          window.kakao.maps.load(() => {
            console.log('✅ Kakao SDK 완전히 로드됨');
            setMapLoaded(true); // ✅ 이때만 initMap 호출 가능!
          });
        }}
      />

      <h2 className='mb-6 font-bold text-2xl md:text-3xl'>
        내 주변 꽃집 📍
      </h2>

      {/* 지도 및 검색 결과 UI */}
      <div className='relative'>
        <div
          ref={mapRef}
          className='w-full h-[500px] rounded-xl'
        />

        {/* 왼쪽 상단 검색창 및 결과 목록 */}
        <div className='absolute top-2 left-2 bg-white/80 p-3 rounded-lg z-10 w-64 max-h-[450px] overflow-y-auto shadow-lg'>
          <form
            id='searchForm'
            className='mb-3 flex items-center gap-2'
          >
            <input
              ref={keywordRef}
              type='text'
              className='w-full border border-gray-300 rounded px-2 py-1'
              placeholder='키워드 입력'
            />
            <button
              type='submit'
              className='bg-blue-500 text-white px-3 py-1 rounded'
            >
              검색
            </button>
          </form>

          {/* 장소 리스트 */}
          <ul>
            {places.map((place, idx) => (
              <li
                key={idx}
                className='border-t py-2 text-sm'
              >
                <strong>{place.place_name}</strong>
                <div>
                  {place.road_address_name ||
                    place.address_name}
                </div>
                <div className='text-green-600'>
                  {place.phone}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 마커 클릭 시 나오는 모달 */}
      {selectedPlace && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-80 shadow-lg'>
            <h3 className='text-xl font-bold mb-2'>
              {selectedPlace.place_name}
            </h3>
            <p className='text-sm mb-1'>
              📍{' '}
              {selectedPlace.road_address_name ||
                selectedPlace.address_name}
            </p>
            <p className='text-sm mb-4'>
              📞 {selectedPlace.phone || '전화번호 없음'}
            </p>
            <button
              onClick={() => setSelectedPlace(null)}
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
