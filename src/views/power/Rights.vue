<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- <h2>zlx</h2> -->
      <el-table :data="rightsList" stripe border height="610px">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from '@/network/rights.js'
export default {
  data(){
    return {
      rightsList:[],
      type:'list'
    }
  },
  created(){
    this.getRightsList()
  },
  methods:{
    getRightsList(){
      getRightsList(this.type).then(res=>{
        console.log(res)
        this.rightsList = res.data.data
      })
    }
  }
};
</script>
<style lang="stylus" scoped>
</style>