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

        <!-- <el-form-item prop="captcha" v-if="loginShowCaptcha"> -->
          <!-- <div class="captcha-row"> -->
            <!-- <el-input v-model="loginForm.captcha" placeholder="验证码" /> -->
            <!-- <img -->
              <!-- :src="captchaImageUrl" -->
              <!-- alt="验证码" -->
              <!-- class="captcha-img" -->
              <!-- @click="reloadCaptcha" -->
            <!-- /> -->
          <!-- </div> -->
        <!-- </el-form-item> -->

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="submitLogin"
            class="auth-btn"
          >登录</el-button>
        </el-form-item>

        <!-- <div class="social-login"> -->
          <!-- <span>或 使用</span> -->
          <!-- <el-button icon="el-icon-s-platform" circle @click="onSocial('weibo')" /> -->
          <!-- <el-button icon="el-icon-s-platform" circle @click="onSocial('wechat')" /> -->
          <!-- <el-button icon="el-icon-s-platform" circle @click="onSocial('google')" /> -->
        <!-- </div> -->

        <div class="auth-links">
          <router-link to="/forgot-password">忘记密码？</router-link>
          <router-link to="/register">注册账号</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as authService from '@/services/authService'  // 引入 authService
import { useAuth } from '@/composables/useAuth'
export default {
  name: 'Login',
  setup() { //setup() 是 Vue3 的 组合式 API 入口函数。
    const router = useRouter()
    const loginFormRef = ref(null) //获取<el-from>组件
    const { doLogin, isLoggedIn } = useAuth()
    const loginForm = ref({
      username: '',
      password: '',
      // captcha: ''
    })
    const loading = ref(false)//控制登录按钮的“加载中”状态，请求结束再关掉。
    // const loginShowCaptcha = ref(false)
    // const captchaImageUrl = ref('')

    const loginRules = { //表单校验规则
      username: [
        { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    }
      // Login.vue 的 <script> 部分
    async function submitLogin() {
      // 1. 校验
      const valid = await loginFormRef.value.validate().catch(() => false)
      if (!valid) return

      // 2. 登录
      loading.value = true
      try {
        await doLogin(loginForm.value.username, loginForm.value.password) 
        ElMessage.success('登录成功')
        router.push('/')
        } catch {
      // 错误提示已在 doLogin 里统一处理
          } finally {
      loading.value = false
        }
    }
    function onSocial(provider) {
      console.log('社交登录：', provider)
    }//预留的第三方登录（GitHub、微信等）入口

    return {
      loginFormRef, loginForm, loginRules,
      loading,submitLogin, onSocial
    }//把上面所有变量、函数“打包”扔出去，模板里才能 v-model、@click 直接用到它们
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
  background: url('../../assets/images/hero-travel.jpg') no-repeat center/cover;
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
  background: rgba(255,255,255,0.85) url('../../assets/images/hero-travel4.jpg') no-repeat center/cover;
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
