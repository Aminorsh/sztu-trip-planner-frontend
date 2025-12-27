<!-- src/views/PlaceDetail.vue -->
<template>
  <div class="place-detail-page">
    <!-- 顶部导航栏 -->
    <header class="top-nav">
      <div class="logo">TravelPlanner</div>
      <div class="nav-buttons">
        <el-button class="btn-nav mantou" @click="goBack">返回</el-button>
        <el-button class="btn-nav btn-add mantou" type="primary" @click="onAddToItinerary">
          + 加入行程
        </el-button>
      </div>
    </header>

    <div class="main-content">
      <div class="carousel-wrapper">
        <el-carousel v-if="coverImages.length" height="420px" :interval="4000" arrow="always">
          <el-carousel-item v-for="(img, idx) in coverImages" :key="idx">
            <img class="carousel-img" :src="img" alt="place" />
          </el-carousel-item>
        </el-carousel>
        <div v-else class="carousel-empty">暂无图片</div>
      </div>

      <div class="detail-wrapper">
        <div class="detail-header">
          <div class="detail-title">{{ place.name }}</div>
          <div class="detail-sub">
            <span class="detail-item">地址：{{ place.address }}</span>
            <span class="detail-item">类别：{{ place.category }}</span>
            <span class="detail-item">评分：{{ displayRating }}</span>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title">简介</div>
          <div v-if="place.description" class="section-content">
            {{ place.description }}
          </div>
          <div v-else class="section-actions">
            <el-button class="mantou" type="primary" :loading="aiLoading" @click="generateAiDescription">
              {{ aiLoading ? '生成中...' : 'AI生成简介' }}
            </el-button>
            <div v-if="errorMessage" class="error-text">{{ errorMessage }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 下方：地图 & 亮点 & 加入按钮 -->
    <!-- <div class="extra-section"> -->
      <!-- <div class="map-mini"> -->
        <!-- <img :src="mapPlaceholder" alt="地图预览" /> -->
      <!-- </div> -->
      <!-- <div class="highlights"> -->
        <!-- <h3>亮点</h3> -->
        <!-- <ul> -->
          <!-- <li v-for="(hl, i) in place.highlights" :key="i">{{ hl }}</li> -->
        <!-- </ul> -->
      <!-- </div> -->
    <!-- </div> -->
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import * as placeService from '@/services/placeService'

export default defineComponent({
  name: 'PlaceDetail',
  props: {
    placeId: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      coverImages: [],
      loading: false,
      error: null,
      aiLoading: false,
      place: {
        id: 'p1',
        name: '浅草寺',
        address: '东京都台东区浅草2-3-1',
        category: '景点',
        rating: 4.5,
        description: '东京最古老、最著名的寺庙之一，历史悠久，文化底蕴深厚。'
      }
    }
  },
  computed: {
    errorMessage() {
      return this.error ? (this.error.message || String(this.error)) : ''
    },
    displayRating() {
      const r = this.place?.rating
      if (!r || Number(r) === 0) return '暂无评分'
      return r
    }
  },
  methods: {
    async fetchPlaceDetail() {
      const pid = this.placeId || this.$route.params.placeId
      if (!pid) return

      this.loading = true
      this.error = null
      try {
        const resp = await placeService.getPlaceDetail(pid)
        const body = resp?.data || resp
        const payload = body?.data || body
        this.place = {
          id: payload.id,
          name: payload.name,
          address: payload.address,
          category: payload.type || payload.category,
          rating: payload.rating,
          description: payload.description
        }

        if (Array.isArray(payload.photos) && payload.photos.length > 0) {
          this.coverImages = payload.photos
        } else if (payload.image) {
          this.coverImages = [payload.image]
        } else {
          this.coverImages = []
        }
      } catch (e) {
        this.error = e
      } finally {
        this.loading = false
      }
    },
    async generateAiDescription() {
      const pid = this.placeId || this.$route.params.placeId
      if (!pid) return

      this.aiLoading = true
      this.error = null
      try {
        const resp = await placeService.getPlaceAiDescription(pid)
        const body = resp?.data || resp
        const payload = body?.data || body
        const desc = payload?.description
        if (desc) {
          this.place.description = desc
        }
      } catch (e) {
        this.error = e
      } finally {
        this.aiLoading = false
      }
    },
    goBack() {
      this.$router.back()
    },
    onAddToItinerary() {
      // 触发加入行程逻辑，可 emit 或 跳转
      this.$emit('add-place', this.place)
      // 如果要自动返回行程详情页面：
      const tripId = this.$route.params.tripId
      if (tripId) {
        this.$router.push({ name: 'TripDetail', params: { tripId } })
      }
    }
  }
  ,
  mounted() {
    this.fetchPlaceDetail()
  }
})
</script>

<style scoped>
.place-detail-page {
  font-family: 'Mantou';
  background-color: #fdfdfd;
  color: #333;
  padding: 12px 16px;
  font-size: 2.5rem;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-weight: 400;
  font-size: 2.5rem;
  font-weight: bold;
  color: #8c88ff;
}
.nav-buttons .btn-nav {
  margin-left: 12px;
  border-radius: 20px;
}
.btn-add {
  background-color: #8c88ff;
  color: #fff;
}

/* 主体布局 */
.main-content {
  margin-top: 16px;
}

.carousel-wrapper {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0,0,0,0.06);
}

.carousel-img {
  width: 100%;
  height: 420px;
  object-fit: cover;
}

.carousel-empty {
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f7fb;
  color: #999;
  font-size: 1.2rem;
}

.detail-wrapper {
  margin-top: 16px;
  background: linear-gradient(to bottom, #e4e8f4 0%,#a0e6ff59 55%, #ffffff 100%);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.06);
}

.detail-title {
  font-size: 1.8rem;
  color: #131068;
  font-weight: 600;
}

.detail-sub {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 1.1rem;
  color: #444;
}

.detail-item {
  padding: 6px 10px;
  background: rgba(255,255,255,0.65);
  border-radius: 10px;
}

.detail-section {
  margin-top: 16px;
}

.section-title {
  font-size: 1.3rem;
  color: #131068;
  font-weight: 600;
}

.section-content {
  margin-top: 10px;
  font-size: 1.1rem;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
}

.section-actions {
  margin-top: 12px;
}

.error-text {
  margin-top: 10px;
  color: #d33;
  font-size: 1rem;
  line-height: 1.4;
}

@font-face {
  font-family: 'Mantou';
  src: url('/src/assets/font/love.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-weight: 400;
}

/* — 响应式媒体查询 — */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }
  .image-column {
    align-items: center;
  }
  .image-rect img {
    height: 200px;
  }
}

@media (max-width: 600px) {
  .top-nav {
    flex-direction: column;
    gap: 12px;
  }
  .nav-buttons {
    display: flex;
    gap: 8px;
  }
  .image-circle img {
    width: 150px;
    height: 150px;
  }
  .image-rect img {
    height: 160px;
  }
  .extra-section {
    flex-direction: column;
  }
  .map-mini img {
    width: 100%;
  }
}

.mantou {
  font-family: 'Mantou', sans-serif;
  letter-spacing: 0.02em;
  font-size: 1.1rem;
  font-weight: 400;
}

</style>
