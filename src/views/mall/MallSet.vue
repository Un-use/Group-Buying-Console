<template>
  <div class="mallSet">
    <el-row style="text-align: left">
      状态:
      <el-select v-model="setStatus" placeholder="请选择状态" style="margin-right: 10px;">
        <el-option
          v-for="item in statusSelectArray"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      商品集名称:
      <el-input v-model="setTitle" placeholder="请输入商品集名称" style="width: 217px;"></el-input>
      <el-button type="primary" icon="search" @click="getMallSetList" style="margin-left: 10px;">搜索</el-button>
      <el-button type="primary" icon="plus" @click="showDialog(true)">添加</el-button>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-table :data="setList" border style="width: 100%" v-loading.body="loading">
        <el-table-column prop="sid" label="商品集ID"></el-table-column>
        <el-table-column prop="title" label="商品集名称"></el-table-column>
        <el-table-column prop="content" label="商品集内容"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template scope="scope">
            <span style="">{{ scope.row.status | formatterValue(statusArray) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间">
          <template scope="scope">
            <span style="">{{ scope.row.startTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间">
          <template scope="scope">
            <span style="">{{ scope.row.endTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}</span>
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
        <el-form-item prop="sid" style="display: none;">
          <el-input v-model="ruleForm.sid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="title" label="商品集名称" :label-width="labelWidth">
          <el-input type="text" v-model="ruleForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="商品集内容" :label-width="labelWidth">
          <el-input type="text" v-model="ruleForm.content" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="itemIdListJson" label="商品ID" :label-width="labelWidth">
          <el-input type="text" v-model="ruleForm.itemIdListJson" auto-complete="off"></el-input>
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
        <el-form-item prop="startTime" label="开始时间" :label-width="labelWidth">
          <el-date-picker v-model="ruleForm.startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime" label="结束时间" :label-width="labelWidth">
          <el-date-picker v-model="ruleForm.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="updateMallSet">确 定</el-button>
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
        setStatus: '',
        setTitle: '',

        token: '',
        setList: [],
        loading: false,
        dialogVisible: false,
        addLoading: false,
        labelWidth: '120px',
        dialogTitle: '',
        pageNumber: 1,
        pageSize: 20,
        allPage: 1,
        statusSelectArray: [{ label: '全部', value: null }, { label: '正常', value: '0' }, { label: '已删除', value: '1' }],
        statusArray: [{ label: '正常', value: '0' }, { label: '已删除', value: '1' }],
        ruleForm: {
          sid: '',
          title: '',
          content: '',
          itemIdListJson: '',
          status: '',
          startTime: '',
          endTime: '',
        },
        rules: {
          title: [
            { required: true, message: '请输入商品集名称', trigger: 'blur' },
          ],
          content: [
            { required: true, message: '请输入商品集名称', trigger: 'blur' },
          ],
          itemIdListJson: [
            { required: true, message: '请输入商品ID', trigger: 'blur' },
          ],
          startTime: [
            { type: 'date', required: true, message: '请输入商品集开始时间', trigger: 'change' },
          ],
          endTime: [
            { type: 'date', required: true, message: '请选择商品集结束时间', trigger: 'change' },
          ],
          status: [
            { required: true, message: '请选择商品集状态', trigger: 'change' },
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
        this.getMallSetList(this.pageSize*(currentPage-1), this.pageSize);
      },

      handleSizeChange (currentPage) {
        if (currentPage > this.allPage) {
          return;
        }
        this.pageNumber = currentPage;
        this.getMallSetList(this.pageSize*(currentPage-1), this.pageSize);
      },

      getMallSetList (start, count) {
        if (this.loading) {
          return;
        }

        this.loading = true;
        let data = {
          status: this.setStatus,
          title: '' === this.setTitle ? null : this.setTitle,
          start: start,
          count: count,
          token: this.token
        };

        this.$http.get(mallApi().getMallSetList, {
          params: data,
          emulateJSON: true
        }).then((response) => {
          if (0 === response.body.result) {
            this.setList = response.body.setList;
            if (null !== this.setList) {
              for (let i = 0; i < this.setList.length; i++) {
                this.setList[i].sid += '';
                this.setList[i].status += '';
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
          this.dialogTitle = '添加商品集';
          this.ruleForm = {
            status: '0',
            startTime: '',
            endTime: '',
          };
        } else {
          this.dialogTitle = '编辑商品集';
          this.ruleForm = {
            sid: row.sid,
            title: row.title,
            content: row.content,
            itemIdListJson: row.itemIdListJson,
            startTime: dateFormat(row.startTime, 'yyyy-MM-dd hh:mm:ss'),
            endTime: dateFormat(row.endTime, 'yyyy-MM-dd hh:mm:ss'),
            status: row.status,
          };
        }

      },

      updateMallSet () {
        this.addLoading = true;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$http.post(mallApi().updateMallSet, JSON.stringify(this.ruleForm), {
              params: {
                token: this.token
              },
            }).then((response) => {
              if (0 === response.body.result) {
                this.addLoading = false;
                this.dialogVisible = false;
                this.getMallSetList();
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
            sid: row.sid,
            status: 1,
          };

          this.$http.post(mallApi().updateMallSet, JSON.stringify(data), {
            params: {
              token: this.token
            },
          }).then((response) => {
            if (0 === response.body.result) {
              this.$message({
                message: '删除成功!',
                type: 'success',
              });
              this.getMallSetList();
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
      this.getMallSetList();
    }

  }

</script>

<style scoped>

</style>
