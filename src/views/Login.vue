<template>
  <div>
    <!--定义校验规则-->
    <el-form
        :rules="rules"
        ref="loginForm"
        :model="loginForm"
        class="loginContainer"
        v-loading="loading"
        element-loading-text="正在登陆..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
      <h3 class="loginTitle">Kyno</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码" @keydown.enter.native="submitLogin()">
        </el-input>
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%;" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>


export default {
  name: "Login",
  data() {
    return {
      loading: false,
      loginForm: {
        username: 'admin',
        password: '123'
      },
      checked: true,
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]
      }
    };
  },
  methods: {
    submitLogin() {
      // alert("登录成功")
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // alert('submit!');
          this.postKeyValueRequest("/doLogin", this.loginForm).then(resp => {
            this.loading = false;
            if (resp) {
              const h = this.$createElement;
              this.$notify({
                title: 'Message',
                message: h('i', { style: 'color: teal'}, '登陆成功😁')
              });
              // alert(JSON.stringify(resp));
              // 保存登陆的信息
              window.sessionStorage.setItem("user", JSON.stringify(resp.obj));
              // 页面跳转 replace替换,不能点击后退按钮，push往栈里压，可以点击后退按钮
              let path = this.$route.query.redirect;
              this.$router.replace((path =='/' || path == undefined) ? '/home' : path)
            }
          });
        } else {
          this.$message.error("请输入所有字段")
          return false;
        }
      });
    },
  },
}
</script>

<style>

  .loginContainer {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 15px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
  .loginTitle {
    margin: 15px auto 20px auto;
    text-align: center;
    color: #505458;
  }
  .loginRemember {
    text-align: left;
    margin: 0px 0px 15px 0px;
  }


</style>
