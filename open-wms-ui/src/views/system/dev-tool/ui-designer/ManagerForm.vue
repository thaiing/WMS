<template>
  <div class="manager-form-container">
    <div class="button-container-title">按钮设计区</div>
    <!--按钮设置-->
    <manager-form-button-group v-model:buttons="data.dataListOptions.buttons" v-model:config-type="currentConfigType" v-model:select="selectWidget"></manager-form-button-group>

    <!--表格设置-->
    <div class="button-container-title margin-top-5">
      字段设计区
      <el-button type="primary" link size="small" class="btn-add-all" @click="btnAddAll">全部加入</el-button>
      <el-button type="primary" link size="small" class="btn-add-all" @click="btnClearAll">清空</el-button>
    </div>
    <draggable v-model="data.dataListOptions.fields" item-key="key" group="people" :animation="300" handle=".handle" ghost-class="ghost" chosenClass="chosen-item" tag="ul" class="draggable-main" @end="handleMoveEnd" @add="handleWidgetAdd" @move="handleWidgetStart" @clone="handleWidgetClone">
      <template #item="{ element, index }">
        <manager-form-item v-if="element && element.key" :key="element.key" :element="element" v-model:select="selectWidget" :index="index" :fields="data.dataListOptions.fields" :data-options="data.dataOptions" v-model:config-type="currentConfigType"></manager-form-item>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts" name="manager-form">
import Draggable from 'vuedraggable';
import ManagerFormItem from './ManagerFormItem.vue';
import ManagerFormButtonGroup from './ManagerFormButtonGroup.vue';

import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 双向更新事件定义
const emit = defineEmits(['update:select', 'update:configType']);

//#region 定义父组件传过来的值
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
  select: {
    type: Object || null,
    default: () => {
      return {};
    },
  },
  configType: {
    type: String,
    default: null,
  },
  // 主表字段
  fieldComponents: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  list1: [
    { name: 'John', id: 1 },
    { name: 'Joao', id: 2 },
    { name: 'Jean', id: 3 },
    { name: 'Gerard', id: 4 },
  ],
  list2: [
    { name: 'Juan', id: 5 },
    { name: 'Edgard', id: 6 },
    { name: 'Johnson', id: 7 },
  ],
});
//#endregion

//#region 计算属性
const currentConfigType = computed({
  get: function () {
    return props.configType;
  },
  set: function (val) {
    emit('update:configType', val);
  },
});

const selectWidget: Record<string, any> = computed({
  get: function () {
    return props.select;
  },
  set: function (val) {
    emit('update:select', val);
  },
});
//#endregion

//#region wacth
watch(
  () => props.select,
  (val) => {
    selectWidget.value = val;
  },
  { deep: true, immediate: true }
);
//#endregion

const handleMoveEnd = (params: any) => {
  let { newIndex, oldIndex } = params;
  // console.log('index', newIndex, oldIndex)
};

const handleWidgetStart = (index: number) => {
  // console.log(index, '#####')
};
const handleWidgetClone = (index: number) => {
  // console.log(index, '#####')
};

const handleSelectWidget = (index: number) => {
  selectWidget.value = props.data.dataListOptions.fields[index];
};

const handleWidgetAdd = (evt: any) => {
  const newIndex = evt.newIndex;
  // 为拖拽到容器的元素添加唯一 key
  const key = new Date().valueOf() + '_' + Math.ceil(Math.random() * 99999);
  let field = proxy.common.deepCopy(props.data.dataListOptions.fields[newIndex]);
  let newField = Object.assign({}, field, {
    prop: field.options.prop,
    dataType: field.dataType || field.options.dataType,
    sortable: false,
    type: 'input',
    hidden: false,
    isQuickSearch: false,
    align: 'center',
    headerAlign: 'center',
    key,
  });
  switch (newField.dataType) {
    case 'datetime':
      newField.width = 140;
      break;
  }
  if (newField.prop.endsWith('Code')) {
    newField.width = 120;
  }

  delete newField.options.prop;
  delete newField.options.dataType;
  props.data.dataListOptions.fields[newIndex] = newField;

  selectWidget.value = props.data.dataListOptions.fields[newIndex];
};

// 添加全部列表字段
const btnAddAll = () => {
  props.fieldComponents
    .filter((field: any) => {
      return (
        !field.options.prop.endsWith('Id') &&
        !field.options.prop.endsWith('ID') &&
        !props.data.dataListOptions.fields.some((item: any) => {
          return item.prop === field.options.prop;
        })
      );
    })
    .forEach((field: any) => {
      const newIndex = props.data.dataListOptions.fields.length;
      // 为拖拽到容器的元素添加唯一 key
      const key = new Date().valueOf() + '_' + Math.ceil(Math.random() * 99999);
      props.data.dataListOptions.fields[newIndex] = {
        prop: field.options.prop,
        label: field.label,
        searchRowNo: field.searchRowNo,
        dataType: field.dataType,
        sortable: false,
        type: 'input',
        hidden: false,
        isQuickSearch: false,
        key,
      };
      var newField = props.data.dataListOptions.fields[newIndex];
      switch (newField.dataType) {
        case 'datetime':
          newField.width = 140;
          break;
      }
      if (newField.prop.endsWith('Code')) {
        newField.width = 120;
      }
    });

  // 选中第一个
  currentConfigType.value = 'ManagerConfig';
  selectWidget.value = props.data.dataListOptions.fields[0];
};

// 清空全部列表字段
const btnClearAll = () => {
  proxy
    .$confirm('确定要全部列表字段, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      props.data.dataListOptions.fields = [];
      selectWidget.value = null;
      proxy.$message.error('清空完毕');
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};
</script>

<style lang="scss" scoped>
.btn-add-all {
  padding: 2px 0px 2px 10px;
}
</style>
