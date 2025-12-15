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
          <!-- <el-button size="mini" @click="openSettings">设置</el-button> -->
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
            <!-- 删除该天 -->
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
            <!-- <el-button type="text" class="add-item-btn" @click="addNewItem"> -->
              <!-- + 添加行程项 -->
            <!-- </el-button> -->
            <!--  day-items 列表下方  -->
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
          <div class="map-container" ref="mapContainer">
            <!-- 如果地图未接入，临时用一张背景做占位 -->
            <!-- <div class="bg-image" :style="{ backgroundImage: `url(${heroTravel5})` }"></div> -->
          </div>
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
                <el-input v-model="selectedItem.name" />
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
        { id: 'b1-1', name: '天安门广场',   time: '08:00', note: '升旗仪式，建议提前 30 min 到', priority: '高' },
        { id: 'b1-2', name: '故宫博物院',   time: '09:30', note: '提前网上购票，午门进神武门出', priority: '高' },
        { id: 'b1-3', name: '景山公园',     time: '14:00', note: '登顶万春楼俯瞰紫禁城全景', priority: '中' },
        { id: 'b1-4', name: '王府井步行街', time: '17:30', note: '老字号小吃+伴手礼', priority: '低' }
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
          { title: '浅草寺', date: '2025-06-01', backgroundColor: '#6262f3', borderColor: '#6262f3' },
          { title: '秋叶原漫步', date: '2025-06-02', backgroundColor: '#ff6f6f', borderColor: '#6262f3' },
          { title: '银座午餐', date: '2025-06-03', backgroundColor: '#6fcfff', borderColor: '#6262f3' },
          { title: '东京塔夜景', date: '2025-06-04', backgroundColor: '#d88cff', borderColor: '#6262f3' },
          { title: '涉谷步行', date: '2025-06-05', backgroundColor: '#ffd86f', borderColor: '#6262f3' }
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
      map: null,                  // AMap.Map 实例
      polyline: null,             // 路线折线实例
      markers: []                 // 所有点标记
      
    }
  },

  mounted() {
  this.$nextTick(() => {
    this.initMap()              // DOM 渲染完再初始化
  })
  },

  methods: {

    /* 1. 初始化地图 */
    initMap() {
      const dom = this.$refs.mapContainer
      this.map = new AMap.Map(dom, {
        zoom: 11,
        center: [116.397428, 39.90923],   // 默认北京天安门
        resizeEnable: true
      })
      this.drawRoute()              // 画点+连线
    },

    /* 2. 根据 dayItems 画 marker + 连线 */
    drawRoute() {
      if (!this.map) return

      // 先清掉上一次
      this.map.remove(this.markers)
      this.markers = []
      if (this.polyline) this.map.remove(this.polyline)

      // 这里只演示「写死坐标」，实际项目请调高德 GeoCoder 把地址→经纬度
      const coords = this.dayItems.map((item, idx) => {
        // 示例：提前准备好常去景点的坐标
        const coordMap = {
          '天安门广场': [116.397428, 39.90923],
          '故宫博物院': [116.397731, 39.916485],
          '景山公园': [116.391467, 39.925929],
          '王府井步行街': [116.413384, 39.913312],
          '八达岭长城': [116.023773, 40.36488],
          '明十三陵': [116.235774, 40.292098],
          '颐和园': [116.275525, 39.999838],
          '圆明园': [116.309334, 40.008222],
          '天坛公园': [116.407386, 39.882652],
          '南锣鼓巷': [116.403169, 39.937736],
          '鸟巢': [116.397515, 39.992838],
          '水立方': [116.390132, 39.993854]
        }
        const lnglat = coordMap[item.name] || [116.397428, 39.90923] // 找不到就默认天安门
        return { name: item.name, lnglat, idx }
      })

      // 画 marker
      coords.forEach(({ name, lnglat, idx }) => {
        const marker = new AMap.Marker({
          position: new AMap.LngLat(...lnglat),
          title: `${idx + 1}. ${name}`,
          label: { content: `${idx + 1}`, direction: 'center' }
        })
        this.markers.push(marker)
      })
      this.map.add(this.markers)

      // 画折线
      this.polyline = new AMap.Polyline({
        path: coords.map(i => i.lnglat),
        strokeColor: '#6262f3',
        strokeWeight: 5,
        strokeOpacity: 0.8,
        lineJoin: 'round'
      })
      this.map.add(this.polyline)

      // 自动缩放到所有点可见
      this.map.setFitView([...this.markers, this.polyline], false, [40, 40, 40, 40])
    },

    /* 3. 以后每次增删改 dayItems 后重新绘制 */
    refreshMap() {
      this.drawRoute()
    },
    saveTrip() {
      this.lastSaved = new Date().toLocaleString()
      console.log('保存行程')
    },
    shareTrip() {
      console.log('分享行程')
    },
    openSettings() {
      console.log('打开设置')
    },
    addNewItem() {
      const newId = `item${Date.now()}`
      this.dayItems.push({ id: newId, name: '', time: '', note: '', priority: '低' })
    },
    addNewDay() {
      // 1. 天数 +1
      this.tripDays += 1

      // 2. 自动切换到最后一天（可选）
      this.currentDay = this.tripDays

      // 3. 为新的一天准备空数组（若 dayItems 是按天分的对象/数组）
      //    这里假设你只有一份 dayItems，想新建可再 push 空数组
      //    如果 dayItems 已经是“按天”结构，请按你数据结构 push
      // 示例：dayItems 空数组，用户后续再添加具体项
      // this.dayItems.push([])   // 若 dayItems 是二维数组

      // 4. 可选：滚动到底部
      this.$nextTick(() => {
      const list = this.$el.querySelector('.items-list')
      if (list) list.scrollTop = list.scrollHeight
      })
    },
    onDeleteDay(index) {
      // 至少留 1 天
      if (this.tripDays <= 1) return

      this.$confirm(`确定删除第 ${index + 1} 天？`, '提示', {
        confirmButtonText: '删',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tripDays -= 1
        // 如果当前正在删除这一天，就切到前一天
        if (this.currentDay === index + 1) {
          this.currentDay = Math.max(1, index)
        } else if (this.currentDay > index + 1) {
        // 删除的是前面的天，当前 day 序号-1
          this.currentDay -= 1
        }
       }).catch(() => {})
    },
    selectItem(item) {
      this.selectedItem = item
    },
    saveItem() {
      if (!this.selectedItem) return;

      // 1. 写回 dayItems
      const idx = this.dayItems.findIndex(i => i.id === this.selectedItem.id);
      if (idx > -1) this.dayItems.splice(idx, 1, { ...this.selectedItem });

      // 2. 刷新地图
      this.refreshMap();

      // 3. 更新保存时间
      this.lastSaved = new Date().toLocaleString();

      // 4. 用户提示
      this.$message?.success?.('已保存') || console.log('已保存');
    },
    removeItem() {
      this.dayItems = this.dayItems.filter(i => i.id !== this.selectedItem.id)
      this.selectedItem = null
      this.refreshMap()          // <-- 重绘
    },
    markVisited() {
      console.log('打卡 / 完成', this.selectedItem)
    },
    zoomIn() {
      console.log('地图放大')
    },
    zoomOut() {
      console.log('地图缩小')
    },
    fitBounds() {
      console.log('地图自适应')
    },
    optimizeRoute() {
      console.log('优化路线')
    },
    onCalendarDateClick(arg) {
      this.selectedDate = arg.dateStr
      console.log('点击日历日期：', arg.dateStr)
    },
    onPlaceAdded(place) {
      const newItem = {
        id: 'p' + Date.now(),
        name: place.name,
        time: '',
        note: place.description,
        priority: '中'
      }
      this.dayItems.push(newItem)
      this.showPlaceSearch = false
      this.refreshMap()          // <-- 重绘
    },
    handleExported(exportResult) {
      console.log('收到导出结果：', exportResult)
      // 如果需要关闭弹窗可以设 exportVisible = false
      this.exportVisible = false
    }
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





</style>
