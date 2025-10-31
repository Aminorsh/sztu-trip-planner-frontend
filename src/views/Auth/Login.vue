<!-- src/views/Login.vue -->
<template>
  <div class="auth-page login-page">
    <div class="bg-image"></div>
    <div class="bg-overlay"></div>

    <div class="auth-container">
      <h2 class="auth-title">登录</h2>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        class="auth-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="邮箱 / 用户名"
            prefix-icon="el-icon-user"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="captcha" v-if="loginShowCaptcha">
          <div class="captcha-row">
            <el-input v-model="loginForm.captcha" placeholder="验证码" />
            <img
              :src="captchaImageUrl"
              alt="验证码"
              class="captcha-img"
              @click="reloadCaptcha"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="submitLogin"
            class="auth-btn"
          >登录</el-button>
        </el-form-item>

        <div class="social-login">
          <span>或 使用</span>
          <el-button icon="el-icon-s-platform" circle @click="onSocial('weibo')" />
          <el-button icon="el-icon-s-platform" circle @click="onSocial('wechat')" />
          <el-button icon="el-icon-s-platform" circle @click="onSocial('google')" />
        </div>

        <div class="auth-links">
          <router-link to="/forgot-password">忘记密码？</router-link>
          <router-link to="/register">注册账号</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: ''
      },
      loading: false,
      loginShowCaptcha: false,
      captchaImageUrl: '',
      loginRules: {
        username: [
          { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reloadCaptcha() {
      this.captchaImageUrl = `/api/captcha?ts=${Date.now()}`
    },
    submitLogin() {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return
        this.loading = true
        // TODO: 后端登录接口
        setTimeout(() => {
          this.loading = false
          this.$router.push({ name: 'Dashboard' })
        }, 1200)
      })
    },
    onSocial(provider) {
      console.log('社交登录：', provider)
      // 可根据 provider 发起第三方登录流程
    }
  },
  mounted() {
    if (this.loginShowCaptcha) {
      this.reloadCaptcha()
    }
  }
}
</script>

<style scoped>
.auth-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #eaeaf2;
}
.bg-image {
  position: absolute;
  inset: 0;
  background: url('@/assets/images/hero-travel.jpg') no-repeat center/cover;
  z-index: 0;
}
.bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1;
}
.auth-container {
  position: relative;
  z-index: 2;
  width: 90%;
  max-width: 380px;
  padding: 32px;
  background: rgba(255,255,255,0.85) url('@/assets/images/hero-travel4.jpg') no-repeat center/cover;
  background-size: cover;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
}
.auth-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 1.8rem;
  color: #bdbcf8;
}
.auth-btn {
  width: 100%;
  border-radius: 22px;
}
.social-login {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

/* 辅助链接：一左一右布局 */
.auth-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.auth-links a {
  text-decoration: none;
  color: #cfcffb;
  transition: color 0.2s ease;
}
.auth-links a:hover {
  color: #8c88ff;
}

.captcha-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.captcha-img {
  width: 100px;
  height: 38px;
  cursor: pointer;
  border-radius: 6px;
  object-fit: cover;
}
</style>
