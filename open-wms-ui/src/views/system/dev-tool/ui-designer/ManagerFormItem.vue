<template>
  <li v-if="element && element.key" :class="{ active: state.selectWidget && state.selectWidget.key == element.key }" class="item" @click.stop="handleSelectWidget(index)">
    <i class="handle yrt-yidong1 mr-2"></i>
    <span>{{ element.label }}</span>
    <el-button v-if="state.selectWidget && state.selectWidget.key == element.key" type="primary" link title="删除" size="small" @click.stop="handleWidgetDelete(index)">
      <i class="yrt-shanchu2"></i>
    </el-button>
    <el-button v-if="state.selectWidget && state.selectWidget.key == element.key" type="primary" link title="复制" size="small" @click.stop="handleWidgetClone(index)">
      <i class="yrt-fuzhi4"></i>
    </el-button>
    <div class="right-tool">
      <el-input v-model="element.width" placeholder="列宽" class="w-50" size="small"></el-input>
      <el-input v-model.number="element.searchRowNo" placeholder="查询顺序(大于0显示)" class="w-50" size="small"></el-input>
      <el-select v-if="dataOptions.openGroupBy" v-model="element.groupBy" class="w-100" placeholder="分组查询" size="small" clearable>
        <el-option label="GROUP" value="GROUP"></el-option>
        <el-option label="SUM" value="SUM"></el-option>
        <el-option label="COUNT" value="COUNT"></el-option>
        <el-option label="AVG" value="AVG"></el-option>
        <el-option label="MAX" value="MAX"></el-option>
        <el-option label="MIN" value="MIN"></el-option>
        <el-option label="MAXDISTINCT" value="MAXDISTINCT"></el-option>
        <el-option label="CustomExpress" value="CustomExpress"></el-option>
      </el-select>
      <span class="txt">快速查询：</span>
      <el-switch v-model="element.isQuickSearch" :active-value="true" :inactive-value="false" size="small"></el-switch>
      <span class="txt">扩展字段：</span>
      <el-switch v-model="element.isExpandField" :active-value="true" :inactive-value="false" size="small"></el-switch>
      <span class="txt">显示：</span>
      <el-switch v-model="element.hidden" :active-value="false" :inactive-value="true" size="small"></el-switch>
    </div>
  </li>
</template>

<script setup lang="ts" name="manager-form-item">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 双向更新事件定义
const emit = defineEmits(['update:select', 'update:configType']);

//#region 定义父组件传过来的值
const props = defineProps({
  element: {
    type: Object,
    default: () => {
      return {};
    },
  },
  select: {
    type: Object,
    default: () => {
      return {};
    },
  },
  index: {
    type: Number,
    default: null,
  },
  fields: {
    type: Array,
    default: () => {
      return [] as Array<any>;
    },
  },
  configType: {
    type: String,
    default: null,
  },
  dataOptions: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  selectWidget: props.select as any,
});
//#endregion

//#region wacth
watch(
  () => props.select,
  (val) => {
    state.selectWidget = val;
  },
  { deep: true, immediate: true }
);

watch(
  () => state.selectWidget,
  (val) => {
    emit('update:select', val);
  },
  { deep: true, immediate: true }
);
//#endregion

//#region 计算属性
// 可用字段
const currentFields = computed(() => {
  return props.fields as Array<any>;
});
//#endregion

const handleSelectWidget = (index: number) => {
  state.selectWidget = props.fields[index];
  if (typeof state.selectWidget.tagColorList === 'undefined') {
    state.selectWidget.tagColorList = [];
  }
  emit('update:configType', 'ManagerConfig');
};

const handleWidgetDelete = (index: number) => {
  if (props.fields.length - 1 === index) {
    if (index === 0) {
      state.selectWidget = {};
    } else {
      state.selectWidget = props.fields[index - 1];
    }
  } else {
    state.selectWidget = props.fields[index + 1];
  }

  proxy.$nextTick(() => {
    props.fields.splice(index, 1);
  });
};

const handleWidgetClone = (index: number) => {
  const cloneData = {
    ...currentFields.value[index],
    key: new Date().valueOf() + '_' + Math.ceil(Math.random() * 99999),
  };

  props.fields.splice(index, 0, cloneData);

  proxy.$nextTick(() => {
    state.selectWidget = props.fields[index + 1];
  });
};
</script>

<style lang="scss" scoped>
.txt {
  font-size: 14px;
  margin-left: 10px;
  display: inline-block;
  color: #5a5e66;
}

:deep(.right-tool) {
  .el-input__inner {
    padding: 0 5px;
  }
}
</style>
