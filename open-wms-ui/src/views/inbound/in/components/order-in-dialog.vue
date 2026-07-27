<template>
  <div class="dialog-container">
    <el-dialog append-to-body destroy-on-close v-model="currentVisible" width="1200px" title="一键入库">
      <yrt-data-list ref="dataListRef" :editor-ref="editorRefName" :data="state.detailTableData" :data-options="state.dataOptions" :auth-nodes="state.authNodes" v-model:fields="state.dataListOptions.fields" :data-list-selections="state.dataListSelections" :is-simple-search="true" :is-static-data="true" :max-height="500" size="small">
        <template #button-tool2-slot="">
          <div class="item">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="货位：">
                <el-input v-model="state.orderInfo.positionName" placeholder="批量设置货位" style="width: 180px; display: inline-block"></el-input>
                <el-button type="primary" @click="onReplacePosition">设置货位</el-button>
              </el-form-item>
            </el-form>
          </div>
        </template>
        <template #common-column-slot="{ row, col }">
          <template v-if="!col.readonly && 'input,textarea'.indexOf(col.type) >= 0">
            <el-input :ref="'input-' + col.prop" v-model="row[col.prop]" :type="col.type" size="small" clearable @change="(val:any) => change(proxy.$refs['input-' + col.prop], val, col, row)"></el-input>
          </template>
          <!--下拉框选择器-->
          <template v-else-if="!col.readonly && col.type == 'select'">
            <!--有关联主键字段-->
            <el-select v-if="col.keyProp" :ref="'select-' + col.prop" :key="col.key" v-model="row[col.keyProp]" size="small" :style="{ width: col.width }" :col="col" :disabled="col.disabled" :multiple="col.multiple" :filterable="!!col.filterable" class="inline-input" @change="(val:any) => change(proxy.$refs['select-' + col.prop], val, col, row)">
              <el-option v-for="item in getOptions(col)" :key="item.id" v-bind="item" :label="item.label" :value="item.value" :option="item"> </el-option>
            </el-select>
            <!--无关联主键字段-->
            <el-select v-else :ref="'select-' + col.prop" :key="col.keys" v-model="row[col.prop]" size="small" :style="{ width: col.width }" :col="col" :disabled="col.disabled" :multiple="col.multiple" :filterable="!!col.filterable" class="inline-input" @change="(val:any) => change(proxy.$refs['select-' + col.prop], val, col, row)">
              <el-option v-for="item in getOptions(col)" :key="item.id" v-bind="item" :label="item.label" :value="item.value" :option="item"> </el-option>
            </el-select>
          </template>

          <!-- 表格选择框 -->
          <template v-else-if="!col.readonly && col.type === 'table-select'">
            <table-select v-model="row[col.prop]" :form-data="row" :col="col" :columns="col.columns" :label="col.label" :disabled="col.disabled" size="small" :props="{ label: col.options.labelField, value: col.options.valueField }" :input-width="col.width" :placeholder="col.placeholder" @on-change="(ref:any, val:any) => change(ref, val, col, row)" @on-row-change="(ref:any, selectedRow:any) => base.onRowChange(ref, selectedRow, col, row)"> </table-select>
          </template>

          <template v-else-if="['positionName'].indexOf(col.prop) >= 0">
            <input-select ref="positionName" v-model="row.positionName" :options="row.waitPositionNames" label="货位" input-width="110px" trigger="click" size="small" @on-row-click="(ref:any, data:any, rowData:any)=>elDropdownSelect(row, data, rowData)" @on-row-change="(ref:any, value:any, rowData:any)=>elDropdownChange(row, value, rowData)" @on-key-up="(ref:any, value:any)=>elDropdownKeyup(row, value)"></input-select>
          </template>

          <template v-else-if="!col.readonly && col.type === 'time'">
            <el-time-select v-if="col.fixedTimeSelect" v-model="row[col.prop]" :placeholder="col.placeholder" :readonly="col.readonly" :disabled="col.disabled" :editable="col.editable" :clearable="col.clearable" :style="{ width: col.width }" :picker-options="{ start: col.start, end: col.end, step: col.step }"> </el-time-select>
            <el-time-picker v-else v-model="row[col.prop]" :is-range="col.isRange" :placeholder="col.placeholder" :start-placeholder="col.startPlaceholder" :end-placeholder="col.endPlaceholder" :readonly="col.readonly" :disabled="col.disabled" :editable="col.editable" :clearable="col.clearable" :arrow-control="col.arrowControl" :style="{ width: col.width }"> </el-time-picker>
          </template>

          <template v-else-if="!col.readonly && ['date', 'datetime'].indexOf(col.type) >= 0">
            <el-date-picker :ref="'date-' + col.prop" v-model="row[col.prop]" :type="col.type" :is-range="col.isRange" :placeholder="col.placeholder" :start-placeholder="col.startPlaceholder" :end-placeholder="col.endPlaceholder" :readonly="col.readonly" :disabled="col.disabled" :editable="col.editable" :clearable="col.clearable" :format="col.format" :value-format="col.format" @change="(val:any) =>change(proxy.$refs['date-' + col.prop], val, col, row)" size="small" style="width: 100%"></el-date-picker>
          </template>
          <template v-else>
            <!-- 通用标签颜色着色 -->
            <template v-if="col.tagColorList && col.tagColorList.length">
              <el-tag :color="common.getTagBgColor(row, col, row[col.prop])" :style="common.getTagColor(row, col, row[col.prop])">
                {{ common.formatData(row, col) }}
              </el-tag>
            </template>
            <template v-else>
              {{ common.formatData(row, col) }}
            </template>
          </template>
        </template>
      </yrt-data-list>

      <template #footer>
        <div class="space-between">
          <div class="item"></div>
          <div class="item">
            <el-button @click="currentVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveSaleOrder">确 定</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="order-outer-dialog">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import moment from 'moment';
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:visible', 'on-closed', 'on-item-click']);
import useDropdownStore from '/@/stores/modules/dropdown';
import { PositionTypeEnum } from '/@/enums/PositionTypeEnum';
const dropdownStore = useDropdownStore();
const base = baseHook({
  custoJsonmRoute: '/inbound/in/order-dialog',
});
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;
const dataListRef = ref();

//#region 定义属性
const props = defineProps({
  // 显示对话框
  visible: {
    type: Boolean,
    default: false,
    required: true,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  // 明细数据
  detailTableData: [] as any[],
  orderInfo: {
    storageId: 0,
    orderId: 0,
    orderCode: '',
    positionName: '',
  },
  // 批量修改对话框
  batchVisible: false,
  isOnShelve: false,
});
//#endregion

// 是否显示dialog
const currentVisible = computed({
  get() {
    return props.visible;
  },
  set(newValue) {
    emit('update:visible', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
  },
});
const getOptions = (col: any) => {
  if (col.options.remote === 'bindDropdown') {
    let dropdown = dropdownStore.getDropdown(col.options.dropdownId);
    col.options.options = dropdown?.value;
  }
  return col.options.options;
};

// 字段change事件
const change = (ref: any, val: any, field: any, row: any) => {
  if (field.prop == 'finishedQuantity')
    if (Number(val) > row.quantity) {
      // 判断按钮时候开着 ，开着就执行下面判断
      row.finishedQuantity = row.quantity;
      proxy.$message.error('实际入库数量不允许大于预入库数量');
      return;
    }

  if (['decimal'].indexOf(field.dataType) >= 0) {
    row[field.prop] = Number(val);
  }
  if (field.type === 'select') {
    // 设置表单数据
    if (!Array.isArray(val)) {
      const itemOption = ref.getOption(val).$attrs.option;
      Object.keys(itemOption).forEach((key, index) => {
        if (['value', 'label'].indexOf(key) < 0) {
          // proxy.$set(row, key, itemOption[key]);
        }
      });
    } else {
      const names = [];
      let prop = field.prop;
      for (const item of val) {
        if (prop.charAt(prop.length - 1) === 's') {
          prop = prop.substr(0, prop.length - 1);
        }
        const itemOption = ref.getOption(item).$attrs.option;
        const v = itemOption[prop] || itemOption.value;
        names.push(v);
      }
      row[field.prop] = names;
    }
  }
  proxy.$emit('on-change', ref, val, field, row);
};

// 初始化数据
const initData = async (orderInfo: any) => {
  state.orderInfo = orderInfo;
  const url = '/inbound/in/orderDetail/getQuickEnterList';
  const params = {
    orderId: orderInfo.orderId,
  };

  let [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  if (res?.result) {
    state.detailTableData = res.data.map((row: any, index: any) => {
      row.index = index;
      row.applyDate = row.applyDate ? moment(row.applyDate).format('YYYY-MM-DD') : null;
      row.produceDate = row.produceDate ? moment(row.produceDate).format('YYYY-MM-DD') : null;
      row.quantity = Number(row.quantity);
      row.finishedQuantity = row.quantity - Number(row.enterQuantity);
      row.productAttribute = '正常';
      state.isOnShelve = row.positionType !== PositionTypeEnum.RECEIVING; // 是否直接上架

      return row;
    });
    setTimeout(() => {
      dataListRef.value.loadData();
    }, 100);

    currentVisible.value = true;
  }
  init();
};

// 确认出库提交数据
const saveSaleOrder = async () => {
  state.detailTableData.map((row) => {
    row.limitDate = row.produceDate ? moment(row.produceDate).add(row.shelfLifeDay, 'days').format('YYYY-MM-DD') : '';
  });
  var url = '/inbound/in/inScanOrder/normalScanSave';
  var params = {
    scanInType: 'PC_QUICK_ENTER', // PC一键入库
    orderId: state.orderInfo.orderId,
    orderCode: state.orderInfo.orderCode,
    positionName: state.orderInfo.positionName,
    onShelve: state.isOnShelve,
    dataList: state.detailTableData,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    state.detailTableData = []; // 重置
    currentVisible.value = false;
    state.orderInfo = {
      storageId: 0,
      orderId: 0,
      orderCode: '',
      positionName: '',
    };
    emit('on-closed'); // 关闭窗口事件
  }
};

const elDropdownSelect = (row: any, data: any, rowData: any) => {
  row.positionName = data;
  state.isOnShelve = rowData.positionType !== PositionTypeEnum.RECEIVING; // 是否直接上架
};

const elDropdownChange = (row: any, data: any, rowData: any) => {
  row.positionName = data;
  state.isOnShelve = rowData.positionType !== PositionTypeEnum.RECEIVING; // 是否直接上架
};

const elDropdownKeyup = async (row: any, val: any) => {
  try {
    if (!val) {
      row.waitPositionNames = [];
      return;
    }
    const url = '/basic/storage/position/getPositionList';
    const params = {
      storageId: state.orderInfo.storageId,
      name: val,
      isOnShelve: false,
      positionTypes: '13,12,8,1,2,14', //存储货位,高架货位,次品货位,常规货位,残品货位,临期货位
    };
    const [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    if (res.result) {
      row.waitPositionNames = res.data.map((m: any) => {
        m.value = m.positionName;
        m.label = m.positionName;
        return m;
      });
    }
  } catch (error: any) {
    proxy.$message.error(error.message);
  }
};
// 批量设置货位
const onReplacePosition = () => {
  if (!state.orderInfo.positionName) {
    proxy.$message.error('货位不能为空！');
    return;
  }

  for (const row of state.detailTableData) {
    row.positionName = state.orderInfo.positionName;
  }
  proxy.$message.success(`货位【${state.orderInfo.positionName}】设置成功`);
};
const init = () => {
  for (const info of state.dataListOptions.fields) {
    if (info.prop == 'batchNumber') {
      info.width = 120;
    }
    if (info.type == 'date' || info.type == 'datetime') {
      info.width = 120;
    }
  }
};

// 对外暴露属性和方法
defineExpose({
  initData,
});
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
