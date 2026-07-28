<template>
  <el-form-item v-if="element && element.key" :class="{ active: state.selectWidget && state.selectWidget.key === element.key, is_req: element.options.required, 'no-margin': element.options.noMargin }" class="widget-view" @click.stop="handleSelectWidget(index)">
    <component :is="element.type"></component>

    <el-button v-if="state.selectWidget && state.selectWidget.key === element.key" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(index)">
      <i class="el-icon-yrt-shanchu2"></i>
    </el-button>
    <el-button v-if="state.selectWidget && state.selectWidget.key === element.key" title="复制" class="widget-action-clone" circle plain type="primary" @click.stop="handleWidgetClone(index)">
      <i class="el-icon-yrt-fuzhi4"></i>
    </el-button>
  </el-form-item>
</template>

<script setup lang="ts" name="manager-form-item">
import FmUpload from './Upload/index.vue';
import Tinymce from '/@/components/tinymce/index.vue';
import InputSelect from '/@/components/base/InputSelect.vue';
import TableSelect from '/@/components/base/TableSelect.vue';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 双向更新事件定义
const emit = defineEmits(['update:select', 'update:configType']);
// // 代办任务
// import taskSchedule from '/@/views/dashboard/task/task-schedule';
// import taskUrge from '/@/views/dashboard/task/task-urge';
// import taskContent from '/@/views/dashboard/task/task-content';

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
      return {};
    },
  },
  configType: {
    type: String,
    default: null,
  },
});

//#region 定义变量
const state = reactive({
  selectWidget: props.select as any,
});
//#endregion

const _fields: any = computed(() => {
  return props.fields;
});
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
const handleSelectWidget = (index: number) => {
  state.selectWidget = props.fields[index];
  if (typeof state.selectWidget.tagColorList === 'undefined') {
    state.selectWidget.tagColorList = [];
  }
  emit('update:configType', 'ManagerConfig');
};
const handleWidgetDelete = (index: any) => {
  if (props.fields.length - 1 === index) {
    if (index === 0) {
      state.selectWidget.value = {};
    } else {
      state.selectWidget.value = props.fields[index - 1];
    }
  } else {
    state.selectWidget.value = props.fields[index + 1];
  }

  proxy.$nextTick(() => {
    props.fields.splice(index, 1);
  });
};
const handleWidgetClone = (index: number) => {
  let cloneData = {
    ..._fields.value[index],
    options: { ..._fields.value[index].options },
    key: new Date().valueOf() + '_' + Math.ceil(Math.random() * 99999),
  };

  if (_fields.value[index].type === 'radio' || _fields.value[index].type === 'checkbox') {
    cloneData = {
      ...cloneData,
      options: {
        ...cloneData.options,
        options: cloneData.options.options.map((item: any) => ({ ...item })),
      },
    };
  }

  props.fields.splice(index, 0, cloneData);

  proxy.$nextTick(() => {
    state.selectWidget.value = props.fields[index + 1];
  });
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.widget-view {
  div.el-input:not(.no-bg) {
    ::v-deep input.el-input__inner[readonly] {
      background-color: #f5f7fa;
      cursor: not-allowed;
    }
  }
}
</style>
