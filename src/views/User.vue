<template>
  <!-- 面包屑 -->
  <div class="user_container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" class="input-with-select"></el-input>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="success" plain>添加用户</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态" >
        <template v-slot="{row}">
          <el-switch v-model="row.my_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
        <el-button type="success" icon="el-icon-check" size="mini" plain>分配角色</el-button>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      userList: []
    };
  },
  created() {
    axios({
      url: "http://localhost:8888/api/private/v1/users",
      params: {
        pagenum: 1,
        pagesize: 3
      },
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then(res => {
      let {
        data: { data, meta }
      } = res;
      this.userList = data.users;
    });
  }
};
</script>
<style>
.el-main .el-breadcrumb {
  padding-left: 10px;
  height: 50px;
  line-height: 50px;
  background-color: #d4dae0;
  font-size: 16px;
}
.user_container .info {
  margin-top: 0 !important;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
