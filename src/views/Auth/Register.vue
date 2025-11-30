<!-- src/views/Register.vue -->
<template>
  <div class="auth-page register-page">
    <div class="bg-image"></div>
    <div class="bg-overlay"></div>

    <div class="auth-container register-container">
      <h2 class="auth-title light">注册</h2>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-position="top"
        class="auth-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="用户名"
            prefix-icon="el-icon-user"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="display_name">
          <el-input
            v-model="registerForm.display_name"
            placeholder="昵称"
            prefix-icon="el-icon-user"
            clearable
          />
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="邮箱"
            prefix-icon="el-icon-user"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码 (6~20 位)"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>

        <!-- <el-form-item prop="captcha"> -->
          <!-- <div class="captcha-row"> -->
            <!-- <el-input v-model="registerForm.captcha" placeholder="验证码" /> -->
            <!-- <img -->
              <!-- :src="captchaImageUrl" -->
              <!-- alt="验证码" -->
              <!-- class="captcha-img" -->
              <!-- @click="reloadCaptcha" -->
            <!-- /> -->
          <!-- </div> -->
        <!-- </el-form-item> -->

        <el-form-item prop="captcha">
          <div class="captcha-row">
            <el-input v-model="registerForm.captcha" placeholder="验证码" />
            <el-button
              type="primary"
              :loading="sending"
              @click="sendCodeToEmail"
              :disabled="!registerForm.email"
            >发送验证码</el-button>
          </div>
        </el-form-item>        

        <el-form-item>
          <el-button
            type="success"
            :loading="registering"
            @click="submitRegister"
            class="auth-btn"
          >注册</el-button>
        </el-form-item>

        <!-- <div class="social-login"> -->
          <!-- <span>或 使用</span> -->
          <!-- <el-button icon="el-icon-s-platform" circle @click="onSocial('weibo')" /> -->
          <!-- <el-button icon="el-icon-s-platform" circle @click="onSocial('wechat')" /> -->
          <!-- <el-button icon="el-icon-s-platform" circle @click="onSocial('google')" /> -->
        <!-- </div> -->

        <div class="auth-links">
          <router-link to="/login">已有账号？登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as authService from '@/services/authService'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const registerFormRef = ref(null)
    const registerForm = ref({
      username: '',
      display_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      captcha: ''
    })
    const loading = ref(false)
    const captchaImageUrl = ref('') //验证码图片的地址，后面拼时间戳刷新用
    const sending     = ref(false)   // 发送验证码按钮菊花
    const registering = ref(false)   // 注册按钮菊花

    const registerRules = {
      display_name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, message: '用户名至少 3 个字符', trigger: 'blur' }
      ],      
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, message: '用户名至少 3 个字符', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不少于 6 位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== registerForm.value.password) {
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

    // ① 纯粹发验证码
    async function sendCodeToEmail() {
      if (!registerForm.value.email) return
      sending.value = true
      try {
        await authService.sendCode(registerForm.value.email)
        ElMessage.success('验证码已发送，请查收邮箱')
      } catch (e) {
        ElMessage.error(e.message || '发送失败')
      } finally {
        sending.value = false
      }
    }
    async function submitRegister() {
    // ① 校验拦截
      const valid = await registerFormRef.value.validate().catch(() => false)
      if (!valid) return

      registering.value = true
      try {
        const { email, password, username, captcha, display_name } = registerForm.value
        const res = await authService.register({
        username,
        email,
        password,
        code: captcha,          // 与后端约定字段保持一致
        display_name
        })

        // ② 后端如果只给 201 不返 token，就删掉下面这行
        localStorage.setItem('token', res.token)

        ElMessage.success('注册成功')
        router.push('/login')   // ③ 加 await 确保完成再释放 loading
      } catch (e) {
          ElMessage.error(e.response?.data?.message || '注册失败')
        } finally {
          registering.value = false
        }
    }
    function onSocial(provider) {
      console.log('社交注册：', provider)
    }

    // 初始化验证码图片
    

    return {
      registerFormRef, registerForm, registerRules,
      sending,registering,sendCodeToEmail,submitRegister,onSocial
    }
  }
}
</script>

<style scoped>
/* 你现有样式保留 */
</style>


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
  max-width: 400px;
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
  color: #b3b3f8;
}
.auth-btn {
  width: 100%;
  border-radius: 22px;
  border: #8c88ff;
  background: #b3b3f8;
}
.social-login {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
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
