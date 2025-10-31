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
              <el-input
                v-model="keyword"
                placeholder="搜索地点"
                clearable
                class="search-input"
                @clear="onSearch"
                @keyup.enter="onSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-select v-model="filterType" placeholder="类别" class="filter-select" @change="onFilterChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="景点" value="scenic"></el-option>
                <el-option label="餐饮" value="restaurant"></el-option>
                <el-option label="酒店" value="hotel"></el-option>
              </el-select>
              <el-select v-model="sortOrder" placeholder="排序" class="sort-select" @change="onSortChange">
                <el-option label="距离" value="distance"></el-option>
                <el-option label="评分" value="rating"></el-option>
                <el-option label="热门" value="popularity"></el-option>
              </el-select>
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
                    <el-button size="mini" @click="viewDetails(place)">
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
            <el-button @click="onCancel">关闭</el-button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import heroTravel from '@/assets/images/hero-travel.jpg'

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
      defaultImage: heroTravel,
      debounceTimer: null
    }
  },
  methods: {
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
    fetchPlaces() {
      const sample = [
        { id: 'p1', name: '浅草寺', address: '东京都台东区浅草2-3-1', description: '东京最古老、最著名的寺庙之一。', image: heroTravel, rating: 4.5, distance: 1.2, openingHours: '06:00-18:00', added: this.existingPlaceIds.includes('p1'), expanded: false },
        { id: 'p2', name: '秋叶原电器街', address: '东京千代田区外神田', description: '电子、动漫文化圣地。', image: heroTravel, rating: 4.2, distance: 2.5, openingHours: '10:00-21:00', added: this.existingPlaceIds.includes('p2'), expanded: false },
        { id: 'p3', name: '银座购物区', address: '东京中央区银座', description: '高端品牌林立的商业街区。', image: heroTravel, rating: 4.7, distance: 3.8, openingHours: '11:00-20:00', added: this.existingPlaceIds.includes('p3'), expanded: false },
        { id: 'p4', name: '台场海滨公园', address: '东京港区台场1-4-1', description: '海滨散步 + 娱乐综合体。', image: heroTravel, rating: 4.4, distance: 4.1, openingHours: '09:00-22:00', added: this.existingPlaceIds.includes('p4'), expanded: false },
        { id: 'p5', name: '明治神宫', address: '东京涩谷区代代木神园町1-1', description: '穿越森林的神社之一，环境宁静。', image: heroTravel, rating: 4.8, distance: 2.2, openingHours: '05:00-17:00', added: this.existingPlaceIds.includes('p5'), expanded: false },
        { id: 'p6', name: '筑地市场', address: '东京中央区筑地5-2-1', description: '鲜活海鲜与寿司的天堂。', image: heroTravel, rating: 4.3, distance: 5.0, openingHours: '05:00-14:00', added: this.existingPlaceIds.includes('p6'), expanded: false }
      ]
      this.places = sample
    },
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
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
.modal-container {
  width: 760px;
  max-height: 90vh;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background: #f8f8fb;
}
.modal-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #8c88ff;
}
.modal-close-btn {
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
  padding-top: 8px;
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
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: all 0.25s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
