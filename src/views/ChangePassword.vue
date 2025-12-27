<template>
  <div class="change-password-page">
    <!-- 顶部导航栏 -->
    <header class="profile-header">
      <div class="container header-inner">
        <div class="logo">TravelPlanner</div>
        <nav class="nav-menu">
          <el-button type="text" class="nav-btn" @click="goHome">首页</el-button>
          <el-button type="text" class="nav-btn" @click="goDashboard">我的行程</el-button>
          <el-button type="text" class="nav-btn" @click="goProfile">资料 / 设置</el-button>
        </nav>
        <div class="auth-buttons">
          <el-button class="btn-small btn-soft" @click="onLogout">退出登录</el-button>
        </div>
      </div>
    </header>

    <!-- 主体内容区 -->
    <section class="password-content container">
      <h2 class="section-title">修改密码</h2>
      
      <el-form 
        :model="passwordForm" 
        :rules="passwordRules" 
        ref="passwordFormRef" 
        label-position="top" 
        class="form-section"
        @submit.prevent="onChangePassword"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input 
            type="password" 
            v-model="passwordForm.oldPassword" 
            placeholder="请输入旧密码"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            type="password" 
            v-model="passwordForm.newPassword" 
            placeholder="请输入新密码 (至少6位)"
            clearable
            show-password
          />
        </el-form-item>
        
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input 
            type="password" 
            v-model="passwordForm.confirmPassword" 
            placeholder="请再次输入新密码"
            clearable
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="onChangePassword" :loading="loadingPassword">修改密码</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
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
import { ElButton, ElInput, ElForm, ElFormItem, ElMessage } from 'element-plus'
import { changePassword } from '@/services/userService'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'

export default {
  name: 'ChangePassword',
  setup() {
    const { doLogout } = useAuth()
    const router = useRouter()
    const loadingPassword = ref(false)
    const passwordFormRef = ref(null)
    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    // 表单验证规则
    const passwordRules = {
      oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== passwordForm.newPassword) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }

    const onChangePassword = async () => {
      console.log('密码表单数据:', passwordForm)
      
      if (!passwordFormRef.value) {
        ElMessage.error('表单未初始化')
        return
      }
      
      try {
        await passwordFormRef.value.validate()
        console.log('表单验证通过')
      } catch (error) {
        console.log('表单验证失败:', error)
        return
      }

      loadingPassword.value = true
      try {
        console.log('开始调用密码修改API')
        console.log('发送的数据:', {
          old_password: passwordForm.oldPassword, 
          new_password: passwordForm.newPassword 
        })
        
        const response = await changePassword({ 
          old_password: passwordForm.oldPassword, 
          new_password: passwordForm.newPassword 
        })
        console.log('密码修改API调用成功，响应:', response)
        ElMessage.success('密码修改成功！系统将自动跳转到登录页面')
        // 清空表单
        Object.assign(passwordForm, { oldPassword: '', newPassword: '', confirmPassword: '' })
        
        // 密码修改成功后，清除登录状态并跳转到登录页
        setTimeout(() => {
          onLogout()
        }, 2000)
      } catch (err) {
        console.error('密码修改失败:', err)
        console.error('错误响应:', err.response)
        
        let errorMessage = err.message || '未知错误'
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message
        } else if (err.response?.data?.error?.message) {
          errorMessage = err.response.data.error.message
        }
        
        if (errorMessage.includes('旧密码') || errorMessage.includes('password') || err.response?.status === 401) {
          ElMessage.error('修改密码失败：' + errorMessage)
        } else {
          // 其他错误，可能是因为token已失效
          ElMessage.error('修改密码失败：' + errorMessage + '，可能需要重新登录')
          setTimeout(() => {
            onLogout()
          }, 3000)
        }
      } finally {
        loadingPassword.value = false
      }
    }

    const goHome = () => router.push({ name: 'Home' })
    const goDashboard = () => router.push({ name: 'Dashboard' })
    const goProfile = () => router.push({ name: 'Profile' })
    const goBack = () => router.push({ name: 'Profile' })
    const onLogout = () => {
      doLogout()
      router.push({ name: 'Login' })
    }

    return {
      loadingPassword,
      passwordFormRef,
      passwordForm,
      passwordRules,
      goHome,
      goDashboard,
      goProfile,
      goBack,
      onLogout,
      onChangePassword,
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

.change-password-page {
  font-family: 'Mantou';
  color: #303133;
  background-color: #f8f8fb;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

.password-content {
  flex: 1;
  padding: 40px 0;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #2a2785;
  text-align: left;
}

.form-section {
  background: #ffffff;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  margin: 0 auto;
}

.footer {
  padding: 48px 0;
  background-color: #f8f8fb;
  border-top: 1px solid #eee;
  margin-top: auto;
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