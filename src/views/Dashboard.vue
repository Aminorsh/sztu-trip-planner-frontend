<!-- src/views/Dashboard.vue -->
<template>
  <div class="dashboard-page">
    <!-- 新建行程弹窗 -->
    <el-dialog v-model="createVisible" title="新建行程" width="400px" @close="resetNewForm">
      <el-form :model="newTripForm" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="newTripForm.title" placeholder="例如：东京 5 日游"/>
        </el-form-item>
        <el-form-item label="开始日期" required>
          <el-date-picker
            v-model="newTripForm.startDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="calcDays"
          />
        </el-form-item>
        <el-form-item label="结束日期" required>
          <el-date-picker
            v-model="newTripForm.endDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="calcDays"
          />
        </el-form-item>
        <el-form-item label="天数">
          <el-input-number
            v-model="newTripForm.days"
            :min="1"
            :max="99"
            :step="1"
            controls-position="right"
            disabled
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetNewForm">取消</el-button>
        <el-button type="primary" @click="onCreate">创建</el-button>
      </template>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="editVisible"
      title="编辑行程"
      width="420px"
      @close="resetEdit"
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="editForm.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="开始日期">
        <el-date-picker
          v-model="editForm.startDate"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="calcDays"
        />
      </el-form-item>

      <el-form-item label="结束日期">
        <el-date-picker
          v-model="editForm.endDate"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="calcDays"
        />
      </el-form-item>

      <el-form-item label="天数">
        <el-input-number
          v-model="editForm.days"
          :min="1"
         :max="99"
         :step="1"
         controls-position="right"
         disabled
       />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="resetEdit">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
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
        <!-- <div class="sidebar-decor"> -->
          <!-- <img :src="img9" alt="decor" class="sidebar-img" /> -->
        <!-- </div> -->
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
                <!-- <el-button size="mini" @click="shareTrip(trip.id)"> -->
                  <!-- <el-icon><Share /></el-icon>邀请 -->
                <!-- </el-button> -->
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
        <!-- <div class="right-decor"> -->
          <!-- <img :src="img7" alt="decor" class="right-img" /> -->
        <!-- </div> -->
      </aside>
    </div>
  </div>
</template>

<script>
// 引入图片 & 图标组件
import heroTravel from '@/assets/images/16.jpg'
import img1 from '@/assets/images/15.jpg'
import img2 from '@/assets/images/14.jpg'
import img3 from '@/assets/images/13.jpg'
import img4 from '@/assets/images/12.jpg'
import img5 from '@/assets/images/11.jpg'
import img6 from '@/assets/images/10.jpg'
import img7 from '@/assets/images/7.jpg'
import img8 from '@/assets/images/8.jpg'
import img9 from '@/assets/images/9.jpg'

import {
  View, Edit, Delete, Share, House, CirclePlus, Search
} from '@element-plus/icons-vue'

export default {
  name: 'Dashboard',
  components: { View, Edit, Delete, Share, House, CirclePlus, Search },
  
  data() {
    return {
      heroTravel,
      img1,img2,img3,img4,img5,img6,img7,img8,img9,
      editVisible: false,  
      newTripForm: {      // 新建表单
      title: '',
      startDate: '',
      endDate: '',
      days: 1
      },
      createVisible: false,        // 弹窗开关
      editForm: {                  // 临时表单
      id: '',
      title: '',
      startDate: '',
      endDate: '',
      days: 0
    },
      user: {
        name: '张三',
        nickname: '旅行者',
        avatar: ''
      },
      searchKey: '',
      trips: [
        {
          id: 't1',
          coverImage: img1,
          title: '东京＋箱根 5 日游',
          startDate: '2025-06-01',
          endDate: '2025-06-05',
          days: 5
        },
        {
          id: 't2',
          coverImage: img2,
          title: '巴黎 7 日文化游',
          startDate: '2025-07-10',
          endDate: '2025-07-16',
          days: 7
        },
        {
          id: 't3',
          coverImage: img3,
          title: '东南亚海岛 4 日',
          startDate: '2025-08-01',
          endDate: '2025-08-04',
          days: 4
        },
        {
          id: 't4',
          coverImage: img4,
          title: '美国国家公园 10 日探险',
          startDate: '2025-09-01',
          endDate: '2025-09-10',
          days: 10
        },
        {
          id: 't5',
          coverImage: img5,
          title: '巴厘岛休闲 6 日',
          startDate: '2025-10-05',
          endDate: '2025-10-10',
          days: 6
        },
        {
          id: 't6',
          coverImage: img6,
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
    viewTrip(tripId) {
      this.$router.push({ name: 'TripDetail', params: { tripId } })
    },
    editTrip(id) {
      this.$router.push({ name: 'EditTrip', params: { id } })
    },
    deleteTrip(id) {
      this.trips = this.trips.filter(t => t.id !== id)
    },
    // shareTrip(id) {
    //   this.$router.push({ name: 'ShareTrip', params: { id } })
    // },
    onSearch() {
      console.log('搜索关键字:', this.searchKey)
    },
    editTrip(id) {
      const t = this.trips.find(v => v.id === id)
      if (!t) return
      this.editForm = { ...t }   // 深拷贝一份
     this.editVisible = true
    },

    calcDays() {
      if (!this.editForm.startDate || !this.editForm.endDate) return
      const start = new Date(this.editForm.startDate)
      const end   = new Date(this.editForm.endDate)
      const days  = Math.ceil((end - start) / 86400000) + 1
      this.editForm.days = days > 0 ? days : 1
    },

    saveEdit() {
      const idx = this.trips.findIndex(v => v.id === this.editForm.id)
      if (idx > -1) {
        // 回写数据
        this.trips.splice(idx, 1, { ...this.editForm })
        this.$message.success('已保存')
      }
      this.resetEdit()
    },

    resetEdit() {
      this.editVisible = false
      this.editForm = { id: '', title: '', startDate: '', endDate: '', days: 0 }
    },
    createNew() {
  this.createVisible = true   // 打开弹窗
},
    calcDays() {
      if (!this.newTripForm.startDate || !this.newTripForm.endDate) return
      const start = new Date(this.newTripForm.startDate)
      const end   = new Date(this.newTripForm.endDate)
      const days  = Math.ceil((end - start) / 86400000) + 1
      this.newTripForm.days = days > 0 ? days : 1
    },
    onCreate() {
      if (!this.newTripForm.title || !this.newTripForm.startDate || !this.newTripForm.endDate) {
        this.$message.warning('请填写完整')
        return
      }
      // 随机封面图（6 张里轮播）
      const covers = [this.img1, this.img2, this.img3, this.img4, this.img5, this.img6]
      const newTrip = {
        id: 't' + Date.now(),                                      // 随机 id
        coverImage: covers[Math.floor(Math.random() * covers.length)],
        title: this.newTripForm.title,
        startDate: this.newTripForm.startDate,
        endDate: this.newTripForm.endDate,
        days: this.newTripForm.days
      }
      // 追加到列表最前面
      this.trips.unshift(newTrip)
      this.$message.success('创建成功')
      this.resetNewForm()
      // 立即进入详情页（或改为 EditTrip）
      this.$router.push({ name: 'TripDetail', params: { id: newTrip.id } })
    },
    resetNewForm() {
      this.createVisible = false
      this.newTripForm = { title: '', startDate: '', endDate: '', days: 1 }
    }
  }
}
</script>

<style scoped>
/* ---------- 基础布局 ---------- */

@font-face {
  font-family: 'Mantou';
  src: url('/src/assets/font/love.ttf') format('truetype');

  font-style: normal;
  font-weight: 400;
}

@font-face {
  font-family: 'Hou';
  src: url('/src/assets/font/1.ttf') format('truetype');

  font-style: normal;
  font-weight: 400;
}


.mantou {
  font-family: 'Mantou', sans-serif;
  letter-spacing: 0.02em;
  font-size: 1.1rem;
  font-weight: 400;
}

.Hou {
  font-family: 'Hou', sans-serif;
  letter-spacing: 0.05em;
  font-size: 1.1rem;
  font-weight: 10;
}
.dashboard-page {
  font-family: 'Mantou';
  position: relative;
  width: 100%;
  min-height: 100vh;
  color: #f3f4f6;
  background:rgba(92, 76, 76, 0.045);
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
  color: #fcfcfc;
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
  color: #f4f4f7;
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
  color: #343097;
}
.card-meta {
  font-size: 0.9rem;
  color: #161c5e;
  margin-bottom: 12px;
}
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.card-actions .el-button {
  font-family: Hou;
  color:#373f89;
  display: inline-flex;
  align-items: center;
  border-color: #f3f4f6;
  gap: 4px;
}




.el-button--danger { 
  background: #ffffff;
  border-color: #f3f4f6;
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
  color: #333399;
}
.right-img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}
</style>