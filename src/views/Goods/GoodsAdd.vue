<template>
  <div class="goodsAdd">
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>

    <!-- 左侧的tab栏 -->
    <!-- tab-click事件 tab被选中时触发  -->
    <el-tabs :tab-position="tabPosition" :value="activeName" @tab-click="changeTab">
      <el-tab-pane label="基本信息" name="basic">
        <!-- 商品信息的form表单 -->
        <el-form ref="form" :model="addGoodsFormData" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsFormData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsFormData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsFormData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsFormData.goods_number"></el-input>
          </el-form-item>
          <!-- 商品分类的级联选择器 -->
          <el-form-item label="商品分类">
            <el-cascader
              v-model="addGoodsFormData.catArr"
              :options="cateOptions"
              :props="defaultProps"
            ></el-cascader>
          </el-form-item>
          <!-- 是否促销的单选框 -->
          <!-- v-model 绑定值 -->
          <el-form-item label="是否促销">
            <el-radio v-model="addGoodsFormData.is_promote" label="1">是</el-radio>
            <el-radio v-model="addGoodsFormData.is_promote" label="0">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button class="next" type="primary" style="margin-top: 12px;" @click="next(1,'pic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <!-- 商品图片的上传图片 必须是完整路径 -->
        <!-- list-type 文件列表的类型
        headers 设置上传的请求头
        on-success 文件上传成功时的钩子-->
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :headers="headers"
          :on-success="onFileSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button
          class="next"
          type="primary"
          style="margin-top: 12px;"
          @click="next(2,'content')"
        >下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <!-- 富文本编辑器 -->
        <quill-editor v-model="addGoodsFormData.goods_introduce"></quill-editor>
        <el-button class="next" type="primary" style="margin-top: 12px;" @click="addGoods">确认</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      tabPosition: "left",
      active: 0,
      // 添加商品一进来 首先渲染的是第一步基本信息 name="basic"
      activeName: "basic",
      addGoodsFormData: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_introduce: "",
        is_promote: 0,
        catArr: [],
        pics: []
      },
      //   级联选择器中的选项
      cateOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      }
    };
  },
  methods: {
    //当图片上传成功时
    onFileSuccess(res) {
      // console.log(res);

      this.addGoodsFormData.pics.push({
        pic: res.data.tmp_path
      });
    },
    //   点击下一步跳到下一步骤的事件
    next(index, activeName) {
      //1、把步骤条进行切换
      this.active = index;
      //2、把tabs进行切换
      this.activeName = activeName;
    },
    //tab栏中的基本信息 商品图片 商品内容 点击时被触发 要和上面的步骤相对应
    changeTab(tab) {
      // console.log(tab);
      //打印出来的当前tab是一个对象 对象中的index值为从0 开始 0--基本信息 1--商品图片 2--商品内容

      this.active = +tab.index;
    },
    //提交添加的数据
    async addGoods() {
      let newGoods = {
        //获取的是一个字符串
        goods_cat: this.addGoodsFormData.catArr.join(),
        goods_name: this.addGoodsFormData.goods_name,
        goods_price: this.addGoodsFormData.goods_price,
        goods_number: this.addGoodsFormData.goods_number,
        goods_weight: this.addGoodsFormData.goods_weight,
        goods_introduce: this.addGoodsFormData.goods_introduce,
        pics: this.addGoodsFormData.pics,
        is_promote: this.addGoodsFormData.is_promote
      };
      let res = await this.$http({
        url: "goods",
        method: "post",
        data: newGoods
      });

      if (res.data.meta.status == 201) {
        // push 页面跳转
        this.$router.push("/goods");
      }
    }
  },
  async created() {
    let res = await this.$http({
      url: "categories",
      params: {
        type: 3
      }
    });
    this.cateOptions = res.data.data;
    // console.log(111);
  }
};
</script>
<style>
.goodsAdd .el-button.next {
  margin-top: 20px;
}
.quill-editor {
  background-color: #fff;
}
</style>
