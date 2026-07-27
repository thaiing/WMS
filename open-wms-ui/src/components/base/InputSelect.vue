<template>
  <el-popover ref="input-select" v-model:visible="showPopover" :title="'请选择' + label" :disabled="disabled" :trigger="trigger" popper-class="input-popover" placement="bottom" width="300" @show="popoverShow()" @hide="() => (state.treeSuffixIcon = 'yrt-xiangxiajiantou1')">
    <template #reference>
      <div>
        <el-input ref="input" v-model="currentValue" :style="{ width: inputWidth }" :placeholder="placeholder" :disabled="disabled" :size="size" class="input-select no-bg" @focus="(event:any) => onFocus($refs['input'], currentValue, event)" @change="(val:any) => onInputChange($refs['input-select'], val)" @keyup="(e:any) => onInputKeyup($refs['input'], e)" @keydown="(event:any) => onInputKeydown($refs['input'], event)" @blur="(event:any) => onBlur($refs['input'], currentValue, event)">
          <template #suffix> <i :class="state.treeSuffixIcon"></i></template>
        </el-input>
      </div>
    </template>
    <el-scrollbar :noresize="false" :native="false" wrap-class="popover-options scrollbar-wrap">
      <template v-for="(item, index) in state.dataList">
        <div :ref="state.currentOption === item ? 'option-item' : ''" :class="['select-item', { selected: state.currentOption === item, hover: currentValue === getItemLabel(item) }]" @click="onRowClick(getItemLabel(item), item)">
          {{ getItemLabel(item) }}
        </div>
      </template>
      <div v-if="!state.dataList.length" class="no-data">没有数据</div>
    </el-scrollbar>
  </el-popover>
</template>

<script setup lang="ts" name="input-select">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:modelValue', 'on-row-click', 'on-change', 'on-row-change', 'on-key-up', 'on-key-down', 'on-focus', 'on-blur']);

//#region 定义属性
const props = defineProps({
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
  // 候选项列表
  options: {
    type: Array,
    required: true,
    default: () => {
      return [];
    },
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 输入框宽度
  inputWidth: {
    type: String,
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
  // 弹出框触发事件方式
  trigger: {
    type: String as PropType<any>,
    default: 'click',
  },
  // 选中后隐藏下拉框
  clickHidden: {
    type: Boolean,
    default: true,
  },
  // 加载数据前事件
  loadDataBefore: {
    type: Function,
    default: null,
  },
  // 输入框大小
  size: {
    type: String as PropType<any>,
    default: 'default',
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  // TREE选择器右侧下拉框
  treeSuffixIcon: 'yrt-xiangxiajiantou1',
  // 是否显示下拉框
  isShowPopover: false,
  // 当前行
  currentOption: {} as EmptyObjectType,
  // 键盘按下时延时handle
  searchHandle: null as unknown as NodeJS.Timeout,
  // 当前数据
  dataList: [] as any[],
});
//#endregion

//#region 计算属性
// 当前筛选完数据
const currentValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

// 当前筛选完数据
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
  () => props.options,
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

// item单击事件
const onRowClick = (val: any, rowData: any) => {
  var ref = proxy.$refs['input-select'];
  currentValue.value = val;
  emit('on-row-click', ref, val, rowData);
  if (props.clickHidden) {
    ref.hide();
  }
};

// 关闭下拉框
const close = () => {
  var ref = proxy.$refs['input-select'];
  ref.hide();
};

// input change事件
const onInputChange = (ref: any, val: any) => {
  emit('on-change', ref, val);
};

// input change事件
const onInputKeyup = (ref: any, e: any) => {
  // Up key
  if (e.keyCode === 38) {
    let existIndex = props.options.findIndex((item: any) => {
      // return item[state.props.label] === state.currentOption;
      return item === state.currentOption;
    });
    existIndex -= 1;
    if (existIndex < 0) {
      existIndex = props.options.length - 1;
    }
    const rowData: any = props.options.find((item, index) => {
      return index === existIndex;
    });
    state.currentOption = rowData;
    // currentValue.value = rowData[state.props.label];
    emit('on-row-change', ref, currentValue.value, rowData);
    return;
  }
  // Down key
  if (e.keyCode === 40) {
    showPopover.value = true;
    let existIndex = props.options.findIndex((item: any) => {
      // return item[state.props.label] === currentValue.value;
      return item === state.currentOption;
    });
    existIndex += 1;
    if (existIndex >= props.options.length) {
      existIndex = 0;
    }
    const rowData: any = props.options.find((item, index) => {
      return index === existIndex;
    });
    state.currentOption = rowData;
    // currentValue.value = rowData[state.props.label];
    proxy.$nextTick(() => {
      emit('on-row-change', ref, currentValue.value, rowData);
    });
    return;
  }
  // Enter key
  if (e.keyCode === 13) {
    currentValue.value = state.currentOption[props.props.label];
    showPopover.value = !showPopover.value;
    proxy.$refs.input.select();
    proxy.$refs.input.focus();
    onRowClick(currentValue.value, state.currentOption);
    return;
  }
  // 取消请求加载数据
  if (state.searchHandle) {
    clearTimeout(state.searchHandle);
  }
  state.searchHandle = setTimeout(() => {
    loadData(ref, false);
    clearTimeout(state.searchHandle);
  }, 800);
  emit('on-key-up', ref, currentValue.value, e, state.currentOption);
};

// input keydown事件
const onInputKeydown = (ref: any, event: any) => {
  emit('on-key-down', ref, currentValue.value, event);
};

// 当值当前行
const setCurrentIndex = (existIndex: any) => {
  var ref = proxy.$refs['input'];
  const rowData: any = props.options.find((item, index) => {
    return index === existIndex;
  });
  if (rowData) {
    currentValue.value = rowData[props.props.label];
    proxy.$nextTick(() => {
      emit('on-row-change', ref, currentValue.value, rowData);
    });
  }
};

// 判断是否有选中项
const getCurrrentIndex = () => {
  const existIndex = props.options.findIndex((item: any) => {
    return item[props.props.label] === currentValue.value;
  });
  return existIndex;
};

// 获得焦点
const onFocus = (ref: any, val: any, event: any) => {
  var disabled = ref.$attrs.disabled;
  if (disabled) return;

  emit('on-focus', ref, val, event);
};

// 失去焦点
const onBlur = (ref: any, val: any, event: any) => {
  if (props.disabled) return;

  emit('on-blur', ref, val, event);
};

const focus = () => {
  proxy.$refs.input.focus();
};

const select = () => {
  proxy.$refs.input.select();
};

// 下拉框数据项-label值
const getItemLabel = (item: any) => {
  if (typeof item === 'string') {
    return item;
  } else {
    return item[props.props.label] || item[props.props.value];
  }
};

// 下拉框数据项-label值
const getItemValue = (item: any) => {
  if (typeof item === 'string') {
    return item;
  } else {
    return item.value !== null ? item[props.props.value] : item[props.props.label];
  }
};

// 下拉框输入改变后加载数据
const loadData = async (ref: any, isInit: any) => {
  if (!props.field || !props.field.options) return;

  const val = !isInit ? currentValue.value : '';
  const url = props.field.options.url;
  if (url) {
    if (!props.field.options.searchFields) {
      proxy.$message.error(`字段【${props.field.options.prop}】未设置查询字段！`);
      return;
    }
    const params = {
      name: val,
      searchFields: props.field.options.searchFields.split(','),
    };
    if (typeof props.loadDataBefore === 'function') {
      props.loadDataBefore(params);
    }
    let [err, res] = await to(postData(url, params));
    if (err) {
      proxy.$message.error(err.message);
      return;
    }
    proxy.common.showMsg(res);
    state.dataList = [];
    if (res?.result) {
      state.dataList = res.data;
    }
  }
};

const popoverShow = () => {
  state.treeSuffixIcon = 'yrt-xiangxiajiantou1 dropdown';
  // onInputKeyup(proxy.$refs['input-select'], { keyCode: 0 });
};
</script>

<style lang="scss" scoped>
/* input-select */
.input-select {
  padding: auto;
  .yrt-xiangxiajiantou1 {
    transition: all 0.6s;
    -moz-transition: all 0.6s; /* Firefox 4 */
    -webkit-transition: all 0.6s; /* Safari and Chrome */
    -o-transition: all 0.6s; /* Opera */
    height: 100%;
    &.dropdown {
      transform: rotateZ(-180deg) translateY(3px);
      -ms-transform: rotateZ(-180deg) translateY(3px); /* Internet Explorer */
      -moz-transform: rotateZ(-180deg) translateY(3px); /* Firefox */
      -webkit-transform: rotateZ(-180deg) translateY(3px); /* Safari 和 Chrome */
      -o-transform: rotateZ(-180deg) translateY(3px); /* Opera */
    }
  }
  .el-input__inner {
    padding-left: 5px;
  }
}
.select-item {
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 34px;
  line-height: 34px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  &.hover,
  &:hover {
    background-color: #f5f7fa;
  }
  &:last-child {
    margin-bottom: 20px;
  }
  &.selected {
    color: #409eff;
    font-weight: 700;
  }
}
.no-data {
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 34px;
  line-height: 34px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  &:last-child {
    margin-bottom: 20px;
  }
}
.el-scrollbar {
  :deep(.popover-options.scrollbar-wrap) {
    max-height: 200px;
    overflow-x: hidden;
    padding: 0px;
  }
}
</style>
