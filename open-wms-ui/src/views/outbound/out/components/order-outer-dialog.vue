<template>
  <div class="dialog-container">
    <el-dialog append-to-body destroy-on-close v-model="currentVisible" width="1200px" title="确认出库">
      <yrt-data-list ref="dataListRef" :editor-ref="editorRefName" :data="state.detailTableData" :data-options="state.dataOptions" :auth-nodes="state.authNodes" v-model:fields="state.dataListOptions.fields" :data-list-selections="state.dataListSelections" :is-simple-search="true" :is-static-data="true" :max-height="500">
        <template #common-column-slot="{ row, col }">
          <template v-if="!col.readonly && 'input,textarea'.indexOf(col.type) >= 0">
            <el-input-number v-if="['int', 'int32', 'int64', 'bigDecimal'].indexOf(col.dataType) >= 0" :ref="'input-' + col.prop" v-model.number="row[col.prop]" controls-position="right" :style="{ width: col.width || 'auto' }" clearable @blur="(event:any) => onBlur(proxy.$refs['input-' + col.prop], row[col.prop], event, col)" @focus="(event:any) => onFocus($refs['input-' + col.prop], row[col.prop], event, col)" @change="(val:any) => change($refs['input-' + col.prop], val, col, row)"></el-input-number>
            <el-input v-else-if="['decimal'].indexOf(col.dataType) >= 0" :ref="'input-' + col.prop" v-model="row[col.prop]" :style="{ width: col.width || 'auto' }" type="number" @blur="(event:any) => onBlur($refs['input-' + col.prop], row[col.prop], event, col)" @focus="(event:any) => onFocus($refs['input-' + col.prop], row[col.prop], event, col)" @change="(val:any) => change($refs['input-' + col.prop], val, col, row)" @keyup="(event:any) =>onKeyup($refs['input-' + col.prop], row[col.prop], event, col)"></el-input>
            <el-input v-else :ref="'input-' + col.prop" v-model="row[col.prop]" v-bind="col" :type="col.type" :style="{ width: col.width || 'auto' }" clearable @blur="(event:any) => onBlur($refs['input-' + col.prop], row[col.prop], event, col)" @focus="(event:any) => onFocus($refs['input-' + col.prop], row[col.prop], event, col)" @change="(val:any) => change($refs['input-' + col.prop], val, col, row)"></el-input>
          </template>
          <!--下拉框选择器-->
          <template v-else-if="!col.readonly && col.type == 'select'">
            <!--有关联主键字段-->
            <el-select v-if="col.keyProp" :ref="'select-' + col.prop" :key="col.key" v-model="row[col.keyProp]" :style="{ width: col.width }" :col="col" :disabled="col.disabled" :multiple="col.multiple" :filterable="!!col.filterable" class="inline-input" @change="(val:any) => change($refs['select-' + col.prop], val, col, row)"></el-select>
            <!--无关联主键字段-->
            <el-select v-else :ref="'select-' + col.prop" :key="col.keys" v-model="row[col.prop]" :style="{ width: col.width }" :col="col" :disabled="col.disabled" :multiple="col.multiple" :filterable="!!col.filterable" class="inline-input" @change="(val:any) => change($refs['select-' + col.prop], val, col, row)"></el-select>
          </template>

          <!-- 输入选择框 -->
          <template v-else-if="!col.readonly && col.type === 'input-select'">
            <!-- <input-select
							v-model="row[col.prop]"
							:field="col"
							:options="[]"
							:props="{ label: col.options.labelField, value: col.options.valueField }"
							:label="col.label"
							:disabled="getInputSelectOptions(col).disabled"
							:input-width="getInputSelectOptions(col).width"
							:placeholder="getInputSelectOptions(col).placeholder"
							:load-data-before="loadDataBefore"
							@on-item-click="
								(ref, val, itemData) => {
									itemClick(ref, val, itemData, col);
								}
							"
							@on-change="
								(ref, val) => {
									change(ref, val, col, row);
								}
							"
						>
						</input-select> -->
          </template>

          <!-- 表格选择框 -->
          <template v-else-if="!col.readonly && col.type === 'table-select'">
            <table-select v-model="row[col.prop]" :form-data="row" :col="col" :columns="col.columns" :label="col.label" :disabled="col.disabled" :props="{ label: col.options.labelField, value: col.options.valueField }" :input-width="col.width" :placeholder="col.placeholder" @on-focus="(ref:any, val:any, event:any) => onFocus(ref, val, event, col)" @on-item-click="(ref:any, val:any, itemData:any) =>itemClick(ref, val, itemData, col, row)" @on-change="(ref:any, val:any) => change(ref, val, col, row)" @on-key-up="(ref:any, val:any, event:any, tableData:any) => onKeyup(ref, val, event, col)" @on-row-change="(ref:any, selectedRow:any) => base.onRowChange(ref, selectedRow, col, row)"> </table-select>
          </template>

          <template v-else-if="!col.readonly && col.type === 'time'">
            <el-time-select v-if="col.fixedTimeSelect" v-model="row[col.prop]" :placeholder="col.placeholder" :readonly="col.readonly" :disabled="col.disabled" :editable="col.editable" :clearable="col.clearable" :style="{ width: col.width }" :picker-options="{ start: col.start, end: col.end, step: col.step }"> </el-time-select>
            <el-time-picker v-else v-model="row[col.prop]" :is-range="col.isRange" :placeholder="col.placeholder" :start-placeholder="col.startPlaceholder" :end-placeholder="col.endPlaceholder" :readonly="col.readonly" :disabled="col.disabled" :editable="col.editable" :clearable="col.clearable" :arrow-control="col.arrowControl" :style="{ width: col.width }"> </el-time-picker>
          </template>

          <template v-else-if="!col.readonly && ['date', 'datetime'].indexOf(col.type) >= 0">
            <el-date-picker :ref="'date-' + col.prop" v-model="row[col.prop]" :type="col.type" :is-range="col.isRange" :placeholder="col.placeholder" :start-placeholder="col.startPlaceholder" :end-placeholder="col.endPlaceholder" :readonly="col.readonly" :disabled="col.disabled" :editable="col.editable" :clearable="col.clearable" :format="col.format" :value-format="col.format" :style="{ width: '100%' }" @change="(val:any) =>change($refs['date-' + col.prop], val, col, row)"></el-date-picker>
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
      <!-- <el-form ref="form" :model="state.formData" label-width="80px">
				<el-form-item label="上传附加">
					<upload-file :value.sync="state.formData.attachFile"></upload-file>
				</el-form-item>
			</el-form> -->

      <template #footer>
        <div class="space-between">
          <div class="item">
            <!--自定义按钮-->
            <el-button v-if="quickOutType === 'quickOut'" type="primary" @click="state.batchVisible = true">批量修改数量</el-button>
          </div>
          <div class="item">
            <el-button @click="currentVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="state.batchVisible" draggable width="700px" title="批量修改重量" append-to-body>
      <el-alert title="格式为：｛商品条码｝空格｛数量｝" type="warning"> </el-alert>
      <el-input v-model="state.productModels" type="textarea" :rows="6" placeholder="请输入内容" class="w-100pc"> </el-input>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state.batchVisible = false">取 消</el-button>
          <el-button type="primary" @click="batchModify">批量修改</el-button>
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

// 系统配置参数
let config = ref({
  outer_onekey_factQtyNoMoreQtyOrder: true,
});
const base = baseHook({
  config,
  custoJsonmRoute: '/outbound/out/order-outer-dialog',
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
  // 出库类型
  quickOutType: {
    type: String,
    default: 'quickOut', // quickOut, selfOut
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  // 配置参数
  config: config.value,
  // 明细数据
  detailTableData: [] as any[],
  // 当前订单ID
  orderId: 0,
  // 当前仓库ID
  storageId: 0,
  // 批量修改对话框
  batchVisible: false,
  // 批量修改数量文本
  productModels: null as any,
  // 上传附加
  formData: {
    attachFile: [],
  },
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
// 字段change事件
const change = (ref: any, val: any, field: any, row: any) => {
  // 判断按钮时候开着 ，开着就执行下面判断
  if (state.config.outer_onekey_factQtyNoMoreQtyOrder) {
    if (row.finishedQuantity > row.quantityOrder) {
      row.finishedQuantity = row.quantityOrder;

      proxy.$message.error('实际出库数量不允许大于预出库数量');
      return;
    }
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
// input-select item click event
const itemClick = (ref: any, val: any, itemData: any, field: any, row: any) => {
  emit('on-item-click', ref, val, itemData, field, row);
};
// // 输入获得焦点事件
const onFocus = (ref: any, val: any, e: any, field: any) => {};
// // 输入失去焦点事件
const onBlur = (ref: any, val: any, e: any, field: any) => {};
// // 输入选择框键盘抬起事件
const onKeyup = (ref: any, val: any, e: any, field: any) => {};
// // 输入选择框加载前事件
// loadDataBefore (params) {
//   // 将仓库ID加入筛选条件
//   params.storageId = this.storageId;
// },

// 初始化数据
const initData = async (orderId: any, storageId: any) => {
  state.storageId = storageId;
  state.orderId = orderId;
  const url = '/outbound/out/order/getOrderOuterDetails';
  const params = {
    orderId: orderId,
  };

  let [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res?.result) {
    state.detailTableData = res.data.map((row: any, index: any) => {
      row.index = index;
      row.applyDate = row.applyDate ? moment(row.applyDate).format('YYYY-MM-DD HH:mm:ss') : null;
      row.produceDate = row.produceDate ? moment(row.produceDate).format('YYYY-MM-DD') : null;
      row.finishedQuantity = row.quantityOrder;
      return row;
    });
    setTimeout(() => {
      dataListRef.value.loadData();
    }, 100);
  }
};
// 校验生产日期，如果在停售时长内但是没有过期，要提示，可以选择出库或者不出库
const submit = () => {
  // if (props.quickOutType === 'selfOut') {
  // 	// 自提出库
  // 	if (!state.formData.attachFile.length) {
  // 		proxy.$message.error('自提出库需要上传附件！');
  // 		return;
  // 	}
  // }
  // const checkResult = saveCheck();

  // // if (!checkResult.result) {
  // if (!checkResult) {
  // 	proxy
  // 		.$confirm(checkResult + ', 是否继续?', '提示', {
  // 			confirmButtonText: '确定',
  // 			cancelButtonText: '取消',
  // 			type: 'warning',
  // 		})
  // 		.then(() => {
  // 			saveSaleOrder();
  // 		})
  // 		.catch(() => {
  // 			proxy.$message.info('已取消开启');
  // 		});
  // } else {
  saveSaleOrder();
  // }
};
const saveCheck = async () => {
  return new Promise(async (resolve) => {
    const jsonDetails = state.detailTableData.map((m: any) => {
      return {
        orderDetailId: m.orderDetailId,
        productCode: m.productCode,
        productId: m.productId,
        quantityOrder: m.quantityOrder,
        finishedQuantity: m.finishedQuantity,
      };
    });
    const url = '/outbound/out/order/saveCheck';
    const params = {
      orderId: state.orderId,
      jsonDetails: jsonDetails,
    };

    const [err, res] = await to(postData(url, params));
    if (err) {
      proxy.$message.error(err.message);
      return;
    }
    resolve(res);
  });
};
// 确认出库提交数据
const saveSaleOrder = async () => {
  const url = '/outbound/out/order/quickOut';
  const params = {
    scanInType: 'PC_QUICK_OUT', // PC一键出库
    orderId: state.orderId,
    dataList: state.detailTableData,
    quickOutType: props.quickOutType,
  };
  const ref = proxy.$parent.dataList;
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  if (res.result) {
    state.detailTableData = []; // 重置

    currentVisible.value = false;
    emit('on-closed'); // 关闭窗口事件
  }
  state.formData.attachFile = []; // 清空上传文件
};
// 批量修改
const batchModify = () => {
  if (!state.productModels) {
    proxy.$message.error('至少输入一行！');
    return;
  }
  const productModels = state.productModels.split('\n').map((m: any) => m);
  for (const m of productModels) {
    if (!m) continue;

    const datas = m.split(/\t| /gi);
    if (datas.length !== 2) {
      proxy.$message.error(m + '数据格式不正确！');
      return;
    }
    const item = state.detailTableData.find((f: any) => f.productModel === datas[0]);
    if (item) {
      item.finishedQuantity = Number(datas[1]);
    }
  }
  proxy.$message.success('执行完成！');
  state.batchVisible = false;
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
