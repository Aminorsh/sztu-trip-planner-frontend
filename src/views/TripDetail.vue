<template>
  <div class="trip-page">
    <!-- 背景 + 遮罩层 -->
    <div class="bg-image" :style="{ backgroundImage: `url(${heroTravel})` }"></div>
    <div class="bg-overlay"></div>

    <div class="trip-inner">
      <!-- 顶部工具栏 -->
      <header class="trip-header">
        <div class="header-left">
          <h2 class="trip-title">{{ trip.title }}</h2>
          <span class="trip-status">{{ trip.status }}</span>
        </div>
        <div class="header-right">
          <el-button size="mini" @click="saveTrip">保存</el-button>
          <el-button size="mini" @click="shareTrip">分享</el-button>
          <el-button size="mini" @click="exportVisible = true">导出</el-button>
          <el-button size="mini" @click="showPlaceSearch = true">添加地点</el-button>
        </div>
      </header>

      <div class="trip-body">
        <!-- 左侧：天数切换 / 行程项 / 日历 -->
        <aside class="left-side">
          <div class="day-switcher">
            <el-button
              v-for="(d, idx) in tripDays"
              :key="idx"
              :type="currentDay === (idx + 1) ? 'primary' : 'text'"
              @click="currentDay = idx + 1"
            >
              第 {{ idx + 1 }} 天
            </el-button>
            <el-button
              type="text"
              icon="Delete"
              size="small"
              class="del-day-btn"
              @click="onDeleteDay(idx)"
            />
          </div>
          <div class="items-list">
            <draggable v-model="dayItems" handle=".drag-handle" item-key="id">
              <template #item="{ element }">
                <div
                  class="item-card"
                  :class="{ selected: selectedItem && selectedItem.id === element.id }"
                  @click="selectItem(element)"
                >
                  <span class="drag-handle">⋮⋮</span>
                  <div class="item-content">
                    <div class="item-title">{{ element.name }}</div>
                    <div class="item-time">{{ element.time }}</div>
                  </div>
                </div>
              </template>
            </draggable>
            <div class="bottom-actions">
              <el-button
                type="text"
                class="add-day-btn"
                @click="addNewDay"
              >
              + 添加新的一天
              </el-button>
              <el-button
                type="text"
                class="add-item-btn"
                @click="addNewItem"
                >
                + 添加行程项
              </el-button>
            </div>
          </div>
          <!-- 日历视图 -->
          <div class="calendar-view">
            <FullCalendar :options="calendarOptions" />
          </div>
        </aside>
        <!-- 中间：地图 + 概览摘要展示 -->
        <section class="trip-map">
          <div class="map-container" ref="mapContainer"></div>
          <div class="map-tools">
            <el-button icon="el-icon-zoom-in" circle @click="zoomIn" />
            <el-button icon="el-icon-zoom-out" circle @click="zoomOut" />
            <el-button icon="el-icon-full-screen" circle @click="fitBounds" />
          </div>
          <div class="map-summary">
            <h4>本日概览</h4>
            <p class="overview-text">{{ daySummary.overview }}</p>
            <div class="summary-stats">
              <span>总距离：{{ daySummary.totalDistance }}</span>
              <span>总用时：{{ daySummary.totalTime }}</span>
            </div>
            <div class="summary-photos">
              <img
                v-for="(p, i) in daySummary.photos"
                :key="i"
                :src="p"
                alt="photo"
              />
            </div>
          </div>
        </section>
        <!-- 右侧：属性编辑 / 打卡等 -->
        <aside class="right-side">
          <div v-if="selectedItem">
            <h3 class="right-title">编辑项：{{ selectedItem.name }}</h3>
            <el-form :model="selectedItem" label-position="top">
              <el-form-item label="名称">
                <!-- 改用 el-autocomplete -->
                <input
                  id="poiInput"
                  v-model="selectedItem.name"
                  placeholder="请输入地点名称"
                  style="width:100%;height:32px;padding:0 8px;border:1px solid #ffffff;border-radius:4px,"
                />
              </el-form-item>
              <el-form-item label="时间">
                <el-input v-model="selectedItem.time" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="selectedItem.note" />
              </el-form-item>
              <el-form-item label="优先级">
                <el-select v-model="selectedItem.priority" placeholder="优先级">
                  <el-option label="高" value="high"></el-option>
                  <el-option label="中" value="medium"></el-option>
                  <el-option label="低" value="low"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button size="small" @click="saveItem">保存</el-button>
                <el-button size="small" type="danger" @click="removeItem">
                  删除
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="success" @click="markVisited">
                  打卡 / 完成
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-else class="no-selection">
            <p>请从左侧选择一个行程项进行编辑</p>
          </div>
        </aside>
      </div>
      
      <footer class="trip-footer">
        <span>最后保存时间：{{ lastSaved }}</span>
        <el-button size="mini" @click="optimizeRoute">优化路线</el-button>
      </footer>
    </div>

    <!-- 弹窗：地点搜索 -->
    <PlaceSearch
      v-if="showPlaceSearch"
      :existing-place-ids="dayItems.map(i => i.id)"
      @place-added="onPlaceAdded"
      @cancel="showPlaceSearch = false"
    />

    <!-- 弹窗：导出面板 -->
    <ExportPanel
      v-model="exportVisible"
      :trip-data="trip"
      @exported="handleExported"
    />
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import { debounce } from 'lodash'  // 导入debounce
import heroTravel from '@/assets/images/27.jpg'
import heroTravel5 from '@/assets/images/19.jpg'
import PlaceSearch from './PlaceSearch.vue'
import ExportPanel from './ExportPanel.vue'

export default {
  name: 'TripDetail',
  components: {
    draggable,
    FullCalendar,
    PlaceSearch,
    ExportPanel
  },
  data() {
    return {
      heroTravel,
      heroTravel5,
      trip: {
        title: '北京 5 日游',
        status: '进行中'
      },
      tripDays: 5,
      currentDay: 2,
      dayItems: [
        { id: 'b1-1', name: '天安门广场',   time: '08:00', note: '升旗仪式，建议提前 30 min 到', priority: '高', lnglat: [116.397428, 39.90923] },
        { id: 'b1-2', name: '故宫博物院',   time: '09:30', note: '提前网上购票，午门进神武门出', priority: '高', lnglat: [116.397731, 39.916485] },
        { id: 'b1-3', name: '景山公园',     time: '14:00', note: '登顶万春楼俯瞰紫禁城全景', priority: '中', lnglat: [116.391467, 39.925929] },
        { id: 'b1-4', name: '王府井步行街', time: '17:30', note: '老字号小吃+伴手礼', priority: '低', lnglat: [116.413384, 39.913312] }
      ],
      selectedItem: null,
      lastSaved: new Date().toLocaleString(),
      daySummary: {
        overview: '中轴线核心一日：天安门升旗→故宫深度游→景山俯瞰→王府井夜宵。',
        totalDistance: '7.8 km',
        totalTime: '8 小时 30 分钟',
        photos: [heroTravel, heroTravel, heroTravel]
      },
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: ''
        },
        events: [
        { title: '天安门广场',      date: '2025-06-01', backgroundColor: '#6262f3', borderColor: '#6262f3' },
        { title: '故宫博物院',      date: '2025-06-02', backgroundColor: '#ff6f6f', borderColor: '#6262f3' },
        { title: '景山公园',        date: '2025-06-03', backgroundColor: '#6fcfff', borderColor: '#6262f3' },
        { title: '王府井步行街',    date: '2025-06-04', backgroundColor: '#d88cff', borderColor: '#6262f3' },
        { title: '北海公园',        date: '2025-06-05', backgroundColor: '#ffd86f', borderColor: '#6262f3' }

        ],
        dateClick: this.onCalendarDateClick,
        dayCellClassNames: (info) => {
          if (info.dateStr === this.selectedDate) {
            return ['fc-day-highlight']
          }
          return null
        }
      },
      selectedDate: null,
      showPlaceSearch: false,
      exportVisible: false,
      map: null,
      polyline: null,
      markers: [],
      geocoder: null,
      placeSearch: null,
      loading: false // 添加加载状态
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initMap()
      this.drawRoute()
    })
  },

  methods: {
    /* 1. 初始化地图 */
    initMap() {
      const dom = this.$refs.mapContainer
      this.map = new AMap.Map(dom, {
        zoom: 5,
        center: [104.195397, 35.86166],
        resizeEnable: true
      })
          /* ===== 1. 输入提示 ===== */
      AMap.plugin('AMap.AutoComplete', () => {
        const auto = new AMap.AutoComplete({
          input: 'poiInput',   // 对应上面 input 的 id
          city: ''
        })
        // 用户选中一条结果
        auto.on('select', (e) => {
          const poi = e.poi
          if (!poi || !this.selectedItem) return
          this.selectedItem.name = poi.name
          // 立即拿坐标
          if (poi.location) {
            this.selectedItem.lnglat = [poi.location.lng, poi.location.lat]
            this.map.setCenter(poi.location)   // 可选：地图飞过去
            this.refreshMap()                  // 重画路线
          } else {
            // 个别 POI 没有即时坐标，再补一次地理编码
            this.getLocationByName(poi.name).then(ll => {
              this.selectedItem.lnglat = ll
              this.refreshMap()
            })
          }
        })
      })
    
      /* ===== 2. 其余你原来的代码 ===== */
      this.geocoder = new AMap.Geocoder({ city: '' })
      // 初始化地理编码器
      this.geocoder = new AMap.Geocoder({ 
        city: '',
        radius: 1000
      })
      
      // 初始化PlaceSearch（用于自动补全）
      this.initPlaceSearch()
    },
    
    /* 2. 初始化PlaceSearch */
    initPlaceSearch() {
      AMap.plugin(['AMap.PlaceSearch'], () => {
        this.placeSearch = new AMap.PlaceSearch({
          city: '',
          pageSize: 10,
          map: this.map, // 重要：传递map实例
          panel: 'search-result' // 可选：指定结果显示容器
        })
      })
    },

    /* 3. 获取地点坐标（核心方法） */
    async getLocationByName(name) {
      if (!name || !this.geocoder) {
        console.warn('地点名称为空或地理编码器未初始化')
        return null
      }
      
      return new Promise((resolve) => {
        this.geocoder.getLocation(name, (status, result) => {
          console.log('地理编码结果:', status, result)
          if (status === 'complete' && result.geocodes && result.geocodes.length > 0) {
            const loc = result.geocodes[0].location
            resolve([loc.lng, loc.lat])
          } else {
            console.warn(`无法获取"${name}"的坐标，使用默认坐标`)
            // 默认坐标
            resolve([104.195397, 35.86166])
          }
        })
      })
    },

    /* 4. 绘制路线 */
    async drawRoute() {
      console.log('开始绘制路线，dayItems:', this.dayItems)
      
      if (!this.map) {
        console.warn('地图未初始化')
        return
      }

      // 清空之前的标记
      this.map.remove(this.markers)
      this.markers = []
      if (this.polyline) {
        this.map.remove(this.polyline)
        this.polyline = null
      }

      // 如果没有地点，直接返回
      if (!this.dayItems || this.dayItems.length === 0) {
        console.log('没有行程项可绘制')
        return
      }

      const validCoords = []
      
      try {
        // 获取所有地点的坐标
        for (let i = 0; i < this.dayItems.length; i++) {
          const item = this.dayItems[i]
          console.log(`处理第 ${i+1} 个地点:`, item.name)
          
          let lnglat = null
          
          // 如果已有坐标，直接使用
          if (item.lnglat && Array.isArray(item.lnglat) && item.lnglat.length === 2) {
            lnglat = item.lnglat
            console.log(`使用现有坐标:`, lnglat)
          } else if (item.name) {
            // 没有坐标，则获取坐标
            console.log(`获取"${item.name}"的坐标...`)
            lnglat = await this.getLocationByName(item.name)
            if (lnglat) {
              // 更新item的坐标
              this.$set(this.dayItems[i], 'lnglat', lnglat)
              console.log(`获取到坐标:`, lnglat)
            }
          }
          
          if (lnglat) {
            validCoords.push({
              name: item.name,
              lnglat: lnglat,
              idx: i
            })
          }
        }

        console.log('有效坐标:', validCoords)

        // 如果没有有效的坐标，直接返回
        if (validCoords.length === 0) {
          console.warn('没有有效的坐标')
          return
        }

        // 添加标记
        validCoords.forEach(({ name, lnglat, idx }) => {
          try {
            const marker = new AMap.Marker({
              position: new AMap.LngLat(lnglat[0], lnglat[1]),
              title: `${idx + 1}. ${name}`,
              label: { 
                content: `${idx + 1}`, 
                direction: 'center',
                offset: new AMap.Pixel(0, 0)
              }
            })
            this.markers.push(marker)
            this.map.add(marker)
          } catch (error) {
            console.error('创建标记失败:', error)
          }
        })

        // 绘制路线（至少两个点）
        if (validCoords.length > 1) {
          try {
            this.polyline = new AMap.Polyline({
              path: validCoords.map(i => i.lnglat),
              strokeColor: '#6262f3',
              strokeWeight: 5,
              strokeOpacity: 0.8,
              lineJoin: 'round'
            })
            this.map.add(this.polyline)
          } catch (error) {
            console.error('绘制路线失败:', error)
          }
        }

        // 调整视野
        try {
          const mapObjects = [...this.markers]
          if (this.polyline) mapObjects.push(this.polyline)
          
          if (mapObjects.length > 0) {
            this.map.setFitView(mapObjects, false, [60, 60, 60, 60])
          }
        } catch (error) {
          console.error('调整视野失败:', error)
        }
        
        console.log('路线绘制完成')
      } catch (error) {
        console.error('绘制路线过程中出错:', error)
      }
    },

    /* 6. 核心操作 - 保存行程项 */
    async saveItem() {
      console.log('开始保存行程项:', this.selectedItem)
      
      if (!this.selectedItem) {
        console.warn('没有选中的行程项')
        return
      }

      try {
        this.loading = true

        // 如果名称有变化但没有坐标，则获取坐标
        if (this.selectedItem.name && this.selectedItem.name.trim() !== '' && 
            (!this.selectedItem.lnglat || !Array.isArray(this.selectedItem.lnglat))) {
          console.log(`获取"${this.selectedItem.name}"的坐标...`)
          const lnglat = await this.getLocationByName(this.selectedItem.name)
          if (lnglat) {
            this.selectedItem.lnglat = lnglat
            console.log('获取到坐标:', lnglat)
          }
        }

        // 更新dayItems
        const idx = this.dayItems.findIndex(i => i.id === this.selectedItem.id)
        if (idx > -1) {
          // 使用Vue.set确保响应式更新
          this.dayItems[idx] = { ...this.selectedItem }
        }

        // 刷新地图
        await this.drawRoute()

        // 更新保存时间
        this.lastSaved = new Date().toLocaleString()

        // 提示
        if (this.$message) {
          this.$message.success('已保存')
        } else {
          console.log('已保存')
        }
        
        console.log('保存完成')
      } catch (error) {
        console.error('保存失败:', error)
        if (this.$message) {
          this.$message.error('保存失败: ' + error.message)
        }
      } finally {
        this.loading = false
      }
    },

    /* 7. 其他方法（保持不变） */
    saveTrip() {
      this.lastSaved = new Date().toLocaleString()
      console.log('保存行程')
    },
    
    shareTrip() {
      console.log('分享行程')
    },
    
    addNewItem() {
      const newId = `item${Date.now()}`
      this.dayItems.push({ 
        id: newId, 
        name: '', 
        time: '', 
        note: '', 
        priority: '低',
        lnglat: null
      })
    },
    
    addNewDay() {
      this.tripDays += 1
      this.currentDay = this.tripDays
      this.$nextTick(() => {
        const list = this.$el.querySelector('.items-list')
        if (list) list.scrollTop = list.scrollHeight
      })
    },
    
    onDeleteDay(index) {
      if (this.tripDays <= 1) return

      this.$confirm(`确定删除第 ${index + 1} 天？`, '提示', {
        confirmButtonText: '删',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tripDays -= 1
        if (this.currentDay === index + 1) {
          this.currentDay = Math.max(1, index)
        } else if (this.currentDay > index + 1) {
          this.currentDay -= 1
        }
      }).catch(() => {})
    },
    
    selectItem(item) { 
      this.selectedItem = item
    },
    
    async removeItem() {
      this.dayItems = this.dayItems.filter(i => i.id !== this.selectedItem.id)
      this.selectedItem = null
      await this.drawRoute()
    },
    
    markVisited() {
      console.log('打卡 / 完成', this.selectedItem)
    },
    
    zoomIn() {
      this.map?.zoomIn()
    },
    
    zoomOut() {
      this.map?.zoomOut()
    },
    
    fitBounds() {
      if (this.markers.length > 0) {
        this.map.setFitView(this.markers, false, [40, 40, 40, 40])
      }
    },
    
    optimizeRoute() {
      console.log('优化路线')
    },
    
    onCalendarDateClick(arg) {
      this.selectedDate = arg.dateStr
      console.log('点击日历日期：', arg.dateStr)
    },
    
    async onPlaceAdded(place) {
      const newItem = {
        id: 'p' + Date.now(),
        name: place.name,
        time: '',
        note: place.description,
        priority: '中',
        lnglat: place.lnglat
      }
      this.dayItems.push(newItem)
      this.showPlaceSearch = false
      await this.drawRoute()
    },
    
    handleExported(exportResult) {
      console.log('收到导出结果：', exportResult)
      this.exportVisible = false
    }
  }
}
</script>

<!-- 样式保持不变 -->
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

/* 保持你原来样式或微调，这里略写基础样式 */
.trip-page { font-family:'Mantou';position: relative; width:100%; min-height:100vh; color: #f3f4f6; background: #f8f8fb; }
.bg-image { position:absolute; inset:0; background-repeat:no-repeat; background-position:center; background-size:cover; z-index:0; }
.bg-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.4); z-index:1; }
.trip-inner { position:relative; z-index:2; display:flex; flex-direction:column; height:100%; }
/* … 其余样式保持你已有版本 … */
</style>


<style scoped>

.trip-page { position: relative; width:100%; min-height:100vh; color: #f3f4f6; background: #f8f8fb; }
.bg-image { position:absolute; inset:0; background-repeat:no-repeat; background-position:center; background-size:cover; z-index:0; }
.bg-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.4); z-index:1; }
.trip-inner { position:relative; z-index:2; display:flex; flex-direction:column; height:100%; }


.trip-status{
  text-align: center;
  background: #111769dc;
  color:#2b2b77;
  border: 2px solid e6e2ebb3;
}

.trip-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  color: #5f5f97;
  background: #822562;
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
  /* 页面背景颜色 */
  background: rgba(92, 82, 82, 0.045);
  z-index: 1;
}
.trip-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.trip-title {
  font-family: 'Hou';
  font-weight: 1;
  font-size: 2.0rem;
  margin: 0;
  color: #ffffff;
}
.trip-status {
  font-family: 'Mantou';
  padding: 4px 12px;
  font-weight: 1000;
  background: rgba(252, 252, 252, 0.942);
  border-color:  rgba(246, 246, 246, 0.942);
  color: rgba(116, 182, 208, 0.942);
  border-radius: 8px;
  font-size: 1.4rem;
  
}
.header-right .el-button {
  font-family: Mantou;
  font-size: 1.2rem;
  font-weight: 1000;
  margin-left: 8px;
  background: rgba(255, 255, 255, 0.942);
  border-color:  rgba(255, 255, 255, 0.942);
  color: rgba(116, 182, 208, 0.942);
}

/* 主体布局 */
.trip-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.day-switcher .el-button {
  height: 32px;                  /* 1. 统一高度 */
  line-height: 32px;             /* 2. 让文字垂直居中 */
  padding: 0 12px;               /* 3. 统一横向内间距 */
  border: none !important;       /* 4. 去掉边框差异 */
  margin: 0;                     /* 5. 去掉默认 margin */
  vertical-align: middle;        /* 6. 行内元素中线对齐 */
}
.el-button--text{
  font-family: 'Mantou';
  font-weight: 500;
  font-size:1.0rem;
  background: #ffffffeb;
  --el-button-hover-text-color:#191962;
  border: #f9f9f9;
}
.el-button--primary{
  font-family: 'Mantou';
  font-size:1.0rem;
  background: #8ed6f5;
  font-weight: 500;
  border: #f8f8f8;
  --el-button-hover-text-color:#1a1a57;
}
.el-button{
  text-align: center;
  
  color:#12125d;
  border: 2px solid e6e2ebb3;
}
.el-button:hover {
  background: #fcf9fd9b;
  color:#0a0a5b
}
.left-side {
  width: 280px;
  border-right: 1px solid rgba(245, 242, 242, 0.918);
  padding: 16px;
  background: rgba(243, 241, 244, 0.284);
  border-radius: 20px;
}
.day-switcher {
  
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.items-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}
.item-card {
  display: flex;
  align-items: center;
  padding: 8px;
  background: #ffffff;
  color: #0a0a42;
  font-weight: 500;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.item-card:hover {
  background: #f4f6ba;
}
.item-card.selected {
  border: 2px solid #ffffff;
}
.drag-handle {
  cursor: grab;
  margin-right: 8px;
  font-size: 1.2rem;
  color: #8c88ff;
}
.item-content {
  flex: 1;
}

.bottom-actions {
  display: flex;               /* 同一行 */
  align-items: center;         /* 垂直中线对齐 */
  gap: 12px;                   /* 按钮间距 */
  margin-top: 12px;
}

.add-item-btn {
  padding: 8px;
  font-family: 'Mantou';
  font-weight: 500;
  /* padding-right: 8px; */
  font-size: 0.9rem;
  text-align: center;
  margin-top: 12px;
  color: #0a0a52;
  display: block;
}

.add-day-btn {
  padding: 8px;
  font-family: 'Mantou';
  font-weight: 500;
  /* padding-right: 8px; */
  font-size: 0.9rem;
  text-align: center;
  margin-top: 12px;
  color: #0a0a52;
  display: block;
}


.calendar-view {
  margin-top: 24px;
  min-height: 300px;
  border: 1px solid rgba(157, 119, 119, 0.1);
  background: #fbfafb;
  border-radius: 10px;
  overflow: hidden;
  font-size: 11px;          /* 根节点缩小，整体继承 */
  --fc-small-font-size: 10px; /* FullCalendar 内部变量 */
}

/* 2. 让日历自身高度=内容高度，不出现滚动条 */
.calendar-view .fc-scrollgrid,
.calendar-view .fc-daygrid-body,
.calendar-view .fc-daygrid-body table {
  height: auto !important;
  min-height: unset !important;
}

/* 3. 去掉下方空白（FullCalendar 默认预留的“事件行”空间） */
.calendar-view .fc-daygrid-day-frame {
  padding-bottom: 0 !important;
}

/* 4. 强制隐藏可能出现的横向/纵向滚动条 */
.calendar-view .fc-scroller {
  overflow: hidden !important;
}
/* 表头（星期） */
.calendar-view .fc-col-header-cell {
  font-size: 20px;
}

/* 日期格子 */
.calendar-view .fc-daygrid-day-number {
  font-size: 20px;
}

/* 地图 & 概览摘要 */
.trip-map {
  
  flex: 1;
  position: relative;
  
}
.map-container {
  border-radius: 20px;
  width: 100%;
  height: 100%;
  background: #f1f6f3;
}
.map-tools {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.map-summary {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  background: rgba(255,255,255,0.95);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  color: #333;
}
.map-summary h4 {
  margin-top: 0;
  margin-bottom: 8px;
  color: #a8a6f7;
}
.overview-text {
  font-size: 0.95rem;
  line-height: 1.4;
}
.summary-stats {
  display: flex;
  gap: 24px;
  margin-top: 8px;
}
.summary-photos {
  margin-top: 12px;
  display: flex;
}
.summary-photos img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 8px;
}

/* 右侧 */
.el-button--small { 
  border: #a8a6f7;
}
.right-side {
  /* border-radius: 20px; */
  width: 260px;
  border-left: 1px solid rgba(246, 243, 243, 0.3);
  padding: 16px;
  border-radius: 20px;
  /* background: rgba(255,255,255,0.95); */
  overflow-y: auto;
}
.no-selection {
  text-align: center;
  margin-top: 40px;
  color: #d7cfcf;
}


.trip-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(247, 245, 247, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: radius 10px ;
  background: rgba(247, 246, 248, 0.9);
}
.trip-footer span {
  color: #200707;
}
.trip-footer .el-button {
  color: #1e1a68;
}

.right-title{
  font-family: Hou;
  font-weight: 1;
  color: #000000;
  font-size: 1.6rem;
}
.el-button--small:hover {
  background: #a3b5d9;
}
.el-button--danger {
  background: #fff;
}

.el-button--danger:hover{
  background: #d44949;
}

.el-button--success:hover{
  background: #8ed0ee;
}

.el-button--success {
  background: #fff; 
}

.el-form-item--label-top{
  color: #000003;
}

.el-form-item__content input {
  border-color: #d9f3fa;

}
#poiInput:focus {
  border-color: #eaeafa;         /* 换成你想要的颜色 */
  box-shadow: 0 0 4px 0 #dedeeb; /* 可选：光晕 */
}


</style>
