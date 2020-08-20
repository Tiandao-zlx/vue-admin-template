<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
            @input="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="600px"></el-table-column>
        <el-table-column prop="goods_price" label="价格"></el-table-column>
        <el-table-column prop="goods_weight" label="重量"></el-table-column>
        <el-table-column prop="upd_time" label="更新时间">
          <template v-slot="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-button type="primary" icon="el-icon-edit" @click="getGoodById(scope.row.goods_id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="delGoods(scope.row.goods_id)"></el-button>
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
      <el-dialog title="编辑商品" :visible.sync="editDialogVisible" width="50%" @close="editClosed">
        <el-form :model="goodInfo" :rules="editRules" ref="editRuleForm" label-width="100px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="goodInfo.goods_name" style="width : 90%"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="goods_price">
            <el-input v-model="goodInfo.goods_price" style="width : 90%"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="goods_number">
            <el-input v-model="goodInfo.goods_number" style="width : 90%"></el-input>
          </el-form-item>
          <el-form-item label="重量" prop="goods_weight">
            <el-input v-model="goodInfo.goods_weight" style="width : 90%"></el-input>
          </el-form-item>
          <el-form-item label="选择商品分类" prop="goods_cat">
            <el-cascader
              v-model="ArrGoods_cat"
              :options="categoriesList"
              clearable
              :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="介绍">
            <el-input v-model="goodInfo.goods_introduce" style="width : 90%"></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
              drag
              action="http://127.0.0.1:8888/api/private/v1/upload"
              multiple
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :file-list="fileList"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="参数">
            <el-alert title="如若点击错误请关闭重新编辑" type="warning" center show-icon></el-alert>
            <p>动态参数</p>
            <el-form-item :label="item.attr_name" v-for="item in arrAttrsMany" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1,index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <p>静态参数</p>
            <el-form-item
              :label="item.attr_name"
              v-for="item in arrAttrsOnly"
              :key="item.attr_id"
              label-width="150px"
            >
              <el-input v-model="item.attr_vals" style="width : 90%"></el-input>
            </el-form-item>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGood">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="图片预览" :visible.sync="PreviewDialogVisible" width="50%">
        <img :src="previewPath" alt class="previewImg" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getGoodsList,
  delGoods,
  getGoodById,
  editGood
} from "@/network/goodsList";
import { getCategoriesList } from "@/network/cate";

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: null,
      editDialogVisible: false,
      PreviewDialogVisible: false,
      goodInfo: {},
      headerObj: { Authorization: window.sessionStorage.getItem("token") },
      previewPath: "",
      attrs: "",
      arrAttrsMany: [],
      arrAttrsOnly: [],
      categoriesList: [],
      ArrGoods_cat: [],

      editRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称名称",
            trigger: "blur"
          }
        ],
        oods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur"
          }
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur"
          }
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur"
          }
        ],
        ArrGoods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "blur"
          }
        ]
      },
      fileList: []
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList() {
      getGoodsList(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then(res => {
        console.log(res);
        this.goodsList = res.data.data.goods;
        this.total = res.data.data.total;
        // console.log(this.goodsList)
      });
    },
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getGoodsList(0, this.pagenum, this.pagesize);
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getGoodsList(0, this.pagenum, this.pagesize);
    },
    delGoods(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delGoods(id).then(res => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.$message.success("删除成功");
              this.getGoodsList();
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    goAddPage() {
      this.$router.push("/goods/add");
    },
    getCategoriesList() {
      getCategoriesList().then(res => {
        console.log(res);
        this.categoriesList = res.data.data;
      });
    },
    handleChange() {
      if (this.ArrGoods_cat.length !== 3) {
        this.ArrGoods_cat = [];
        console.log(this.ArrGoods_cat);
        return;
      }
    },
    getGoodById(id) {
      this.getCategoriesList();
      getGoodById(id).then(res => {
        console.log(res);
        this.goodInfo = res.data.data;
        this.ArrGoods_cat = res.data.data.goods_cat.split(",");
        console.log(this.ArrGoods_cat);
        res.data.data.pics.forEach(item => {
          const picInfo = {
            name: item.pics_big,
            url: item.pics_big_url
          };
          this.fileList.push(picInfo);
          // console.log(this.fileList);
        });
        res.data.data.attrs.forEach(item => {
          // console.log(item);
          if (item.attr_sel === "many") {
            console.log(item);
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");

            this.arrAttrsMany.push(item);
            // console.log(this.arrarrAttrsMany)
          } else {
            this.arrAttrsOnly.push(item);
          }
        });
        // this.arrAttrs = res.data.data.attrs.join(",")
      });
      // this.goodInfo.push(this.attrs)
      console.log(this.goodInfo);
      this.editDialogVisible = true;
      console.log(this.arrAttrsMany);
      console.log(this.arrAttrsOnly);
    },
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.url;
      this.PreviewDialogVisible = true;
    },
    handleRemove(file) {
      // console.log(file);
      const filePath = file.name;
      const i = this.fileList.findIndex(x => x.name === filePath);
      this.fileList.splice(i, 1);
      console.log(this.fileList);
    },
    handleSuccess(response) {
      console.log(response);
      const picInfo = {
        name: response.data.tmp_path,
        url: response.data.url
      };
      this.fileList.push(picInfo);
      console.log(this.fileList);
    },
    editClosed() {
      this.$refs.editRuleForm.resetFields();
      (this.fileList = []), (this.arrAttrsMany = []), (this.arrAttrsOnly = []);
    },
    editGood() {
      this.$refs.editRuleForm.validate(valid => {
        if (valid) {
          this.goodInfo.attrs = [];
          this.goodInfo.pics = [];
          this.goodInfo.goods_cat = this.ArrGoods_cat.toString();
          console.log(this.goodInfo);
          this.fileList.forEach(item => {
            const newInfo = {
              pic: item.name
            };
            this.goodInfo.pics.push(newInfo);
          });
          console.log(this.arrAttrsMany);
          this.arrAttrsMany.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(" ")
            };
            this.goodInfo.attrs.push(newInfo);
          });
          this.arrAttrsOnly.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
            this.goodInfo.attrs.push(newInfo);
          });

          console.log(this.goodInfo);
          editGood(
            this.goodInfo.goods_id,
            this.goodInfo.goods_name,
            this.goodInfo.goods_price,
            this.goodInfo.goods_number,
            this.goodInfo.goods_cat,
            this.goodInfo.goods_weight,
            this.goodInfo.goods_introduce,
            this.goodInfo.pics,
            this.goodInfo.attrs
          ).then(res => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.$message.success("修改商品信息成功");
              this.editDialogVisible = false;
            } else {
              this.$message.error("修改商品信息失败");
            }
          });
          this.getGoodsList();
        } else {
          this.$message.error('请检查输入内容是否合法')
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-table {
  margin-top: 10px;
  font-size: 12px;
}

.el-pagination {
  margin-top: 10px;
}

.previewImg {
  width: 100%;
}

.el-checkbox {
  margin: 0 5px 0 0 !important;
}
</style>