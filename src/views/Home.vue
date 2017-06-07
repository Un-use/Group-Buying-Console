<template>
  <div class="home">
    <el-row class="grid-content bg-blue">
      <el-col :span="24" style="height: 75px;">
        <el-col :span="12">
          <span :span="6" class="head-title">团购后端系统</span>
        </el-col>
        <el-col :span="12">
          <img :src="userData.avatar" width="50" height="50" style="padding-top: 2px; border-radius: 25px;"/>
          <div>
            <span style="font-size: 15px; color: white;">
              {{userData.username}}
            </span>
            <el-dropdown>
              <span class="el-dropdown-link head-title" style="font-size: 10px; line-height: 0px;">
                下拉菜单<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">设置</el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-col>
      <el-col :span="24" class="main">
        <el-col :span="3" style="min-height: 620px; min-width: 150px;">
          <el-menu default-active="1-1" :router="true" class="el-menu-vertical-demo" theme="dark" style="height: 100%;">
            <el-submenu index="1">
              <template slot="title">用户</template>
              <el-menu-item index="/user">用户管理</el-menu-item>
              <el-menu-item index="/user/address">用户收件地址管理</el-menu-item>
              <el-menu-item index="/user/cart">购物车管理</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">商品</template>
              <el-menu-item index="/mall/item">商品管理</el-menu-item>
              <el-menu-item index="/mall/set">商品集管理</el-menu-item>
              <el-menu-item index="/mall/order">订单管理</el-menu-item>
              <el-menu-item index="/mall/comment">评论管理</el-menu-item>
              <el-menu-item index="/mall/returnGoods">退货管理</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
        <el-col :span="21" style="min-width: 800px; min-height: 620px;" :style="{ height: contentHeight + 'px'}">
          <div class="grid-content bg-purple-light">
            <el-col :span="24" style="height: 20px; background-color: aqua;">
              <strong style="width: 200px; float: left; color: #20A0FF;">{{$route.name}}</strong>
              <el-breadcrumb separator="/" style="float: right;">
                <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                  {{item.name}}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </el-col>
            <el-col :span="24" style="box-sizing: border-box; min-height: 600px; padding: 20px;" :style="{ height: (contentHeight-20) + 'px'}">
              <router-view></router-view>
            </el-col>
          </div>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { isValidSessionData } from '../common/Util'

export default {
  name: 'home',

  data () {
    return {
      token: '',
      userData: {},
      contentWidth: '',
      contentHeight: '',
    };
  },

  methods: {
    logout () {
      this.$confirm('确认退出吗?', '提示', {
        type: 'warning'
      }).then(() => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userData');
        this.$router.push('/login');
      }).catch( () => {

      });
    },
  },

  mounted () {
    this.token = sessionStorage.getItem('token');
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    if (typeof window.innerWidth !== 'undefined') {
      this.contentWidth = window.innerWidth - 275;
      this.contentHeight = window.innerHeight - 90;
    } else {
      this.contentWidth = document.documentElement.clientWidth - 300;
      this.contentHeight = document.documentElement.clientHeight - 80;
    }
    window.onresize = () => {
      return (() => {
        if (typeof window.innerWidth !== 'undefined') {
          this.contentWidth = window.innerWidth - 275;
          this.contentHeight = window.innerHeight - 90;
        } else {
          this.contentWidth = document.documentElement.clientWidth - 300;
          this.contentHeight = document.documentElement.clientHeight - 80;
        }
      }) ()
    }
  }

}
</script>

<style scoped>

  .main {
    background: white;
    position: absolute;
    top: 77px;
    bottom: 0;
    min-width: 1000px;
  }

  .el-row {
    margin-bottom: 20px;
    &:last-child {
     margin-bottom: 0;
   }
  }

  .el-col {
    border-radius: 4px;
    height: 75px;
  }

  .bg-blue {
    background: #20A0FF;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 75px;
  }

  .head-title {
    color: white;
    font-size: 26px;
    line-height: 75px;
  }

  .content-container {
    background-color: #505458;
    overflow-y: scroll;
    padding: 20px;
    flex: 1;
    float: left;
  }

</style>
