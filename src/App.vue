<template>
  <div id="app">
    <header>
      <!-- 添加标题和导航栏 -->
      <h1>ChatGPT: Image to Code Converter</h1>
      <!-- 可添加其他导航链接等 -->
    </header>
    <main>
      <!-- 使用 ImageConverter 组件 -->
      <ImageConverter />
    </main>
    <footer>
      <!-- 添加页脚信息 -->
      <p>&copy; 2024 Lipo</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ImageConverter from '@/components/ImageConverter.vue';

export default defineComponent({
  components: {
    ImageConverter,
  },
});
</script>

<style>
* {
  border: none;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #729fd8;
  color: #fff;
  font-size: 0.5rem;
  padding: 0.75rem 1rem 0.75rem 5vh;
  /* text-align: center; */
  width: 100vw;
}

main {
  padding: 2rem;
  width: 100vw;
  max-width: 800px;
  box-sizing: border-box;
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #729fd8;
  color: #fff;
  padding: 0.2rem;
  text-align: center;
  margin-top: auto;
  width: 100vw;
}
</style>
