<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @clear="getOrdersList"
            @input="getOrdersList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="ordersList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="600px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status == 1" type="sucess">已付款</el-tag>
            <el-tag v-if="scope.row.pay_status == 0 " type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="150px">
          <template v-slot="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-tooltip class="item" effect="dark" content="编辑地址" placement="bottom-end">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="getInfo(scope.row.order_id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="物流信息" placement="bottom-end">
              <el-button
                type="success"
                icon="el-icon-location-outline"
                circle
                @click="showProgress()"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
      <el-dialog
        title="修改地址"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
              clearable
              :props="{ expandTrigger: 'hover',value:'value',label:'label',children:'children' }"
              style="width : 90%"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2" style="width : 90%"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="查询物流进度" :visible.sync="progressDialogVisible" width="50%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.ftime"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getOrdersList, getProgress } from "@/network/orders";
import cityData from "@/network/citydata";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
        user_id: "",
        pay_status: "",
        is_send: "",
        order_fapiao_title: "",
        order_fapiao_company: "",
        order_fapiao_content: "",
        consignee_addr: ""
      },
      cityData,
      ordersList: [],
      total: null,
      editDialogVisible: false,
      progressDialogVisible: false,
      progressInfo: [],
      addressForm: {
        address1: [],
        address2: ""
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: "请选择省市区县",
            trigger: "blur"
          }
        ],
        address2: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    getOrdersList() {
      getOrdersList(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize,
        this.queryInfo.user_id,
        this.queryInfo.pay_status,
        this.queryInfo.is_send,
        this.queryInfo.order_fapiao_title,
        this.queryInfo.order_fapiao_company,
        this.queryInfo.order_fapiao_content,
        this.queryInfo.consignee_addr
      ).then(res => {
        console.log(res);
        this.ordersList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getOrdersList(0, this.pagenum, this.pagesize);
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getOrdersList(0, this.pagenum, this.pagesize);
    },
    getInfo() {
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    showProgress() {
      this.progressDialogVisible = true;
      //   getProgress(id).then(res=>{
      //       console.log(res)
      //   })
      this.getProgress();
    },
    getProgress() {
      getProgress().then(res => {
        this.progressInfo = res.data.data;
        console.log(this.progressInfo);
      });
    }
  }
};
</script>
<style lang="stylus" scoped></style>