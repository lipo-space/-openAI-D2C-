<template>
  <div id="app">
    <header>
      <el-popconfirm title="Are you sure to delete?" @confirm="shuaxin()">
        <template #reference>
          <el-button circle type="warning" icon="RefreshRight" size="small"
            style="float: left; margin-right: 1vh;"></el-button>
        </template>
      </el-popconfirm>
      <!-- 添加标题和导航栏 -->
      <h1 style="line-height: 1.65rem; float: left;">
        ChatGPT: Image to Code Converter
      </h1>
      <!-- 可添加其他导航链接等 -->

    </header>
    <main>
      <!-- 使用 ImageConverter 组件 -->
      <ImageConverter />
    </main>
    <footer>
      <!-- 添加页脚信息 -->

      <p style="color: #d81d1d; font-weight: bold;">
        请注意此处的数据没有数据库仅存在于前端，刷新即删除此页面全部对话!
        &copy; 2024 Lipo
      </p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import ImageConverter from '@/components/ImageConverter.vue';

const shuaxin = () => {
  location.reload();
};


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
  padding: 0.75rem 1rem 0.75rem 3vh;
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
