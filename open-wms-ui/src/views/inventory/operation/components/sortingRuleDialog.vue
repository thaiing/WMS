<template>
  <div>
    <!-- 设置订单明细分拣规则 -->
    <el-dialog v-model="winSortingRuleVisible" draggable width="800px" :title="$tt('设置订单明细分拣规则')" append-to-body>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form :model="state.sortingRuleForm" label-width="120px">
            <el-form-item :label="$tt('商品编号')">
              <el-input v-model="state.sortingRuleForm.productCode" :readonly="true" link :placeholder="$tt('请输入商品编号')"></el-input>
            </el-form-item>
            <el-form-item :label="$tt('拣货货位')">
              <input-select ref="positionName" v-model="state.sortingRuleForm.positionName" :options="state.sortingRuleForm.choosePositionNameArray" label="货位" style="width: 100%" trigger="click" @on-item-click="(ref:any, data:any)=>elDropdownSelect(data)" @on-change="(ref:any, data:any)=>elDropdownChange(data)" @on-key-up="(ref:any, data:any)=>elDropdownKeyup(data)"></input-select>
            </el-form-item>
            <el-form-item :label="$tt('批次号')">
              <el-input v-model="state.sortingRuleForm.batchNumber" link :placeholder="$tt('请输入批次号')"></el-input>
            </el-form-item>
            <el-form-item :label="$tt('生产日期')">
              <el-date-picker v-model="state.sortingRuleForm.produceDate" type="date" :placeholder="$tt('选择日期')" value-format="YYYY-MM-DD" format="YYYY-MM-DD" style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item :label="$tt('托盘号')">
              <el-input v-model="state.sortingRuleForm.plateCode" link :placeholder="$tt('请输入托盘号')"></el-input>
            </el-form-item>
            <el-form-item :label="$tt('唯一码')">
              <el-input v-model="state.sortingRuleForm.singleSignCode" link :placeholder="$tt('请输入唯一码')"></el-input>
            </el-form-item>
            <el-form-item :label="$tt('库存ID')">
              <el-input v-model="state.sortingRuleForm.inventoryId" link :placeholder="$tt('库存ID')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="state.btnReadOnly.sortingRegularAdd" type="primary" class="margin-right-10" @click="submitSortingRuleData()">添加</el-button>

              <el-button type="primary" @click="viewInventory()">{{ $tt('查看库存') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10">
          <div v-if="state.sortingRuleList.length == 0" class="tip">
            <p>[{{ $tt('暂无规则') }}]</p>
          </div>
          <div v-for="item in state.sortingRuleList" :key="item.ruleId" class="tip">
            <p>
              {{ $tt('商品编号') }}：{{ item.productCode }}
              <span class="deleteRule-span" style="float: right" @click="deleteRule(item.ruleId)">[{{ $tt('关闭') }}] </span>
            </p>
            <p v-if="item.positionName">{{ $tt('拣货货位') }}：{{ item.positionName }}</p>
            <p v-if="item.batchNumber">{{ $tt('批次号') }}：{{ item.batchNumber }}</p>
            <p v-if="item.produceDate">{{ $tt('生产日期') }}：{{ common.formatDate(item.produceDate, 'YYYY-MM-DD') }}</p>
            <p v-if="item.plateCode">{{ $tt('托盘号') }}:{{ item.plateCode }}</p>
            <p v-if="item.singleSignCode">{{ $tt('唯一码') }}：{{ item.singleSignCode }}</p>
            <p v-if="item.inventoryId">{{ $tt('库存ID') }}：{{ item.inventoryId }}</p>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="winSortingRuleVisible = false">{{ $tt('关闭') }}</el-button>
      </div>
    </el-dialog>

    <!--出库单设置规则-查询库存-->
    <detail-roleflow ref="roleflow" v-model:visible="state.showDistConfig.showEditorDialog" :load-options="state.productPositionDetail" :where="{ productCode: state.sortingRuleForm.productCode, storage_Id: state.formData.storage_Id, productStorage: { operator: QueryType.GT, value: 0 } }"></detail-roleflow>
  </div>
</template>

<script setup lang="ts" name="sorting-rule">
import { ComponentInternalInstance } from 'vue';
import { DataType, QueryBo, QueryType } from '/@/types/common';
import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import baseHook from '/@/components/hooks/baseHook';
const detailstateFlow = defineAsyncComponent(() => import('/@/components/common/components/detailstateflow.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const roleflow = ref();
const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

const emit = defineEmits(['update:visible', 'on-closed']);
//#region 定义属性
const props = defineProps({
  visible: Boolean,
  orderCode: String,
  masterData: {
    value: String,
  } as any,
  // 选中的订单ID
  dataListSelections: {
    type: Array,
    default: () => {
      return [];
    },
    required: true,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  outerDetailId: 0,
  ...toRefs(baseState),
  sortingRuleForm: {
    productCode: '',
    positionName: '',
    batchNumber: '',
    produceDate: '',
    plateCode: '',
    singleSignCode: '',
    choosePositionNameArray: [],
  } as any,
  sortingRuleList: [] as any[],
  selectRuleRow: null as any,
  // 当前编辑数据
  formData: {} as any,
  // 设置规则-查询库存
  showDistConfig: {
    // 生成配送派车单对话框
    showEditorDialog: false,
  } as any,
  // 明细分拣状态流加载参数
  productPositionDetail: {
    prefixRouter: 'inventory/core/inventory',
    tableName: 'core_inventory',
    idField: 'inventory_id',
    orderBy: '{"inventory_id":"DESC"}',
    pageIndex: 1,
    pageSize: 100,
    menu_Id: 1032,
  },
});

//#endregion

// 是否显示dialog
const winSortingRuleVisible = computed({
  get() {
    return props.visible;
  },
  set(newValue) {
    emit('update:visible', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
  },
});

const loadData = async (row: any) => {
  state.selectRuleRow = row;
  var productCode = state.selectRuleRow['productCode'];
  state.sortingRuleForm.productCode = productCode;
};

// 获取分拣列表
const getSortingRuleList = async () => {
  const outerDetailId = state.outerDetailId;
  const url = '/inventory/operation/outer/getSortingRule';
  const params = { orderDetailId: outerDetailId };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  state.sortingRuleList = res as any;
};
// 查看库存
const viewInventory = () => {
  state.showDistConfig.showEditorDialog = true;
  roleflow.value.loadData(state.selectRuleRow);
};
// 提交分拣规则
const submitSortingRuleData = async () => {
  const consignorId = props.masterData.value.consignorId;
  const consignorCode = props.masterData.value.consignorCode;
  const consignorName = props.masterData.value.consignorName;
  const storageId = props.masterData.value.storageId;
  const storageName = props.masterData.value.storageName;

  const outerId = props.masterData.value.outerId;
  const outerCode = props.masterData.value.outerCode;
  const positionName = state.sortingRuleForm.positionName;
  const batchNumber = state.sortingRuleForm.batchNumber;
  const produceDate = state.sortingRuleForm.produceDate;
  const plateCode = state.sortingRuleForm.plateCode;
  const singleSignCode = state.sortingRuleForm.singleSignCode;
  const inventoryId = state.sortingRuleForm.inventoryId;
  const productId = state.selectRuleRow['productId'];
  const productCode = state.selectRuleRow['productCode'];
  const productName = state.selectRuleRow['productName'];
  const outerDetailId = state.outerDetailId;

  const url = '/inventory/operation/outer/setSortingRule';
  const params = {
    consignorId: consignorId,
    consignorCode: consignorCode,
    consignorName: consignorName,
    storageId: storageId,
    storageName: storageName,

    orderDetailId: outerDetailId,
    orderId: outerId,
    orderCode: outerCode,

    positionName: positionName,
    batchNumber: batchNumber,
    produceDate: produceDate,
    plateCode: plateCode,
    singleSignCode: singleSignCode,
    inventoryId: inventoryId,
    productId: productId,
    productCode: productCode,
    productName: productName,
  };

  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    getSortingRuleList();
    state.sortingRuleForm.positionName = '';
    state.sortingRuleForm.batchNumber = '';
    state.sortingRuleForm.produceDate = '';
    state.sortingRuleForm.plateCode = '';
    state.sortingRuleForm.singleSignCode = '';
    state.sortingRuleForm.inventoryId = '';
    state.sortingRuleForm.choosePositionNameArray = [];
  }
};

// 关闭分拣规则
const deleteRule = async (ruleId: any) => {
  proxy
    .$confirm('确实要关闭当前规则吗', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/inventory/operation/outer/deleteSortingRule';
      const params = { ruleId: ruleId };
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }

      getSortingRuleList();
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};

const elDropdownSelect = async (data: any) => {
  state.sortingRuleForm.positionName = data;
};
const elDropdownChange = (data: any) => {
  state.sortingRuleForm.positionName = data;
};
const elDropdownKeyup = async (val: any) => {
  try {
    if (!val) {
      state.sortingRuleForm.choosePositionNameArray = [];
      return;
    }
    const orderCode = props.masterData.value.outerCode;
    const url = '/inbound/in/inScanShelve/searchShelvePositionList';
    const params = {
      shelveCode: orderCode,
      key: val,
    };
    const [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    var positionNameList = res.data.map((m: any) => {
      return {
        positionName: m.positionName,
        label: m.positionName,
      };
    });
    positionNameList;

    state.sortingRuleForm.choosePositionNameArray = positionNameList;
  } catch (error: any) {}
};

// 对外暴露属性和方法
defineExpose({
  getSortingRuleList,
  loadData,
  state,
});
</script>

<style rel="stylesheet/scss" scoped>
.tip {
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 5px 0;
}

.dialog-info {
  overflow: hidden;
  width: 100%;
}

.dialog-left {
  float: left;
  width: 45%;
}

.dialog-right {
  margin-left: 30px;
  float: left;
  width: 45%;
}

.deleteRule-span {
  cursor: pointer;
}

.page-list-container {
  min-height: calc(100vh - 135px);
  overflow: hidden;
  position: relative;
}

.scrollbar-wrap {
  margin-top: 20px;
  max-height: 400px;
  overflow-x: hidden;
  padding: 0px;
}

.msg-container {
  margin: 0;
  padding: 0;
  padding-bottom: 40px;
}

.msg-item {
  margin: 0;
  padding: 5px 0;
  word-wrap: break-word;
  font-size: 14px;
}

.gutter {
  display: none;
}

@media screen and (max-height: 900px) {
  .page-list-container {
    min-height: 600px;
  }
}
</style>
