// src/services/tripService.js
import apiClient from './apiClient';
import { config } from '@/config';

// ==================== Mock 数据 ====================
const mockTrips = [
  {
    id: 'trip-123',
    title: '北京 5 日游',
    status: '进行中',
    days: [
      {
        day: 1,
        items: [
          { id: 'b1-1', name: '天安门广场', time: '08:00', note: '升旗仪式，建议提前 30 min 到', priority: '高' },
          { id: 'b1-2', name: '故宫博物院', time: '09:30', note: '提前网上购票，午门进神武门出', priority: '高' },
          { id: 'b1-3', name: '景山公园', time: '14:00', note: '登顶万春楼俯瞰紫禁城全景', priority: '中' },
          { id: 'b1-4', name: '王府井步行街', time: '17:30', note: '老字号小吃+伴手礼', priority: '低' }
        ]
      },
      {
        day: 2,
        items: [
          { id: 'b2-1', name: '颐和园', time: '09:00', note: '皇家园林，建议从东宫门进入', priority: '高' },
          { id: 'b2-2', name: '圆明园', time: '14:00', note: '历史遗址，建议游览西洋楼景区', priority: '中' }
        ]
      }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    lastSaved: new Date().toISOString()
  }
];


const mockDelay = () => new Promise(resolve => setTimeout(resolve, config.MOCK_DELAY));

// ==================== Mock 实现 ====================

const mockFetchTrips = async () => {
  await mockDelay();
  return { success: true, data: mockTrips, message: '获取行程列表成功' };
};

const mockFetchTripDetail = async (tripId) => {
  await mockDelay();
  const trip = mockTrips.find(t => t.id === tripId);
  if (trip) {
    return { success: true, data: trip, message: '获取行程详情成功' };
  }
  return { success: false, message: '行程不存在', code: 404 };
};

const mockCreateTrip = async (tripData) => {
  await mockDelay();
  const newTrip = {
    id: `trip-${Date.now()}`,
    ...tripData,
    createdAt: new Date().toISOString(),
    lastSaved: new Date().toISOString()
  };
  mockTrips.push(newTrip);
  return { success: true, data: { tripId: newTrip.id }, message: '创建行程成功' };
};

const mockUpdateTrip = async (tripId, tripData) => {
  await mockDelay();
  const index = mockTrips.findIndex(t => t.id === tripId);
  if (index !== -1) {
    mockTrips[index] = { ...mockTrips[index], ...tripData, lastSaved: new Date().toISOString() };
    return { success: true, message: '更新行程成功' };
  }
  return { success: false, message: '行程不存在', code: 404 };
};

const mockDeleteTrip = async (tripId) => {
  await mockDelay();
  const index = mockTrips.findIndex(t => t.id === tripId);
  if (index !== -1) {
    mockTrips.splice(index, 1);
    return { success: true, message: '删除行程成功' };
  }
  return { success: false, message: '行程不存在', code: 404 };
};



export function fetchTrips() {
  if (config.USE_MOCK) {
    console.log('[Mock] fetchTrips');
    return mockFetchTrips();
  }
  return apiClient.get('/trips');
}

export function fetchTripDetail(tripId) {
  if (config.USE_MOCK) {
    console.log('[Mock] fetchTripDetail:', tripId);
    return mockFetchTripDetail(tripId);
  }
  return apiClient.get(`/trips/${tripId}`);
}

export function createTrip(tripData) {
  if (config.USE_MOCK) {
    console.log('[Mock] createTrip:', tripData);
    return mockCreateTrip(tripData);
  }
  return apiClient.post('/trips', tripData);
}

export function updateTrip(tripId, tripData) {
  if (config.USE_MOCK) {
    console.log('[Mock] updateTrip:', tripId, tripData);
    return mockUpdateTrip(tripId, tripData);
  }
  return apiClient.put(`/trips/${tripId}`, tripData);
}

export function deleteTrip(tripId) {
  if (config.USE_MOCK) {
    console.log('[Mock] deleteTrip:', tripId);
    return mockDeleteTrip(tripId);
  }
  return apiClient.delete(`/trips/${tripId}`);
}



export function addTripItem(tripId, day, itemData) {
  if (config.USE_MOCK) {
    console.log('[Mock] addTripItem:', { tripId, day, itemData });
    return mockAddTripItem(tripId, day, itemData);
  }
  return apiClient.post(`/trips/${tripId}/days/${day}/items`, itemData);
}

export function updateTripItem(tripId, itemId, itemData) {
  if (config.USE_MOCK) {
    console.log('[Mock] updateTripItem:', { tripId, itemId, itemData });
    return mockUpdateTripItem(tripId, itemId, itemData);
  }
  return apiClient.put(`/trips/${tripId}/items/${itemId}`, itemData);
}

export function deleteTripItem(tripId, itemId) {
  if (config.USE_MOCK) {
    console.log('[Mock] deleteTripItem:', { tripId, itemId });
    return mockDeleteTripItem(tripId, itemId);
  }
  return apiClient.delete(`/trips/${tripId}/items/${itemId}`);
}

export function addNewDay(tripId) {
  if (config.USE_MOCK) {
    console.log('[Mock] addNewDay:', tripId);
    return mockAddNewDay(tripId);
  }
  return apiClient.post(`/trips/${tripId}/days`);
}

export function deleteDay(tripId, day) {
  if (config.USE_MOCK) {
    console.log('[Mock] deleteDay:', { tripId, day });
    return mockDeleteDay(tripId, day);
  }
  return apiClient.delete(`/trips/${tripId}/days/${day}`);
}

export function optimizeRoute(tripId, day) {
  if (config.USE_MOCK) {
    console.log('[Mock] optimizeRoute:', { tripId, day });
    return mockOptimizeRoute(tripId, day);
  }
  return apiClient.post(`/trips/${tripId}/optimize`, { day });
}

export function getCalendarEvents(tripId, month) {
  if (config.USE_MOCK) {
    console.log('[Mock] getCalendarEvents:', { tripId, month });
    return mockGetCalendarEvents(tripId, month);
  }
  return apiClient.get(`/trips/${tripId}/calendar`, { params: { month } });
}



