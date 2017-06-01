<template>
  <div class="user">
    <el-row>
      <el-input v-model="uid" placeholder="请输入UID" style="width: 300px;" size="large">
        <el-button slot="append" icon="search" @click="getUserData"></el-button>
      </el-input>
    </el-row>
    <el-row style="padding-top: 20px;">
      <el-col :span="24">
        <div style="margin: 0 auto; width: 260px;">
          <table width="260" border="1" style="text-align: center;">
            <tr>
              <td>UID</td>
              <td>{{userData.uid}}</td>
            </tr>
            <tr>
              <td>手机号</td>
              <td>{{userData.phone}}</td>
            </tr>
            <tr>
              <td>姓名</td>
              <td>{{userData.name}}</td>
            </tr>
            <tr>
              <td>用户名</td>
              <td>{{userData.username}}</td>
            </tr>
            <tr>
              <td>性别</td>
              <td>{{userData.gender}}</td>
            </tr>
            <tr>
              <td>头像</td>
              <td><img :src="userData.avatar" width="50" height="50" style="border-radius: 25px;"/></td>
            </tr>
            <tr>
              <td>余额</td>
              <td>{{userData.funds}}</td>
            </tr>
            <tr>
              <td>创建时间</td>
              <td>{{userData.createTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}</td>
            </tr>
            <tr>
              <td>余额</td>
              <td>{{userData.updateTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}</td>
            </tr>
          </table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { isValidSessionData, isValidValue } from '../../common/Util'
import { contentType, userApi } from '../../api/api'

export default {
  name: 'user',

  data () {
    return {
      token: '',
      userData: {},
      uid: '',
      loading: false,
    }
  },

  methods: {
    getUserData () {

      if (this.loading) {
        return;
      }

      this.loading = true;
      if (isValidValue(this.uid)) {
        let data = {
          uid: this.uid,
          token: this.token
        };

        this.$http.get(userApi().getUser, {
          params: data,
          emulateJSON: true
        }).then((response) => {
          if (0 === response.body.result) {
            this.userData = response.body.userData;
          } else {
            this.$message({
              message: response.body.errorInfo,
              type: 'error'
            });
          }
          this.loading = false;
        }, (response) => {
          this.$message({
            message: response.body.errorInfo,
            type: 'error'
          });
          this.loading = false;
          return false;
        });

      }
    },
  },

  mounted () {
    this.token = sessionStorage.getItem('token');
//    if (!isValidSessionData()) {
//      this.$router.push('/login');
//    }
  }

}
</script>

<style scoped>

</style>
