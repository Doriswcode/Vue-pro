<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加商品的按钮 -->
    <!-- 点击添加商品按钮 跳转到goods-add页面 -->
    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <!-- table表格 斑马条纹stripe 带索引 -->
    <!-- :data绑定数据  -->
    <el-table :data="goodsList" style="width: 100%" stripe>
      <!-- index索引号 -->
      <el-table-column type="index"></el-table-column>
      <!--  prop 对应列内容的字段名，也可以使用 property 属性
      label 标题名称-->
      <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="180"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="180"></el-table-column>
      <el-table-column label="操作">
        <!-- 未做  -->
        <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
        <!-- 删除删除整行信息  未做-->
        <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsList: [],
      //   pagenum 是当前页码
      pagenum: 1,
      //pagesize 是一页显示的数据
      pagesize: 6,
      total: 0
    };
  },
  methods: {
    //   封装渲染列表数据的函数
    async getGoodsList() {
      let res = await this.$http({
        url: "goods",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      this.goodsList = res.data.data.goods;
      this.total = res.data.data.total;
    },
    //当分页的按钮点击后的事件
    changePage(currentPage) {
      this.pagenum = currentPage;
      this.getGoodsList();
    }
  },
  created() {
    this.getGoodsList();
  }
};
</script>