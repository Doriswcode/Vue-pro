<template>
  <div class="categories">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类商品 注册点击事件显示模态框 -->
    <el-button type="success" plain @click="ShowAddCateDialog">添加分类</el-button>
    <!-- 添加分类商品的模态框 -->
    <el-dialog title="添加分类" :visible.sync="isShowAddCateDialog">
      <el-form :model="addCateFormData" label-width="100px" ref="addCateForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFormData.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <!-- 级联选择器 -->
          <!-- clearable 是否支持清空选项 -->
          <el-cascader
            v-model="addCateFormData.parentArr"
            :options="cateOptions"
            :props="defaultProps"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- table表格 -->
    <el-table :data="categoryList" style="width: 100%" stripe>
      <!-- 使用组件第三方的插件element-tree-grid  ElTreeGrid -->
      <el-table-tree-column
        file-icon="el-icon-notebook-2"
        folder-icon="icon icon-folder"
        prop="cat_name"
        label="分类名称"
        width="220"
        tree-key="cat_id"
        parent-key="cat_pid"
        level-key="cat_level"
        :indent-size="30"
      ></el-table-tree-column>

      <!--  prop 对应列内容的字段名，也可以使用 property 属性
      label 标题名称-->
      <el-table-column label="是否有效" width="180">
        <template v-slot="{row}">{{row.cat_deleted ? "否":"是"}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级" width="180"></el-table-column>
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
// 只在当前页面使用该组件
const ElTreeGrid = require("element-tree-grid");
export default {
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      isShowAddCateDialog: false,
      addCateFormData: {
        cat_name: "",
        parentArr: []
      },
      cateOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        //是否可单级选择
        checkStrictly: true
      }
    };
  },

  methods: {
    //渲染数据的封装函数
    async getCategoryList() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      this.categoryList = res.data.data.result;
      this.total = res.data.data.total;
    },
    changePage(currentPage) {
      this.pagenum = currentPage;
      this.getCategoryList();
    },
    // 点击添加分类按钮 注册点击事件 显示隐藏的模态框
    async ShowAddCateDialog() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 2
        }
      });
      this.cateOptions = res.data.data;
      this.isShowAddCateDialog = true;
    },
    //模态框添加数据,点击确认后，数据提交
    async addCate() {
      //获取表单数据
      let cat_name = this.addCateFormData.cat_name;
      //   console.log("hah");
      //cat_level其实可以直接用parenArr.length
      let cat_level = this.addCateFormData.parentArr.length;
      // this.addCateFormData.parentArr  这个里面放的是所有的父分类的id,只需要最后一个就可以了
      let cat_pid = this.addCateFormData.parentArr.pop() || 0;
      //获取cat_level
      //向后台提交数据
      let res = await this.$http({
        url: "categories",
        method: "post",
        data: {
          cat_name,
          cat_level,
          cat_pid
        }
      });
      //   console.log(res.data.meta.status);

      if (res.data.meta.status == 201) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        //模态框关闭
        this.isShowAddCateDialog = false;
        //重置表单
        // console.log(123);
        console.log(this);
        //此方法只有在实行表单验证时才会清空
        this.$refs.addCateForm.resetFields();
        //由于级联选择器不属于表单内容 所以需要手动清空
        this.addCateFormData.parentArr = [];

        //重新获取数据
        this.getCategoryList();
      }
    }
  },
  created() {
    this.getCategoryList();
  }
};
</script>
