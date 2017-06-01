<template>
  <div class="mallItem">
    <el-row style="text-align: left">
      状态:
      <el-select v-model="itemStatus" placeholder="请选择状态" style="margin-right: 10px;">
        <el-option
          v-for="item in statusSelectArray"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      商品名称:
      <el-input v-model="itemTitle" placeholder="请输入商品名称" style="width: 217px;"></el-input>
      <el-button type="primary" icon="search" @click="getMallItemList" style="margin-left: 10px;">搜索</el-button>
      <el-button type="primary" icon="plus" @click="showDialog(true)">添加</el-button>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-table :data="itemList" border style="width: 100%" v-loading.body="loading">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="主图:">
                <span>{{ props.row.mainPictureListJson }}</span>
              </el-form-item>
              <br>
              <el-form-item label="详情图:">
                <span>{{ props.row.detailPictureListJson }}</span>
              </el-form-item>
              <br>
              <el-form-item label="用法:">
                <span>{{ props.row.usage }}</span>
              </el-form-item>
              <br>
              <el-form-item label="类别:">
                <span>{{ props.row.cid | formatterCategory(categoryList)}}</span>
              </el-form-item>
              <br>
              <el-form-item label="库存:">
                <span>{{ props.row.stock }}</span>
              </el-form-item>
              <br>
              <el-form-item label="参团人数:">
                <span>{{ props.row.joinNumber }}</span>
              </el-form-item>
              <br>
              <el-form-item label="商品规格:">
                <span>{{ props.row.skuListJson | formatterSku }}</span>
              </el-form-item>
              <br>
              <el-form-item label="描述:">
                <span>{{ props.row.description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="itemId" label="商品ID"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template scope="scope">
            <span style="">{{ scope.row.status | formatterValue(statusArray) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品名称"></el-table-column>
        <el-table-column prop="price" label="商品价格"></el-table-column>
        <el-table-column prop="salesVolume" label="销量"></el-table-column>
        <el-table-column prop="choice" label="精选">
          <template scope="scope">
            <span style="">{{ scope.row.choice | formatterValue(choiceArray) }}</span>
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
        <el-form-item prop="itemId" style="display: none;">
          <el-input v-model="ruleForm.itemId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="类型" :label-width="labelWidth" style="display: none;">
          <el-select v-model="ruleForm.type" placeholder="请选择类型">
            <el-option
              v-for="item in typeArray"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="title" label="商品名称" :label-width="labelWidth">
          <el-input type="text" v-model="ruleForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="price" label="商品价格" :label-width="labelWidth">
          <el-input type="text" v-model="ruleForm.price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="stock" label="库存" :label-width="labelWidth">
          <el-input type="number" v-model="ruleForm.stock" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="cid" label="类别" :label-width="labelWidth">
          <el-cascader expand-trigger="hover" :options="categoryTree" v-model="ruleForm.cid" :show-all-levels="false"></el-cascader>
        </el-form-item>
        <el-form-item prop="choice" label="精选" :label-width="labelWidth">
          <el-select v-model="ruleForm.choice" placeholder="是否精选">
            <el-option
              v-for="item in choiceArray"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
        <el-form-item prop="skuListJson" label="规格" :label-width="labelWidth">
          <el-input type="textarea" v-model="ruleForm.skuListJson" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="usage" label="用法" :label-width="labelWidth">
          <el-input type="textarea" v-model="ruleForm.usage" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="描述" :label-width="labelWidth">
          <el-input type="textarea" v-model="ruleForm.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="updateMallItem">确 定</el-button>
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
      itemStatus: '',
      itemTitle: '',

      token: '',
      itemList: [],
      categoryList: [],
      categoryTree: [],
      loading: false,
      dialogVisible: false,
      addLoading: false,
      labelWidth: '120px',
      dialogTitle: '',
      pageNumber: 1,
      pageSize: 20,
      allPage: 1,
      typeSelectArray: [{ label: '全部', value: null }, { label: '普通', value: '1' }, { label: '团购', value: '2' }],
      statusSelectArray: [{ label: '全部', value: null }, { label: '正常', value: '0' }, { label: '已删除', value: '1' }],
      typeArray: [{ label: '普通', value: '1' }, { label: '团购', value: '2' }],
      statusArray: [{ label: '正常', value: '0' }, { label: '已删除', value: '1' }],
      choiceArray: [{ label: '否', value: '0' }, { label: '是', value: '1' }],
      ruleForm: {
        itemId: '',
        title: '',
        usage: '',
        price: '',
        stock: '',
        skuListJson: '',
        description: '',
        choice: '',
        type: '1',
        status: '',
      },
      rules: {
        title: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        skuListJson: [
          { required: true, message: '请输入规格信息', trigger: 'blur' },
        ],
        stock: [
          { required: true, message: '请输入商品库存', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '请选择商品状态', trigger: 'change' },
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
      this.getMallItemList(this.pageSize*(currentPage-1), this.pageSize);
    },

    handleSizeChange (currentPage) {
      if (currentPage > this.allPage) {
        return;
      }
      this.pageNumber = currentPage;
      this.getMallItemList(this.pageSize*(currentPage-1), this.pageSize);
    },

    getMallItemList (start, count) {
      if (this.loading) {
        return;
      }

      this.loading = true;
      let data = {
        type: 1,
        status: this.itemStatus,
        title: '' === this.itemTitle ? null : this.itemTitle,
        start: start,
        count: count,
        token: this.token
      };

      this.$http.get(mallApi().getMallItemList, {
        params: data,
        emulateJSON: true
      }).then((response) => {
        if (0 === response.body.result) {
          this.itemList = response.body.itemList;
          if (null !== this.itemList) {
            for (let i = 0; i < this.itemList.length; i++) {
              this.itemList[i].itemId += '';
              this.itemList[i].joinNumber = null === this.itemList[i].joinNumber ? '' : this.itemList[i].joinNumber + '';
              this.itemList[i].price += '';
              this.itemList[i].cid += '';
              this.itemList[i].stock += '';
              this.itemList[i].salesVolume += '';
              this.itemList[i].type += '';
              this.itemList[i].status += '';
              this.itemList[i].choice += '';
              let category = this.categoryList[this.itemList[i].cid];
              this.itemList[i].cid = [category.parentCid, category.value];
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

    getCategoryList () {
      let data = {
        token: this.token
      };

      this.$http.get(mallApi().getCategoryList, {
        params: data,
        emulateJSON: true
      }).then((response) => {
        if (0 === response.body.result) {
          if (null !== response.body.categoryList) {
            this.categoryList = [];
            this.categoryTree = response.body.categoryTree;
            for (let i = 0; i < response.body.categoryList.length; i++) {
              this.categoryList[response.body.categoryList[i].value] = response.body.categoryList[i];
            }
            this.getMallItemList();
          }
        } else {
          this.$message({
            message: response.body.errorInfo,
            type: 'error'
          });
        }
      }, (response) => {
        this.$message({
          message: response.body.errorInfo,
          type: 'error'
        });
        return false;
      });

    },

    showDialog (isAdd, row) {
      this.dialogVisible = true;
      this.addLoading = false;
      if (isAdd) {
        this.dialogTitle = '添加商品';
        this.ruleForm = {
          type: '1',
          choice: '0',
          status: '0',
        };
      } else {
        this.dialogTitle = '编辑商品';
        this.ruleForm = {
          itemId: row.itemId,
          title: row.title,
          usage: row.usage,
          price: row.price,
          cid: row.cid,
          stock: row.stock,
          skuListJson: row.skuListJson,
          description: row.description,
          choice: row.choice,
          type: row.type,
          status: row.status,
        };
      }

    },

    updateMallItem () {
      this.addLoading = true;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ruleForm.cid = this.ruleForm.cid[1];
          this.$http.post(mallApi().updateMallItem, JSON.stringify(this.ruleForm), {
            params: {
              token: this.token
            },
          }).then((response) => {
            if (0 === response.body.result) {
              this.addLoading = false;
              this.dialogVisible = false;
              this.getMallItemList();
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
          itemId: row.itemId,
          status: 1,
        };

        this.$http.post(mallApi().updateMallItem, JSON.stringify(data), {
          params: {
            token: this.token
          },
        }).then((response) => {
          if (0 === response.body.result) {
            this.$message({
              message: '删除成功!',
              type: 'success',
            });
            this.getMallItemList();
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
    formatterSku (value) {
      let skuStr = '';
      let skuList = JSON.parse(value);
      for (let i = 0; i < skuList.length; i++) {
        skuStr += skuList[i].name + ' : ' + skuList[i].detail + '\r\n';
      }
      return skuStr;
    },

    formatterValue (value, array) {
      return array[value].label;
    },

    formatterCategory (value, categoryList) {
      return categoryList[parseInt(value)].label;
    },

  },

  mounted () {
    this.token = sessionStorage.getItem('token');
    this.getCategoryList();
  }

}

</script>

<style scoped>

</style>
