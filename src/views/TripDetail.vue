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
          <!-- <el-button size="mini" @click="saveTrip">保存</el-button> -->
          <!-- <el-button size="mini" @click="shareTrip">分享</el-button> -->
          <el-button size="mini" @click="GoDashboard">返回</el-button>
          <el-button size="mini" @click="exportVisible = true">导出</el-button>
          <el-button size="mini" @click="showPlaceSearch = true">添加地点</el-button>
        </div>
      </header>

      <div class="trip-body">
        <!-- 左侧：天数切换 / 行程项 / 日历 -->
        <aside class="left-side">
          <div class="day-switcher">
            <el-button
              v-for="day in tripDays"
              :key="day.id"
              :type="currentDay === day.day ? 'primary' : 'text'"
              @click="handleSelectDay(day.day)"         
               >
              第 {{day.day}} 天
              <el-button
                type="text"
                icon="Delete"
                size="small"
                class="del-day-btn"
                @click="onDeleteDay(day.id - 1)"
              />
            </el-button >
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
                @click="openNewItemDialog"
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
          <!-- <div class="map-tools"> -->
            <!-- <el-button icon="el-icon-zoom-in" circle @click="zoomIn" /> -->
            <!-- <el-button icon="el-icon-zoom-out" circle @click="zoomOut" /> -->
            <!-- <el-button icon="el-icon-full-screen" circle @click="fitBounds" /> -->
          <!-- </div> -->
          <div class="map-summary">
            <h4>本日概览</h4>
            <p class="overview-text">{{ dayOverviewText }}</p>
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
                <el-autocomplete
                  
                  v-model="selectedItem.name"
                  placeholder="请输入地点名称"
                  :fetch-suggestions="queryPoiSuggestions"
                  :teleported="false"
                   popper-class="poi-autocomplete-popper"
                   @select="onPoiSelect"
                   style="width: 100%"
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
              <el-form-item label="打卡状态">
                  <el-switch
                    v-model="selectedItem.visited"
                    active-text="已打卡"
                    inactive-text="未打卡"
                    @change="onVisitedChange"
                  />
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

    <el-dialog
      title="添加新行程项"
      v-model="showNewItemDialog"
      width="400px"
    >
      <el-form :model="newItemForm" label-position="top">
        <!-- <el-form-item label="名称">
          <el-input v-model="newItemForm.name" placeholder="请输入地点名称" />
        </el-form-item> -->

        <el-form-item label="名称">
          <el-autocomplete
            v-model="newItemForm.name"
            placeholder="请输入地点名称"
            :fetch-suggestions="queryPoiSuggestions"
            :trigger-on-focus="false"
            :debounce="300"
            clearable
            style="width:100%"
            @select="onPoiSelect"
          />
        </el-form-item>

        <el-form-item label="时间">
          <el-time-picker
            v-model="newItemForm.time"
            placeholder="选择时间"
            :format="'HH:mm'"           
            :value-format="'HH:mm'"    
            clearable
            ></el-time-picker>
        </el-form-item>
        <!-- <el-form-item label="时间">
          <el-input v-model="newItemForm.time" placeholder="09:00" />
        </el-form-item> -->

        <el-form-item label="备注">
          <el-input type="textarea" v-model="newItemForm.note" placeholder="备注信息" />
        </el-form-item>

        <el-form-item label="优先级">
          <el-select v-model="newItemForm.priority" placeholder="优先级">
            <el-option label="高" value="high"></el-option>
            <el-option label="中" value="medium"></el-option>
            <el-option label="低" value="low"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="add_NewItem">确认</el-button>
      </template>
    </el-dialog>

  </div>

    <!-- 1. 悬浮球 -->
  <div class="ai-float-btn" @click="openChat">
    <el-icon size="24"><ChatDotRound /></el-icon>
  </div>

  <!-- 2. 聊天弹窗 -->
  <teleport to="body">
    <transition name="fade">
      <div v-if="chatVisible" class="ai-mask" @click.self="closeChat">
        <div class="ai-window" :style="{ left: winLeft + 'px', top: winTop + 'px' }">
          <!-- 标题栏（可拖拽） -->
          <div class="ai-header" @mousedown="onMouseDown">
            <span class="ai-title">行程小助手</span>
            <el-icon class="ai-close" @click="closeChat"><Close /></el-icon>
          </div>

          <!-- 消息区 -->
          <div ref="chatBox" class="ai-body">
            <div
              v-for="(m, idx) in messages"
              :key="idx"
              :class="['ai-bubble', m.role]">
              <div class="ai-content">{{ m.content }}</div>
            </div>
            <div v-if="replying" class="ai-bubble assistant">
              <div class="ai-content">思考中…</div>
            </div>
          </div>

          <!-- 输入区 -->
          <div class="ai-footer">
            <el-input
              v-model="input"
              placeholder="输入问题，按 Enter 发送"
              :disabled="replying"
              @keyup.enter="send"
            />
            <el-button type="primary" :loading="replying" @click="send">发送</el-button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script>
import draggable from 'vuedraggable'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import { debounce } from 'lodash'  // 导入debounce
import heroTravel from '@/assets/images/27.jpg'
import heroTravel2 from '@/assets/images/12.jpg'
import heroTravel3 from '@/assets/images/13.jpg'
import heroTravel5 from '@/assets/images/19.jpg'
import PlaceSearch from './PlaceSearch.vue'
import ExportPanel from './ExportPanel.vue'
import { ChatDotRound, Close } from '@element-plus/icons-vue'
import apiClient from '@/services/apiClient'
import { 
  getTripDetail, 
  addNewDay, 
  deleteDay, 
  getDayItems, 
  addNewItem, 
  updateItem, 
  deleteItem,
} from '@/services/Trip_Service'
const AMAP_KEY = 'ca55a345ea12a37b1e00830ee7f62380'
const INPUTTIPS_URL = 'https://restapi.amap.com/v3/assistant/inputtips'

const ICON_RED   = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_rs.png'
const ICON_BLUE  = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png'
export default {
  name: 'TripDetail',
  components: {
    draggable,
    FullCalendar,
    PlaceSearch,
    ExportPanel,
    draggable, FullCalendar, PlaceSearch, ExportPanel, ChatDotRound, Close
  },
  data() {
    return {
      showNewItemDialog: false, 
      heroTravel,
      heroTravel5,
      tripId: null,
      trip: {
        title: '',
        status: '进行中',
        days: 0,


      },
      tripDays: [],
      currentDay:1,
      dayItems: [],
      newItemForm: {        // 弹窗表单数据
        name: "",
        time: "",
        note: "",
        priority: "medium",
      },
      selectedItem: null,
      lastSaved: '',
      daySummary: {
        // overview: '中轴线核心一日：天安门升旗→故宫深度游→景山俯瞰→王府井夜宵。',
        totalDistance: '7.8 km',
        totalTime: '8 小时 30 分钟',
        photos: [heroTravel, heroTravel2, heroTravel3]
      },
      calendarOptions: {//日历
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
      loading: false, // 添加加载状态
      walking: null,
      chatVisible: false,      // 弹窗显隐
      input: '',               // 当前输入
      messages: [],            // 历史消息 [{role:'user'|'assistant', content:'...'}]
      replying: false,         // 正在等待接口返回
      winLeft: 0, winTop: 0,   // 窗口定位
      dragging: false,         // 是否正在拖拽
      dragX: 0, dragY: 0       // 拖拽偏移
    }
  },

  // mounted() {
  //   this.$nextTick(() => {
  //     this.initMap()
  //     this.drawRoute()
  //   })
  // },

  async created() {
    console.log(this.$route.params.tripId)
    this.tripId = this.$route.params.tripId || 1
    await this.loadTripData()
    // await this.loadDayItems(this.currentDay)
    this.$nextTick(() => {
      this.initMap()
      this.drawRoute()
    })
  },
  computed: {


    dayOverviewText() {
      if (!this.dayItems || this.dayItems.length === 0) {
        return '暂无行程安排'
      }
      return this.dayItems
        .map(item => item.name)
        .filter(Boolean)
        .join(' → ')
    }
  },
  methods: {
    // 用户点击“第 N 天”
  async handleSelectDay(day) {
    this.currentDay = day                // 1. 更新高亮
    await this.loadDayItems(day)         // 2. 加载该天 items
  },

  // 加载某天的 items 并重新画线
  async loadDayItems(day) {
    const dayObj = this.tripDays.find(d => d.day === day)
    this.dayItems = dayObj ? dayObj.items : []
    await this.drawRoute()               // 3. 立即画线
    this.updateDayOverview()
  },
    GoDashboard(){
      this.$router.push({ name: 'Dashboard' })
    },
    onCancel() {
      this.resetNewItemForm()   // 清空
      this.showNewItemDialog = false  // 关窗
    },
    openNewItemDialog() {
    // 清空表单
      this.newItemForm = {
        name: "",
        time: "",
        note: "",
        priority: "medium",
      };
      this.showNewItemDialog = true; // 打开弹窗
    },
     // 加载行程详情
  async loadTripData() {
    console.log('loadTripData')
    console.log('tripId:', this.tripId)
    try {
      const response = await getTripDetail(this.tripId)
      // console.log(response.data)
      // console.log(response.data.days[0])
      if (1) {
        // this.trip = response.data.data
        this.trip.title=response.data.title
        // 初始化天数数组
        // this.tripDays = Array.from({ length: this.trip.days }, (_, i) => ({
        //   id: i + 1,
        //   day: i + 1,
        //   items: []
        // }))
        // console.log('trip:', 1)
      //  this.tripDays=response.data.days
       
          this.tripDays = response.data.days.map(d => ({
            id: d.day,
            day: d.day,
            items: d.items || [],
            // lnglat: d.lnglat || null
            
        }))
        this.dayItems=response.data.days[0].items
        console.log('tripDays:', this.tripDays[0].items)
        this.currentDay = this.tripDays[0]?.day || 1
        this.dayItems = this.tripDays[0]?.items || []
      }
    } catch (error) {
      console.error('加载行程失败:', error)
      this.$message.error('加载行程失败')
    }
  },
  
  // 加载某天的行程项
  async loadDayItems(day) {
    /* 1. 取天 */
    const dayObj = this.tripDays.find(d => d.day === day)
    this.dayItems = dayObj ? dayObj.items : []

    /* 2. 强制重新画线（drawRoute 里会再次反查坐标） */
    await this.drawRoute()

    /* 3. 更新概览文字 */
    this.updateDayOverview()
  },    
  // 切换天数
  changeDay(day) {
    this.currentDay = day
    const dayObj = this.tripDays.find(d => d.day === day)
    this.dayItems = dayObj ? dayObj.items : []

    this.selectedItem = null
  },
    /* 1. 初始化地图 */
    initMap() {
      const dom = this.$refs.mapContainer
      this.map = new AMap.Map(dom, {
        zoom: 5,
        center: [104.195397, 35.86166],
        resizeEnable: true
      })
      AMap.plugin(['AMap.Walking'], () => {
        this.walking = new AMap.Walking({
          map: this.map,
          hideMarkers: true,   // 我们自己画 marker
          autoFitView: false
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
    /* 4. 绘制路线（分段 Polyline） */
    async drawRoute() {
      console.log('开始绘制路线，dayItems:', this.dayItems)
    
      if (!this.map) {
        console.warn('地图未初始化')
        return
      }
    
      // 清空旧标记和路线
      this.map.remove(this.markers)
      this.markers = []
    
      if (this.polyline) {
        if (Array.isArray(this.polyline)) {
          this.polyline.forEach(p => this.map.remove(p))
        } else {
          this.map.remove(this.polyline)
        }
        this.polyline = null
      }
    
      if (!this.dayItems || this.dayItems.length === 0) {
        console.log('没有行程项可绘制')
        return
      }
    
      const validCoords = []
    
      // 获取每个地点坐标
      for (let i = 0; i < this.dayItems.length; i++) {
        const item = this.dayItems[i]
        let lnglat = null
      
        if (item.lnglat && Array.isArray(item.lnglat) && item.lnglat.length === 2) {
          lnglat = item.lnglat
        } else if (item.name) {
          lnglat = await this.getLocationByName(item.name)
          if (lnglat) {
            this.$set(this.dayItems[i], 'lnglat', lnglat)
          }
        }
      
        if (lnglat) {
          validCoords.push({ name: item.name, lnglat, idx: i })
        }
      }
    
      if (validCoords.length === 0) return
    
      // 添加标记
      // 只创建一个全局 InfoWindow
      if (!this.infoWindow) {
        this.infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -35)
        })
      }

      validCoords.forEach(({ name, lnglat, idx }) => {
        const item = this.dayItems[idx]
        const iconUrl = item.visited
          ? ICON_RED   // 已打卡 → 红色
          : ICON_BLUE    // 未打卡 → 蓝色

        const marker = new AMap.Marker({
          position: new AMap.LngLat(lnglat[0], lnglat[1]),
          title: `${idx + 1}. ${name}`,
          icon: iconUrl,
          offset: new AMap.Pixel(-10, -34),
          content: `
            <div style="
              position: relative;
              width: 30px;
              height: 42px;
              background: url(${iconUrl}) no-repeat center / contain;
            ">
              <div style="
                position: absolute;
                top: 6px;
                left: 0;
                right: 0;
                text-align: center;
                color: #fff;
                font-size: 13px;
                font-weight: bold;
                text-shadow: 0 0 3px rgba(0,0,0,0.6);
                pointer-events: none;
              ">
                ${idx + 1}
              </div>
            </div>
          `
        })
      
        // ⭐ 点击 marker 显示 InfoWindow
        marker.on('click', () => {
          const priorityMap = {
            high: '高',
            medium: '中',
            low: '低'
          }
        
          const infoHtml = `
            <div style="padding:10px;max-width:220px;font-size:14px;">
              <h3 style="margin:0 0 6px 0;">${idx + 1}. ${item.name}</h3>
              <p><b>时间：</b>${item.time || '--'}</p>
              <p><b>优先级：</b>${priorityMap[item.priority] || '--'}</p>
              <p><b>状态：</b>${item.visited ? '已打卡' : '未打卡'}</p>
              <p><b>备注：</b>${item.note || '--'}</p>
            </div>
          `
          
          this.infoWindow.setContent(infoHtml)
          this.infoWindow.open(this.map, marker.getPosition())
        })
      
        this.markers.push(marker)
        this.map.add(marker)
      })


      // 绘制分段路线
      if (validCoords.length > 1) {
        const segments = []
        for (let i = 0; i < validCoords.length - 1; i++) {
          const segResult = await new Promise((resolve) => {
            this.walking.search(validCoords[i].lnglat, validCoords[i + 1].lnglat, (status, result) => {
              if (status === 'complete' && result.routes?.length) {
                resolve(result.routes[0])
              } else {
                resolve(null)
              }
            })
          })
          if (segResult) segments.push(segResult)
        }
      
        // 每段生成独立 polyline
        const colors = ['#6262f3', '#f36f6f', '#6fcfff', '#d88cff', '#ffd86f']
        this.polyline = []
        segments.forEach((seg, idx) => {
          const path = []
          seg.steps.forEach(step => {
            step.path.forEach(p => path.push([p.lng, p.lat]))
          })
          const line = new AMap.Polyline({
            path,
            strokeColor: colors[idx % colors.length],
            strokeWeight: 6,
            strokeOpacity: 0.8
          })
          this.map.add(line)
          this.polyline.push(line)
        })
      
        // 更新总距离和时间
        const totalDistance = segments.reduce((sum, s) => sum + s.distance, 0)
        const totalTime = segments.reduce((sum, s) => sum + s.time, 0)
        this.daySummary.totalDistance = (totalDistance / 1000).toFixed(2) + ' km'
        this.daySummary.totalTime = Math.round(totalTime / 60) + ' 分钟'
      }
    
      // 调整视野
      const mapObjects = [...this.markers]
      if (this.polyline) {
        if (Array.isArray(this.polyline)) mapObjects.push(...this.polyline)
        else mapObjects.push(this.polyline)
      }
      if (mapObjects.length > 0) this.map.setFitView(mapObjects, false, [60, 60, 60, 60])
    
      console.log('路线绘制完成')

    },
    async planRouteWithWalking(coords) {
        return new Promise((resolve, reject) => {
          if (!this.walking || coords.length < 2) {
            resolve(null)
            return
          }
        
          let totalDistance = 0
          let totalTime = 0
          const path = []
        
          const searchNext = (index) => {
            if (index >= coords.length - 1) {
              resolve({ path, totalDistance, totalTime })
              return
            }
          
            this.walking.search(
              coords[index],
              coords[index + 1],
              (status, result) => {
                if (status !== 'complete' || !result.routes?.length) {
                  reject(result)
                  return
                }
              
                const route = result.routes[0]
                totalDistance += route.distance
                totalTime += route.time
              
                route.steps.forEach(step => {
                  step.path.forEach(p => {
                    path.push([p.lng, p.lat])
                  })
                })
              
                searchNext(index + 1)
              }
            )
          }
        
          searchNext(0)
        })
    },

    async saveItem() {
      if (!this.selectedItem) return

      try {
        this.loading = true
      
        // ⭐ 核心：名称一旦存在，就重新获取坐标
        if (this.selectedItem.name && this.selectedItem.name.trim()) {
          const lnglat = await this.getLocationByName(this.selectedItem.name)
          this.selectedItem.lnglat = lnglat
        }
      
        // 更新 dayItems
        const idx = this.dayItems.findIndex(i => i.id === this.selectedItem.id)
        if (idx > -1) {
          this.dayItems.splice(idx, 1, { ...this.selectedItem })
        }
      
        await this.drawRoute()
      
        this.lastSaved = new Date().toLocaleString()
        this.$message?.success('已保存')
      } finally {
        this.loading = false
      }
    },
       /* ====== 名称输入提示 ====== */
    queryPoiSuggestions(queryStr, cb) {
      if (!queryStr || !queryStr.trim()) {
        cb([])
        return
      }

      // 清理旧 script
      if (this._poiScript) {
        document.head.removeChild(this._poiScript)
        delete this._poiScript
      }

      const cbName = '_poiCb_' + Date.now()

      window[cbName] = (data) => {
        const list =
          data.status === '1' && data.tips
            ? data.tips.map(t => ({
                value: t.name,
                location: t.location    // 顺便带上坐标
              }))
            : []

        cb(list)

        delete window[cbName]
        document.head.removeChild(this._poiScript)
        delete this._poiScript
      }

      this._poiScript = document.createElement('script')
      this._poiScript.src = `${INPUTTIPS_URL}?key=${AMAP_KEY}&keywords=${encodeURIComponent(
        queryStr.trim()
      )}&datatype=all&callback=${cbName}`
      document.head.appendChild(this._poiScript)
    },
      /* ====== 选中某个 POI ====== */
      async onPoiSelect(item) {
        if (!this.selectedItem) return

        this.selectedItem.name = item.value

        // ⭐ inputtips 的 location 是字符串 "lng,lat"
        if (item.location) {
          const [lng, lat] = item.location.split(',').map(Number)
          this.selectedItem.lnglat = [lng, lat]
          this.map.setCenter([lng, lat])
          await this.drawRoute()
          return
        }
      
        // 兜底
        const lnglat = await this.getLocationByName(item.value)
        this.selectedItem.lnglat = lnglat
        await this.drawRoute()
      },
    onVisitedChange(val) {
      if (!this.selectedItem) return
      const idx = this.dayItems.findIndex(i => i.id === this.selectedItem.id)
      if (idx > -1) {
        this.dayItems.splice(idx, 1, { ...this.selectedItem })
      }
    
      // ⭐ 重新绘制地图（InfoWindow 内容才会更新）
      this.drawRoute()
    },




    /* 7. 其他方法（保持不变） */
    saveTrip() {
      this.lastSaved = new Date().toLocaleString()
      console.log('保存行程')
    },
    
    shareTrip() {
      console.log('分享行程')
    },
        
  // 添加新的一天
  async addNewDay() {
    try {
      const newDayNum = this.tripDays.length + 1
      const response = await addNewDay(this.tripId, newDayNum)
      
      if (response.data.success) {
        this.tripDays.push({
          id: newDayNum,
          day: newDayNum,
          items: []
        })
        this.currentDay = newDayNum
        this.$message.success('新的一天已添加')
      }
    } catch (error) {
      console.error('添加新天失败:', error)
      this.$message.error('添加失败')
    }
  },    
  // 删除某一天
  async onDeleteDay(dayIndex) {
      const dayId = dayIndex + 1

      await this.$confirm(`确定删除第 ${dayId} 天？`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })

      /* 1. 先调接口 */
      const response = await deleteDay(this.tripId, dayId)
      if (!response.data.success) return

      /* 2. 前端兜底：把该条 items 清成 [] 再删整条 */
      this.tripDays[dayIndex].items = []          // 先清空
      this.tripDays.splice(dayIndex, 1)           // 再剔掉该天对象

      /* 3. 后续天数 day 值前移 1 */
      for (let i = dayIndex; i < this.tripDays.length; i++) {
        this.tripDays[i].day -= 1
      }

      /* 4. 修正当前选中天 */
      if (this.currentDay === dayId) {
        this.currentDay = Math.max(1, dayId - 1)
      } else if (this.currentDay > dayId) {
        this.currentDay -= 1
      }

      /* 5. 重新拉该天数据（后端此时即使把孤儿 items 归到别天，也会被过滤掉） */
      await this.loadDayItems(this.currentDay)

      this.$message.success('删除成功')
    },
  // 添加新行程项
  //   async add_NewItem() {
  //   try {
  //     const newItem = {
  //       name: this.newItemForm.name,
  //       time: this.newItemForm.time,
  //       note: this.newItemForm.note,
  //       priority: this.newItemForm.priority,
  //     }
      
  //     const response = await addNewItem(this.tripId, this.currentDay, newItem)
      
  //     if (1) {
  //       const itemId = response.data.data.itemId
  //       newItem.id = itemId.toString()
  //       newItem.visited = false
        
  //       this.dayItems.push(newItem)
  //       this.selectedItem = newItem
        
  //       this.$message.success('行程项已添加')
  //     }
  //   } catch (error) {
  //     console.error('添加行程项失败:', error)
  //     this.$message.error('添加失败')
  //   }
  // },
  async add_NewItem() {
      // 1️⃣ 构建新行程项数据
      const newItem = {
        name: this.newItemForm.name,
        time: this.newItemForm.time,
        note: this.newItemForm.note,
        priority: this.newItemForm.priority,
      }
      if (newItem.name?.trim()) {
        newItem.lnglat = await this.getLocationByName(newItem.name)
      }
      // 2️ 调用后端接口添加
      const response = await addNewItem(this.tripId, this.currentDay, newItem)
      console.log('添加行程项响应数据:', response)
      console.log('添加行程项响应数据:', response.data)
      console.log('添加行程项响应数据:', response.data.itemId)
      // 3️ 检查返回结果
      console.log('【4】真的要取 itemId 了', response.data?.itemId)
      const itemId = response.data?.itemId
      if (itemId) {
        // const itemId = response.data.data.itemId
        newItem.id = itemId.toString()
        newItem.visited = false

        // 5️ 同步更新 tripDays 对应天的 items（保证 dayItems 与 tripDays[currentDay-1].items 一致）
        const dayObj = this.tripDays.find(d => d.day === this.currentDay)
        if (dayObj) {
          dayObj.items.push(newItem)
          console.log('【5】tripDays[currentDay-1].items:', dayObj.items)
        }

        // 6️ 设置右侧编辑栏选中
        this.selectedItem = newItem
        
        

        // 7️ 关闭弹窗
        this.showNewItemDialog = false

        // 8️ 成功提示
        this.$message.success('行程项已添加')

        // 9️ 可选：重新绘制地图路线
        await this.drawRoute()
        // resetNewItemForm()
      } else {
        this.$message.error('添加行程项失败，请稍后重试')
      }
  },
  resetNewItemForm() {
    this.newItemForm = {
      name: '',
      time: '',
      note: '',
      priority: 'medium',
    }
  },

    // 保存行程项
  async saveItem() {
    if (!this.selectedItem) return
    
    try {
      const itemData = {
        name: this.selectedItem.name,
        time: this.selectedItem.time,
        note: this.selectedItem.note || '',
        priority: this.selectedItem.priority,
        lnglat: this.selectedItem.lnglat
      }
      
      // 如果有坐标，确保发送正确的格式
      if (itemData.lnglat && Array.isArray(itemData.lnglat)) {
        itemData.lnglat = [itemData.lnglat[0], itemData.lnglat[1]]
      }
      
      const response = await updateItem(
        this.tripId,
        this.currentDay,
        this.selectedItem.id,
        itemData
      )
      
      if (response.data.success) {
        // 更新本地数据
        const index = this.dayItems.findIndex(item => item.id === this.selectedItem.id)
        if (index !== -1) {
          this.dayItems[index] = { ...this.selectedItem }
        }
        
        // 重新绘制路线
        await this.drawRoute()
        
        this.lastSaved = new Date().toLocaleString()
        this.$message.success('保存成功')
      }
    } catch (error) {
      console.error('保存失败:', error)
      this.$message.error('保存失败')
    }
  },
    // 删除行程项
    async removeItem() {
    if (!this.selectedItem) return
    
    try {
      await this.$confirm('确定删除这个行程项？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
      
      const response = await deleteItem(
        this.tripId,
        this.currentDay,
        this.selectedItem.id
      )
      
      if (response.data.success) {
        this.dayItems = this.dayItems.filter(item => item.id !== this.selectedItem.id)
        this.selectedItem = null
        
        await this.drawRoute()
        this.$message.success('删除成功')
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败:', error)
        this.$message.error('删除失败')
      }
    }
  },
  
    selectItem(item) { 
      this.selectedItem = item
    },
    
    async removeItem() {
      this.dayItems = this.dayItems.filter(i => i.id !== this.selectedItem.id)
      this.selectedItem = null
      await this.drawRoute()
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
    },
    openChat() {
      this.chatVisible = true
      // 初始化位置（居中）
      this.winLeft = (window.innerWidth - 400) / 2
      this.winTop = (window.innerHeight - 600) / 2
      // 欢迎语
      if (!this.messages.length) {
        this.messages.push({
          role: 'assistant',
          content: '你好！我是行程小助手，可以帮你推荐附近好玩的、好吃的，或者调整路线。请问有什么需要？'
        })
      }
      this.$nextTick(() => this.scrollBottom())

    },
    closeChat() {
      this.chatVisible = false
    },
    async send() {
  const q = this.input.trim()
  if (!q || this.replying) return

  // 用户消息入队
  this.messages.push({ role: 'user', content: q })
  this.input = ''
  this.replying = true
  this.$nextTick(() => this.scrollBottom())

  // 添加生成中提示
  const typingIndex = this.messages.push({ role: 'assistant', content: 'AI 正在生成中...' }) - 1
  this.$nextTick(() => this.scrollBottom())

  try {
    console.log('即将请求 AI 接口:', '/v3/assistants/chat')
    console.log('请求体 messages:', q)

    // 发送请求，统一格式为数组对象
    const res = await apiClient.post('/v3/assistants/chat', {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: q }],
      stream: false
    }, {
      timeout: 60000 // 延长超时，支持长文本
    })

    const json = res.data
    console.log('接口返回:', json)

    // 移除生成中提示
    this.messages.splice(typingIndex, 1)

    if (json.success) {
      this.messages.push({ role: 'assistant', content: json.data })
    } else {
      this.messages.push({
        role: 'assistant',
        content: '抱歉，出错了：' + (json.message || '未知错误')
      })
    }
  } catch (e) {
    console.error('请求失败:', e)
    // 移除生成中提示
    this.messages.splice(typingIndex, 1)

    if (e.code === 'ECONNABORTED') {
      this.messages.push({ role: 'assistant', content: '请求超时，请稍后再试' })
    } else if (e.response && e.response.status === 400) {
      this.messages.push({ role: 'assistant', content: '请求格式错误，请检查输入内容' })
    } else if (e.response && e.response.status >= 500) {
      this.messages.push({ role: 'assistant', content: '服务器内部错误，请稍后再试' })
    } else {
      this.messages.push({ role: 'assistant', content: '网络错误，请稍后再试' })
    }
  } finally {
    this.replying = false
    this.$nextTick(() => this.scrollBottom())
  }
},
async send() {
  const q = this.input.trim()
  if (!q || this.replying) return

  this.messages.push({ role: 'user', content: q })
  this.input = ''
  this.replying = true
  this.$nextTick(() => this.scrollBottom())

  try {
    const res = await apiClient.post('/v3/assistants/chat', {
      model: 'deepseek-chat',
      messages: q,
      stream: false
    })
    const content = res.data
    console.log('接口返回内容:', content)

    // 1. 先放一条空消息
    const assistantMessage = { role: 'assistant', content: '' }
    this.messages.push(assistantMessage)

    // 2. 打字机：只改 content，不再 push
    let i = 0
    const timer = setInterval(() => {
      if (i >= content.length) return clearInterval(timer)
      assistantMessage.content += content.slice(i, i + 2)
      i += 2
      this.$nextTick(() => this.scrollBottom())
    }, 30)
  } catch (e) {
    console.error(e)
    this.messages.push({
      role: 'assistant',
      content: e.code === 'ECONNABORTED' ? '请求超时' : '网络错误，请稍后再试'
    })
  } finally {
    this.replying = false
    this.$nextTick(() => this.scrollBottom())
  }
},
    scrollBottom() {
      const box = this.$refs.chatBox
      if (box) box.scrollTop = box.scrollHeight
    },
    onMouseDown(e) {
      this.dragging = true
      this.dragX = e.clientX - this.winLeft
      this.dragY = e.clientY - this.winTop
      const move = (ev) => {
        if (!this.dragging) return
        this.winLeft = ev.clientX - this.dragX
        this.winTop = ev.clientY - this.dragY
      }
      const up = () => {
        this.dragging = false
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', up)
      }
      window.addEventListener('mousemove', move)
      window.addEventListener('mouseup', up)
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
  position: fixed;
  inset: auto 0 0 0;
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
.poi-autocomplete-popper {
  z-index: 20000;
}

.el-autocomplete {
  width: 100%;
}

/* 悬浮球 */
.ai-float-btn{
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #16474a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
  z-index: 2000;
  transition: transform .2s;
}
.ai-float-btn:hover{ transform: scale(1.1); }

/* 遮罩 */
.ai-mask{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fade-enter-active, .fade-leave-active{ transition: opacity .2s; }
.fade-enter-from, .fade-leave-to{ opacity: 0; }

/* 聊天窗口 */
.ai-window{
  position: center;
  width: 800px;
  height: 600px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(124, 38, 38, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.ai-header{
  height: 48px;
  background: #cedfe0;
  color: #3b2f2f;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  cursor: move;
  user-select: none;
}
.ai-title{ font-size: 16px; }
.ai-close{ cursor: pointer; font-size: 20px; }

/* 消息区 */
.ai-body{
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;
  background: #ffffff;
}
.ai-bubble{ margin-bottom: 12px; display: flex; }
.ai-bubble.user{ justify-content: flex-end; }
.ai-bubble.assistant{ justify-content: flex-start; }
.ai-content{
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  line-height: 1.4;
  font-size: 14px;
  white-space: pre-wrap;
}
.ai-bubble.user .ai-content{ background: #6eb8d4; color: #ffffff; }
.ai-bubble.assistant .ai-content{ background: #cbe5f8; color: #6f9281; }

/* 输入区 */
.ai-footer{
  display: flex;
  padding: 12px;
  border-top: 1px solid #fcfcfc;
  background: #ffffff;
}
.ai-footer .el-input{ flex: 1; margin-right: 8px; }

</style>
