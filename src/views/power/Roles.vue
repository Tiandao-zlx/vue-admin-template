<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe style="width: 100%" border height="570px">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom',index1 === 0 ? 'bdtop':'']"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRolesById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="['bdbottom',index2 === 0 ? 'bdtop':'']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRolesById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      @close="removeRolesById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="delRoles(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="showDisRoles(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="ID">
            <el-input v-model="editForm.roleId" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="权限分配"
        :visible.sync="disDialogVisible"
        width="50%"
        @close="setRightDialogClosed"
      >
        <el-tree
          :data="rights"
          :props="rightsProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="disDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getRolesList,
  addRoles,
  delRoles,
  getRole,
  editRole,
  removeRole,
allotRights
} from "@/network/roles";
import { getRightsList } from "@/network/rights.js";

export default {
  data() {
    return {
      rights: [],
      rightsProps: {
        children: "children",
        label: "authName"
      },
      type: "tree",
      rolesList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      disDialogVisible: false,
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      editForm: {},
      addFormRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigge: "blur"
          }
        ]
      },
      editFormRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigge: "blur"
          }
        ]
      },
      //默认选中节点ID值数组
      defKeys: [],
      roleId:0
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    getRolesList() {
      getRolesList().then(res => {
        console.log(res.data.data);
        this.rolesList = res.data.data;
      });
    },
    addRoles() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          addRoles(this.addForm.roleName, this.addForm.roleDesc).then(res => {
            console.log(res);
            if (res.data.meta.status == 201) {
              this.$message.success("添加角色成功");
              this.addDialogVisible = false;
              this.getRolesList();
            } else {
              this.$message.error("添加角色失败");
            }
          });
        } else {
          this.$message.error("添加角色失败，请确定输入信息的格式是否合法");
        }
      });
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    setRightDialogClosed(){
      this.defKeys = []
      this.getRolesList()
    },
    delRoles(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRoles(id).then(res => {
            if (res.data.meta.status == 200) {
              this.$message.success("删除用户成功");
              this.getRolesList();
            } else {
              this.$message.error("删除用户失败");
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
    showEditRoles(id) {
      this.editDialogVisible = true;
      // console.log(id);
      getRole(id).then(res => {
        if (res.data.meta.status == 200) {
          this.$message.success("获取角色数据成功"),
            (this.editForm = res.data.data);
        } else {
          this.$message.error("获取角色数据失败");
        }
        console.log(res);
      });
    },
    editRoles() {
      this.$refs.editFormRef.validate(valid => {
        if (valid == true) {
          editRole(
            this.editForm.roleId,
            this.editForm.roleName,
            this.editForm.roleDesc
          ).then(res => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.$message.success("修改角色数据成功"),
                (this.editDialogVisible = false),
                this.getRolesList();
            } else {
              this.$message.error("修改角色数据失败");
            }
          });
        } else {
          this.$message.error("修改角色数据失败，请检查输入内容是否合法");
        }
      });
    },
    removeRolesById(role, rightId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeRole(role.id, rightId).then(res => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.$message.success("取消权限成功");
              // this.getRolesList()
              role.children = res.data.data;
            } else {
              this.$message.error("取消权限成功");
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
    showDisRoles(role) {
      this.roleId = role.id
      this.disDialogVisible = true;
      getRightsList(this.type).then(res => {
        console.log(res);
        this.rights = res.data.data;
        console.log(this.rights);
      });
      this.getLeafKeys(role, this.defKeys);
    },
    //通过递归的形式，获取角色下所有三级权限的id，并保存到数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafKeys(item, arr));
    },
    //点击为角色分配权限
    allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      console.log(idStr)

      allotRights(this.roleId,idStr).then(res=>{
        console.log(res)
      })

    }
  }
};
</script>
<style lang="stylus" scoped>
.el-row {
  padding-bottom: 10px;
  display: flex;
  align-items: center;
}

.el-tag {
  margin: 10px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>