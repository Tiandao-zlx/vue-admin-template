<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert type="warning">
        <i class="el-icon-warning" style="font-size:20px">注意：只允许为第三级分类设置参数！</i>
      </el-alert>
      <div class="category">
        <a>选择商品分类：</a>
        <el-cascader
          v-model="value"
          :options="categoriesList"
          clearable
          :show-all-levels="false"
          :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
          @change="handleChange"
        ></el-cascader>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <el-table :data="attrList" border stripe height="445px">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column>
              <template v-slot="scope">
                <!-- {{scope.row}} -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="getAttrById(scope.row.attr_id,scope.row.attr_vals)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="delAttr(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <el-table :data="attrList" border stripe height="445px">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column>
              <template v-slot="scope">
                <!-- {{scope.row}} -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="getAttrById(scope.row.attr_id,scope.row.attr_vals)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="delAttr(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-dialog title="添加参数" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- <span>这是一段信息</span> -->
        <el-form :model="addForm" label-width="70px" :rules="addFormRules" ref="addFormRef">
          <el-form-item label="参数名称" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAttr">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="添加属性" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- <span>这是一段信息</span> -->
        <el-form :model="addForm" label-width="70px" :rules="addFormRules" ref="addFormRef">
          <el-form-item label="属性名称" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAttr">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改参数" :visible.sync="editDialogVisible" width="50%">
        <el-form :model="attrInfo" label-width="70px" :rules="addFormRules" ref="editFormRef">
          <el-form-item label="参数名称" prop="attr_name">
            <el-input v-model="attrInfo.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAttr">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getCategoriesList } from "@/network/cate";
import {
  getAttrList,
  addAttr,
  delAttr,
  getAttrById,
  editAttr
} from "@/network/params";
export default {
  data() {
    return {
      inputVisible: false,
      inputValue: "",
      value: [],
      categoriesList: [],
      //被激活的页签名称
      activeName: "first",
      sel: "many",
      attrList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      attrInfo: [],
      addForm: {
        attr_name: "",
        attr_sel: "",
        attr_vals: ""
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigge: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getCategoriesList();
  },
  //   mounted(){
  //     this.getAttrList()

  //   },
  methods: {
    getCategoriesList() {
      getCategoriesList().then(res => {
        console.log(res);
        this.categoriesList = res.data.data;
      });
    },
    handleChange(value) {
      console.log(value);
      if (value.length !== 3) {
        this.value = [];
        this.attrList = []
        return;
      }
      this.getAttrList();
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击页签事件的处理函数
    handleClick() {
      console.log(this.activeName);
      if (this.activeName === "first") {
        this.sel = "many";
      } else {
        this.sel = "only";
      }
      console.log(this.sel);
      this.getAttrList();
    },
    getId() {
      if (this.value.length === 3) {
        return this.value[2];
      }
      return null;
    },
    getAttrList() {
      getAttrList(this.getId(), this.sel).then(res => {
        // 将attr_vals中的数据变成数组的形式
        res.data.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          (item.inputVisible = false), (item.inputValue = "");
          // console.log(res);
        });
        this.attrList = res.data.data;
      });
    },
    addAttr() {
      this.$refs.addFormRef.validate(valid => {
        if (valid == true) {
          addAttr(
            this.getId(),
            this.addForm.attr_name,
            this.sel,
            this.addForm.attr_vals
          ).then(res => {
            if (res.data.meta.status == 201) {
              this.$message.success("添加成功");
              this.addDialogVisible = false;
              this.getAttrList();
            } else {
              this.$message.error("添加失败");
            }
            console.log(res);
          });
        } else {
          this.$message.error("添加失败，请检查输入的内容是否合法");
        }
      });
    },
    delAttr(attr_id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delAttr(this.getId(), attr_id).then(res => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.$message.success("删除成功"), this.getAttrList();
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
    getAttrById(attrId, attr_vals) {
      getAttrById(this.getId(), attrId, this.sel, attr_vals).then(res => {
        // console.log(res)
        this.attrInfo = res.data.data;
        this.editDialogVisible = true;
      });
    },
    // editAttr() {
    //   this.editAttrMain();
    //   this.getAttrList();
    // },
    editAttr() {
      editAttr(
        this.attrInfo.cat_id,
        this.attrInfo.attr_id,
        this.attrInfo.attr_name,
        this.attrInfo.attr_sel,
        this.attrInfo.attr_vals
      ).then(res => {
        console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success("修改成功"), (this.editDialogVisible = false);
          this.getAttrList();
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    // getAttrByIdMain(attrId, attr_vals) {
    //   getAttrById(this.getId(), attrId, this.sel, attr_vals).then(res => {
    //     // console.log(res)
    //     this.attrInfo = res.data.data;
    //   });
    // },
    saveEditAttr(row){
      editAttr(
        row.cat_id,
        row.attr_id,
        row.attr_name,
        row.attr_sel,
        row.attr_vals.join(' ')
      ).then(res => {
        console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success("修改成功"), (this.editDialogVisible = false);
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    showInput(row) {
      row.inputVisible = true;
      //nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
      // getAttrById(this.getId(), row.attr_id, this.sel, row.attr_vals).then(
      //   res => {
      //     console.log(res);
      //     this.attrInfo = res.data.data;
      //   }
      // );
    },
    //文本框失去焦点，或者按钮下回车时都会触发
    handleInputConfirm(row) {
      console.log("ok");
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // row.inputVisible = false
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      // this.attrInfo.attr_vals = row.attr_vals.join(" ");
      // console.log(this.attrInfo)
      // this.editAttr();
      this.saveEditAttr(row)
      // editAttr(
      //   this.attrInfo.cat_id,
      //   this.attrInfo.attr_id,
      //   this.attrInfo.attr_name,
      //   this.attrInfo.attr_sel,
      //   this.attrInfo.attr_vals
      // ).then(res => {
      //   console.log(res);
      //   if (res.data.meta.status == 200) {
      //     this.$message.success("修改成功"), (this.editDialogVisible = false);
      //   } else {
      //     this.$message.error("修改失败");
      //   }
      // });
    },
    handleClose(index, row) {
      // this.getAttrByIdMain(row.attr_id,row.attr_vals)
      row.attr_vals.splice(index, 1);
      this.saveEditAttr(row)


      // this.attrInfo.attr_vals = row.attr_vals.join(' ');
      // console.log(this.attrInfo)
      // this.editAttr();
      // editAttr(
      //   row.cat_id,
      //   row.attr_id,
      //   row.attr_name,
      //   row.attr_sel,
      //   row.attr_vals.join(' ')
      // ).then(res => {
      //   console.log(res);
      //   if (res.data.meta.status == 200) {
      //     this.$message.success("修改成功"), (this.editDialogVisible = false);
      //   } else {
      //     this.$message.error("修改失败");
      //   }
      // });
    }
  },
  computed: {
    //如果按钮需要被禁用，返回true
    isBtnDisabled() {
      if (this.value.length !== 3) {
        return true;
      }
      return false;
    }
  }
};
</script>
<style lang="stylus" scoped>
.category {
  font-size: 20px;
  margin-top: 20px;
}

.el-table {
  margin-top: 10px;
}

.el-tag {
  margin-left: 10px;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
}
</style>