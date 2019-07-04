<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="6">
          <div class="logo">
            <img src="../../assets/logo.png" alt />
          </div>
        </el-col>
        <el-col>
          <h1>电商后台管理系统</h1>
        </el-col>
        <el-col :span="6">
          <div class="header_right">
            欢迎上海39期钻石会员
            <a href="#" @click.prevent="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu v-for="menu1 in menuList" :key="menu1.id" :index="menu1.id + ''">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu1.authName}}</span>
            </template>
            <el-menu-item v-for="menu2 in menu1.children" :key="menu2.id" :index="'/' + menu2.path">
              <i class="el-icon-menu"></i>
              <span>{{menu2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: []
    };
  },
  async created() {
    let res = await this.$http({
      url: "menus"
    });
    this.menuList = res.data.data;
  },
  methods: {
    logout() {
      //清空token
      localStorage.removeItem("token");
      //跳转到登陆页
      this.$router.push("/login");
    }
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
.el-container {
  height: 100%;
  background-color: #eaeef1;
}
.el-container .el-header {
  padding: 0;
  background-color: #b3c1cd;
}
.el-header .el-col {
  text-align: center;
}
.el-col .logo img {
  width: 200px;
}
.el-header .el-col h1 {
  font-size: 30px;
  color: #fff;
}
.el-header .el-col .header_right {
  padding-right: 15px;
}
.el-col .header_right {
  font-weight: 700;
}
.el-col .header_right a {
  color: orange;
}

.el-aside {
  height: 100%;
}

.el-aside .el-menu {
  height: 100%;
}
</style>


