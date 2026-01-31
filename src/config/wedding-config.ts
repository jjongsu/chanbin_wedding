const uniqueIdentifier = 'JWK-WEDDING-TEMPLATE-V1';

// 갤러리 레이아웃 타입 정의
type GalleryLayout = 'scroll' | 'grid';
type GalleryPosition = 'middle' | 'bottom';

interface GalleryConfig {
    layout: GalleryLayout;
    position: GalleryPosition;
    images: string[];
}

export const weddingConfig = {
    // 메타 정보
    meta: {
        title: '찬빈❤️인화 결혼식에 초대합니다.',
        description: '2026. 4. 5.(일) PM 12:40\n대전 팔레드오페라, 4F 가르니에홀',
        ogImage: '/images/ha0h-1fsi-bqt3.jpg',
        noIndex: true,
        _jwk_watermark_id: uniqueIdentifier,
    },

    // 메인 화면
    main: {
        title: 'Wedding Day',
        image: '/images/ha0h-1fsi-bqt3.jpg',
        date: '2026년 4월 5일 일요일 12시 40분',
        venue: '팔레드오페라 4F 가르니에홀',
    },

    // 소개글
    intro: {
        title: '',
        text: '서로를 바라보며 걸어온\n소중한 발걸음이\n이제 하나의 길로 이어집니다.\n\n사랑과 믿음으로\n새 가정을 이루는 저희 두 사람의\n작은 시작을 알려드립니다.',
    },

    // 결혼식 일정
    date: {
        year: 2026,
        month: 4,
        day: 5,
        hour: 12,
        minute: 40,
        displayDate: '2026.04.05 SUN PM 12:40',
    },

    // 장소 정보
    venue: {
        name: '팔레드오페라',
        address: '대전 서구 둔산남로 50\n팔레드오페라',
        tel: '042-300-5000',
        naverMapId: '팔레드오페라', // 네이버 지도 검색용 장소명
        coordinates: {
            latitude: 37.5665,
            longitude: 126.978,
        },
        placeId: '123456789', // 네이버 지도 장소 ID
        mapZoom: '17', // 지도 줌 레벨
        mapNaverCoordinates: '14141300,4507203,15,0,0,0,dh', // 네이버 지도 길찾기 URL용 좌표 파라미터 (구 형식)
        transportation: {
            subway: '지하철역 1번 출구에서 도보 5분',
            bus: '간선\n 101, 102, 103\n지선\n 1234, 5678',
        },
        parking: '건물 주차장 이용 가능 (3시간 무료)',
    },

    // 갤러리
    gallery: {
        layout: 'grid' as GalleryLayout, // "scroll" 또는 "grid" 선택
        position: 'bottom' as GalleryPosition, // "middle" (현재 위치) 또는 "bottom" (맨 하단) 선택
        images: [
            '/images/gallery/image1.jpg',
            '/images/gallery/image2.jpg',
            '/images/gallery/image3.jpg',
            '/images/gallery/image4.jpg',
            '/images/gallery/image5.jpg',
            '/images/gallery/image6.jpg',
            '/images/gallery/image7.jpg',
            '/images/gallery/image8.jpg',
            '/images/gallery/image9.jpg',
        ],
    } as GalleryConfig,

    // 초대의 말씀
    invitation: {
        message: '사랑과 신뢰로 한 걸음 한 걸음\n\n서로의 인생에 다가선 두 사람이\n\n이제 하나가 되어\n\n새로운 시작을 하려 합니다.',
        groom: {
            name: '남궁찬빈',
            label: '아들',
            father: '남궁석',
            mother: '김선영',
        },
        bride: {
            name: '이인화',
            label: '딸',
            father: '이현수',
            mother: '전은수',
        },
    },

    // 계좌번호
    account: {
        groom: {
            bank: '신한은행',
            number: '110-550-784349',
            holder: '남궁찬빈',
        },
        bride: {
            bank: '농협은행',
            number: '352-1102-3325-23',
            holder: '이인화',
        },
        groomFather: {
            bank: '농협은행',
            number: '463072-52-065046',
            holder: '남궁석',
        },
        groomMother: {
            bank: '우체국',
            number: '310391-02-046715',
            holder: '김선영',
        },
        brideFather: {
            bank: '은행명',
            number: '999-000-111222',
            holder: '신부아버지',
        },
        brideMother: {
            bank: '은행명',
            number: '333-444-555666',
            holder: '신부어머니',
        },
    },

    // RSVP 설정
    rsvp: {
        enabled: false, // RSVP 섹션 표시 여부
        showMealOption: false, // 식사 여부 입력 옵션 표시 여부
    },

    // 슬랙 알림 설정
    slack: {
        webhookUrl: process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL || '',
        channel: '#wedding-response',
        compactMessage: true, // 슬랙 메시지를 간결하게 표시
    },
};
