<!-- src/views/Profile.vue -->
<template>
  <!-- <div class="bg-image" :style="{ backgroundImage: `url(${heroTravel})` }"></div> -->
  <div class="profile-page">
    
    <!-- 顶部导航栏 -->
    <header class="profile-header">
      <div class="container header-inner">
        <div class="logo">TravelPlanner</div>
        <nav class="nav-menu">
          <el-button type="text" class="nav-btn" @click="goHome">首页</el-button>
          <el-button type="text" class="nav-btn" @click="goDashboard">我的行程</el-button>
          <el-button type="text" class="nav-btn" @click="goProfile" disabled>资料 / 设置</el-button>
        </nav>
        <div class="auth-buttons">
          <el-button class="btn-small btn-soft" @click="onLogout">退出登录</el-button>
        </div>
      </div>
    </header>

    <!-- 主体内容区 -->
    <section class="profile-content container">
      <h2 class="section-title">个人资料设置</h2>

      <!-- 个人资料编辑表单 -->
      <el-form :model="profile" ref="profileForm" label-position="top" class="form-section">
        <!-- 头像上传 -->
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarChange"
          >
            <img v-if="profile.avatar" :src="getFullAvatarUrl(profile.avatar)" class="avatar-img" alt="avatar" />
            <el-icon v-else class="avatar-placeholder"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item label="昵称" prop="display_name">
          <el-input v-model="profile.display_name" placeholder="请输入昵称" />
        </el-form-item>

        <!-- 简介 -->
        <el-form-item label="个人简介">
          <el-input
            type="textarea"
            v-model="profile.bio"
            placeholder="一句话介绍自己"
            :rows="3"
          />
        </el-form-item>

        <!-- 保存 / 取消按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSaveProfile" :loading="loadingProfile">保存资料</el-button>
          <el-button @click="onCancelProfile">取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 密码修改 -->
      <h2 class="section-title">修改密码</h2>
      <div class="form-section">
        <p style="margin-bottom: 16px; color: #606266;">为了账户安全，请在专门的页面修改密码</p>
        <el-button type="primary" @click="goToChangePassword">前往修改密码</el-button>
      </div>

      <!-- 通知 / 推送偏好设置 -->
      <!-- <h2 class="section-title">通知 & 推送偏好</h2> -->
      <!-- <el-form :model="preferences" label-position="top" class="form-section"> -->
        <!-- <el-form-item> -->
          <!-- <el-switch v-model="preferences.emailNotifications" active-text="邮箱通知" inactive-text="关闭邮箱通知" /> -->
        <!-- </el-form-item> -->
        <!-- <el-form-item> -->
          <!-- <el-switch v-model="preferences.pushNotifications" active-text="移动推送" inactive-text="关闭推送" /> -->
        <!-- </el-form-item> -->
        <!-- <el-form-item> -->
          <!-- <el-button type="primary" @click="onSavePreferences" :loading="loadingPref">保存偏好</el-button> -->
        <!-- </el-form-item> -->
      <!-- </el-form> -->

      <!-- 隐私 / 分享默认设置 -->
      <!-- <h2 class="section-title">隐私 & 分享默认设置</h2> -->
      <!-- <el-form :model="privacy" label-position="top" class="form-section"> -->
        <!-- <el-form-item label="默认行程分享状态"> -->
          <!-- <el-radio-group v-model="privacy.defaultShareStatus"> -->
            <!-- <el-radio label="public">公开</el-radio> -->
            <!-- <el-radio label="private">仅自己可见</el-radio> -->
          <!-- </el-radio-group> -->
        <!-- </el-form-item> -->
        <!-- <el-form-item> -->
          <!-- <el-button type="primary" @click="onSavePrivacy" :loading="loadingPrivacy">保存隐私设置</el-button> -->
        <!-- </el-form-item> -->
      <!-- </el-form> -->

      <!-- 删除账号按钮 -->
      <!-- <section class="danger-section"> -->
        <!-- <h2 class="section-title danger-title">删除账号</h2> -->
        <!-- <el-button type="danger" @click="onDeleteAccount">删除帐号</el-button> -->
      <!-- </section> -->

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
        <div class="footer-copyright">
          © 2025 TravelPlanner 保留所有权利
        </div>
      </div>
    </footer>

  </div>
</template>


<script>
// 引入 Element Plus 组件
import { ElButton, ElInput, ElUpload, ElForm, ElFormItem, ElSwitch, ElRadioGroup, ElRadio, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getProfile, updateProfile, updateAvatar } from '@/services/userService'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import { getFullAvatarUrl, triggerAvatarUpdate } from '@/utils/avatarUtils'

export default {
  name: 'Profile',
  setup() {
    const { doLogout } = useAuth()
    const router = useRouter()
    const loadingProfile = ref(false)
    const profile = reactive({
      avatar: '',
      display_name: '',
      bio: ''
    })



    const fetchProfile = async () => {
      try {
        const res = await getProfile()
        Object.assign(profile, {
          avatar: res.data.avatar_url || '',
          display_name: res.data.display_name || '',
          bio: res.data.bio || ''
        })
      } catch (err) {
        ElMessage.error('获取个人信息失败：' + err.message)
      }
    }

    onMounted(fetchProfile)

    const handleAvatarChange = async (uploadFile) => {
      const file = uploadFile.raw
      if (!file) return
      
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJpgOrPng) {
        ElMessage.error('只能上传 JPG/PNG 格式头像!')
        return
      }
      if (!isLt2M) {
        ElMessage.error('头像大小不能超过2MB!')
        return
      }
      
      try {
        console.log('开始上传头像，文件:', file.name)
        const res = await updateAvatar(file)
        console.log('头像上传响应:', res)
        // 后端返回结构: {success: true, data: {avatar_url: "..."}}
        if (res.success && res.data?.avatar_url) {
          profile.avatar = res.data.avatar_url
          ElMessage.success('头像更新成功')
          
          // 触发全局头像更新事件，通知其他页面刷新头像
          triggerAvatarUpdate(res.data.avatar_url)
        } else {
          ElMessage.error('头像更新失败：响应数据格式错误')
        }
      } catch (err) {
        console.error('头像上传失败:', err)
        // 更详细的错误信息
        const errorMessage = err.response?.data?.message || err.response?.data?.error?.message || err.message
        ElMessage.error('头像更新失败：' + errorMessage)
      }
    }

    const onSaveProfile = async () => {
      loadingProfile.value = true
      try {
        await updateProfile({ display_name: profile.display_name, bio: profile.bio })
        ElMessage.success('资料已保存')
      } catch (err) {
        ElMessage.error('保存失败：' + err.message)
      } finally {
        loadingProfile.value = false
      }
    }

    const onCancelProfile = () => {
      fetchProfile()
    }



    const goHome = () => router.push({ name: 'Home' })
    const goDashboard = () => router.push({ name: 'Dashboard' })
    const goProfile = () => {}
    const goToChangePassword = () => router.push({ name: 'ChangePassword' })
    const onLogout = () => {
      doLogout()
      router.push({ name: 'Login' })
    }

    return {
      loadingProfile,
      profile,
      goHome,
      goDashboard,
      goProfile,
      goToChangePassword,
      onLogout,
      getFullAvatarUrl,
      handleAvatarChange,
      onSaveProfile,
      onCancelProfile,
    }
  }
}</script>


<style scoped>

@font-face {
  font-family: 'Mantou';
  src: url('/src/assets/font/love.ttf') format('truetype');

  font-style: normal;
  font-weight: 400;
}

@font-face {
  font-family: 'Hou';
  src: url('/src/assets/font/1.ttf') format('truetype');

  font-style: normal;
  font-weight: 400;
}


.mantou {
  font-family: 'Mantou', sans-serif;
  letter-spacing: 0.02em;
  font-size: 1.3rem;
  font-weight: 700;
}

.Hou {
  font-family: 'Hou', sans-serif;
  letter-spacing: 0.05em;
  font-size: 1.1rem;
  font-weight: 10;
}

.bg-image { position:absolute; inset:0; background-repeat:no-repeat; background-position:center; background-size:cover; z-index:0; }
.profile-page {
  font-family: 'Mantou';
  color: #303133;
  background-color: #f8f8fb;
}
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px;
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
  color: #2a2785;
}
.nav-menu {
  display: flex;
  gap: 20px;
}
.nav-btn {
  color: #2a2785;
  padding: 6px 12px;
  border-radius: 16px;
  transition: background-color 0.2s ease;
}
.nav-btn:hover {
  background-color: #f4f4ff;
}
.btn-small.btn-soft {
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 0.9rem;
  background-color: #ffffff;
  color: #2a2785;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-top: 40px;
  margin-bottom: 20px;
  color: #2a2785;
  text-align: left;
}
.form-section {
  background: #ffffff;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  margin-bottom: 40px;
}
.avatar-uploader {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f4f4ff;
  cursor: pointer;
  overflow: hidden;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-placeholder {
  font-size: 48px;
  color: #2a2785;
}
.danger-section {
  padding: 24px;
  background: #fff5f6;
  border: 1px solid #ffe4e6;
  border-radius: 14px;
}
.danger-title {
  color: #f56c6c;
  margin-bottom: 12px;
}
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
  color: #2a2785;
}
.footer-copyright {
  font-size: 0.85rem;
  color: #999;
}
</style>
