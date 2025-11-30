<template>
  <div class="share-trip-page">
    <!-- 顶部返回栏 -->
    <header class="header">
      <div class="container header-inner">
        <el-button type="text" @click="$router.back()">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="logo">TravelPlanner</div>
      </div>
    </header>

    <!-- 主内容 -->
    <main v-if="trip" class="main">
      <div class="container">
        <!-- 头部信息 -->
        <div class="hero-card">
          <h1 class="trip-title">{{ trip.title }}</h1>
          <p class="trip-meta">{{ trip.days }} 天 · {{ trip.stops }} 站</p>
        </div>

        <!-- 每日行程 -->
        <div class="day-list">
          <div class="day-card" v-for="(day, idx) in trip.dayList" :key="idx">
            <div class="day-header">
              <span class="day-label">第 {{ idx + 1 }} 天</span>
              <span class="day-date">{{ day.date }}</span>
            </div>
            <ul class="spot-list">
              <li v-for="spot in day.spots" :key="spot.name" class="spot-item">
                <el-icon><Location /></el-icon>
                <span>{{ spot.name }}</span>
                <small>{{ spot.time }}</small>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <!-- 404 -->
    <div v-else class="not-found">
      <el-empty description="行程不存在或已下架" />
      <el-button type="primary" @click="$router.push('/')">回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Location } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 假数据池
const tripMap = {
  trip1: {
    title: '东京＋箱根 5 日游',
    days: 5,
    stops: 8,
    dayList: [
      {
        date: '2025-06-01',
        spots: [
          { name: '浅草寺', time: '09:00-11:00' },
          { name: '东京晴空塔', time: '12:00-15:00' }
        ]
      },
      {
        date: '2025-06-02',
        spots: [
          { name: '富士山五合目', time: '08:00-12:00' },
          { name: '忍野八海', time: '13:00-15:00' }
        ]
      }
      // ……可继续补充
    ]
  },
  trip2: {
    title: '欧洲12国经典 20 日',
    days: 20,
    stops: 35,
    dayList: [
      { date: '2025-07-01', spots: [{ name: '巴黎埃菲尔铁塔', time: '全天' }] },
      { date: '2025-07-02', spots: [{ name: '卢浮宫', time: '全天' }] }
    ]
  },
  trip3: {
    title: '美国国家公园 10 日探险',
    days: 10,
    stops: 12,
    dayList: [
      { date: '2025-08-01', spots: [{ name: '黄石公园', time: '全天' }] },
      { date: '2025-08-02', spots: [{ name: '大提顿国家公园', time: '全天' }] }
    ]
  }
}

const trip = ref(null)

onMounted(() => {
  const id = route.params.shareId
  trip.value = tripMap[id] || null
})
</script>

<style scoped>
.share-trip-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ff 100%);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #eee;
}
.header-inner {
  display: flex;
  align-items: center;
  height: 60px;
  gap: 12px;
}
.logo {
  margin-left: auto;
  font-size: 1.4rem;
  font-weight: 700;
  color: #8c88ff;
}

.main {
  padding: 40px 0 80px;
}

.hero-card {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  text-align: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}
.trip-title {
  font-size: 2rem;
  color: #333;
  margin: 0 0 8px;
}
.trip-meta {
  font-size: 1rem;
  color: #666;
}

.day-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.day-card {
  background: rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.day-label {
  font-weight: 600;
  color: #8c88ff;
}
.day-date {
  font-size: 0.9rem;
  color: #999;
}
.spot-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.spot-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 1rem;
  color: #444;
}
.spot-item small {
  margin-left: auto;
  color: #999;
}

.not-found {
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
</style>