<template>
  <button class="base-button" v-bind="$attrs">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton'
}
</script>

<style scoped>
.base-button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
.base-button:hover {
  background-color: #0056b3;
}
</style>