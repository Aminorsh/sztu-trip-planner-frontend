// src/services/placeService.js
import apiClient from './apiClient';
import { config } from '@/config';

// ==================== Mock 数据 ====================
const mockPlaces = [
  {
    id: 'p1',
    name: '浅草寺',
    address: '东京都台东区浅草2-3-1',
    description: '东京最古老、最著名的寺庙之一。',
    image: require('@/assets/images/hero-travel.jpg'),
    rating: 4.5,
    distance: 1.2,
    openingHours: '06:00-18:00',
    type: 'scenic',
    added: false,
    expanded: false,
    coordinates: [139.7947, 35.7148]
  },
  {
    id: 'p2',
    name: '秋叶原电器街',
    address: '东京千代田区外神田',
    description: '电子、动漫文化圣地。',
    image: require('@/assets/images/hero-travel.jpg'),
    rating: 4.2,
    distance: 2.5,
    openingHours: '10:00-21:00',
    type: 'scenic',
    added: false,
    expanded: false,
    coordinates: [139.7740, 35.7020]
  },
  {
    id: 'p3',
    name: '银座购物区',
    address: '东京中央区银座',
    description: '高端品牌林立的商业街区。',
    image: require('@/assets/images/hero-travel.jpg'),
    rating: 4.7,
    distance: 3.8,
    openingHours: '11:00-20:00',
    type: 'restaurant',
    added: false,
    expanded: false,
    coordinates: [139.7676, 35.6715]
  },
  {
    id: 'p4',
    name: '台场海滨公园',
    address: '东京港区台场1-4-1',
    description: '海滨散步 + 娱乐综合体。',
    image: require('@/assets/images/hero-travel.jpg'),
    rating: 4.4,
    distance: 4.1,
    openingHours: '09:00-22:00',
    type: 'scenic',
    added: false,
    expanded: false,
    coordinates: [139.7775, 35.6255]
  },
  {
    id: 'p5',
    name: '明治神宫',
    address: '东京涩谷区代代木神园町1-1',
    description: '穿越森林的神社之一，环境宁静。',
    image: require('@/assets/images/hero-travel.jpg'),
    rating: 4.8,
    distance: 2.2,
    openingHours: '05:00-17:00',
    type: 'scenic',
    added: false,
    expanded: false,
    coordinates: [139.6995, 35.6764]
  },
  {
    id: 'p6',
    name: '筑地市场',
    address: '东京中央区筑地5-2-1',
    description: '鲜活海鲜与寿司的天堂。',
    image: require('@/assets/images/hero-travel.jpg'),
    rating: 4.3,
    distance: 5.0,
    openingHours: '05:00-14:00',
    type: 'restaurant',
    added: false,
    expanded: false,
    coordinates: [139.7719, 35.6654]
  }
];

const mockDelay = () => new Promise(resolve => setTimeout(resolve, config.MOCK_DELAY));

// ==================== Mock 实现 ====================

const mockSearchPlaces = async (params) => {
  await mockDelay();
  let results = [...mockPlaces];
  

  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    results = results.filter(place => 
      place.name.toLowerCase().includes(keyword) || 
      place.description.toLowerCase().includes(keyword) ||
      place.address.toLowerCase().includes(keyword)
    );
  }
  

  if (params.filterType) {
    results = results.filter(place => place.type === params.filterType);
  }
  
  if (params.sortOrder) {
    switch (params.sortOrder) {
      case 'distance':
        results.sort((a, b) => a.distance - b.distance);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        // 模拟按热度排序（用rating作为热度）
        results.sort((a, b) => b.rating - a.rating);
        break;
    }
  }
  
  return { 
    success: true, 
    data: results,
    total: results.length,
    message: '搜索成功'
  };
};

const mockGetPlaceDetail = async (placeId) => {
  await mockDelay();
  const place = mockPlaces.find(p => p.id === placeId);
  if (place) {
    return { success: true, data: place, message: '获取地点详情成功' };
  }
  return { success: false, message: '地点不存在', code: 404 };
};

const mockAddPlaceToTrip = async (tripId, placeData) => {
  await mockDelay();
  // 这里简单模拟添加地点到行程
  console.log('模拟添加地点到行程:', { tripId, placeData });
  return { 
    success: true, 
    data: { 
      tripItemId: `item-${Date.now()}`,
      ...placeData 
    }, 
    message: '地点已添加到行程' 
  };
};



export function searchPlaces(params) {
  if (config.USE_MOCK) {
    console.log('[Mock] searchPlaces:', params);
    return mockSearchPlaces(params);
  }
  return apiClient.get('/places/search', { params });
}

export function getPlaceDetail(placeId) {
  if (config.USE_MOCK) {
    console.log('[Mock] getPlaceDetail:', placeId);
    return mockGetPlaceDetail(placeId);
  }
  return apiClient.get(`/places/${placeId}`);
}

export function addPlaceToTrip(tripId, placeData) {
  if (config.USE_MOCK) {
    console.log('[Mock] addPlaceToTrip:', { tripId, placeData });
    return mockAddPlaceToTrip(tripId, placeData);
  }
  return apiClient.post(`/trips/${tripId}/places`, placeData);
}



export function togglePlaceExpanded(placeId, expanded) {
  if (config.USE_MOCK) {
    console.log('[Mock] togglePlaceExpanded:', { placeId, expanded });
    return mockTogglePlaceExpanded(placeId, expanded);
  }
  return apiClient.put(`/places/${placeId}/expanded`, { expanded });
}

export function markPlaceAdded(placeId, added) {
  if (config.USE_MOCK) {
    console.log('[Mock] markPlaceAdded:', { placeId, added });
    return mockMarkPlaceAdded(placeId, added);
  }
  return apiClient.put(`/places/${placeId}/added`, { added });
}


const mockTogglePlaceExpanded = async (placeId, expanded) => {
  await mockDelay();
  const place = mockPlaces.find(p => p.id === placeId);
  if (place) {
    place.expanded = expanded;
    return { success: true, message: '更新成功' };
  }
  return { success: false, message: '地点不存在', code: 404 };
};

const mockMarkPlaceAdded = async (placeId, added) => {
  await mockDelay();
  const place = mockPlaces.find(p => p.id === placeId);
  if (place) {
    place.added = added;
    return { success: true, message: '更新成功' };
  }
  return { success: false, message: '地点不存在', code: 404 };
};