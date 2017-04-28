<template>
  <div class="login">
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="phone">
        <el-input type="text" v-model="ruleForm.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item style="width: 100%;">
        <el-button type="primary" style="width: 100%;" :loading="logining" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
    <router-view></router-view>
  </div>
</template>

<script>
import { authApi } from '../api/api'

export default {
  name: 'login',

  data () {
    return {
      logining: false,
      ruleForm: {
        phone: '',
        password: '',
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      }
    }
  },

  methods: {
    login () {
      this.logining = true;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$http.post(authApi().confirmUser, this.ruleForm, {
            emulateJSON: true,
          }).then((response) => {
            if (0 === response.body.result) {
              sessionStorage.setItem('token', response.body.token);
              sessionStorage.setItem('userData', JSON.stringify(response.body.userData));
              this.$router.push('/home');
            } else {
              this.$message({
                message: response.body.errorInfo,
                type: 'error'
              });
            }
            this.logining = false;
          }, (response) => {
            console.log(response);
            this.$message({
              message: response.body.errorInfo,
              type: 'error'
            });
            this.logining = false;
            return false;
          });
        }
      });
    },

  }
}
</script>

<style scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
</style>
