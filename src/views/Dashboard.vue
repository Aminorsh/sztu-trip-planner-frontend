<!-- src/views/Dashboard.vue -->
<template>
  <div class="dashboard-page">
    <!-- 背景图层 + 遮罩层 -->
    <div
      class="bg-image"
      :style="{ backgroundImage: `url(${heroTravel})` }"
    ></div>
    <div class="bg-overlay"></div>

    <div class="dashboard-inner">
      <!-- 左边栏目 -->
      <aside class="sidebar">
        <div class="sidebar-logo">TravelPlanner</div>
        <nav class="sidebar-menu">
          <el-button type="text" class="menu-btn" @click="goHome">
            <el-icon><House /></el-icon>主页
          </el-button>
          <el-button type="text" class="menu-btn" @click="createNew">
            <el-icon><CirclePlus /></el-icon>新建行程
          </el-button>
        </nav>
        <div class="sidebar-decor">
          <img :src="heroTravel" alt="decor" class="sidebar-img" />
        </div>
      </aside>

      <!-- 中间主内容区 -->
      <main class="main-content">
        <div class="main-header">
          <div class="greeting">Hello, {{ user.name }}</div>
          <el-input
            v-model="searchKey"
            placeholder="搜索我的行程"
            clearable
            class="search-input"
            @clear="onSearch"
            @keyup.enter="onSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="cards-container">
          <div
            v-for="trip in trips"
            :key="trip.id"
            class="trip-card"
          >
            <div class="card-image-wrapper">
              <img
                :src="trip.coverImage || heroTravel"
                alt="cover"
                class="card-image"
              />
              <div class="card-overlay-shape"></div>
            </div>
            <div class="card-info">
              <h3 class="card-title">{{ trip.title }}</h3>
              <p class="card-meta">
                {{ trip.startDate }} — {{ trip.endDate }} · {{ trip.days }} 天
              </p>
              <div class="card-actions">
                <!-- 方案 B：el-icon 包裹 -->
                <el-button size="mini" @click="viewTrip(trip.id)">
                  <el-icon><View /></el-icon>进入
                </el-button>
                <el-button size="mini" @click="editTrip(trip.id)">
                  <el-icon><Edit /></el-icon>编辑
                </el-button>
                <el-button size="mini" type="danger" @click="deleteTrip(trip.id)">
                  <el-icon><Delete /></el-icon>删除
                </el-button>
                <el-button size="mini" @click="shareTrip(trip.id)">
                  <el-icon><Share /></el-icon>分享
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- 右边用户信息 / 装饰栏 -->
      <aside class="rightbar">
        <div class="user-info">
          <img
            :src="user.avatar || heroTravel"
            alt="avatar"
            class="avatar-img-large"
          />
          <div class="user-name">{{ user.name }}</div>
          <div class="user-nick">{{ user.nickname }}</div>
        </div>
        <div class="right-decor">
          <img :src="heroTravel" alt="decor" class="right-img" />
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
// 引入图片 & 图标组件
import heroTravel from '@/assets/images/hero-travel.jpg'
import {
  View, Edit, Delete, Share, House, CirclePlus, Search
} from '@element-plus/icons-vue'

export default {
  name: 'Dashboard',
  components: { View, Edit, Delete, Share, House, CirclePlus, Search },
  data() {
    return {
      heroTravel,
      user: {
        name: '张三',
        nickname: '旅行者',
        avatar: ''
      },
      searchKey: '',
      trips: [
        {
          id: 't1',
          coverImage: '',
          title: '东京＋箱根 5 日游',
          startDate: '2025-06-01',
          endDate: '2025-06-05',
          days: 5
        },
        {
          id: 't2',
          coverImage: '',
          title: '巴黎 7 日文化游',
          startDate: '2025-07-10',
          endDate: '2025-07-16',
          days: 7
        },
        {
          id: 't3',
          coverImage: '',
          title: '东南亚海岛 4 日',
          startDate: '2025-08-01',
          endDate: '2025-08-04',
          days: 4
        },
        {
          id: 't4',
          coverImage: '',
          title: '美国国家公园 10 日探险',
          startDate: '2025-09-01',
          endDate: '2025-09-10',
          days: 10
        },
        {
          id: 't5',
          coverImage: '',
          title: '巴厘岛休闲 6 日',
          startDate: '2025-10-05',
          endDate: '2025-10-10',
          days: 6
        },
        {
          id: 't6',
          coverImage: '',
          title: '意大利南部 8 日游',
          startDate: '2025-11-01',
          endDate: '2025-11-08',
          days: 8
        }
      ]
    }
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'Home' })
    },
    createNew() {
      this.$router.push({ name: 'CreateTrip' })
    },
    viewTrip(id) {
      this.$router.push({ name: 'TripDetail', params: { id } })
    },
    editTrip(id) {
      this.$router.push({ name: 'EditTrip', params: { id } })
    },
    deleteTrip(id) {
      this.trips = this.trips.filter(t => t.id !== id)
    },
    shareTrip(id) {
      this.$router.push({ name: 'ShareTrip', params: { id } })
    },
    onSearch() {
      console.log('搜索关键字:', this.searchKey)
    }
  }
}
</script>

<style scoped>
/* ---------- 基础布局 ---------- */
.dashboard-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  color: #f3f4f6;
  background: #f8f8fb;
}
.bg-image {
  position: absolute;
  inset: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  z-index: 0;
}
.bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}
.dashboard-inner {
  position: relative;
  z-index: 2;
  display: flex;
  height: 100%;
}

/* ---------- 左栏 ---------- */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
}
.sidebar-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8c88ff;
  margin-bottom: 40px;
}
.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}
.menu-btn {
  text-align: left;
  color: #8c88ff;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
}
.sidebar-decor {
  margin-top: auto;
  width: 100%;
}
.sidebar-img {
  width: 100%;
  height: 66vh;
  object-fit: cover;
  border-radius: 12px;
}

/* ---------- 中间内容 ---------- */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
}
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.greeting {
  font-size: 1.8rem;
  font-weight: 600;
  color: #ffffff;
}
.search-input {
  width: 260px;
}
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}
.trip-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;
}
.trip-card:hover {
  transform: translateY(-4px);
}
.card-image-wrapper {
  position: relative;
  height: 140px;
}
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-overlay-shape {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at top left,
    rgba(140, 136, 255, 0.3),
    rgba(236, 111, 111, 0.3)
  );
  mix-blend-mode: multiply;
}
.card-info {
  padding: 16px;
}
.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: #8c88ff;
}
.card-meta {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 12px;
}
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.card-actions .el-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* ---------- 右栏 ---------- */
.rightbar {
  width: 200px;
  flex-shrink: 0;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-info {
  text-align: center;
  margin-bottom: 32px;
}
.avatar-img-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
}
.user-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffffff;
}
.user-nick {
  font-size: 0.9rem;
  color: #dcdcff;
}
.right-img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}
</style>