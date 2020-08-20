<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path:'/goods'}">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <el-steps :active="activeIndex*1" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-addForm"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
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
            <div class="next">
              <el-button type="primary" @click="nextPage1">下一步</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-alert title="如若点击错误请点击'上一步'操作或者点击'重选按钮'" type="warning" center show-icon></el-alert>
            <el-form-item :label="item.attr_name" v-for="item in attrsMany" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1,index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div class="next">
              <el-button type="primary" @click="nextPage0">上一步</el-button>
              <el-button type="primary" @click="nextPage1">重选</el-button>
              <el-button type="primary" @click="nextPage2">下一步</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in attrsOnly" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
            <div class="next">
              <el-button type="primary" @click="nextPage1">上一步</el-button>
              <el-button type="primary" @click="nextPage3">下一步</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>-->
            <el-upload
              drag
              action="http://127.0.0.1:8888/api/private/v1/upload"
              multiple
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
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
            <div class="next">
              <el-button type="primary" @click="nextPage2">上一步</el-button>
              <el-button type="primary" @click="nextPage4">下一步</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <div class="next">
              <el-button type="primary" @click="nextPage3">上一步</el-button>
              <el-button type="primary" @click="nextPage5">下一步</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="确认添加" name="5">
            <div class="nextadd">
              <el-button type="primary" @click="nextPage4">上一步</el-button>
              <el-button type="primary" @click="addGoods">确认添加</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览 -->
      <el-dialog title="提示" :visible.sync="PreviewDialogVisible" width="50%">
        <img :src="previewPath" alt class="previewImg" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getCategoriesList } from "@/network/cate";
import { getAttrList } from "@/network/params";
import { addGood } from "@/network/goodsList";
export default {
  data() {
    return {
      activeIndex: "0",
      categoriesList: [],
      TF: true,
      attrsMany: [],
      attrsOnly: [],
      testAttrs: [],
      previewPath: "",
      PreviewDialogVisible: false,
      ArrGoods_cat: [],
      //图片上传组件的headers请求头部的对象
      headerObj: { Authorization: window.sessionStorage.getItem("token") },
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: "",
        attrs: [],
        pics: [],
        goods_introduce: ""
      },
      rules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        goods_price: [
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
      }
    };
  },
  created() {
    this.getCategoriesList();
  },
  methods: {
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
    beforeTabLeave(activeName, oldActiveName) {
      console.log(oldActiveName);
      console.log(activeName);
      // console.log(this.TF)
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          // console.log(valid)
          this.TF = false;
          // console.log(this.TF)
          // }
        } else {
          if (this.ArrGoods_cat.length !== 3) {
            this.TF = false;
          } else {
            this.TF = true;
          }
        }
      });
      // console.log(this.TF)
      return this.TF;
    },
    nextPage0() {
      this.activeIndex = "0";
    },
    nextPage1() {
      (this.activeIndex = "1"), this.getAttrListMany();
      // this.getAttrList((this.type = "only"));
    },
    nextPage2() {
      this.activeIndex = "2";
      this.getAttrListOnly();
    },
    nextPage3() {
      this.activeIndex = "3";
    },
    nextPage4() {
      this.activeIndex = "4";
    },
    nextPage5() {
      this.activeIndex = "5";
    },
    tabClicked() {
      if (this.activeIndex === "1") {
        this.getAttrListMany();
        // this.getAttrList((this.type = "only"));
      } else if (this.activeIndex === "2") {
        this.getAttrListOnly();
      }
    },
    getId() {
      if (this.ArrGoods_cat.length === 3) {
        return this.ArrGoods_cat[2];
      }
      return null;
    },
    getAttrListMany() {
      getAttrList(this.getId(), "many").then(res => {
        console.log(res);
        res.data.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.attrsMany = res.data.data;
        this.testAttrs = res.data.data;
        console.log(this.attrsMany);
      });
    },
    getAttrListOnly() {
      getAttrList(this.getId(), "only").then(res => {
        // console.log(res);
        // res.data.data.forEach(item => {
        //   item.attr_vals =
        //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ") + "";
        // });
        this.attrsOnly = res.data.data;
        // this.testAttrs = res.data.data;
        console.log(this.attrsOnly);
      });
    },
    handleRemove(file) {
      // console.log(file);
      const filePath = file.response.data.tmp_path;
      //从pics数组中找到图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath);

      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.PreviewDialogVisible = true;
    },
    //监听图片上传成功的事件
    handleSuccess(response) {
      // console.log(response)
      const picInfo = {
        pic: response.data.tmp_path
      };
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },
    addGoods() {
      console.log(this.addForm);
      // this.addForm.goods_cat = this.ArrGoods_cat.join(",");
      this.addForm.goods_cat = this.ArrGoods_cat.toString()

      console.log(this.addForm.goods_cat)
      this.attrsMany.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(" ")
        };
        this.addForm.attrs.push(newInfo);
      });
      this.attrsOnly.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        };
        this.addForm.attrs.push(newInfo);
      });
      console.log(this.addForm)
      this.addGood();
    },
    addGood() {
      addGood(
        this.addForm.goods_name,
        this.addForm.goods_cat,
        this.addForm.goods_price,
        this.addForm.goods_number,
        this.addForm.goods_weight,
        this.addForm.goods_introduce,
        this.addForm.pics,
        this.addForm.attrs
      ).then(res => {
        console.log(res);
        if (res.data.meta.status == 201) {
          this.$message.success("添加商品成功");
          this.$router.push("/goods");
        } else {
          this.$message.error('添加商品失败')
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-steps {
  margin-top: 20px;
  margin-bottom: 20px;
}

.next {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.el-checkbox {
  margin: 0 5px 0 0;
}

.previewImg {
  width: 100%;
}

.nextadd {
  display: flex;
  justify-content: center;
  margin-top: 100px;
  margin-bottom: 200px;
}
</style>