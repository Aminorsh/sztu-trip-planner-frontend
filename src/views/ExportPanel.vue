<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="visible" class="export-overlay" @click.self="onCancel">
        <div class="export-panel">
          <!-- 标题 + 关闭按钮 -->
          <div class="panel-header">
            <h3>导出行程</h3>
            <button class="btn-close" @click="onCancel">×</button>
          </div>

          <div class="panel-body">
            <!-- 导出格式选择 -->
            <section class="option-section">
              <h4>导出格式</h4>
              <el-radio-group v-model="selectedFormat">
                <el-radio-button label="pdf">PDF</el-radio-button>
                <el-radio-button label="image">图片</el-radio-button>
                <el-radio-button label="kml">KML</el-radio-button>
                <el-radio-button label="ics">ICS</el-radio-button>
              </el-radio-group>
            </section>

            <!-- 附加选项 -->
            <section class="option-section">
              <h4>附加选项</h4>
              <el-checkbox v-model="options.includeFootprint">包含足迹轨迹</el-checkbox>
              <el-checkbox v-model="options.includeMarkers">包含地点标注</el-checkbox>
              <el-checkbox v-model="options.includeMap">包含地图底图</el-checkbox>
              <el-checkbox v-model="options.includeCover">包含封面页</el-checkbox>
            </section>

            <!-- 预览缩略图 -->
            <section v-if="previewUrl" class="preview-section">
              <h4>预览</h4>
              <img :src="previewUrl" alt="预览缩略图" class="preview-img" />
            </section>

            <!-- 导出按钮 + 状态提示 -->
            <div class="action-row">
              <el-button
                type="primary"
                :disabled="isExporting"
                @click="onExport"
              >
                {{ isExporting ? "导出中…" : "导出" }}
              </el-button>
              <span class="status-text">{{ statusText }}</span>
            </div>

            <!-- 成功后下载链接或错误重试 -->
            <div class="result-row" v-if="exportUrl">
              <el-button type="link" @click="downloadExport">下载导出文件</el-button>
              <el-button v-if="exportError" type="text" @click="onExport">重试</el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { ref, reactive, watch } from 'vue'

export default {
  name: 'ExportPanel',
  props: {
    modelValue: {           // 支持 v-model
      type: Boolean,
      default: false
    },
    tripData: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue', 'exported'],
  setup(props, { emit }) {
    const visible = ref(props.modelValue)
    const selectedFormat = ref('pdf')
    const options = reactive({
      includeFootprint: true,
      includeMarkers: true,
      includeMap: true,
      includeCover: true
    })

    const isExporting = ref(false)
    const exportUrl = ref('')
    const previewUrl = ref('')
    const exportError = ref(null)
    const statusText = ref('')

    // 监听 prop 变化，更新 local visible
    watch(
      () => props.modelValue,
      (newVal) => {
        visible.value = newVal
        if (newVal) resetState()
      }
    )
    // 监听 local visible 变化，向父组件发出更新
    watch(visible, (newVal) => {
      emit('update:modelValue', newVal)
    })

    function resetState() {
      selectedFormat.value = 'pdf'
      options.includeFootprint = true
      options.includeMarkers = true
      options.includeMap = true
      options.includeCover = true
      isExporting.value = false
      exportUrl.value = ''
      previewUrl.value = ''
      exportError.value = null
      statusText.value = ''
    }

    function onCancel() {
      visible.value = false
    }

    async function onExport() {
      if (isExporting.value) return
      isExporting.value = true
      statusText.value = '正在生成导出文件…'
      exportError.value = null
      exportUrl.value = ''
      previewUrl.value = ''

      try {
        const payload = {
          format: selectedFormat.value,
          options: { ...options },
          trip: props.tripData
        }
        const resp = await fakeExportApi(payload)
        exportUrl.value = resp.url
        previewUrl.value = resp.preview
        statusText.value = '导出成功'
        emit('exported', resp)
      } catch (err) {
        console.error('导出失败', err)
        exportError.value = err
        statusText.value = '导出失败，请重试'
      } finally {
        isExporting.value = false
      }
    }

    function downloadExport() {
      if (!exportUrl.value) return
      const link = document.createElement('a')
      link.href = exportUrl.value
      link.download = `trip_export.${selectedFormat.value}`
      link.click()
    }

    function fakeExportApi(payload) {
      // 模拟网络请求
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            url: 'https://example.com/download/trip_export.pdf',
            preview: 'https://via.placeholder.com/300x200.png?text=Preview'
          })
        }, 2000)
      })
    }

    return {
      visible,
      selectedFormat,
      options,
      isExporting,
      exportUrl,
      previewUrl,
      exportError,
      statusText,
      onCancel,
      onExport,
      downloadExport
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
.export-overlay {
  font-family: 'Mantou';
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
.export-panel {
  width: 480px;
  max-width: 90%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0,0,0,0.12);
  overflow: hidden;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #f4f4ff;
}
.panel-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #342dae;
}
.btn-close {
  font-size: 1.4rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #888;
}
.panel-body {
  padding: 20px 24px;
}
.option-section {
  margin-bottom: 20px;
}
.option-section h4 {
  font-size: 1.1rem;
  color: #342dae;
  margin-bottom: 8px;
}
.preview-section {
  text-align: center;
  margin-bottom: 20px;
}
.preview-img {
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.action-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}
.status-text {
  color: #666;
  font-size: 0.9rem;
}
.result-row {
  padding-top: 8px;
  border-top: 1px solid #eee;
}
.result-row .el-button {
  padding: 0;
}
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: all 0.25s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>

