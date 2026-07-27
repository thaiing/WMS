<template>
  <div class="widget-form-container">
    <el-form :label-position="data.config.labelPosition" :inline="data.config.formInline" :style="{ width: data.config.formWidth || 'auto' }">
      <draggable v-model="data.fields" :options="{ group: 'people', ghostClass: 'ghost' }" class="widget-form-list form-region" @end="handleMoveEnd" @add="handleWidgetAdd">
        <template v-for="(element, index) in data.fields">
          <template v-if="element.type === 'grid'">
            <div v-if="element && element.key" :key="element.key" class="widget-grid-container data-grid" style="position: relative">
              <el-row :justify="element.options.justify" :align="element.options.align" :class="{ active: state.selectWidget && state.selectWidget.key === element.key }" :gutter="element.options.gutter ? element.options.gutter : 0" class="widget-grid" type="flex" @click="handleSelectWidget(index)">
                <el-col v-for="(col, colIndex) in element.columns" :key="colIndex" :span="col.span ? col.span : 0">
                  <div style="border: 1px dashed #999">
                    <draggable v-model="col.fields" :options="{ group: 'people', ghostClass: 'ghost' }" class="widget-form-list grid-list" filter="widget-grid-container" @end="handleMoveEnd" @add="handleWidgetColAdd($event, element, colIndex)">
                      <template v-for="(el, i) in col.fields">
                        <widget-form-item v-if="el.key" :key="el.key" :element="el" :select.sync="state.selectWidget" :config-type.sync="currentConfigType" :index="i" :fields="col.fields"></widget-form-item>
                      </template>
                    </draggable>
                  </div>
                </el-col>
              </el-row>
              <el-button v-if="state.selectWidget && state.selectWidget.key === element.key" title="删除" style="bottom: -20px" circle plain type="danger" class="widget-action-delete" @click.stop="handleWidgetDelete(index)">
                <i class="el-icon-yrt-shanchu2"></i>
              </el-button>
            </div>
          </template>
          <template v-else-if="element.type === 'splitter-group'">
            <div v-if="element && element.key" :key="element.key" class="widget-grid-container splitter-group" style="position: relative">
              <div :class="{ active: state.selectWidget && state.selectWidget.key === element.key }" class="widget-grid" @click="handleSelectWidget(index)">
                <div style="border: 1px dashed #999">
                  <div class="splitter-title">
                    {{ element.label }}
                  </div>
                </div>
              </div>
              <el-button v-if="state.selectWidget && state.selectWidget.key === element.key" title="删除" style="bottom: -20px" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(index)">
                <i class="el-icon-yrt-shanchu2"></i>
              </el-button>
            </div>
          </template>
          <template v-else>
            <widget-form-item v-if="element && element.key" :key="element.key" :element="element" :select.sync="state.selectWidget" :config-type.sync="currentConfigType" :index="index" :fields="data.fields"></widget-form-item>
          </template>
        </template>
      </draggable>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="widget-form">
import Draggable from 'vuedraggable';
import widgetFormItem from './widgetFormItem.vue';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { getData } from '/@/api/common/baseApi';
// 双向更新事件定义
const emit = defineEmits(['update:select', 'update:configType', 'update:detailFields']);

//#region 定义父组件传过来的值
const props = defineProps({
  data: {
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
  configType: {
    type: String,
    default: null,
  },
  detailFields: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
// #endregion

//#region 定义变量
const state = reactive({
  selectWidget: props.select,
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

const currentDetailFields = computed({
  get: function () {
    return props.detailFields;
  },
  set: function (val) {
    emit('update:detailFields', val);
  },
});

//#endregion

//#region wacth
watch(
  () => props.select,
  (val) => {
    state.selectWidget.value = val;
  },
  { deep: true, immediate: true }
);
//#endregion

const handleMoveEnd = (evt: any) => {};
const handleMoveStart = (evt: any) => {};
const handleSelectWidget = (index: any) => {
  state.selectWidget = props.data.fields[index];
  currentConfigType.value = 'WidgetConfig';
};
const handleWidgetAdd = (evt: any) => {
  const newIndex = evt.newIndex;
  // 为拖拽到容器的元素添加唯一 key
  const key = new Date().valueOf() + '_' + Math.ceil(Math.random() * 99999);
  let field = proxy.common.deepCopy(props.data.editorOptions.fields[newIndex]);
  props.data.editorOptions.fields[newIndex] = {
    ...field,
    options: {
      dataType: field.dataType,
      ...field.options,
    },
    key,
    rules: [],
  };
  delete field.dataType;
  delete field.icon;

  if (field.type === 'radio' || field.type === 'checkbox') {
    field = {
      ...field,
      options: {
        ...field.options,
        options: field.options.options.map((item: any) => ({
          ...item,
        })),
      },
    };
  } else if (field.type === 'detail-grid') {
    field.subTableName = null; // 关联子表
    field['buttons'] = [
      {
        type: 'button-group',
        label: '按钮组',
        buttons: [
          {
            type: 'button',
            label: '新建',
            options: {
              icon: 'el-icon-plus',
              type: 'primary',
              authNode: 'detailAdd',
            },
            key: 'detail_add',
          },
          {
            type: 'button',
            label: '删除',
            options: {
              icon: 'yrt-shanchu2',
              type: 'primary',
              authNode: 'detailDelete',
            },
            key: 'detail_delete',
          },
        ],
        options: {
          icon: 'icon-anniuzu',
        },
      },
    ];

    // delete field.options;
    delete field.rules;
  } else if (field.type === 'grid') {
    field = {
      ...field,
      columns: field.columns.map((item: any) => ({ ...item })),
    };
    delete field.rules;
  }

  state.selectWidget.value = props.data.editorOptions.fields[newIndex];
};
const handleWidgetColAdd = ($event: any, row: any, colIndex: any) => {
  // console.log('coladd', $event, row, colIndex)
  const newIndex = $event.newIndex;
  const oldIndex = $event.oldIndex;
  const item = $event.item;
  let field = proxy.common.deepCopy(row.columns[colIndex].fields[newIndex]);

  // 防止布局元素的嵌套拖拽
  if (item.className.indexOf('data-grid') >= 0) {
    // 如果是列表中拖拽的元素需要还原到原来位置
    item.tagName === 'DIV' && props.data.editorOptions.fields.splice(oldIndex, 0, field);

    row.columns[colIndex].fields.splice(newIndex, 1);

    return false;
  }

  // console.log('from', item)

  const key = new Date().valueOf() + '_' + Math.ceil(Math.random() * 99999);

  row.columns[colIndex].fields[newIndex] = {
    ...field,
    options: {
      dataType: field.dataType,
      ...field.options,
    },
    key,
    // 绑定键值
    model: field.type + '_' + key,
    rules: [],
  };

  if (field.type === 'radio' || field.type === 'checkbox') {
    field = {
      ...field,
      options: {
        ...field.options,
        options: field.options.options.map((item: any) => ({
          ...item,
        })),
      },
    };
  }
  delete field.dataType;
  delete field.icon;

  currentConfigType.value = 'WidgetConfig';
  state.selectWidget.value = row.columns[colIndex].fields[newIndex];
};
const handleWidgetDelete = (index: any) => {
  if (props.data.editorOptions.fields.length - 1 === index) {
    if (index === 0) {
      state.selectWidget.value = {};
    } else {
      state.selectWidget.value = props.data.editorOptions.fields[index - 1];
    }
  } else {
    state.selectWidget.value = props.data.editorOptions.fields[index + 1];
  }

  proxy.$nextTick(() => {
    props.data.editorOptions.fields.splice(index, 1);
  });
};
// 行内布局
const handleWidgetInlineAdd = ($event: any, row: any) => {
  // console.log('coladd', $event, row, colIndex)
  const newIndex = $event.newIndex;
  const oldIndex = $event.oldIndex;
  const item = $event.item;

  // 防止布局元素的嵌套拖拽
  if (item.className.indexOf('inline-group') >= 0) {
    // 如果是列表中拖拽的元素需要还原到原来位置
    item.tagName === 'DIV' && props.data.editorOptions.fields.splice(oldIndex, 0, row.fields[newIndex]);

    row.fields.splice(newIndex, 1);

    return false;
  }

  // console.log('from', item)

  const key = new Date().valueOf() + '_' + Math.ceil(Math.random() * 99999);

  row.fields[newIndex] = {
    ...row.fields[newIndex],
    options: {
      ...row.fields[newIndex].options,
    },
    key,
    rules: [],
  };

  if (row.fields[newIndex].type === 'radio' || row.fields[newIndex].type === 'checkbox') {
    row.fields[newIndex] = {
      ...row.fields[newIndex],
      options: {
        ...row.fields[newIndex].options,
        options: row.fields[newIndex].options.options.map((item: any) => ({
          ...item,
        })),
      },
    };
  }
  delete row.fields[newIndex].icon;

  currentConfigType.value = 'WidgetConfig';
  state.selectWidget.value = row.fields[newIndex];
};
// 明细布局
const handleWidgetDetailAdd = ($event: any, row: any) => {
  // console.log('coladd', $event, row, colIndex)
  const newIndex = $event.newIndex;
  const oldIndex = $event.oldIndex;
  const item = $event.item;

  // 防止布局元素的嵌套拖拽
  if (item.className.indexOf('detail-grid') >= 0) {
    // 如果是列表中拖拽的元素需要还原到原来位置
    item.tagName === 'DIV' && props.data.editorOptions.fields.splice(oldIndex, 0, row.fields[newIndex]);

    row.fields.splice(newIndex, 1);

    return false;
  }

  const key = new Date().valueOf() + '_' + Math.ceil(Math.random() * 99999);

  var field = row.fields[newIndex];
  row.fields[newIndex] = {
    prop: field.options.prop,
    label: field.label,
    dataType: field.options.dataType,
    sortable: false,
    hidden: false,
    isQuickSearch: false,
    key,
    headerAlign: 'center',
    align: 'left',
  };
  delete field.options.dataType;

  if (row.fields[newIndex].type === 'radio' || row.fields[newIndex].type === 'checkbox') {
    row.fields[newIndex] = {
      ...row.fields[newIndex],
      options: {
        ...row.fields[newIndex].options,
        options: row.fields[newIndex].options.options.map((item: any) => ({
          ...item,
        })),
      },
    };
  }
  delete row.fields[newIndex].icon;

  currentConfigType.value = 'ManagerConfig';
  state.selectWidget.value = row.fields[newIndex];
};
// 显示明细字段列表
const showDetailField = () => {
  if (!state.selectWidget.value.subTableName) {
    proxy.$message.warning('请设置关联子表名称');
    return;
  }
  loadModuleFields();
};
// 加载模块字段
const loadModuleFields = async () => {
  var url = '/tool/gen/columnListByTableName/' + state.selectWidget.value.subTableName;
  var params = {};

  const res = await getData(url, params);
  if (res.result) {
    var fields = res.data.rows.map((item: any, index: number, arr: Array<any>) => {
      var field = {
        type: 'input',
        label: item.columnComment,
        icon: 'yrt-danhangshurukuang',
        options: {
          prop: item.javaField,
          width: '100%',
          noLabel: false,
          defaultValue: '',
          required: false,
          dataType: proxy.common.caseStyle(item.javaType),
          pattern: '',
          placeholder: '',
        },
      };
      return field;
    });
    currentDetailFields.value = fields;
    // 找到明细主键
    var keyField = res.data.rows.find((item: any) => {
      return item.fieldAttribute === 'Key';
    });
    if (keyField) {
      state.selectWidget.value.options.idField = keyField.columnName;
    }
  } else {
    proxy.$message.error(res.Msg);
  }
};
// 下来选择器参数
const selectOptions = (newField: any, dropdownId: any, keyProp: any) => {
  const randNum = Math.ceil(Math.random() * 99999);
  const key = new Date().valueOf() + '_' + randNum;
  const params = {
    type: 'select',
    label: newField.label,
    options: {
      width: '280px',
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      showLabel: true,
      noLabel: false,
      options: [
        {
          value: '下拉框1',
        },
        {
          value: '下拉框2',
        },
        {
          value: '下拉框3',
        },
      ],
      remote: 'bindDropdown',
      remoteOptions: [],
      dropdownId: dropdownId,
      props: {
        value: 'value',
        label: 'label',
      },
      prop: newField.options.prop,
      keyProp: null,
      dataType: newField.options.dataType,
    },
    key: key,
  };
  if (keyProp) {
    params.options.keyProp = keyProp;
  }
  return params;
};

// 向fields集合中添加字段
const addField = (fields: any, field: any, width?: any) => {
  const newIndex = fields.length;
  // 为拖拽到容器的元素添加唯一 key
  const randNum = Math.ceil(Math.random() * 99999);
  const key = new Date().valueOf() + '_' + randNum;
  fields[newIndex] = {
    ...field,
    options: {
      ...field.options,
    },
    key,
    rules: [],
  };

  var newField = fields[newIndex];
  switch (newField.options.dataType) {
    case 'datetime':
      newField.type = 'date';
      break;
  }
  switch (newField.options.prop) {
    case 'enable':
      fields[newIndex] = {
        type: 'switch',
        label: newField.label,
        options: {
          defaultValue: false,
          required: false,
          disabled: false,
          noLabel: false,
          prop: newField.options.label,
          dataType: newField.options.dataType,
          'active-value': 1,
          'inactive-value': 0,
        },
        key: key,
      };
      break;
    case 'userTrueName':
      fields[newIndex] = selectOptions(newField, 22, 'user_Id');
      break;
    case 'consignorName':
      fields[newIndex] = selectOptions(newField, 797, 'consignor_Id');
      break;
    case 'storageName':
      fields[newIndex] = selectOptions(newField, 31, 'storage_Id');
      break;
    case 'expressCorpName':
      fields[newIndex] = selectOptions(newField, 568, 'expressCorp_Id');
      break;
    case 'expressCorpType':
      fields[newIndex] = selectOptions(newField, 502, null);
      break;
    case 'creator':
    case 'createDate':
    case 'modifier':
    case 'modifyDate':
      newField.options.readonly = true;
      break;
    case 'remark':
      fields[newIndex].type = 'textarea';
      fields[newIndex].options.width = '420px';
      break;
  }
  if (fields[newIndex].type !== 'switch') {
    fields[newIndex].options.width = width || '100%';
  }
  delete fields[newIndex].icon;
};
</script>
