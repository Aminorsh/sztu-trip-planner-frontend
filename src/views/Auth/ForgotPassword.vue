<!-- src/views/ForgotPassword.vue -->
<template>
  <div class="auth-page forgot-page">
    <div class="bg-image"></div>
    <div class="bg-overlay"></div>

    <div class="auth-container forgot-container">
      <h2 class="auth-title lighter">找回密码</h2>
      <el-form
        ref="forgotFormRef"
        :model="forgotForm"
        :rules="forgotRules"
        label-position="top"
        class="auth-form"
      >
        <el-form-item prop="email">
          <el-input
            v-model="forgotForm.email"
            placeholder="请输入注册邮箱/用户名"
            prefix-icon="el-icon-message"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="forgotForm.password"
            type="password"
            placeholder="密码 (6~20 位)"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="forgotForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="captcha">
          <div class="captcha-row">
            <el-input v-model="forgotForm.captcha" placeholder="验证码" />
            <el-button
              type="primary"
              :loading="loading"
              @click="submitForgot"
               class="auth-btn"
            >发送验证码</el-button>
          </div>
        </el-form-item>        

        <!--  -->

        <!-- <el-form-item> -->
          <!-- <el-input v-model="forgotForm.captcha" placeholder="验证码" /> -->
          <!-- <el-button -->
            <!-- type="primary" -->
            <!-- :loading="loading" -->
            <!-- @click="submitForgot" -->
            <!-- class="auth-btn" -->
          <!-- >发送验证码</el-button> -->
        <!-- </el-form-item> -->

        <div class="auth-links">
          <router-link to="/login">返回登录</router-link>
          <router-link to="/register">注册账号</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      forgotForm: {
        username: '',
        confirmPassword: '',
        password: '',
        captcha: ''
      },
      loading: false,
      forgotRules: {
        username: [
          { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
          { min: 3, message: '用户名至少 3 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不少于 6 位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.forgotForm.password) {
                callback(new Error('两次输入密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]        
      }
    }
  },
  methods: {
    submitForgot() {
      this.$refs.forgotFormRef.validate((valid) => {
        if (!valid) return
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.$message.success('重置链接已发送，请查收邮箱')
        }, 1200)
      })
    }

    // 缺正则判断username是邮箱还是用户名
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
  color: #d0d0f8;
}
.auth-btn {
  width: 100%;
  border-radius: 22px;
}


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

.captcha-row{
  width: 100%;
}

.auth-btn{
  margin-top:10px;
}
</style>
