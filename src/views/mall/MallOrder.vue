<template>
  <div class="mallOrder">
    <el-row style="text-align: left">
      用户ID:
      <el-input v-model="orderUid" placeholder="请输入UID" style="width: 217px; margin-right: 10px;"></el-input>
      状态:
      <el-select v-model="orderStatus" placeholder="请选择状态" style=" margin-right: 10px;">
        <el-option
          v-for="item in statusSelectArray"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="search" @click="getMallOrderList">搜索</el-button>
      <el-button type="primary" icon="plus" @click="showDialog(true)">添加</el-button>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-table :data="orderList" border style="width: 100%" v-loading.body="loading">

        <el-table-column type="expand">
          <template scope="props">
            <el-table :data="props.row.mallGoodsList" border style="width: 100%" v-loading.body="loading">
              <el-table-column prop="gid" label="货物ID"></el-table-column>
              <el-table-column prop="itemId" label="商品ID"></el-table-column>
              <el-table-column prop="userAddressId" label="收件地址ID"></el-table-column>
              <el-table-column prop="number" label="购买数量"></el-table-column>
              <el-table-column prop="skuListJson" label="购买规格"></el-table-column>
              <el-table-column prop="status" label="状态">
                <template scope="scope">
                  <span style="">{{ scope.row.status | formatterValue(statusArray) }}</span>
                </template>
              </el-table-column>
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
            </el-table>
          </template>
        </el-table-column>

        <el-table-column prop="oid" label="订单ID"></el-table-column>
        <el-table-column prop="uid" label="用户ID"></el-table-column>
        <el-table-column prop="gidListJson" label="货物ID List"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template scope="scope">
            <span style="">{{ scope.row.status | formatterValue(statusArray) }}</span>
          </template>
        </el-table-column>
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
        <el-form-item prop="oid" style="display: none;">
          <el-input v-model="ruleForm.oid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="uid" label="用户ID" :label-width="labelWidth">
          <el-input v-model="ruleForm.uid" auto-complete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="gidListJson" label="货物ID List" :label-width="labelWidth">
          <el-input type="text" v-model="ruleForm.gidListJson" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态" :label-width="labelWidth">
          <el-select v-model="ruleForm.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusArray"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="updateMallOrder">确 定</el-button>
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
        orderUid: '',
        orderStatus: '',

        token: '',
        orderList: [],
        loading: false,
        disabled: false,
        dialogVisible: false,
        addLoading: false,
        labelWidth: '120px',
        dialogTitle: '',
        pageNumber: 1,
        pageSize: 20,
        allPage: 1,
        statusSelectArray: [{ label: '全部', value: null }, { label: '正常', value: '0' }, { label: '已删除', value: '1' }, { label: '已完成', value: '2' }
          , { label: '待支付', value: '3' }, { label: '待配送', value: '4' }, { label: '待签收', value: '5' }, { label: '待评论', value: '6' }],
        statusArray: [{ label: '正常', value: '0' }, { label: '已删除', value: '1' }, { label: '已完成', value: '2' }
          , { label: '待支付', value: '3' }, { label: '待配送', value: '4' }, { label: '待签收', value: '5' }, { label: '待评论', value: '6' }],
        ruleForm: {
          oid: '',
          uid: '',
          gidListJson: '',
          status: '',
          type: '',
          startTime: '',
          endTime: '',
        },
        rules: {
          gidListJson: [
            { required: true, message: '请输入货物ID List', trigger: 'blur' },
          ],
          status: [
            { required: true, message: '请选择订单状态', trigger: 'change' },
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
        this.getMallOrderList(this.pageSize*(currentPage-1), this.pageSize);
      },

      handleSizeChange (currentPage) {
        if (currentPage > this.allPage) {
          return;
        }
        this.pageNumber = currentPage;
        this.getMallOrderList(this.pageSize*(currentPage-1), this.pageSize);
      },

      getMallOrderList (start, count) {
        if (this.loading) {
          return;
        }

        this.loading = true;
        let data = {
          status: this.orderStatus,
          uid: this.orderUid,
          type: 1,
          start: start,
          count: count,
          token: this.token
        };

        this.$http.get(mallApi().getMallOrderList, {
          params: data,
          emulateJSON: true
        }).then((response) => {
          if (0 === response.body.result) {
            this.orderList = response.body.orderList;
            if (null !== this.orderList) {
              for (let i = 0; i < this.orderList.length; i++) {
                this.orderList[i].uid += '';
                this.orderList[i].oid += '';
                this.orderList[i].status += '';
                this.orderList[i].type += '';
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
          this.dialogTitle = '添加订单';
          this.disabled = false;
          this.ruleForm = {
            status: '0',
            type: 1,
            startTime: '',
            endTime: '',
          };
        } else {
          this.dialogTitle = '编辑订单';
          this.disabled = true;
          this.ruleForm = {
            oid: row.oid,
            uid: row.uid,
            gidListJson: row.gidListJson,
            status: row.status,
            createTime: row.createTime,
            updateTime: row.updateTime,
          };
        }

      },

      updateMallOrder () {
        this.addLoading = true;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$http.post(mallApi().updateMallOrder, JSON.stringify(this.ruleForm), {
              params: {
                token: this.token
              },
            }).then((response) => {
              if (0 === response.body.result) {
                this.addLoading = false;
                this.dialogVisible = false;
                this.getMallOrderList();
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
            oid: row.oid,
            status: 1,
          };

          this.$http.post(mallApi().updateMallOrder, JSON.stringify(data), {
            params: {
              token: this.token
            },
          }).then((response) => {
            if (0 === response.body.result) {
              this.$message({
                message: '删除成功!',
                type: 'success',
              });
              this.getMallOrderList();
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
        });

      },

    },

    filters: {

      formatterValue (value, array) {
          return array[value].label;
      },

    },

    mounted () {
      this.token = sessionStorage.getItem('token');
    }

  }

</script>

<style scoped>

</style>
