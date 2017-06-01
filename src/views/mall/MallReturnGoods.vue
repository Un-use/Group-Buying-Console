<template>
  <div class="mallReturnGoods">
    <el-row style="text-align: left">
      用户ID:
      <el-input v-model="returnGoodsUID" placeholder="请输入商品ID" style="width: 217px; margin-right: 10px;"></el-input>
      状态:
      <el-select v-model="returnGoodsStatus" placeholder="请选择状态" style=" margin-right: 10px;">
        <el-option
          v-for="item in statusSelectArray"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="search" @click="getMallReturnGoodsList">搜索</el-button>
      <el-button type="primary" icon="plus" @click="showDialog(true)">添加</el-button>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-table :data="returnGoodsList" border style="width: 100%" v-loading.body="loading">
        <el-table-column prop="id" label="退货品ID"></el-table-column>
        <el-table-column prop="uid" label="用户ID"></el-table-column>
        <el-table-column prop="oid" label="订单ID"></el-table-column>
        <el-table-column prop="itemId" label="商品ID"></el-table-column>
        <el-table-column prop="reason" label="退货原因">
          <template scope="scope">
            <span style="">{{ scope.row.reason | formatterValue(reasonArray) }}</span>
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column prop="des" label="描述"></el-table-column>
        <el-table-column prop="pictureListJson" label="图片列表"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template scope="scope">
            <span style="">{{ scope.row.status | formatterValue(statusArray) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" width="180">
          <template scope="scope">
            <span style="">{{ scope.row.createTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180">
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
        <el-form-item prop="id" style="display: none;">
          <el-input v-model="ruleForm.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="uid" label="用户ID" :label-width="labelWidth">
          <el-input v-model="ruleForm.uid" auto-complete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="oid" label="订单ID" :label-width="labelWidth">
          <el-input v-model="ruleForm.oid" auto-complete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="itemId" label="商品ID" :label-width="labelWidth">
          <el-input v-model="ruleForm.itemId" auto-complete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="reason" label="退货原因" :label-width="labelWidth">
          <el-select v-model="ruleForm.reason" placeholder="请选择退货原因">
            <el-option
              v-for="item in reasonArray"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="des" label="退货描述" :label-width="labelWidth">
          <el-input type="textarea" v-model="ruleForm.des" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="pictureListJson" label="图片" :label-width="labelWidth">
          <el-input type="textarea" v-model="ruleForm.pictureListJson" auto-complete="off"></el-input>
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
        <el-button type="primary" :loading="addLoading" @click="updateMallReturnGoods">确 定</el-button>
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
        returnGoodsUID: '',
        returnGoodsStatus: '',

        token: '',
        returnGoodsList: [],
        loading: false,
        dialogVisible: false,
        disabled: false,
        addLoading: false,
        labelWidth: '120px',
        dialogTitle: '',
        pageNumber: 1,
        pageSize: 20,
        allPage: 1,
        statusSelectArray: [{ label: '全部', value: null }, { label: '正常', value: '0' }, { label: '已删除', value: '1' }, { label: '已完成', value: '2' }],
        statusArray: [{ label: '正常', value: '0' }, { label: '已删除', value: '1' }, { label: '已完成', value: '2' }],
        reasonArray: [{ label: '货物不对', value: '1' }, { label: '质量太差', value: '2' }, { label: '商品不符', value: '3' }],
        ruleForm: {
          id: '',
          uid: '',
          oid: '',
          itemId: '',
          reason: '',
          des: '',
          pictureListJson: '',
          status: '',
        },
        rules: {
          oid: [
            { required: true, message: '请输入订单ID', trigger: 'blur' },
          ],
          itemId: [
            { required: true, message: '请输入商品ID', trigger: 'blur' },
          ],
          uid: [
            { required: true, message: '请输入用户ID', trigger: 'blur' },
          ],
          reason: [
            { required: true, message: '请选择退货原因', trigger: 'change' },
          ],
          status: [
            { required: true, message: '请选择评论状态', trigger: 'change' },
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
        this.getMallReturnGoodsList(this.pageSize*(currentPage-1), this.pageSize);
      },

      handleSizeChange (currentPage) {
        if (currentPage > this.allPage) {
          return;
        }
        this.pageNumber = currentPage;
        this.getMallReturnGoodsList(this.pageSize*(currentPage-1), this.pageSize);
      },

      getMallReturnGoodsList (start, count) {
        if (this.loading) {
          return;
        }

        this.loading = true;
        let data = {
          status: this.returnGoodsStatus,
          uid: this.returnGoodsUID,
          start: start,
          count: count,
          token: this.token
        };

        this.$http.get(mallApi().getMallReturnGoodsList, {
          params: data,
          emulateJSON: true
        }).then((response) => {
          if (0 === response.body.result) {
            this.returnGoodsList = response.body.returnGoodsList;
            if (null !== this.returnGoodsList) {
              for (let i = 0; i < this.returnGoodsList.length; i++) {
                this.returnGoodsList[i].id += '';
                this.returnGoodsList[i].uid += '';
                this.returnGoodsList[i].oid += '';
                this.returnGoodsList[i].itemId += '';
                this.returnGoodsList[i].status += '';
                this.returnGoodsList[i].reason += '';
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
          this.disabled = false;
          this.dialogTitle = '添加退货商品';
          this.ruleForm = {
            status: '0',
            reason: '1',
          };
        } else {
          this.disabled = true;
          this.dialogTitle = '编辑退货商品';
          this.ruleForm = {
            id: row.id,
            itemId: row.itemId,
            uid: row.uid,
            oid: row.oid,
            reason: row.reason,
            status: row.status,
            des: row.des,
            pictureListJson: row.pictureListJson,
          };
        }

      },

      updateMallReturnGoods () {
        this.addLoading = true;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$http.post(mallApi().updateMallReturnGoods, JSON.stringify(this.ruleForm), {
              params: {
                token: this.token
              },
            }).then((response) => {
              if (0 === response.body.result) {
                this.addLoading = false;
                this.dialogVisible = false;
                this.getMallReturnGoodsList();
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
            id: row.id,
            status: 1,
          };

          this.$http.post(mallApi().updateMallReturnGoods, JSON.stringify(data), {
            params: {
              token: this.token
            },
          }).then((response) => {
            if (0 === response.body.result) {
              this.$message({
                message: '删除成功!',
                type: 'success',
              });
              this.getMallReturnGoodsList();
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
