<template>
  <div class="cart">
    <el-row style="text-align: left">
      用户ID: <el-input v-model="uid" placeholder="请输入UID" style="width: 300px;"></el-input>
      <el-button type="primary" icon="search" @click="getUserCartList" style="margin-left: 10px;">搜索</el-button>
      <el-button type="primary" icon="plus" @click="showDialog(true)">添加</el-button>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-table :data="cartList" border style="width: 100%" v-loading.body="loading">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品ID">
                <span>{{ props.row.mallItem.itemId }}</span>
              </el-form-item>
              <el-form-item label="商品名称">
                <span>{{ props.row.mallItem.title }}</span>
              </el-form-item>
              <el-form-item label="商品价格">
                <span>{{ props.row.mallItem.price }}</span>
              </el-form-item>
              <el-form-item label="商品库存">
                <span>{{ props.row.mallItem.stock }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.mallItem.description }}</span>
              </el-form-item>
              <el-form-item label="商品使用说明">
                <span>{{ props.row.mallItem.usage }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="cartId" label="购物车ID"></el-table-column>
        <el-table-column prop="uid" label="用户ID"></el-table-column>
        <el-table-column prop="itemId" label="商品ID"></el-table-column>
        <el-table-column prop="skuList" label="商品规格" :formatter="formatterSku"></el-table-column>
        <el-table-column prop="number" label="购买数量"></el-table-column>
        <el-table-column prop="createTime" label="添加时间">
          <template scope="scope">
            <span style="">{{ scope.row.createTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template scope="scope">
            <span style="">{{ scope.row.updateTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button size="small" @click="showDialog(false, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="padding-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNumber"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="allPage">
        </el-pagination>
      </div>
    </el-row>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" size="tiny">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" class="demo-ruleForm">
        <el-form-item prop="cartId" style="display: none;">
          <el-input v-model="ruleForm.cartId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="uid" label="用户ID" :label-width="labelWidth">
          <el-input type="number" v-model="ruleForm.uid" auto-complete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="itemId" label="商品ID" :label-width="labelWidth">
          <el-input type="number" v-model="ruleForm.itemId" auto-complete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="number" label="购买数量" :label-width="labelWidth">
          <el-input type="number" v-model="ruleForm.number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="skuListJson" label="商品规格" :label-width="labelWidth">
          <el-input type="textarea" v-model="ruleForm.skuListJson" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="updateUserCart">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { isValidSessionData, dateFormat } from '../../common/Util'
import { mallApi } from '../../api/api'

export default {
  name: 'app',

  data () {
    return {
      uid: '',
      token: '',
      cartList: [],
      loading: false,
      disabled: false,
      dialogVisible: false,
      addLoading: false,
      labelWidth: '120px',
      dialogTitle: '',
      pageNumber: 1,
      pageSize: 20,
      allPage: 1,
      ruleForm: {
        cartId: '',
        uid: '',
        itemId: '',
        skuListJson: '',
        number: '',
      },
      rules: {
        uid: [
          { required: true, message: '请输入UID', trigger: 'blur' },
        ],
        itemId: [
          { required: true, message: '请输入商品ID', trigger: 'blur' },
        ],
        skuListJson: [
          { required: true, message: '请输入规格信息', trigger: 'blur' },
        ],
        number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
      },
    }

  },

  methods: {
    handleCurrentChange (currentPage) {
      if (currentPage > this.allPage) {
        return;
      }
      this.pageNumber = currentPage;
      this.getUserCartList(this.pageSize*(currentPage-1), this.pageSize);
    },

    handleSizeChange (currentPage) {
      if (currentPage > this.allPage) {
        return;
      }
      this.pageNumber = currentPage;
      this.getUserCartList(this.pageSize*(currentPage-1), this.pageSize);
    },

    getUserCartList (start, count) {
      if (this.loading) {
        return;
      }

      this.loading = true;
      let data = {
        uid: this.uid,
        start: start,
        count: count,
        token: this.token
      };

      this.$http.get(mallApi().getMallCartList, {
        params: data,
        emulateJSON: true
      }).then((response) => {
        if (0 === response.body.result) {
          this.cartList = response.body.cartList;
          if (null !== this.cartList) {
            for (let i = 0; i < this.cartList.length; i++) {
              this.cartList[i].cartId += '';
              this.cartList[i].uid += '';
              this.cartList[i].itemId += '';
              this.cartList[i].number += '';
              this.cartList[i].createTime = dateFormat(this.cartList[i].createTime, 'yyyy-MM-dd hh:mm:ss');
              this.cartList[i].updateTime = dateFormat(this.cartList[i].updateTime, 'yyyy-MM-dd hh:mm:ss');
            }

            this.allPage = parseInt(response.body.allCount/this.pageSize + 1);
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
        this.dialogTitle = '添加购物车商品';
        this.disabled = false;
        this.ruleForm = {};
      } else {
        this.dialogTitle = '编辑购物车商品';
        this.disabled = true;
        this.ruleForm = {
          cartId: row.cartId,
          uid: row.uid,
          itemId: row.itemId,
          skuListJson: row.skuListJson,
          number: row.number,
        }
      }

    },

    updateUserCart () {
      this.addLoading = true;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$http.post(mallApi().updateMallCart, JSON.stringify(this.ruleForm), {
            params: {
              token: this.token
            },
          }).then((response) => {
            if (0 === response.body.result) {
              this.addLoading = false;
              this.dialogVisible = false;
              this.getUserCartList();
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

        } else {
          this.addLoading = false;
        }

      });

    },

    deleteItem (row) {
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning'
      }).then(() => {
        let data = {
          cartId: row.cartId,
        };

        this.$http.post(mallApi().deleteMallCart, data, {
          params: {
            token: this.token
          },
          emulateJSON: true,
        }).then((response) => {
          if (0 === response.body.result) {
            this.$message({
              message: '删除成功!',
              type: 'success',
            });
            this.getUserCartList();
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

    formatterSku (value, row) {
      let skuStr = '';
      for (let i = 0; i < value.skuList.length; i++) {
        skuStr += value.skuList[i].name + ' : ' + value.skuList[i].detail + '\r\n';
      }
      return skuStr;
    },

  },

  mounted () {
    this.token = sessionStorage.getItem('token');
    this.getUserCartList();
  }

}
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
