<template>
  <!-- <div class="home"> -->
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="head">
        <img src="@/assets/timg.jpg" alt />
        <span style="font-size : 25px">周廉兴的后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 左侧菜单区域 -->
      <el-aside :width="isCollapse ? '60px':'200px'">
        <div class="toggle-button" @click="toggleClick">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#304156"
          text-color="#BFCBD9"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
        <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题内容区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>

  <!-- <el-button @click="toForm">form</el-button>
    <el-button @click="toTable">table</el-button>
  <router-view></router-view>-->
  <!-- </div> -->
</template>

<script>
// @ is an alias to /src
import { getMenuList } from "@/network/home"

export default {
  name: "Home",
  components: {},
  data() {
    return {
      menuList:null,
      iconsObj:{
        '125' : 'iconfont icon-user',
        '103' : 'iconfont icon-tijikongjian',
        '101' : 'iconfont icon-shangpin',
        '102' : 'iconfont icon-danju',
        '145' : 'iconfont icon-baobiao',
      },
      isCollapse:false,
      activePath:''
    };
  },
  created(){
    this.getMenuList()
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      this.$router.push({ path: "/login" });
    },
    toForm() {
      this.$router.push({ path: "/form" });
    },
    toTable() {
      this.$router.push({ path: "/table" });
    },
    getMenuList(){
      getMenuList().then(res => {
        // console.log(res)
        this.menuList = res.data.data
      })
    },
    //切换菜单折叠展开
    toggleClick(){
      this.isCollapse = !this.isCollapse
    },
  }
};
</script>
<style lang="stylus" scoped>
.home-container 
  height 100%

.el-header 
  background-color #2B2F3A
  display flex
  justify-content space-between
  align-items center
  color white
  font-size 20px
  >div 
    display flex
    align-items center
  


.el-aside 
  background-color #304156


.el-main 
  background-color #EFF1F4


.head img 
  height 100px
  width 100px
  border-radius 50%
  vertical-align middle
  padding-right 20px

.iconfont
 margin-right 10px

.el-menu
 border-right none 

.toggle-button
 background-color #37373D
 font-size 10px
 line-height 24px
 color #fff
 text-align center
 letter-spacing 0.2em
 cursor pointer
</style>
