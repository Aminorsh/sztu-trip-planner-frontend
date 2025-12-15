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

    <div class="content-wrapper">
      <!-- 左列：两张图片（圆 + 矩形） -->
      <div class="image-column">
        <!-- <div class="image-circle"> -->
          <!-- <img :src="coverImages[0]" alt="图片圆形" /> -->
        <!-- </div> -->
        <!-- <div class="image-rect"> -->
          <!-- <img :src="coverImages[1]" alt="图片矩形" /> -->
        <!-- </div> -->
        <div class="image-grid">
          <div class="img-item hero-img" :style="{ gridColumn: '1 / 3' }">
            <img :src="coverImages[0]" alt="hero" />
            <!-- <div class="img-text mantou">找一家有故事的民宿，度过一个悠闲的假期。感受这里的慢时光，让生活回归简单与纯粹。</div> -->
          </div>
          <div class="img-item" v-for="i in 6" :key="i">
              <img :src="coverImages[i]" alt="place-img" />
              
          </div>
        </div>
      </div>

      <!-- 右列：表单信息（左一右二布局） -->
      <div class="form-column">
        <el-form :model="place" label-position="top" class="info-form" size="small">
          <!-- 名称：全宽 -->
          <div class="form-row full-width">
            <el-form-item label="名称">
              <el-input v-model="place.name" disabled />
            </el-form-item>
          </div>
          <!-- 地址 / 类别 -->
          <div class="form-row two-cols mantou">
            <div class="col">
              <el-form-item label="地址">
                <el-input v-model="place.address" disabled />
              </el-form-item>
            </div>
            <div class="col">
              <el-form-item label="类别">
                <el-input v-model="place.category" disabled />
              </el-form-item>
            </div>
          </div>
          <!-- 评分 / 开放时间 -->
          <div class="form-row two-cols">
            <div class="col">
              <el-form-item label="评分">
                <el-input v-model="place.rating" disabled />
              </el-form-item>
            </div>
            <div class="col">
              <el-form-item label="开放时间">
                <el-input v-model="place.openingHours" disabled />
              </el-form-item>
            </div>
          </div>
          <!-- 简介 -->
          <div class="form-row full-width">
            <el-form-item label="简介">
              <el-input
                type="textarea"
                v-model="place.description"
                disabled
                :rows="4"
              />
            </el-form-item>
          </div>
          <!-- 票价 / 须知 -->
          <div class="form-row two-cols">
            <div class="col">
              <el-form-item label="票价">
                <el-input v-model="place.ticketPrice" disabled />
              </el-form-item>
            </div>
            <div class="col">
              <el-form-item label="须知">
                <el-input v-model="place.notes" disabled />
              </el-form-item>
            </div>
          </div>
        </el-form>
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
import heroTravel from '@/assets/images/14.jpg'
import heroTravel2 from '@/assets/images/hero-travel2.jpg'
import mapPlaceholder from '@/assets/images/hero-travel3.jpg'
import trip1img from '/src/assets/images/5.jpg'
import trip2img from '/src/assets/images/6.jpg'
import img1 from '@/assets/images/11.jpg'
import img2 from '@/assets/images/12.jpg'
import img3 from '@/assets/images/13.jpg'
import img4 from '@/assets/images/15.jpg'
import trip3img from '/src/assets/images/7.jpg'
import avatar3 from '/src/assets/images/10.jpg'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PlaceDetail',
  data() {
    return {
      coverImages: [img4,img1,img2,img3,trip2img,trip3img,avatar3],
      mapPlaceholder,
      place: {
        id: 'p1',
        name: '浅草寺',
        address: '东京都台东区浅草2-3-1',
        category: '景点',
        rating: 4.5,
        description: '东京最古老、最著名的寺庙之一，历史悠久，文化底蕴深厚。',
        highlights: ['雷门大灯笼', '五重塔', '仲见世购物街'],
        openingHours: '06:00-18:00',
        ticketPrice: '免费入场（部分展馆除外）',
        notes: '请遵守寺庙礼仪，注意语音干扰。'
      }
    }
  },
  methods: {
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
.content-wrapper {
  display: flex;
  gap: 24px;
  margin-top: 24px;
}

/* 图片列 */
.image-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.image-circle img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.image-rect img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

/* 表单列 */
.form-column {
  flex: 2;
}
.info-form {
  background: linear-gradient(to bottom, #e4e8f4 0%,#a0e6ff59 55%, #ffffff 100%);
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.06);
}
.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
.full-width {
  width: 100%;
}
.two-cols .col {
  flex: 1;
}

/* 下方 extra 部分 */
.extra-section {
  display: flex;
  gap: 24px;
  margin-top: 32px;
}
.map-mini img {
  width: 40%;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
}
.highlights {
  flex: 1;
}
.highlights h3 {
  color: #8c88ff;
  margin-bottom: 12px;
}
.highlights ul {
  list-style: disc;
  padding-left: 20px;
}
.highlights li {
  margin-bottom: 8px;
  color: #555;
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

/* 3 行 3 列网格 */
.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 列 */
  grid-auto-rows: 100px;                /* 每行固定高 */
  gap: 12px;
}

/* 第一行大图 */
.hero-img {
  grid-column: 1 / 3;   /* 占满 2 列 */
  grid-row: 1 / 3;      /* 第 1 行 */
  position: relative;
}


.mantou {
  font-family: 'Mantou', sans-serif;
  letter-spacing: 0.02em;
  font-size: 1.1rem;
  font-weight: 400;
}
/* 文字覆盖 */
.img-text {
  
  
  position: absolute;
  bottom: 12px; left: 12px;
  color: #fcfcfc;
  /* background: rgba(0,0,0,0.45); */
  padding: 6px 12px;
  border-radius: 6px;
  
}

.img-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 响应式：屏幕窄时变 2 列 */
@media (max-width: 1024px) {
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

</style>
