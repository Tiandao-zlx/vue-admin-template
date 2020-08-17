<template>
  <div class="about">
    <div class="loginForm">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../../assets/timg.jpg" alt />
      </div>
      <!-- 登陆表单区 -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="25%"
        class="demo-ruleForm"
      >
        <!-- 账号 -->
        <el-form-item label="账号" prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="ruleForm.username"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
            v-model="ruleForm.password"
          ></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "About",
  components: {},
  data() {
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        password: "123456",
        username: "admin"
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: "blur" },
          { min: 6, message: "密码长度最短为6位", trigger: "blur" }
        ],
        username: [{ validator: checkUsername, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        // if (valid) {
        //   const {data : res} = await this.$http.post('login',this.ruleForm);
        //   console.log(res)
        //   // sessionStorage.setItem("token", "123123");
        //   this.$router.push({ path: "/" });
        // } else {
        //   console.log("error submit!!");
        //   return false;
        // }
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.ruleForm);
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error("登陆失败");
        this.$message.success("登陆成功");
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/");
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="stylus" scoped>
.about {
  background: url('login1.jpg');
  background-size: cover;
  background-color: #2D3A4B;
  height: 100%;
}

.loginForm {
  width: 550px;
  height: 350px;
  background-color: #fff;
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

// margin 200px auto
.demo-ruleForm {
  position: absolute;
  bottom: 15%;
  width: 450px;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: center;
}
</style>
