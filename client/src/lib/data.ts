export type Product = {
  id: string;
  name: string;
  englishName: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  colors: string[];
  sizes: string[];
  badge?: 'NEW' | 'BEST' | 'SALE';
  description: string;
  detail: string;
  stock: number;
};

export const categories = [
  { slug: 'all', label: '전체' },
  { slug: 'best', label: '베스트' },
  { slug: 'new', label: '신상품' },
  { slug: 'top', label: '블라우스' },
  { slug: 'dress', label: '원피스' },
  { slug: 'outer', label: '아우터' },
  { slug: 'bottom', label: '스커트 / 팬츠' },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: '코튼 러플 블라우스',
    englishName: 'Cotton Ruffle Blouse',
    price: 39000,
    originalPrice: 52000,
    category: 'top',
    image: '/products/blouse-cream.png',
    colors: ['크림', '화이트', '라이트블루'],
    sizes: ['S', 'M', 'L'],
    badge: 'BEST',
    description: '은은한 러플 디테일로 여성스러움을 더한 데일리 블라우스',
    detail:
      '부드러운 코튼 혼방 소재로 제작되어 사계절 편안하게 착용 가능합니다. 잔잔한 러플 디테일이 우아한 무드를 완성합니다.',
    stock: 124,
  },
  {
    id: 'p2',
    name: '소프트 니트 가디건',
    englishName: 'Soft Knit Cardigan',
    price: 46000,
    category: 'outer',
    image: '/products/knit-pink.png',
    colors: ['블러쉬핑크', '크림', '베이지'],
    sizes: ['FREE'],
    badge: 'NEW',
    description: '포근한 감촉의 데일리 니트 가디건',
    detail:
      '부드러운 터치감의 니트 소재로 가볍게 걸치기 좋은 가디건입니다. 어떤 이너와도 잘 어울립니다.',
    stock: 88,
  },
  {
    id: 'p3',
    name: '플로럴 미디 원피스',
    englishName: 'Floral Midi Dress',
    price: 58000,
    originalPrice: 72000,
    category: 'dress',
    image: '/products/dress-floral.png',
    colors: ['플로럴'],
    sizes: ['S', 'M', 'L'],
    badge: 'SALE',
    description: '잔잔한 플로럴 패턴의 사랑스러운 미디 원피스',
    detail: '하늘하늘한 소재감과 은은한 플로럴 패턴으로 봄, 여름 데이트룩으로 완벽합니다.',
    stock: 42,
  },
  {
    id: 'p4',
    name: '플리츠 미디 스커트',
    englishName: 'Pleated Midi Skirt',
    price: 42000,
    category: 'bottom',
    image: '/products/skirt-beige.png',
    colors: ['베이지', '크림'],
    sizes: ['S', 'M', 'L'],
    description: '우아한 플리츠 라인의 미디 스커트',
    detail: '흐르는 듯한 플리츠 디테일이 워킹 시 자연스러운 움직임을 만들어줍니다.',
    stock: 67,
  },
  {
    id: 'p5',
    name: '테일러드 울 코트',
    englishName: 'Tailored Wool Coat',
    price: 128000,
    originalPrice: 158000,
    category: 'outer',
    image: '/products/coat-camel.png',
    colors: ['카멜', '베이지'],
    sizes: ['S', 'M', 'L'],
    badge: 'BEST',
    description: '고급스러운 핏의 울 혼방 테일러드 코트',
    detail:
      '보온성이 우수한 울 혼방 소재로 제작되었으며, 군더더기 없는 라인으로 오래도록 착용 가능합니다.',
    stock: 35,
  },
  {
    id: 'p6',
    name: '코튼 셔츠 블라우스',
    englishName: 'Cotton Shirt Blouse',
    price: 36000,
    category: 'top',
    image: '/products/blouse-white.png',
    colors: ['화이트', '크림'],
    sizes: ['S', 'M', 'L'],
    badge: 'NEW',
    description: '깔끔한 핏의 베이직 코튼 셔츠',
    detail: '탄탄한 코튼 소재로 단독 착용은 물론 레이어드 아이템으로도 활용도가 높습니다.',
    stock: 153,
  },
  {
    id: 'p7',
    name: '와이드 슬랙스 팬츠',
    englishName: 'Wide Slacks Pants',
    price: 48000,
    category: 'bottom',
    image: '/products/pants-ivory.png',
    colors: ['아이보리', '베이지'],
    sizes: ['S', 'M', 'L'],
    description: '다리 라인을 길어 보이게 하는 와이드 슬랙스',
    detail: '구김이 적은 소재로 데일리 출근룩으로 활용하기 좋습니다.',
    stock: 91,
  },
  {
    id: 'p8',
    name: '린넨 서머 원피스',
    englishName: 'Linen Summer Dress',
    price: 54000,
    category: 'dress',
    image: '/products/dress-blue.png',
    colors: ['스카이블루'],
    sizes: ['S', 'M', 'L'],
    badge: 'NEW',
    description: '시원한 린넨 소재의 여름 원피스',
    detail: '통기성이 좋은 린넨 혼방 소재로 무더운 여름에도 쾌적하게 착용 가능합니다.',
    stock: 58,
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function formatPrice(n: number) {
  return n.toLocaleString('ko-KR') + '원';
}

export type OrderStatus = '결제완료' | '배송준비' | '배송중' | '배송완료' | '취소';

export type Order = {
  id: string;
  date: string;
  customer: string;
  phone: string;
  address: string;
  status: OrderStatus;
  items: { name: string; option: string; qty: number; price: number; image: string }[];
  total: number;
  payment: string;
};

export const orders: Order[] = [
  {
    id: '20260617-0012',
    date: '2026-06-17',
    customer: '김서연',
    phone: '010-1234-5678',
    address: '서울특별시 강남구 테헤란로 123, 4층',
    status: '배송중',
    items: [
      {
        name: '코튼 러플 블라우스',
        option: '크림 / M',
        qty: 1,
        price: 39000,
        image: '/products/blouse-cream.png',
      },
      {
        name: '플리츠 미디 스커트',
        option: '베이지 / M',
        qty: 1,
        price: 42000,
        image: '/products/skirt-beige.png',
      },
    ],
    total: 81000,
    payment: '신용카드',
  },
  {
    id: '20260616-0008',
    date: '2026-06-16',
    customer: '이지은',
    phone: '010-2345-6789',
    address: '경기도 성남시 분당구 판교로 256',
    status: '배송완료',
    items: [
      {
        name: '테일러드 울 코트',
        option: '카멜 / L',
        qty: 1,
        price: 128000,
        image: '/products/coat-camel.png',
      },
    ],
    total: 128000,
    payment: '카카오페이',
  },
  {
    id: '20260615-0021',
    date: '2026-06-15',
    customer: '박하늘',
    phone: '010-3456-7890',
    address: '부산광역시 해운대구 해운대로 88',
    status: '배송준비',
    items: [
      {
        name: '소프트 니트 가디건',
        option: '블러쉬핑크 / FREE',
        qty: 2,
        price: 46000,
        image: '/products/knit-pink.png',
      },
    ],
    total: 92000,
    payment: '네이버페이',
  },
  {
    id: '20260615-0019',
    date: '2026-06-15',
    customer: '최유나',
    phone: '010-4567-8901',
    address: '인천광역시 연수구 송도과학로 32',
    status: '결제완료',
    items: [
      {
        name: '플로럴 미디 원피스',
        option: '플로럴 / S',
        qty: 1,
        price: 58000,
        image: '/products/dress-floral.png',
      },
      {
        name: '코튼 셔츠 블라우스',
        option: '화이트 / M',
        qty: 1,
        price: 36000,
        image: '/products/blouse-white.png',
      },
    ],
    total: 94000,
    payment: '신용카드',
  },
  {
    id: '20260614-0005',
    date: '2026-06-14',
    customer: '정민지',
    phone: '010-5678-9012',
    address: '대구광역시 수성구 동대구로 100',
    status: '취소',
    items: [
      {
        name: '와이드 슬랙스 팬츠',
        option: '아이보리 / M',
        qty: 1,
        price: 48000,
        image: '/products/pants-ivory.png',
      },
    ],
    total: 48000,
    payment: '신용카드',
  },
  {
    id: '20260613-0011',
    date: '2026-06-13',
    customer: '한소희',
    phone: '010-6789-0123',
    address: '서울특별시 마포구 양화로 45',
    status: '배송완료',
    items: [
      {
        name: '린넨 서머 원피스',
        option: '스카이블루 / M',
        qty: 1,
        price: 54000,
        image: '/products/dress-blue.png',
      },
    ],
    total: 54000,
    payment: '토스페이',
  },
];

// 내 주문 목록(고객 화면) 용
export const myOrders: Order[] = [
  orders[0],
  orders[1],
  {
    id: '20260601-0044',
    date: '2026-06-01',
    customer: '나',
    phone: '010-0000-0000',
    address: '서울특별시 강남구 테헤란로 123',
    status: '배송완료',
    items: [
      {
        name: '소프트 니트 가디건',
        option: '크림 / FREE',
        qty: 1,
        price: 46000,
        image: '/products/knit-pink.png',
      },
      {
        name: '와이드 슬랙스 팬츠',
        option: '베이지 / M',
        qty: 1,
        price: 48000,
        image: '/products/pants-ivory.png',
      },
    ],
    total: 94000,
    payment: '신용카드',
  },
];
