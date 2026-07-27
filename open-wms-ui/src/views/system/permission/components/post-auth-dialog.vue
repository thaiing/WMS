<template>
  <el-dialog draggable overflow v-model="currentDialogVisible" title="查看下级权限设置" class="dialog-container" width="980px" append-to-body @open="onOpen">
    <el-table ref="table" :data="state.tableData" style="width: 100%">
      <el-table-column label="模块" width="180">
        <template #default="{ row }">
          <el-checkbox v-model="row.allChecked" @change="(val:any) => selectAll(val, row)"></el-checkbox>
          <span style="margin-left: 10px">{{ row.moduleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限点" align="left">
        <template #default="{ row }">
          <template v-if="row.editType === '选择器'">
            <el-button-group>
              <el-button @click="moduleNameClick(row)">选择器</el-button>
              <el-button @click="selectAllModule(row)">选择全部</el-button>
              <el-button @click="removedAllModule(row)">删除全部</el-button>
            </el-button-group>
            <div class="module-box">
              <div v-if="row.isAll" class="moduleName-item">
                [全部]
                <svg-icon name="ele-Close" class-name="cursor-pointer" :size="14" @click="removeModule(row, 'isAll')" />
              </div>
              <template v-for="(item, index) in row.authNodeList">
                <div :class="item.nodeType === 'group' ? 'moduleName-item-group' : 'moduleName-item'">
                  <span v-if="item.nodeType === 'group'">组名：</span>
                  <span>{{ item.nodeName }}</span>
                  <svg-icon name="ele-Close" class-name="cursor-pointer" :size="14" @click="removeModule(row, index)" />
                </div>
              </template>
              <template v-if="!row.isAll && !row.authNodeList.length">
                <div class="moduleName-item-empty">未设置权限</div>
              </template>
            </div>
          </template>
          <div v-else>
            <div class="padding-bottom-0">
              <el-checkbox v-model="row.isAll">全部</el-checkbox>
            </div>
            <el-checkbox v-for="(item, index) in row.authNodeList" :key="index" v-model="item.isCheck" :disabled="row.isAll">{{ item.nodeName }}</el-checkbox>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="currentDialogVisible = false">取 消</el-button>
        <el-button :loading="state.isSave" type="primary" @click="save">
          <template #icon>
            <svg-icon name="s-save" class="text-size-n" :size="14" />
          </template>
          {{ $tt('保存') }}
        </el-button>
      </span>
    </template>
    <!--选择器-->
    <yrt-selector ref="selectorDialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>

    <!--选择分组-->
    <el-dialog draggable v-model:visible="state.groupDialogVisible" title="数据权限设置" width="500px" append-to-body>
      <el-form ref="form" v-model="state.formData" label-width="80px">
        <el-form-item label="分组类别">
          <el-select v-model="state.formData.typeGroup" placeholder="请选择分组" multiple style="width: 300px">
            <el-option v-for="(item, index) in state.dropdownData['dropdown' + state.selectorConfig.dropdownId]" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="state.groupDialogVisible = false">取 消</el-button>
        <el-button :loading="state.isSave" type="primary" icon="el-icon-yrt-baocun2" @click="confirmSelectGroup">保存</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts" name="sys-permission-role-auth">
import yrtSelector from '/@/components/common/yrtSelector.vue';
import { reactive, ComponentInternalInstance, getCurrentInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import { ElTable } from 'element-plus';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:visible']);

//#region 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: null,
  },
  userId: {
    type: Number,
    required: true,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  isSave: false,
  tableData: [] as any[],
  // 当前选择器
  selectorConfig: {
    title: '功能模块选择器',
    width: '1000px',
    visible: false,
    // 配置路由
    router: '/selector/menu',
  } as any,
  // 选择器配置参数
  config: {
    功能模块: {
      title: '功能模块选择器',
      width: '1000px',
      visible: false,
      // 配置路由
      router: '/selector/menu',
      keyField: 'menuId', // 主键ID字段
      nameField: 'menuName', // 名称字段
      dropdownId: 0,
    },
  } as any,
  // 当前选中权限模块
  currentRow: {} as any,
  // 分组对话框
  groupDialogVisible: false,
  // 选择分组form
  formData: {
    typeGroup: [],
  },
  // 下拉框数据
  dropdownData: {} as any,
});
//#endregion

//#region 计算属性
// 当前宽度
const currentDialogVisible = computed({
  get: function () {
    return props.visible;
  },
  set: function (val) {
    emit('update:visible', val);
  },
});
//#endregion

// 初始化数据
const init = async () => {
  const url = '/system/permission/roleAuth/getDataAuth';
  const params = {
    userId: props.userId,
    moduleType: '岗位模块',
  };
  let [err, res] = await to(postData(url, params));
  if (err) return;

  if (res?.result) {
    state.tableData = res.data;
    state.tableData.forEach((item) => {
      // var allChecked = true;
      // item.authNodeList.forEach((node: any) => {
      // 	if (!node.isCheck) {
      // 		allChecked = false;
      // 	}
      // });
      // item.allChecked = allChecked;
      // 是否全部
      const allNode = item.authNodeList.find((node: any) => node.nodeId === 0);
      item.isAll = allNode ? allNode.isCheck : false;

      // 排除掉0
      item.authNodeList = item.authNodeList.filter((node: any) => node.nodeId !== 0);
    });
  }
};

// 对话框打开事件
const onOpen = () => {
  init();
};

// 全选
const selectAll = (val: any, row: any) => {
  row.authNodeList.forEach((item: any) => {
    item.isCheck = val;
  });
};

const save = async () => {
  const dataList = proxy.common.deepCopy(state.tableData);

  dataList.forEach((item: any) => {
    item.userId = props.userId;
    item.authNodeList = item.authNodeList.filter((node: any) => node.isCheck);
    if (item.isAll) {
      item.authNodeList.push({
        nodeId: 0,
        isCheck: item.isAll,
        nodeName: 'all',
      });
    }
  });
  const url = '/system/permission/roleAuth/saveUserDataAuth';
  const params = {
    dataList: dataList,
  };
  let [err, res] = await to(postData(url, params));
  if (err) return;

  proxy.common.showMsg(res);
  if (res?.result) {
    currentDialogVisible.value = false;
  }
};

// 选择模块
const moduleNameClick = (row: any) => {
  state.currentRow = row;
  const config = state.config[row.moduleName];
  if (!config) {
    proxy.$message.error('当前模块不支持选中器');
    return;
  }
  state.selectorConfig = config;
  setTimeout(() => {
    proxy.$refs.selectorDialog.init();
    state.selectorConfig.visible = true;
  }, 100);
};

const onSelected = (rows: any) => {
  const moduleInfo = state.tableData.find((m) => m.moduleName === state.currentRow.moduleName);
  // 选中项添加到节点中
  moduleInfo.authNodeList.push(
    ...rows
      .filter((f: any) => !moduleInfo.authNodeList.some((s: any) => s.nodeName === f[state.selectorConfig.nameField])) // 过滤重复的
      .map((item: any) => {
        return {
          isCheck: true,
          nodeName: item[state.selectorConfig.nameField],
          nodeId: item[state.selectorConfig.keyField],
        };
      })
  );
  state.selectorConfig.visible = false;
};
// 选择全部
const selectAllModule = (row: any) => {
  row.isAll = true;
  row.authNodeList = [];
};
// 选择类型分类
const selectType = (row: any) => {
  state.formData.typeGroup = [];
  state.currentRow = row;
  const config = state.config[row.moduleName];
  state.selectorConfig = config;

  state.groupDialogVisible = true;
};

// 单个删除
const removeModule = (row: any, index: any) => {
  if (index === 'isAll') {
    row.isAll = false;
  } else {
    row.authNodeList.splice(index, 1);
  }
};

// 全部删除
const removedAllModule = (row: any) => {
  proxy
    .$confirm('确定要全部取消选中项吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      row.isAll = false;
      row.authNodeList = [];
    })
    .catch(() => {
      proxy.$message.info('已取消删除');
    });
};

// 选择分组
const confirmSelectGroup = () => {
  state.currentRow.authNodeList.push(
    ...state.formData.typeGroup.map((m) => {
      return {
        isCheck: true,
        nodeName: m,
        nodeId: -1,
        nodeType: 'group',
      };
    })
  );
  state.groupDialogVisible = false;
};
</script>

<style lang="scss" scoped>
.dialog-container {
  ::v-deep .el-upload-list {
    margin-right: 20px;
  }
  ::v-deep .scrollbar-wrap {
    max-height: 400px;
    overflow-x: hidden;
    padding: 0px;
  }
  .msg-container {
    margin: 0;
    padding: 0;
    .msg-item {
      margin: 0;
      padding: 5px 0;
      word-wrap: break-word;
    }
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0px !important;
  }
  ::v-deep .el-table .el-table__header th,
  ::v-deep .el-table .el-table__body td {
    text-align: left !important;
  }

  .module-box {
    max-height: 300px;
    overflow-y: auto;
    .moduleName-item {
      border: 1px solid #1683e9;
      display: inline-block;
      margin: 10px 10px 0px 0px;
      padding: 5px;
      background-color: #c1dffc;
    }
    .moduleName-item-group {
      border: 1px solid #eb9d0e;
      display: inline-block;
      margin: 10px 10px 0px 0px;
      padding: 5px;
      background-color: #ebdcc2;
    }
    .moduleName-item-empty {
      border: 1px dashed #bd0469;
      display: inline-block;
      margin: 10px 10px 0px 0px;
      padding: 5px;
      background-color: #f8d4e8;
    }
  }
}
</style>
