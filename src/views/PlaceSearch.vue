<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @click.self="onCancel">
        <div class="modal-container">
          <div class="modal-header">
            <h3 class="modal-title">查找地点</h3>
            <button class="modal-close-btn" @click="onCancel">×</button>
          </div>
          <div class="modal-body">
            <div class="search-header">
              <el-autocomplete
                v-model="keyword"
                placeholder="搜索地点"
                clearable
                class="search-input"
                :fetch-suggestions="querySearchAsync"
                :teleported="false"
                popper-class="place-autocomplete-popper"
                @clear="onSearch"
                @keyup.enter="onSearch"
                @select="onSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-autocomplete>
              <!-- <el-select v-model="filterType" placeholder="类别" class="filter-select" @change="onFilterChange"> -->
                <!-- <el-option label="全部" value=""></el-option> -->
                <!-- <el-option label="景点" value="scenic"></el-option> -->
                <!-- <el-option label="餐饮" value="restaurant"></el-option> -->
                <!-- <el-option label="酒店" value="hotel"></el-option> -->
              <!-- </el-select> -->
              <!-- <el-select v-model="sortOrder" placeholder="排序" class="sort-select" @change="onSortChange"> -->
                <!-- <el-option label="距离" value="distance"></el-option> -->
                <!-- <el-option label="评分" value="rating"></el-option> -->
                <!-- <el-option label="热门" value="popularity"></el-option> -->
              <!-- </el-select> -->
            </div>
            <div class="results-list">
              <div v-for="place in places" :key="place.id" class="place-card">
                <img :src="place.image || defaultImage" alt="place-img" class="place-img" />
                <div class="place-info">
                  <h4 class="place-name">{{ place.name }}</h4>
                  <p class="place-address">{{ place.address }}</p>
                  <p class="place-desc">{{ place.description }}</p>
                  <div class="place-actions">
                    <el-button size="mini" type="primary" :disabled="place.added" @click="addPlace(place)">
                      {{ place.added ? '已添加' : '加入行程' }}
                    </el-button>
                    <el-button class="detail" size="mini" @click="viewDetails(place)">
                      详情
                    </el-button>
                  </div>
                  <div v-if="place.expanded" class="place-more">
                    <p>评分：{{ place.rating }} · 距离：{{ place.distance }} km</p>
                    <p>开放时间：{{ place.openingHours }}</p>
                  </div>
                </div>
              </div>
              <div v-if="places.length === 0" class="no-result">
                <p>暂无结果，换个关键词试试吧</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <el-button class="close" @click="onCancel">关闭</el-button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import heroTravel from '@/assets/images/1.jpg'
import heroTravel2 from '@/assets/images/2.jpg'
import heroTravel3 from '@/assets/images/3.jpg'
import heroTravel4 from '@/assets/images/4.jpg'
import heroTravel5 from '@/assets/images/5.jpg'
import heroTravel6 from '@/assets/images/6.jpg'
import heroTravel7 from '@/assets/images/7.jpg'
import heroTravel8 from '@/assets/images/8.jpg'
import heroTravel9 from '@/assets/images/9.jpg'
import heroTravel10 from '@/assets/images/10.jpg'
import heroTravel11 from '@/assets/images/11.jpg'
import heroTravel12 from '@/assets/images/12.jpg'
import heroTravel13 from '@/assets/images/13.jpg'
import axios from 'axios'

// 高德 key
const AMAP_KEY = 'ca55a345ea12a37b1e00830ee7f62380'
// inputtips 接口
const INPUTTIPS_URL = 'https://restapi.amap.com/v3/assistant/inputtips'
const IMAGE_POOL = [
  heroTravel,
  heroTravel2,
  heroTravel3,
  heroTravel4,
  heroTravel5,
  heroTravel6,
  heroTravel7,
  heroTravel8,
  heroTravel9,
  heroTravel10,
  heroTravel11,
  heroTravel12,
  heroTravel13
]

export default {
  name: 'PlaceSearch',
  components: { Search },
  emits: ['place-added', 'cancel'],
  props: {
    existingPlaceIds: {
      type: Array,
      default: () => []
    }
  },
  
  data() {
    return {
      visible: true,
      keyword: '',
      filterType: '',
      sortOrder: '',
      places: [],
      debounceTimer: null
    }
  },
  methods: {
    getImageById(id) {
      const str = id.toString()
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i)
      }
      return IMAGE_POOL[hash % IMAGE_POOL.length]
    },
    async fetchPlaces() {
      if (!this.keyword.trim()) {
        this.places = []
        return
      }
    
      const res = await axios.get(
        'https://restapi.amap.com/v3/place/text',
        {
          params: {
            key: AMAP_KEY,
            keywords: this.keyword,
            // city: '北京',
            // citylimit: true,
            types: this.filterType === 'scenic'
              ? '110000|110100' // 风景名胜（可不填）
              : '',
            extensions: 'base',
            offset: 10,
            page: 1
          }
        }
      )
      
      if (res.data.status !== '1') {
        this.places = []
        return
      }
    
      this.places = res.data.pois.map(poi => {
        const [lng, lat] = poi.location
          ? poi.location.split(',').map(Number)
          : []
      
        return {
          id: poi.id,
          name: poi.name,
          address: poi.address,
          description: poi.type,
          image: this.getImageById(poi.id), // ⭐ 随机图
          rating: poi.biz_ext?.rating || '暂无',
          distance: poi.distance ? (poi.distance / 1000).toFixed(2) : null,
          openingHours: poi.opening_hours || '以现场为准',
          lnglat: [lng, lat],
          added: this.existingPlaceIds.includes(poi.id),
          expanded: false
        }
      })
    },
    // 把原来的 axios 请求换成 JSONP
    querySearchAsync(queryStr, cb) {
      if (!queryStr || !queryStr.trim()) { cb([]); return }

      // 清理上一次脚本
      if (this._script) {
        document.head.removeChild(this._script)
        delete this._script
      }
      // 全局回调名每次随机，防止并发覆盖
      const cbName = '_mapCb' + Date.now()
      window[cbName] = (data) => {
        console.log('高德 tips 返回', data) 
        // 容错
        const sugs = (data.status === '1' && data.tips
          ? data.tips.map(t => ({ value: t.name }))
          : [])
          console.log('准备喂给 el-autocomplete 的数组', sugs) 
        cb(sugs)
        // 清场
        if (this._script) {
          document.head.removeChild(this._script)
          delete this._script
        }
        delete window[cbName]
      }

      this._script = document.createElement('script')
      this._script.src = `${INPUTTIPS_URL}?key=${AMAP_KEY}&keywords=${encodeURIComponent(
        queryStr.trim()
      )}&callback=${cbName}`
      document.head.appendChild(this._script)
    },
    onSearch() {
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.fetchPlaces()
      }, 400)
    },
    
    onFilterChange() {
      this.onSearch()
    },
    onSortChange() {
      this.onSearch()
    },
    // },
    toggleExpand(place) {
      place.expanded = !place.expanded
    },
    addPlace(place) {
      this.$emit('place-added', place)
      this.visible = false
    },
    onCancel() {
      this.visible = false
      this.$emit('cancel')
    },
    viewDetails(place) {
      // 跳转到 PlaceDetail 页面
      this.$router.push({ name: 'PlaceDetail', params: { placeId: place.id } })
      // 同时关闭弹窗
      this.visible = false
      this.$emit('cancel')
    }
  },
  mounted() {
    this.fetchPlaces()
  }
}
</script>

<style scoped>

@font-face {
  font-family: 'Mantou';
  src: url('/src/assets/font/love.ttf') format('truetype');

  font-style: normal;
  font-weight: 400;
}

@font-face {
  font-family: 'Hou';
  src:url('/src/assets/font/1.ttf') format('truetype');

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
  font-size: 2.1rem;
  font-weight: 1;
}
.modal-overlay {
  font-family: Mantou;
  
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
.modal-container {
  font-family: Mantou;
  
  width: 760px;
  max-height: 90vh;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.modal-header {
  font-family: Mantou;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background: #f8f8fb;
}
.modal-title {
  font-family: Mantou;
  
  font-size: 1.8rem;
  font-weight: 600;
  color: #131068;
}
.modal-close-btn {
  font-family: Mantou;

  position: absolute;
  right: 16px;
  top: 16px;
  font-size: 1.2rem;
  border: none;
  background: transparent;
  cursor: pointer;
}
.search-header {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #eee;
}
.search-input {
  flex: 1;
}
.filter-select, .sort-select {
  width: 140px;
}
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 16px;
}
.results-list {
  padding-top: 15px;
  
}
.place-card {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 10px;
  background: #f8f8fb;
  transition: background 0.2s;
}
.place-card:hover {
  background: #f1f1f8;
}
.place-img {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}
.place-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.place-name {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 6px;
}
.place-address, .place-desc {
  font-size: 0.9rem;
  color: #666;
  margin: 2px 0;
}
.place-actions {
  margin-top: auto;
  display: flex;
  gap: 8px;
}
.place-more {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #444;
}
.no-result {
  text-align: center;
  color: #999;
  margin: 64px 0;
}
.modal-footer {
  
  padding: 12px 16px;
  text-align: right;
  background: #fafafa;
}

.close{
  font-family: Mantou;
  color:#131068;
  font-weight: 500;
  font-size:1.1rem;
}
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: all 0.25s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.el-button--mini{
  margin-top:8px;
  font-family: Mantou;
  color:#fdfdfd;
}

.detail{
  margin-top:8px;
  font-family: Mantou;
  color:#a85e5e;
  font-size: 1.1rem;
}

/* 1. 让弹窗本身不再裁掉超出部分 */
.modal-container {
  overflow: visible;          /* 关键：去掉 hidden */
}

.place-autocomplete-popper {
  z-index: 20000;
}
/* 3. 如果下拉面板宽度比输入框窄，可手动对齐 */
.el-autocomplete-suggestion {
  min-width: 360px !important; /* 按需调，和你的搜索框一样宽即可 */
}

/* 4. 兼容小屏：面板最大高度 + 内部滚动 */
.el-autocomplete-suggestion__wrap {
  max-height: 320px !important;
  overflow-y: auto !important;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
