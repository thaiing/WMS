<template>
  <div class="table-select" :style="{ width: common.isNumber(props.inputWidth as string) ? inputWidth + 'px' : inputWidth }">
    <el-popover ref="input-select" v-model:visible="showPopover" :disabled="disabled" :width="popoverWidth" :trigger="props.trigger" placement="bottom-start" popper-class="input-popover" @show="() => (state.treeSuffixIcon = 'yrt-xiangxiajiantou1 dropdown')" @hide="() => (state.treeSuffixIcon = 'yrt-xiangxiajiantou1')">
      <template #reference>
        <el-input ref="input" v-model="currentValue" :style="{ width: common.isNumber(props.inputWidth as string) ? inputWidth + 'px' : inputWidth }" :placeholder="placeholder" :disabled="disabled" class="input no-bg" @focus="(event:any) => onFocus($refs['input'], state.currentRow, event)" clearable @change="(val:any) => onInputChange($refs['input'], val)" @keyup="(event:any) => onInputKeyup($refs['input'], event)" @keydown="(event:any) => onInputKeydown($refs['input'], event)" @blur="showPopover = false" @clear="inputClear">
          <template #suffix>
            <i :class="[state.treeSuffixIcon]"></i>
          </template>
        </el-input>
      </template>
      <el-table ref="dropdownTable" :data="state.dataList" :max-height="tableMaxHeight" size="small" highlight-current-row style="width: 100%" class="dropdown-table" empty-text="暂无数据" @current-change="onCurrentChange" @row-click="onRowClick">
        <el-table-column type="index" width="40" label="#"></el-table-column>
        <slot name="column">
          <el-table-column v-for="(col, index) in props.columns" :key="index" :property="col.prop" :label="col.label" :width="col.width"></el-table-column>
        </slot>
      </el-table>
    </el-popover>
  </div>
</template>

<script setup lang="ts" name="table-select">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:modelValue', 'on-change', 'on-row-change', 'on-row-click', 'on-key-up', 'on-key-down', 'on-focus']);

//#region 定义属性
const props = defineProps({
  // 表单数据
  formData: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 字段信息
  field: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 下拉框绑定值
  modelValue: {
    type: String,
    default: null,
  },
  // 字段中文名
  label: {
    type: String,
    default: null,
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 弹窗宽度
  popoverWidth: {
    type: [Number, String],
    default: '300px',
  },
  // 表格宽度
  tableMaxHeight: {
    type: Number,
    default: 300,
  },
  // 输入框宽度
  inputWidth: {
    type: [Number, String],
    default: '100%',
  },
  // 提示内容
  placeholder: {
    type: String,
    default: null,
  },
  // 配置选项
  props: {
    type: Object,
    default: () => {
      return {
        label: 'label',
        value: 'value',
      };
    },
  },
  // 表格数据
  tableData: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 值字段名
  valueField: {
    type: String,
    default: 'value',
  },
  // 名称字段名
  labelField: {
    type: String,
    default: 'label',
  },
  // 输入框尺寸大小
  size: {
    type: String,
    default: 'default',
  },
  // 弹出框触发事件方式
  trigger: {
    type: String as PropType<any>,
    default: 'focus',
  },
  // 字段列表
  columns: {
    type: Array<any>,
    default: () => {
      return [];
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  // TREE选择器右侧下拉框
  treeSuffixIcon: 'yrt-xiangxiajiantou1',
  // 是否显示下拉框
  isShowPopover: false,
  currentRow: {} as EmptyObjectType,
  // 键盘按下时延时handle
  searchHandle: null as unknown as NodeJS.Timeout,
  // 当前数据
  dataList: [] as any[],
});
//#endregion

//#region 计算属性
// 当前值
const currentValue = computed({
  get: function () {
    return props.modelValue;
  },
  set: function (val) {
    emit('update:modelValue', val);
  },
});

// 显示popover
const showPopover = computed({
  get: function () {
    return state.isShowPopover;
  },
  set: function (val) {
    state.isShowPopover = val;
  },
});
//#endregion

//#region watch
watch(
  () => props.tableData,
  (val: any[]) => {
    state.dataList = val;
  },
  { deep: true, immediate: true }
);
//#endregion

onMounted(() => {
  // 初始化下拉框数据
  loadData(proxy.$refs.input, true);
});

// input change事件
const onInputChange = (ref: any, val: any) => {
  emit('on-change', ref, val);
};

// input keyup事件
const onInputKeyup = (ref: any, event: any) => {
  // Up key
  if (event.keyCode === 38) {
    let existIndex = state.dataList.findIndex((item) => {
      return item[props.labelField] === currentValue.value;
    });
    existIndex -= 1;
    if (existIndex < 0) {
      existIndex = state.dataList.length - 1;
    }
    const itemData: any = state.dataList.find((item, index) => {
      return index === existIndex;
    });
    currentValue.value = itemData[props.labelField];
    proxy.$refs.dropdownTable.setCurrentRow(itemData);
    onRowChange(ref, itemData); // 自动设置值
    emit('on-row-change', ref, itemData, event);
    return false;
  }
  // Down key
  if (event.keyCode === 40) {
    let existIndex = state.dataList.findIndex((item) => {
      return item[props.labelField] === currentValue.value;
    });
    existIndex += 1;
    if (existIndex >= state.dataList.length) {
      existIndex = 0;
    }
    const itemData: any = state.dataList.find((item, index) => {
      return index === existIndex;
    });
    currentValue.value = itemData[props.labelField];
    proxy.$refs.dropdownTable.setCurrentRow(itemData);
    emit('on-row-change', ref, itemData, event);
    return false;
  }
  // Enter key
  if (event.keyCode === 13) {
    // showPopover.value = !showPopover.value;
    // proxy.$refs.input.select();
    // proxy.$refs.input.focus();
    return;
  }
  // 取消请求加载数据
  if (state.searchHandle) {
    clearTimeout(state.searchHandle);
  }
  state.searchHandle = setTimeout(() => {
    showPopover.value = true;
    loadData(ref, false);
    clearTimeout(state.searchHandle);
  }, 800);
  emit('on-key-up', ref, currentValue.value, event, state.dataList);
};

// input keydown事件
const onInputKeydown = (ref: any, event: any) => {
  emit('on-key-down', ref, currentValue.value, event, state.dataList);
};

// 当值当前行
const setCurrentIndex = (existIndex: any) => {
  const itemData = state.dataList.find((item, index) => {
    return index === existIndex;
  });
  if (itemData) {
    currentValue.value = itemData[props.labelField];
    proxy.$refs.dropdownTable.setCurrentRow(itemData);
  }
  // proxy.$refs["input-select"].doClose();
};

// 判断是否有选中项
const getCurrrentIndex = () => {
  const existIndex = state.dataList.findIndex((item) => {
    return item[props.labelField] === currentValue.value;
  });
  return existIndex;
};

// 关闭下拉框
const doClose = () => {
  proxy.$refs['input-select'].doClose();
};

// 获得焦点
const onFocus = (ref: any, val: any, event: any) => {
  proxy.$refs.input.select();
  var disabled = ref.$attrs.disabled;
  if (disabled) return;
  showPopover.value = true;
  emit('on-focus', ref, val, event);
};

// 当前行改变
const onCurrentChange = (val: any) => {
  if (!val) {
    return;
  }
  state.currentRow = val;
  currentValue.value = state.currentRow[props.labelField];
  emit('on-row-change', proxy.$refs.input, state.currentRow);
};

// 单击当前行
const onRowClick = (row: any, column: any, event: any) => {
  showPopover.value = false;
  onRowChange(proxy.$refs.input, row); // 自动设置值
  emit('on-row-click', proxy.$refs.input, state.currentRow);
};

// 设置焦点
const focus = () => {
  proxy.$refs.input.focus();
};

// 下拉框输入改变后加载数据
const loadData = async (ref: any, isInit: any) => {
  if (!props.field || !props.field.options) return;

  const val = !isInit ? currentValue.value : '';
  const url = props.field.options.url;
  if (url) {
    // if (!val && !isInit) {
    //   return;
    // }
    if (!props.field.options.searchFields) {
      proxy.$message.error(`字段【${props.field.options.prop}】未设置查询字段！`);
      return;
    }
    const params = {
      name: val,
      searchFields: props.field.options.searchFields,
      r: Math.random(),
    };
    let hears = {
      noLoading: true,
    };
    let [err, res] = await to(postData(url, params, hears));
    if (err) {
      proxy.$message.error(err.message);
      return;
    }
    state.dataList = [];
    if (res?.result) {
      state.dataList = res.data;
    }
  }
};

// 商品名称下拉框行数据单击事件
const onRowChange = (ref: any, selectedRow: any) => {
  if (props.formData?.keyProp) {
    props.formData.value = selectedRow[props.formData.prop];
    props.formData.keyValue = selectedRow[props.formData.keyProp];
  }
  Object.keys(selectedRow).forEach((key) => {
    props.formData[key] = selectedRow[key];
  });
};

const inputClear = () => {
  if (state.dataList.length) {
    let selectedRow = state.dataList[0];
    Object.keys(selectedRow).forEach((key) => {
      props.formData[key] = null;
    });
  }
  setTimeout(() => {
    showPopover.value = true;
    loadData(proxy.$refs['input'], false);
  }, 200);
};
</script>

<style lang="scss" scoped>
.table-select {
  display: inline-block;
  width: 100%;
}

.input {
  &.el-input--default {
    :deep(.yrt-xiangxiajiantou1) {
      height: 28px;
    }
  }
  :deep(.yrt-xiangxiajiantou1) {
    transition: all 0.6s;
    -moz-transition: all 0.6s; /* Firefox 4 */
    -webkit-transition: all 0.6s; /* Safari and Chrome */
    -o-transition: all 0.6s; /* Opera */
    height: 36px;
    &.dropdown {
      transform: rotateZ(-180deg) translateY(0px);
      -ms-transform: rotateZ(-180deg) translateY(0px); /* Internet Explorer */
      -moz-transform: rotateZ(-180deg) translateY(0px); /* Firefox */
      -webkit-transform: rotateZ(-180deg) translateY(0px); /* Safari 和 Chrome */
      -o-transform: rotateZ(-180deg) translateY(0px); /* Opera */
    }
  }
  &.el-input--mini {
    :deep(.el-input__icon.yrt-xiangxiajiantou1) {
      height: 33px;
    }
  }
  :deep(.el-input__suffix) {
    right: 1px;
  }
}
.input-popover {
  .el-popover__title {
    margin-bottom: 0px;
  }
  .dropdown-table {
    :deep(.cell) {
      cursor: pointer;
    }
  }
}
</style>
