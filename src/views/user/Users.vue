<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="query"
            clearable
            @clear="getUsersList"
            @input="getUsersList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="usersList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>

        <el-table-column prop="email" label="邮箱地址"></el-table-column>
        <el-table-column prop="role_name" label="权限"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" @click="delUsers(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
      <!-- 添加用户弹窗对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主题区域 -->
        <!-- <span>欢迎来到曲🐏烧烤摊</span> -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户对话框 -->
      <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUsers">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getUsersList,
  putMgState,
  addUsers,
  delUser,
  getUser,
  editUser
} from "@/network/users";
export default {
  data() {
    //自定义验证规则
    var checkmobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };
    return {
      usersList: [],
      total: 0,
      query: "",
      pagenum: 0,
      pagesize: 2,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      editDialogVisible: false,

      // id:0,
      // mg_state:true
      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //修改用户的表单数据
      editForm: {},
      //添加表单的验证规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigge: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigge: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigge: "blur"
          },
          {
            min: 6,
            message: "密码长度不小于6位",
            trigge: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigge: "blur"
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigge: "blur"
          },
          {
            validator: checkmobile,
            trigger: "blur"
          }
        ]
      },
      editFormRules: {
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigge: "blur"
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigge: "blur"
          },
          {
            validator: checkmobile,
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    getUsersList(query, pagenum, pagesize) {
      getUsersList(this.query, pagenum, pagesize).then(res => {
        // console.log(res.data);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取用户列表失败");
        } else {
          // this.$message.success("获取用户列表成功");
        }
        this.usersList = res.data.data.users;
        this.total = res.data.data.total;
        this.pagenum = res.data.data.pagenum;
      });
    },
    // async getUsersList() {
    //   const { data: res } = await this.$http.get("users", {
    //     params: this.queryInfo
    //   })
    //   if(res.meta.status !== 200){
    //     return this.$message.error('获取用户列表失败');
    //   }
    //   this.usersList = res.data.users
    //   this.total = res.data.total
    //   console.log(res.data)
    // }
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.pagesize = newSize;
      this.getUsersList(0, this.pagenum, this.pagesize);
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.pagenum = newPage;
      this.getUsersList(0, this.pagenum, this.pagesize);
    },
    //监听switch开关状态的改变
    userStateChanged(userinfo) {
      // console.log(userinfo);
      // this.id = userinfo.id
      // this.mg_state = userinfo.mg_state
      putMgState(userinfo.id, userinfo.mg_state).then(res => {
        // console.log(res);
        // console.log(userinfo);
        if (res.data.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error("更新用户状态失败");
        }
        this.$message.success("更新用户状态成功");
      });
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        // console.log(valid)
        if (valid) {
          //添加用户
          addUsers(
            this.addForm.username,
            this.addForm.password,
            this.addForm.email,
            this.addForm.mobile
          ).then(res => {
            // console.log(res);
            if (res.data.meta.status == 201) {
              this.$message.success("添加用户成功");

              this.addDialogVisible = false;
              this.getUsersList(this.query, this.pagenum, this.pagesize);
            } else {
              this.$message.error("添加用户失败");
            }
          });
        } else {
          this.$message.error("添加用户失败，请确定输入信息的格式是否合法");
        }
      });
    },
    //删除用户信息
    delUsers(id) {
      // console.log(userinfo)
      // delUser(userinfo.id * 1).then(res => {
      //   console.log(res)
      // })
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delUser(id).then(res => {
            // console.log(res);
            if (res.data.meta.status == 200) {
              this.$message.success("删除用户成功");
              this.getUsersList(this.query, this.pagenum, this.pagesize);
            } else {
              this.$message.error("删除用户失败");
            }
          });
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    showEditDialog(id) {
      this.editDialogVisible = true;
      // console.log(id);
      getUser(id).then(res => {
        // console.log(res);
        if (res.data.meta.status == 200) {
          return (
            this.$message.success("获取用户信息成功"),
            (this.editForm = res.data.data)
            // console.log(res.data.data)
          );
        } else {
          this.$message.error("获取用户信息失败");
        }
      });
    },
    editUsers() {
      this.$refs.editFormRef.validate(valid => {
        if (valid == true) {
          editUser(
            this.editForm.id,
            this.editForm.email,
            this.editForm.mobile
          ).then(res => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.$message.success("修改用户信息成功"),
              this.editDialogVisible = false,
              this.getUsersList(this.query, this.pagenum, this.pagesize)
            } else {
              this.$message.error('修改用户信息失败')
            }
          });
        } else {
          this.$message.error("修改用户信息失败，请查看输入内容是否合法");
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}

.el-pagination {
  margin-top: 15px;
}
</style>