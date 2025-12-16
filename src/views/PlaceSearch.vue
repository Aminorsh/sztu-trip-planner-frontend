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
import heroTravel from '@/assets/images/14.jpg'

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
        { id: 'p1',  name: '天安门广场',       address: '东城区天安门广场',        description: '祖国心脏，升旗仪式必看。',         image: heroTravel, rating: 4.7, distance: 0, openingHours: '05:00-22:00', added: this.existingPlaceIds.includes('p1'), expanded: false, lnglat: [116.397428, 39.90923] },
        { id: 'p2',  name: '故宫博物院',       address: '东城区景山前街4号',        description: '世界最大古代宫殿群，震撼到脚软。', image: heroTravel, rating: 4.9, distance: 0, openingHours: '08:30-17:00', added: this.existingPlaceIds.includes('p2'), expanded: false, lnglat: [116.397731, 39.916485] },
        { id: 'p3',  name: '景山公园',         address: '西城区景山西街44号',       description: '登顶万春楼，俯瞰紫禁城全景。',      image: heroTravel, rating: 4.6, distance: 0, openingHours: '06:30-20:00', added: this.existingPlaceIds.includes('p3'), expanded: false, lnglat: [116.391467, 39.925929] },
        { id: 'p4',  name: '王府井步行街',     address: '东城区王府井大街',         description: '百年商业街，小吃+伴手礼一站搞定。', image: heroTravel, rating: 4.5, distance: 0, openingHours: '10:00-22:00', added: this.existingPlaceIds.includes('p4'), expanded: false, lnglat: [116.413384, 39.913312] },
        { id: 'p5',  name: '北海公园',         address: '西城区文津街1号',          description: '皇家园林+白塔倒影，划船超浪漫。',   image: heroTravel, rating: 4.6, distance: 0, openingHours: '06:00-21:00', added: this.existingPlaceIds.includes('p5'), expanded: false, lnglat: [116.3887, 39.9242] },
        { id: 'p6',  name: '什刹海',           address: '西城区什刹海地区',         description: '胡同+酒吧+三轮车，老北京夜生活首选。', image: heroTravel, rating: 4.4, distance: 0, openingHours: '全天', added: this.existingPlaceIds.includes('p6'), expanded: false, lnglat: [116.3867, 39.9413] },
        { id: 'p7',  name: '南锣鼓巷',         address: '东城区南锣鼓巷',           description: '网红胡同，文创小店吃到扶墙。',        image: heroTravel, rating: 4.3, distance: 0, openingHours: '全天', added: this.existingPlaceIds.includes('p7'), expanded: false, lnglat: [116.4030, 39.9376] },
        { id: 'p8',  name: '雍和宫',           address: '东城区雍和宫大街12号',     description: '皇家喇嘛庙，香火旺到怀疑人生。',     image: heroTravel, rating: 4.7, distance: 0, openingHours: '09:00-16:30', added: this.existingPlaceIds.includes('p8'), expanded: false, lnglat: [116.4182, 39.9479] },
        { id: 'p9',  name: '鸟巢/水立方',      address: '朝阳区国家体育场南路1号', description: '奥运地标，夜景拍照无敌。',           image: heroTravel, rating: 4.5, distance: 0, openingHours: '09:00-21:00', added: this.existingPlaceIds.includes('p9'), expanded: false, lnglat: [116.3979, 39.9928] },
        { id: 'p10', name: '颐和园',           address: '海淀区新建宫门路19号',     description: '皇家园林天花板，长廊+昆明湖美炸。',   image: heroTravel, rating: 4.8, distance: 0, openingHours: '06:30-18:00', added: this.existingPlaceIds.includes('p10'), expanded: false, lnglat: [116.2756, 39.9998] },
        { id: 'p11', name: '圆明园',           address: '海淀区清华西路28号',       description: '万园之园遗址，历史感拉满。',          image: heroTravel, rating: 4.4, distance: 0, openingHours: '07:00-19:30', added: this.existingPlaceIds.includes('p11'), expanded: false, lnglat: [116.3016, 40.0081] },
        { id: 'p12', name: '香山公园',         address: '海淀区买卖街40号',         description: '红叶圣地，秋天美成油画。',            image: heroTravel, rating: 4.6, distance: 0, openingHours: '06:00-18:00', added: this.existingPlaceIds.includes('p12'), expanded: false, lnglat: [116.1938, 39.9911] },
        { id: 'p13', name: '北京动物园',       address: '西城区西直门外大街137号',  description: '看熊猫宝宝打滚，萌化少女心。',        image: heroTravel, rating: 4.3, distance: 0, openingHours: '07:30-18:00', added: this.existingPlaceIds.includes('p13'), expanded: false, lnglat: [116.3395, 39.9373] },
        { id: 'p14', name: '前门大街',         address: '东城区前门大街',           description: '复古铛铛车+北京烤鸭，一次体验两种京味。', image: heroTravel, rating: 4.4, distance: 0, openingHours: '全天', added: this.existingPlaceIds.includes('p14'), expanded: false, lnglat: [116.3986, 39.9043] },
        { id: 'p15', name: '天坛公园',         address: '东城区天坛路甲1号',        description: '明清皇帝祭天圣地，回音壁必打卡。',    image: heroTravel, rating: 4.7, distance: 0, openingHours: '06:00-22:00', added: this.existingPlaceIds.includes('p15'), expanded: false, lnglat: [116.407394, 39.88329] }
      ];
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
</style>
