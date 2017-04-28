<template>
  <div class="address">
    <el-row style="text-align: left">
      UID: <el-input v-model="uid" placeholder="请输入UID" style="width: 300px;"></el-input>
      <el-button type="primary" icon="search" @click="getUserAddressList" style="margin-left: 10px;">搜索</el-button>
      <el-button type="primary" icon="plus" @click="showDialog(true)">添加</el-button>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-table :data="addressList" border style="width: 100%" v-loading.body="loading">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="uid" label="UID"></el-table-column>
        <el-table-column prop="province" label="省"></el-table-column>
        <el-table-column prop="city" label="市"></el-table-column>
        <el-table-column prop="district" label="区/县"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="createTime" label="添加时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" @click="showDialog(false, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" size="tiny">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" class="demo-ruleForm">
        <el-form-item prop="id" style="display: none;">
          <el-input v-model="ruleForm.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="uid" label="UID" :label-width="labelWidth">
          <el-input type="number" v-model="ruleForm.uid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="province" label="省" :label-width="labelWidth">
          <el-input type="text" v-model="ruleForm.province" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="city" label="市" :label-width="labelWidth">
          <el-input type="text" v-model="ruleForm.city" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="district" label="区/县" :label-width="labelWidth">
          <el-input type="text" v-model="ruleForm.district" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="address" label="详细地址" :label-width="labelWidth">
          <el-input type="textarea" :rows="2" v-model="ruleForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="收件人姓名" :label-width="labelWidth">
          <el-input type="text" v-model="ruleForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="收件人手机号" :label-width="labelWidth">
          <el-input type="number" v-model="ruleForm.phone" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="updateUserAddress">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { isValidSessionData, dateFormat } from '../../common/Util'
import { userApi } from '../../api/api'

export default {
  name: 'address',

  data () {
    return {
      uid: '',
      token: '',
      addressList: [],
      loading: false,
      dialogVisible: false,
      addLoading: false,
      labelWidth: '120px',
      dialogTitle: '',
      ruleForm: {
        id: '',
        uid: '',
        province: '',
        city: '',
        district: '',
        address: '',
        name: '',
        phone: '',
      },
      rules: {
        uid: [
          { required: true, message: '请输入UID', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入收件人姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入收件人手机号', trigger: 'blur' },
        ],
      },
    }
  },

  methods: {
    getUserAddressList () {
      if (this.loading) {
        return;
      }

      this.loading = true;
      this.token = '431b4522d53d438ebe802853765faa17';
      let data = {
        uid: this.uid,
        token: this.token
      };

      this.$http.get(userApi().getUserAddressList, {
        params: data,
        emulateJSON: true
      }).then((response) => {
        if (0 === response.body.result) {
          this.addressList = response.body.addressList;
          for (let i =0; i < this.addressList.length; i++) {
            this.addressList[i].uid = this.addressList[i].uid + '';
            this.addressList[i].createTime = dateFormat(this.addressList[i].createTime, 'yyyy-MM-dd hh:mm:ss');
            this.addressList[i].updateTime = dateFormat(this.addressList[i].updateTime, 'yyyy-MM-dd hh:mm:ss');
          }
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

    },

    showDialog (isAdd, row) {
      this.dialogVisible = true;
      this.addLoading = false;
      if (isAdd) {
        this.dialogTitle = '添加用户收件地址';
        this.ruleForm = {};
      } else {
        this.dialogTitle = '编辑用户地址';
        this.ruleForm = {
          id: row.id,
          uid: row.uid,
          province: row.province,
          city: row.city,
          district: row.district,
          address: row.address,
          name: row.name,
          phone: row.phone,
        }
      }
    },

    updateUserAddress () {
      this.addLoading = true;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$http.post(userApi().updateUserAddress, JSON.stringify(this.ruleForm), {
            params: {
              token: '431b4522d53d438ebe802853765faa17'
            },
          }).then((response) => {
            if (0 === response.body.result) {
              this.addLoading = false;
              this.dialogVisible = false;
              this.getUserAddressList();
            } else {
              this.$message({
                message: response.body.errorInfo,
                type: 'error'
              });
            }
            this.addLoading = false;
          }, (response) => {
            this.$message({
              message: response.body.errorInfo,
              type: 'error'
            });
            this.addLoading = false;
            return false;
          });

        }

      });

    },

    deleteItem (row) {
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning'
      }).then(() => {
        let data = {
          id: row.id,
        };

        this.$http.post(userApi().deleteUserAddress, data, {
          params: {
            token: '431b4522d53d438ebe802853765faa17'
          },
          emulateJSON: true,
        }).then((response) => {
          if (0 === response.body.result) {
            this.$message({
              message: '删除成功!',
              type: 'success',
            });
            this.getUserAddressList();
          } else {
            this.$message({
              message: response.body.errorInfo,
              type: 'error',
            });
          }
        }, (response) => {
          this.$message({
            message: response.body.errorInfo,
            type: 'error'
          });
          return false;
        });
      }).catch( () => { });

    },

  },

  mounted () {
//    this.token = sessionStorage.getItem('token');
//    this.userData = JSON.parse(sessionStorage.getItem('userData'));
//    if (!isValidSessionData()) {
//      this.$router.push('/login');
//    }
    this.getUserAddressList();
  }

}
</script>

<style>
  .el-form-item {
    margin-right: 80px;
  }

</style>
