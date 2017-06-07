<template>
  <div class="mallComment">
    <el-row style="text-align: left">
      商品ID:
      <el-input v-model="commentItemId" placeholder="请输入商品ID" style="width: 217px; margin-right: 10px;"></el-input>
      用户ID:
      <el-input v-model="commentUID" placeholder="请输入商品ID" style="width: 217px; margin-right: 10px;"></el-input>
      状态:
      <el-select v-model="commentStatus" placeholder="请选择状态" style=" margin-right: 10px;">
        <el-option
          v-for="item in statusSelectArray"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="search" @click="getMallCommentList">搜索</el-button>
      <el-button type="primary" icon="plus" @click="showDialog(true)">添加</el-button>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-table :data="commentList" border style="width: 100%" v-loading.body="loading">
        <el-table-column type="expand">
          <template scope="props">
            <el-table :data="props.row.replyList" border style="width: 100%" v-loading.body="loading">
              <el-table-column prop="replyId" label="评论回复ID"></el-table-column>
              <el-table-column prop="toUid" label="接受者ID"></el-table-column>
              <el-table-column prop="fromUid" label="发送者ID"></el-table-column>
              <el-table-column prop="content" label="回复内容"></el-table-column>
              <el-table-column prop="pictureListJson" label="图片列表"></el-table-column>
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
        <el-table-column prop="commentId" label="评论ID"></el-table-column>
        <el-table-column prop="itemId" label="商品ID"></el-table-column>
        <el-table-column prop="uid" label="用户ID"></el-table-column>
        <el-table-column prop="content" label="评论内容"></el-table-column>
        <el-table-column prop="pictureListJson" label="图片列表"></el-table-column>
        <el-table-column prop="star" label="点赞数"></el-table-column>
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
        <el-form-item prop="commentId" style="display: none;">
          <el-input v-model="ruleForm.commentId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="itemId" label="商品ID" :label-width="labelWidth">
          <el-input v-model="ruleForm.itemId" auto-complete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="uid" label="用户ID" :label-width="labelWidth">
          <el-input v-model="ruleForm.uid" auto-complete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="评论内容" :label-width="labelWidth">
          <el-input type="textarea" v-model="ruleForm.content" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="fileDataList" label="图片列表" :label-width="labelWidth">
          <el-upload
            class="upload-demo"
            ref="upload"
            name="file"
            :multiple="true"
            :action="uploadUrl"
            :file-list="fileDataList"
            :auto-upload="false"
            :on-success="handleSuccess"
            :on-remove="handleRemove">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div>
          </el-upload>
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
        <el-button type="primary" :loading="addLoading" @click="updateMallComment">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { isValidSessionData, dateFormat } from '../../common/Util'
  import { mallApi, fileApi, FileSource } from '../../api/api'

  export default {
    name: 'app',

    data () {
      return {
        commentItemId: '',
        commentUID: '',
        commentStatus: '',

        // file
        uploadUrl: '',
        fileDataList: [],

        token: '',
        commentList: [],
        loading: false,
        dialogVisible: false,
        disabled: false,
        addLoading: false,
        labelWidth: '120px',
        dialogTitle: '',
        pageNumber: 1,
        pageSize: 20,
        allPage: 1,
        statusSelectArray: [{ label: '全部', value: null }, { label: '通过', value: '0' }, { label: '拒绝', value: '1' }, { label: '待审核', value: '2' }],
        statusArray: [{ label: '通过', value: '0' }, { label: '拒绝', value: '1' }, { label: '待审核', value: '2' }],
        ruleForm: {
          commentId: '',
          itemId: '',
          uid: '',
          content: '',
          pictureListJson: '',
          star: '',
          status: '',
          endTime: '',
        },
        rules: {
          itemId: [
            { required: true, message: '请输入商品ID', trigger: 'blur' },
          ],
          uid: [
            { required: true, message: '请输入用户ID', trigger: 'blur' },
          ],
          content: [
            { required: true, message: '请输入评论内容', trigger: 'blur' },
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
        this.getMallCommentList(this.pageSize*(currentPage-1), this.pageSize);
      },

      handleSizeChange (currentPage) {
        if (currentPage > this.allPage) {
          return;
        }
        this.pageNumber = currentPage;
        this.getMallCommentList(this.pageSize*(currentPage-1), this.pageSize);
      },

      getMallCommentList (start, count) {
        if (this.loading) {
          return;
        }

        this.loading = true;
        let data = {
          status: this.commentStatus,
          uid: this.commentUID,
          itemId: this.commentItemId,
          start: start,
          count: count,
          token: this.token
        };

        this.$http.get(mallApi().getMallCommentList, {
          params: data,
          emulateJSON: true
        }).then((response) => {
          if (0 === response.body.result) {
            this.commentList = response.body.commentList;
            if (null !== this.commentList) {
              for (let i = 0; i < this.commentList.length; i++) {
                this.commentList[i].uid += '';
                this.commentList[i].commentId += '';
                this.commentList[i].status += '';
                this.commentList[i].itemId += '';
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
          this.dialogTitle = '添加评论';
          this.ruleForm = {
            status: '0',
            startTime: '',
            endTime: '',
          };
          this.fileDataList = [];
        } else {
          this.disabled = true;
          this.dialogTitle = '编辑评论';
          this.ruleForm = {
            commentId: row.commentId,
            itemId: row.itemId,
            uid: row.uid,
            content: row.content,
            pictureListJson: row.pictureListJson,
            status: row.status,
            createTime: row.createTime,
            updateTime: row.updateTime,
          };
          this.fileDataList = null === row.fileDataList ? [] : row.fileDataList;
        }

      },

      updateMallComment () {
        this.addLoading = true;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let pictureList = [];
            for (let i = 0; i < this.fileDataList.length; i++) {
              pictureList.push(this.fileDataList[i].name);
            }
            this.ruleForm.pictureListJson = JSON.stringify(pictureList);

            this.$http.post(mallApi().updateMallComment, JSON.stringify(this.ruleForm), {
              params: {
                token: this.token
              },
            }).then((response) => {
              if (0 === response.body.result) {
                this.addLoading = false;
                this.dialogVisible = false;
                this.getMallCommentList();
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
        this.$confirm('确认拒绝吗?', '提示', {
          type: 'warning'
        }).then(() => {
          let data = {
            commentId: row.commentId,
            status: 1,
          };

          this.$http.post(mallApi().updateMallComment, JSON.stringify(data), {
            params: {
              token: this.token
            },
          }).then((response) => {
            if (0 === response.body.result) {
              this.$message({
                message: '删除成功!',
                type: 'success',
              });
              this.getMallCommentList();
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

      submitUpload() {
        this.$refs.upload.submit();
      },

      handleSuccess(response, file, fileList) {
        if (0 === response.result) {
          for (let i = 0; i < fileList.length; i++) {
            if (file.uid === fileList[i].uid) {
              fileList[i].url = file.response.fileDataList[0].url;
            }
          }
          this.fileDataList = fileList;
        }
      },

      handleRemove(file, fileList) {
        this.fileDataList = fileList;
      },

    },

    filters: {

      formatterValue (value) {
        let statusValue = {
          '0': '通过',
          '1': '拒绝',
          '2': '待审核'
        };
        return statusValue[value];
      },

    },

    mounted () {
      this.token = sessionStorage.getItem('token');
      this.uploadUrl = fileApi().singleFileUpload + '?token=' + this.token + '&type=' + FileSource.ITEM_COMMENT;
    }

  }

</script>

<style scoped>

</style>
