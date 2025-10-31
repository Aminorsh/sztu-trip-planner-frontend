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
            placeholder="请输入注册邮箱"
            prefix-icon="el-icon-message"
            clearable
          />
        </el-form-item>

        

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="submitForgot"
            class="auth-btn"
          >发送验证码</el-button>
        </el-form-item>

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
        email: ''
      },
      loading: false,
      forgotRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur','change'] }
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
</style>
