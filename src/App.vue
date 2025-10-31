<template>
  <div id="app">
    <!-- 这里可以放全局导航 -->
    <router-view/>   <!-- 路由匹配到的页面会插在这里 -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 可写全局样式或根组件样式 */
</style>
