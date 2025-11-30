<!-- src/views/Auth/ForgotPassword.vue -->
<template>
  <div class="auth-page forgot-page">
    <div class="bg-image"></div>
    <div class="bg-overlay"></div>

    <div class="auth-container forgot-container">
      <h2 class="auth-title lighter">找回密码</h2>

      <el-form
        ref="sendCodeFormRef"
        :model="sendCodeForm"
        :rules="sendCodeRules"
        label-position="top"
      >
        <el-form-item prop="emailOrUsername">
          <el-input
            v-model="sendCodeForm.emailOrUsername"
            placeholder="请输入注册邮箱"
            prefix-icon="el-icon-message"
            clearable
            class="Mantou"
          />
        </el-form-item>
      </el-form>

      <el-form
        ref="forgotFormRef"
        :model="forgotForm"
        :rules="forgotRules"
        label-position="top"
        class="auth-form Mantou"
      >
        <!-- <el-form-item prop="emailOrUsername"> -->
          <!-- <el-input -->
            <!-- v-model="forgotForm.emailOrUsername" -->
            <!-- placeholder="请输入注册邮箱 或 用户名" -->
            <!-- prefix-icon="el-icon-message" -->
            <!-- clearable -->
          <!-- /> -->
        <!-- </el-form-item> -->

        <el-form-item prop="newPassword">
          <el-input
            v-model="forgotForm.newPassword"
            type="password"
            placeholder="新密码 (6~20 位)"
            prefix-icon="el-icon-lock"
            show-password
            class="Mantou"
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="forgotForm.confirmPassword"
            type="password"
            placeholder="确认新密码"
            prefix-icon="el-icon-lock"
            show-password
            class="Mantou"
          />
        </el-form-item>

        <el-form-item prop="code">
          <el-input v-model="forgotForm.code" placeholder="验证码" />
          <el-button
            type="primary"
            :loading="codeSending"
            @click="sendForgetCode"
            class="auth-btn Mantou"
          >发送验证码</el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="submitForgot"
            class="auth-btn Mantou"
          >重置密码</el-button>
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
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as authService from '@/services/authService'
import { useRouter } from 'vue-router'

export default {
  name: 'ForgotPassword',
  setup() {
    const route=useRouter()
    const sendCodeFormRef = ref(null)
    const sendCodeForm = ref({ emailOrUsername: '' })
    const sendCodeRules = {
    emailOrUsername: [
      { required: true, message: '请输入邮箱或用户名', trigger: 'blur' },
      { min: 3, message: '至少 3 个字符', trigger: 'blur' }
    ]
  }
    const forgotFormRef = ref(null)
    const forgotForm = ref({
      newPassword: '',
      confirmPassword: '',
      code: ''
    })
    const loading = ref(false)
    const codeSending = ref(false)

    const forgotRules = {
      // emailOrUsername: [
        // { required: true, message: '请输入邮箱或用户名', trigger: 'blur' },
        // { min: 3, message: '至少 3 个字符', trigger: 'blur' }
      // ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不少于 6 位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== forgotForm.value.newPassword) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      code: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
      ]
    }

    async function sendForgetCode() {
      console.log('[1] 函数入口') 
      const valid = await sendCodeFormRef.value.validate().catch(() => false)
      console.log('[2] 校验结果', valid)
      if (!valid) return
      codeSending.value = true
      console.log('[3] 开始发请求')
      try {
        const val = sendCodeForm.value.emailOrUsername
        // 判断是邮箱还是用户名
        if (val.includes('@')) {
          await authService.sendForgetCode(val)
        } else {
          await authService.sendForgetCodeByUsername(val)
        }
        ElMessage.success('验证码已发送，请查收')
      } catch (err) {
        console.error('发送验证码失败', err)
        ElMessage.error(err.message || '发送验证码失败')
        console.error(err)
        console.log('[4] catch 错误', err)
      } finally {
        codeSending.value = false
        console.log('[5] finally 执行')
      }
    }

    async function submitForgot() {
      await forgotFormRef.value.validate().catch(() => { return })
      loading.value = true

      try {
        const { newPassword,confirmPassword, code } = forgotForm.value
        // 调用后端 “verify-forget-password” 接口
        // 你的接口文档里是用 email 字段，所以需要判断
        if(newPassword!=confirmPassword){
          console.log("密码不一致")
        }
        let email = sendCodeForm.value.emailOrUsername
        await authService.verifyForgetPassword({
          email,
          new_password: newPassword,
          code
        })
        ElMessage.success('密码重置成功，请登录')
        route.push('/login')
      } catch (err) {
        console.error('重置失败', err)
        ElMessage.error(err.message || '重置失败')
      } finally {
        loading.value = false
      }
    }

    return {
      forgotFormRef, forgotForm, forgotRules,sendCodeRules,sendCodeFormRef,sendCodeForm,
      loading, codeSending,
      sendForgetCode, submitForgot
    }
  }
}
</script>

<style scoped>

.mantou {
  font-family: 'Mantou', sans-serif;
  letter-spacing: 0.02em;
  font-size: 1.1rem;
  font-weight: 100;
}

.Hou {
  font-family: 'Hou', sans-serif;
  letter-spacing: 0.05em;
  font-size: 1.1rem;
  font-weight: 100;
}
.auth-page {
  font-family: 'Mantou';
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #2f2f9d;
}
.bg-image {
  position: absolute;
  inset: 0;
  background: url('../../assets/images/9.jpg') no-repeat center/cover;
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
  background: rgba(255,255,255,0.85) url('../../assets/images/13.jpg') no-repeat center/cover;
  background-size: cover;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
}
.auth-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 2.2rem;
  color: #fbfbfb;
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
  color: #f6f6f8;
  font-size: 1.3rem;
  font-weight: 100;
  transition: color 0.2s ease;
}
.auth-links a:hover {
  color: #8c88ff;

}


.captcha-row{
  width: 100%;
}

.auth-btn{
  margin-top:12px;
  margin-bottom: 12px;
  
}
</style>
