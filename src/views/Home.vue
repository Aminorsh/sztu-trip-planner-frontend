<!-- src/views/Home.vue -->
<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <header class="header">
      <div class="container header-inner">
        <div class="logo">TravelPlanner</div>
        <nav class="nav-menu">
          <el-button type="text" class="nav-btn">特色</el-button>
          <el-button type="text" class="nav-btn">范例行程</el-button>
          <el-button type="text" class="nav-btn">关于我们</el-button>
        </nav>
        <div class="auth-buttons">
          <el-button class="btn-small btn-soft" @click="onLogin">登录</el-button>
          <el-button class="btn-small btn-soft" @click="onRegister">注册</el-button>
        </div>
      </div>
    </header>

    <!-- Hero 区：轮播 +叠层 -->
    <section class="hero">
      <div class="hero-carousel">
        <div
          class="hero-slide"
          v-for="(img, idx) in heroImages"
          :key="idx"
          :style="{ backgroundImage: `url(${img})` }"
          :class="{ active: idx === activeSlide }"
        ></div>
      </div>
      <div class="hero-overlay-shape"></div>
      <div class="container hero-inner">
        <div class="hero-text">
          <h1 class="hero-title">创造你的旅程 · 留下真实足迹</h1>
          <p class="hero-subtitle">拖拽景点 · 可视化地图 · 与好友同步规划</p>
          <el-button class="btn-small btn-soft-cta" @click="onGetStarted">马上开始</el-button>
        </div>
      </div>
    </section>

    <!-- 功能 / 亮点展示 -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">主要功能</h2>
        <div class="features-grid">
          <div class="feature" v-for="feature in features" :key="feature.id">
            <div class="feature-icon-wrapper">
              <div class="feature-icon-circle"></div>
              <img class="feature-icon" :src="feature.icon" :alt="feature.title" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 示例行程展示 -->
    <section class="examples">
      <div class="container">
        <h2 class="section-title">热门行程示例</h2>
        <div class="cards-grid">
          <div class="card" v-for="trip in exampleTrips" :key="trip.id" @click="onViewTrip(trip.id)">
            <div class="card-image-wrapper">
              <div class="card-circle-decor"></div>
              <img class="card-image" :src="trip.coverImage" :alt="trip.title" />
            </div>
            <div class="card-body">
              <h4 class="card-title">{{ trip.title }}</h4>
              <p class="card-meta">{{ trip.days }} 天 · {{ trip.stops }} 站</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 用户评价 / 信任标识 -->
    <section class="testimonials">
      <div class="container">
        <h2 class="section-title">用户心声</h2>
        <div class="testimonial-grid">
          <div class="testimonial" v-for="item in testimonials" :key="item.id">
            <div class="testimonial-avatar-wrapper">
              <div class="avatar-circle"></div>
              <img class="testimonial-avatar" :src="item.avatar" :alt="item.name" />
            </div>
            <p class="testimonial-text">“{{ item.text }}”</p>
            <span class="testimonial-name">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 Footer -->
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-links">
          <el-button type="text" class="footer-link">关于</el-button>
          <el-button type="text" class="footer-link">隐私政策</el-button>
          <el-button type="text" class="footer-link">帮助中心</el-button>
          <el-button type="text" class="footer-link">联系我们</el-button>
        </div>
        <div class="footer-social">
          <!-- 官方已有图标 -->
          <el-icon><ChatDotRound /></el-icon>
          <el-icon><PictureRounded /></el-icon>
          <el-icon><Promotion /></el-icon>
        </div>
        <div class="footer-copyright">
          © 2025 TravelPlanner 保留所有权利
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
// 导入 Element Plus 组件 & 图标
import { ElButton, ElIcon } from 'element-plus'
import { ChatDotRound, PictureRounded, Promotion } from '@element-plus/icons-vue'

// 图片资源导入（ESM 风格）
import img1 from '@/assets/images/hero-travel.jpg'
import img2 from '@/assets/images/hero-travel2.jpg'
import img3 from '@/assets/images/hero-travel3.jpg'
import iconDrag from '@/assets/images/icon-drag.png'
import iconMap from '@/assets/images/icon-map.png'
import iconShare from '@/assets/images/icon-share.png'
import avatar1 from '@/assets/images/avatar1.jpg'
import avatar2 from '@/assets/images/avatar2.jpg'
import avatar3 from '@/assets/images/avatar3.jpg'
import trip1img from '@/assets/images/trip1.jpg'
import trip2img from '@/assets/images/trip2.jpg'
import trip3img from '@/assets/images/trip3.jpg'

export default {
  name: 'Home',
  components: {
    ElButton,
    ElIcon
  },
  data() {
    return {
      heroImages: [img1, img2, img3],
      activeSlide: 0,
      features: [
        { id: 1, icon: iconDrag, title: '拖拽规划', description: '将景点拖入日程，自由排序构建专属行程' },
        { id: 2, icon: iconMap, title: '地图可视化', description: '在地图上查看路线、足迹、距离与时间' },
        { id: 3, icon: iconShare, title: '协作分享', description: '邀请朋友一起编辑行程,实时同步更新' },
        { id: 4, icon: iconShare, title: '路线优化', description: 'AI智能规划路线,自动调整景点顺序' }
      ],
      
      exampleTrips: [
        { id: 'trip1', coverImage: trip1img, title: '东京＋箱根 5 日游', days: 5, stops: 8 },
        { id: 'trip2', coverImage: trip2img, title: '欧洲12国经典 20 日', days: 20, stops: 35 },
        { id: 'trip3', coverImage: trip3img, title: '美国国家公园 10 日探险', days: 10, stops: 12 }
      ],
      testimonials: [
        { id: 't1', avatar: avatar1, name: '张女士', text: '用了这个工具后，我轻松规划了环岛旅行，太方便了！' },
        { id: 't2', avatar: avatar2, name: '李先生', text: '和朋友一起编辑行程，看到实时轨迹非常兴奋。' },
        { id: 't3', avatar: avatar3, name: '王小姐', text: '分享功能太棒了，家人也能看到我的旅程动态。' }
      ]
    }
  },
  mounted() {
    this.startCarousel()
  },
  methods: {
    startCarousel() {
      setInterval(() => {
        this.activeSlide = (this.activeSlide + 1) % this.heroImages.length
      }, 4000)
    },
    onLogin() {
      this.$router.push({ name: 'Login' })
    },
    onRegister() {
      this.$router.push({ name: 'Register' })
    },
    onGetStarted() {
      this.$router.push({ name: 'Dashboard' })
    },
    onViewTrip(tripId) {
      this.$router.push({ name: 'ShareTrip', params: { shareId: tripId } })
    }
  }
}
</script>

<style scoped>
/* 字体 &背景基调设定 */
.home-page {
  font-family: 'Poppins', 'Nunito Sans', sans-serif;
  color: #eaeaf2;
  background-color: #f8f8fb;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 导航栏 */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.logo {
  font-size: 1.6rem;
  font-weight: 700;
  color: #8c88ff;
}
.nav-menu {
  display: flex;
  gap: 20px;
}
.nav-btn {
  color: #8c88ff;
  padding: 6px 12px;
  border-radius: 16px;
  transition: background-color 0.2s ease;
}
.nav-btn:hover {
  background-color: #f4f4ff;
}
.auth-buttons .btn-small {
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 0.9rem;
}

/* 按钮样式 */
.btn {
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}
.btn:active {
  transform: scale(0.97);
}
.btn-small.btn-soft {
  background-color: #ffffff;
  color: #8c88ff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.btn-small.btn-soft:hover {
  background-color: #f7f7ff;
}
.btn-small.btn-soft-cta {
  background-color: #f4f4ff;
  color: #8c88ff;
  border: none;
  border-radius: 20px;
  padding: 10px 22px;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.btn-small.btn-soft-cta:hover {
  background-color: #ececff;
}

/* Hero 区 */
.hero {
  position: relative;
  height: 80vh;
  min-height: 520px;
  overflow: hidden;
}
.hero-carousel {
  position: absolute;
  inset: 0;
}
.hero-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}
.hero-slide.active {
  opacity: 1;
}
.hero-overlay-shape {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(140, 136, 255, 0.3), rgba(236, 111, 111, 0.3));
  mix-blend-mode: multiply;
}
.hero-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  height: 100%;
}
.hero-text {
  color: white;
  max-width: 600px;
}
.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 12px;
}
.hero-subtitle {
  font-size: 1.125rem;
  margin-bottom: 28px;
  opacity: 0.9;
}

/* 功能区 */
.features {
  padding: 80px 0;
  background-color: #ffffff;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;
}
.feature {
  text-align: center;
  padding: 34px 24px;
  background: #f8f8fb;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease;
}
.feature:hover {
  transform: translateY(-6px);
}
.feature-icon-wrapper {
  position: relative;
  margin: 0 auto 16px;
  width: 80px;
  height: 80px;
}
.feature-icon-circle {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle at center, #8c88ff, #ff6f6f);
  border-radius: 50%;
  opacity: 0.2;
}
.feature-icon {
  position: relative;
  width: 48px;
  height: 48px;
  margin: 0 auto;
}
.feature-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #8c88ff;
}
.feature-desc {
  font-size: 1rem;
  color: #777;
  line-height: 1.5;
}

/* 示例行程区 */
.examples {
  padding: 80px 0;
  background-color: #ffffff;
}
.section-title {
  text-align: center;
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 40px;
  color: #8c88ff;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 36px;
}
.card {
  cursor: pointer;
  background-color: #f8f8fb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}
.card:hover {
  transform: translateY(-8px);
}
.card-image-wrapper {
  position: relative;
}
.card-circle-decor {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle at center, #ff6f6f, #8c88ff);
  border-radius: 50%;
  opacity: 0.3;
}
.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.card-body {
  padding: 22px;
}
.card-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.card-meta {
  font-size: 0.9rem;
  color: #777;
}

/* 用户评价区 */
.testimonials {
  padding: 80px 0;
  background-color: #ffffff;
}
.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}
.testimonial {
  background-color: #f8f8fb;
  padding: 30px 22px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
}
.testimonial-avatar-wrapper {
  position: relative;
  width: 56px;
  height: 56px;
  margin: 0 auto 18px;
}
.avatar-circle {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  background: radial-gradient(circle at center, #ff6f6f, #8c88ff);
  border-radius: 50%;
  opacity: 0.15;
}
.testimonial-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.testimonial-text {
  font-size: 1rem;
  color: #777;
  margin-bottom: 16px;
}
.testimonial-name {
  font-size: 0.9rem;
  color: #8c88ff;
  display: block;
  text-align: center;
}

/* 页脚 */
.footer {
  padding: 48px 0;
  background-color: #f8f8fb;
  border-top: 1px solid #eee;
}
.footer-inner {
  text-align: center;
}
.footer-links {
  margin-bottom: 24px;
}
.footer-link {
  margin: 0 16px;
  color: #888;
  text-decoration: none;
  font-size: 0.9rem;
}
.footer-link:hover {
  color: #8c88ff;
}
.footer-social {
  margin-bottom: 28px;
}
.social-icon {
  margin: 0 12px;
  color: #888;
  font-size: 1.1rem;
}
.social-icon:hover {
  color: #8c88ff;
}
.footer-copyright {
  font-size: 0.85rem;
  color: #999;
}
</style>