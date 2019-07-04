<template>
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
      <!--  ref="loginForm" 将当前表单对象添加到了this.$refs中
      :rules 将规则对象和表单关联-->
      <el-form
        class="login-form"
        ref="loginForm"
        :rules="formRules"
        :model="form"
        label-width="80px"
        label-position="top"
      >
        <!-- prop属性 用来指定数据字段 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <!--指定type="password" 密码会变成*** show-password展示密码小眼睛 -->
          <el-input type="password" v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 注册提交事件和重置 -->
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          <el-button @click="loginReset('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
//要实现表单校验：
//1、要先给数据中添加一个校验对象
//2、rules:{表单绑定的数据的名称:[{required:true,message:"提示消息",trigger:"触发校验的时机blur change"}]}
//3、需要把这个校验规则对象绑定到el-form组件上， :rules="校验规则对象"
//4、需要给每一项被校验的el-form-item 组件prop属性，属性值就是绑定的数据的名称
// import axios from "axios";
export default {
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
      },
      formRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 5,
            max: 12,
            message: "用户名必须是5到12个字符",
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "密码必须是6到15个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    /*  submitForm(formName) {
      //this.$refs['loginForm']这个就获取到了表单对象
      this.$refs[formName].validate(valid => {
        if (valid) {
          //valid是表单的校验结果
          //如果校验成功true则发送axios请求
          axios({
            url: "http://localhost:8888/api/private/v1/login",
            method: "post",
            data: this.form
          }).then(({ data: { data, meta } }) => {
            // console.log(meta.status);

            if (meta.status === 200) {
              //登陆成功以后，服务器端会返回给我们一个token
              //我们需要将这个token保存到本地
              //保存到localStorage
              //   console.log("111");

              localStorage.setItem("token", data.token);
              this.$router.push("/home");
            }
          });
        } else {
          //   console.log("error submit!!");

          return false;
        }
      });
    },
    loginReset(formName) {
      this.$refs[formName].resetFields();
    } */
    //user.vue写完时 用async的优化 解决回调地狱
    async submitForm(formName) {
      let valid = await this.$refs[formName].validate();
      if (valid) {
        /*   let res = await axios({
          url: "http://localhost:8888/api/private/v1/login",
          method: "post",
          data: this.form
        });
        if (res.data.meta.status == 200) {
          localStorage.setItem("token", res.data.data.token);
          this.$router.push("/home");        
        } */
        //try...catch...完善login的如果失败丢出错误，并提醒用户 用户名错误
        try {
          let res = await this.$http({
            url: "login",
            method: "post",
            data: this.form
          });
          if (res.data.meta.status == 200) {
            localStorage.setItem("token", res.data.data.token);
            this.$router.push("/home");
          } else {
            this.$message({
              message: res.data.meta.msg,
              type: "error",
              duration: 1000
            });
          }
        } catch (err) {
          // console.log("请求发送失败", err);
        }
      } else {
        return false;
      }
    },
    loginReset(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>
.row-bg {
  height: 100%;
  background-color: #2d434c;
}
.login-form {
  padding: 15px 20px;
  background-color: #fff;
  border-radius: 15px;
  min-width: 400px;
}
</style>
