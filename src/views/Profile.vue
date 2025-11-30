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
            :before-upload="beforeAvatarUpload"
            :on-change="handleAvatarChange"
          >
            <img v-if="profile.avatar" :src="profile.avatar" class="avatar-img" alt="avatar" />
            <i v-else class="el-icon-plus avatar-placeholder"></i>
          </el-upload>
        </el-form-item>

        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="profile.username" placeholder="请输入用户名" />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="profile.email" placeholder="请输入邮箱" />
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
      <el-form :model="passwordForm" ref="passwordForm" label-position="top" class="form-section">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword" placeholder="请再次输入新密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onChangePassword" :loading="loadingPassword">修改密码</el-button>
        </el-form-item>
      </el-form>

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
import { ElButton, ElInput, ElUpload, ElForm, ElFormItem, ElSwitch, ElRadioGroup, ElRadio } from 'element-plus'
import heroTravel from '@/assets/images/hero-travel4.jpg'

export default {
  name: 'Profile',
  components: {
    ElButton,
    ElInput,
    ElUpload,
    ElForm,
    ElFormItem,
    ElSwitch,
    ElRadioGroup,
    ElRadio
  },
  data() {
    return {
      heroTravel,
      loadingProfile: false,
      loadingPassword: false,
      loadingPref: false,
      loadingPrivacy: false,
      profile: {
        avatar: '',
        username: '',
        email: '',
        bio: ''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      preferences: {
        emailNotifications: true,
        pushNotifications: false
      },
      privacy: {
        defaultShareStatus: 'public'
      }
    }
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'Home' })
    },
    goDashboard() {
      this.$router.push({ name: 'Dashboard' })
    },
    onLogout() {
      // 注销逻辑
      console.log('用户注销')
      this.$router.push({ name: 'Login' })
    },
    beforeAvatarUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJpgOrPng) {
        this.$message.error('只能上传 JPG/PNG 格式头像!')
      }
      if (!isLt2M) {
        this.$message.error('头像大小不能超过2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    handleAvatarChange(file, fileList) {
      // 模拟上传后返回 URL
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = () => {
        this.profile.avatar = reader.result
      }
    },
    onSaveProfile() {
      this.loadingProfile = true
      // 模拟保存过程
      setTimeout(() => {
        this.loadingProfile = false
        this.$message.success('资料已保存')
      }, 1000)
    },
    onCancelProfile() {
      // 恢复初始值或刷新页面
      console.log('取消编辑资料')
    },
    onChangePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.$message.error('新密码与确认密码不一致')
        return
      }
      this.loadingPassword = true
      // 模拟密码修改过程
      setTimeout(() => {
        this.loadingPassword = false
        this.$message.success('密码已修改')
        // 清空表单
        this.passwordForm.oldPassword = ''
        this.passwordForm.newPassword = ''
        this.passwordForm.confirmPassword = ''
      }, 1000)
    },
    onSavePreferences() {
      this.loadingPref = true
      setTimeout(() => {
        this.loadingPref = false
        this.$message.success('偏好设置已保存')
      }, 500)
    },
    onSavePrivacy() {
      this.loadingPrivacy = true
      setTimeout(() => {
        this.loadingPrivacy = false
        this.$message.success('隐私设置已保存')
      }, 500)
    },
    onDeleteAccount() {
      // 弹窗确认是否删除账号
      this.$confirm('删除后无法恢复，确定要删除账号吗？', '警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('账号删除逻辑执行')
        this.$message.success('账号已删除')
        this.$router.push({ name: 'Login' })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
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
