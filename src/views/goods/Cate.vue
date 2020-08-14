<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">填加分类</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="cateList"
        stripe
        row-key="cat_id"
        style="width: 100%"
        border
        height="556px"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="index" label="#">
          <template slot-scope="scope">
            <!-- <pre>{{scope.row}}</pre> -->
            {{getIndex(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column prop="cat_name" label="商品类型"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color : lightgreen"></i>
            <i class="el-icon-error" v-if="scope.row.cat_deleted" style="color : red"></i>
          </template>
        </el-table-column>

        <el-table-column prop="cat_level" label="商品级别">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag v-if="scope.row.cat_level == 1" type="success">二级</el-tag>
            <el-tag v-if="scope.row.cat_level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-button type="primary" icon="el-icon-edit" @click="editCate(scope.row.cat_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="delCate(scope.row.cat_id)">删除</el-button>
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
        title="增加商品分类"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="选择父类">
            <!-- 选择任意一级父类可用旧版属性 change-on-select-->
            <el-cascader
              v-model="value"
              :options="parentCateList"
              clearable
              :props="{ expandTrigger: 'hover' ,value:'cat_id',label:'cat_name',children:'children',checkStrictly:true,}"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%">
        <!-- <span>这是一段信息</span> -->
        <el-form :model="editForm" label-width="70px" :rules="editFormRules" ref="editFormRef">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCategory">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getCategoriesList,
  addCatergory,
  delCatergory,
  getCateById,
  editCategory
} from "@/network/cate";
export default {
  data() {
    return {
      editForm: [],
      value: [],
      cateList: [],
      parentCateList: [],
      label: "",
      addDialogVisible: false,
      editDialogVisible: false,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      addForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      editFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入商品分类名称",
            trigge: "blur"
          }
        ]
      },
      addFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入商品分类名称",
            trigge: "blur"
          }
        ]
      },
      total: 0
    };
  },
  created() {
    this.getCategoriesList();
    this.getParentCateList();
  },
  methods: {
    getCategoriesList() {
      getCategoriesList(
        this.queryInfo.type,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then(res => {
        console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success("获取商品分类成功");
          this.cateList = res.data.data.result;
          console.log(this.cateList);
          this.total = res.data.data.total;
        }
      });
    },
    getIndex(row) {
      if (row.cat_level === 0) {
        for (let i in this.cateList) {
          if (this.cateList[i].cat_id === row.cat_id) {
            return i * 1 + 1;
          }
        }
      }
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.value = [];
      this.addForm.cat_pid = 0;
      this.addForm.cat_level = 0;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCategoriesList(
        1,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      );
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCategoriesList(
        1,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      );
    },
    getParentCateList() {
      // this.getCategoriesList(3,"" ,"" )
      getCategoriesList(2, "", "").then(res => {
        console.log(res);
        this.parentCateList = res.data.data;
      });
    },
    handleChange(value) {
      console.log(value);
      if (value.length > 0) {
        this.addForm.cat_pid = value[value.length - 1];
        this.addForm.cat_level = value.length;
        return;
      } else {
        this.addForm.cat_pid = 0;
        this.addForm.cat_level = 0;
      }
    },
    addCate() {
      if (this.addForm.cat_name != "") {
        addCatergory(
          this.addForm.cat_pid,
          this.addForm.cat_name,
          this.addForm.cat_level
        ).then(res => {
          console.log(res);
          if (res.data.meta.status == 201) {
            this.$message.success("添加商品分类成功");
            this.getCategoriesList(), (this.addDialogVisible = false);
          }
        });
        console.log(this.addForm);
      } else {
        this.$message.error("添加商品分类失败，请检查输入数据是否合法");
      }
    },
    delCate(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delCatergory(id).then(res => {
            console.log(res);

            if (res.data.meta.status == 200) {
              this.$message.success("删除分类成功"),
                this.getCategoriesList(
                  1,
                  this.queryInfo.pagenum,
                  this.queryInfo.pagesize
                );
            } else {
              this.$message.error("删除商品分类失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      // delCatergory(id).then(res=>{
      //     console.log(res)
      // })
    },
    editCate(id) {
      console.log(id);
      getCateById(id).then(res => {
        console.log(res);
        this.editForm = res.data.data;
        this.editDialogVisible = true;
      });
    },
    editCategory() {
      this.$refs.editFormRef.validate(valid => {
        if (valid == true) {
          editCategory(this.editForm.cat_id, this.editForm.cat_name).then(
            res => {
              if (res.data.meta.status == 200) {
                this.$message.success("修改商品分类名称成功");
                this.getCategoriesList(
                  1,
                  this.queryInfo.pagenum,
                  this.queryInfo.pagesize
                );
                this.editDialogVisible = false;
              } else {
                this.$message.error("修改商品名称失败");
              }
              console.log(res);
            }
          );
        } else {
          this.$message.error("修改分类名称失败，请检查输入内容是否合法");
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-row {
  bottom: 10px;
}
</style>