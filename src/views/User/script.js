// eslint-disable-next-line
/* eslint-disable */

import axios from 'axios'
export default {
  data() {
    return {
      userList: [],
      total: 0,
      pagesize: 3,
      currentpage: 1,
      keyword: '',
      //控制添加用户的模态框的显示和隐藏
      isAddUserDialogShow: false,
      //分配角色的模态框的显示和隐藏
      isAssainRoleDialogShow: false,
      assainRoleData: {
        username: '',
        rid: ''
      },
      roleList: [],
      //添加用户表单数据
      addUserFormData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加用户表单校验规则
      addUserRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 12,
            message: '用户名长度必须在5-12位',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码长度必须在6-15位',
            trigger: 'change'
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: '邮箱格式不正确',
            trigger: 'change'
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机号码格式不正确',
            trigger: 'change'
          }
        ]
      },
      //修改用户的表单数据
      editUserFormData: {
        id: 0,
        username: '',
        email: '',
        mobile: ''
      },
      //修改模态框的展示和隐藏
      isEditUserDialogShow: false,
      //修改模态框的校验规则
      editUserRules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: '邮箱格式不正确',
            trigger: 'change'
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机号码格式不正确',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    // this.$http({
    //   url: "users",
    //   params: {
    //     query: this.keyword,
    //     pagenum: this.currentpage,
    //     pagesize: this.pagesize
    //   }
    // }).then(res => {
    //   let {
    //     data: { data, meta }
    //   } = res;
    //   this.userList = data.users;
    //   this.total = data.total;
    // });
    //封装了axios发送请求渲染列表数据的函数
    this.getUserList()
  },
  methods: {
    //封装了渲染列表axios的函数
    getUserList() {
      this.$http({
        url: 'users',
        params: {
          query: this.keyword,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        }
      }).then(res => {
        // console.log(res);
        // this.userList = res.data.data.users;

        let {
          data: { data, meta }
        } = res
        this.userList = data.users
        this.total = data.total
      })
    },
    //更新角色
    async updateRole() {
      let res = await this.$http({
        url: `users/${this.assainRoleData.id}/role`,
        method: 'put',
        data: {
          rid: this.assainRoleData.rid
        }
      })
      this.$message({
        type: 'success',
        message: res.data.meta.msg,
        duration: 1000
      })
      this.isAssainRoleDialogShow = false
    },
    //分配角色的模态框展示
    async showAssainRoleDialog(row) {
      this.isAssainRoleDialogShow = true
      console.log(row)
      let res = await this.$http({
        url: `users/${row.id}`
      })
      this.assainRoleData = res.data.data
      let roleResult = await this.$http({
        url: 'roles'
      })
      this.roleList = roleResult.data.data
    },
    onPageChange(page) {
      console.log('页码发生改变了', page)
      this.currentpage = page
      // 重新去后端请求数据
      this.getUserList()
    },
    //search 重新渲染列表数据
    search() {
      this.currentpage = 1
      this.getUserList()
    },
    //切换用户状态信息
    async toggleState(user) {
      console.log(user)
      //切换状态后 应该给后台发送数据请求，将当前用户的状态进行修改
      let res = await this.$http({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: 'put'
      })
      if (res.data.meta.status == 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg,
          duration: 1000
        })
      } else {
        this.$message({
          type: 'error',
          message: res.data.meta.msg,
          duration: 1000
        })
        //后台请求出错之后，状态未修改成功，所以页面上的switch也不应该被修改，我们把他修改为原来的状态
        user.mg_state = !user.mg_state
      }
    },
    //删除用户信息
    async delUser(id) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        //向后台发送请求，删除当前行的用户
        let res = await this.$http({
          url: `users/${id}`,
          method: 'delete'
        })
        //重新渲染当前的列表数据
        console.log(res)
        if (res.data.meta.status == 200) {
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 1000
          })
          ;(this.currentpage = 1), this.getUserList()
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    //打开添加用户的模态框
    openAddUserDialog() {
      this.isAddUserDialogShow = true
    },
    //添加用户信息
    async addUser() {
      // 1. 先进行表单校验
      try {
        await this.$refs.addUserForm.validate()
        console.log('校验成功')
        // 2. 表单校验成功之后发送ajax请求
        let res = await this.$http({
          url: 'users',
          method: 'post',
          data: this.addUserFormData
        })
        console.log(res)
        if (res.data.meta.status == 201) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success',
            duration: 1000
          })
          this.getUserList()
          this.isAddUserDialogShow = false
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: 'error',
            duration: 1000
          })
        }
      } catch (err) {
        console.log('校验失败')
      }
    },
    //打开修改用户的模态框
    async openEditUserDialog(id) {
      console.log('hh')
      // 1. 打开模态框
      this.isEditUserDialogShow = true
      // 2. 使用id去后台获取用户数据，展示到模态框中
      let res = await this.$http({
        url: `users/${id}`
      })
      console.log(res)
      this.editUserFormData = res.data.data
    },
    //修改用户信息
    async editUser() {
      try {
        await this.$refs.editUserForm.validate()
        //向后台发送提交请求，修改用户数据
        let res = await this.$http({
          url: `users/${this.editUserFormData.id}`,
          method: 'put',
          data: {
            mobile: this.editUserFormData.mobile,
            email: this.editUserFormData.email
          }
        })
        if (res.data.meta.status == 200) {
          //提示更新成功
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 1000
          })
          //刷新列表
          this.getUserList()
          //关闭模态框
          this.isEditUserDialogShow = false
        } else {
          this.$message({
            type: 'error',
            message: res.data.meta.msg,
            duration: 1000
          })
        }
      } catch (err) {}
    }
  }
}
