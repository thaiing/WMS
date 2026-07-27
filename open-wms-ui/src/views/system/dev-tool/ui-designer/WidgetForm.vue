<template>
  <div class="widget-form-container">
    <el-form :label-position="data.editorOptions.config.labelPosition" :label-width="data.editorOptions.config.labelWidth" :inline="data.editorOptions.config.formInline" :style="{ width: data.editorOptions.config.formWidth || 'auto' }">
      <el-button type="primary" link size="small" class="btn-add-all" @click="addCol">1列模式</el-button>
      <el-button type="primary" link size="small" class="btn-add-all" @click="addCols(2)">2列模式</el-button>
      <el-button type="primary" link size="small" class="btn-add-all" @click="addCols(3)">3列模式</el-button>
      <el-button type="primary" link size="small" class="btn-add-all" @click="btnClearAll">清空</el-button>
      <draggable v-model="data.editorOptions.fields" item-key="key" group="people" ghost-class="ghost" class="widget-form-list form-region" @end="handleMoveEnd" @add="handleWidgetAdd">
        <template #item="{ element, index }">
          <div v-if="element && element.type === 'grid' && element.key" :key="element.key" class="widget-grid-container data-grid" style="position: relative">
            <el-row :justify="element.options.justify" :align="element.options.align" :class="{ active: selectWidget && selectWidget.key === element.key }" :gutter="element.options.gutter ? element.options.gutter : 0" :style="{ 'background-color': element.isMain ? '#b2f9ec' : '' }" class="widget-grid" type="flex" @click="handleSelectWidget(index)">
              <el-col v-for="(col, colIndex) in element.columns" :key="colIndex" :span="col.span ? col.span : 0">
                <div style="border: 1px dashed #999">
                  <draggable v-model="col.fields" item-key="key" :group="{ name: 'people' }" ghost-class="ghost" class="widget-form-list grid-list" filter="widget-grid-container" @end="handleMoveEnd" @add="handleWidgetColAdd($event, element, colIndex)">
                    <template #item="scoped">
                      <widget-form-item v-if="scoped.element.key" :key="scoped.element.key" :element="scoped.element" v-model:select="selectWidget" v-model:config-type="currentConfigType" :index="scoped.index" :fields="col.fields" :data="data"></widget-form-item>
                    </template>
                  </draggable>
                </div>
              </el-col>
            </el-row>
            <el-button v-if="selectWidget && selectWidget.key === element.key" title="删除" style="bottom: -20px" circle plain type="danger" class="widget-action-delete" @click.stop="handleWidgetDelete(index)">
              <i class="yrt-shanchu2"></i>
            </el-button>
          </div>
          <div v-else-if="element && element.type === 'inline-group' && element.key" :key="'inline-group' + element.key" class="widget-grid-container inline-group" style="position: relative">
            <div :class="{ active: selectWidget && selectWidget.key === element.key }" class="widget-grid" @click="handleSelectWidget(index)">
              <div style="border: 1px dashed #999">
                <el-form-item :label="element.label">
                  <draggable v-model="element.fields" item-key="key" :group="{ name: 'people' }" ghost-class="ghost" class="widget-form-list inline-list" filter="widget-grid-container" @end="handleMoveEnd" @add="handleWidgetInlineAdd($event, element)">
                    <template #item="scoped">
                      <widget-form-item-inline v-if="scoped.element.key" :key="scoped.element.key" :element="scoped.element" v-model:select="selectWidget" v-model:config-type="currentConfigType" :index="scoped.index" :fields="element.fields" :data="data"></widget-form-item-inline>
                    </template>
                  </draggable>
                </el-form-item>
              </div>
            </div>
            <el-button v-if="selectWidget && selectWidget.key === element.key" title="删除" style="bottom: -20px" type="danger" class="widget-action-delete" circle plain @click.stop="handleWidgetDelete(index)">
              <i class="yrt-shanchu2"></i>
            </el-button>
          </div>
          <div v-else-if="element && element.type === 'splitter-group' && element.key" :key="'splitter-group' + element.key" class="widget-grid-container splitter-group" style="position: relative">
            <div :class="{ active: selectWidget && selectWidget.key === element.key }" class="widget-grid" @click="handleSelectWidget(index)">
              <div style="border: 1px dashed #999">
                <div class="splitter-title">
                  {{ element.label }}
                </div>
              </div>
            </div>
            <el-button v-if="selectWidget && selectWidget.key === element.key" title="删除" style="bottom: -20px" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(index)">
              <i class="yrt-shanchu2"></i>
            </el-button>
          </div>
          <div v-else-if="element && element.type === 'detail-grid' && element.key" :key="'detail-grid' + element.key" class="widget-grid-container detail-grid" style="position: relative">
            <div :class="{ active: selectWidget && selectWidget.key === element.key }" class="widget-grid" @click="handleSelectWidget(index)">
              <div if="element.options.title" class="splitter-title">
                <div class="title">
                  {{ element.options.title }}
                </div>
              </div>
              <div class="manager-form-container" style="border: 1px dashed #999">
                <div class="button-container-title">明细按钮设计区</div>
                <!--按钮设置-->
                <manager-form-button-group v-model:buttons="element.buttons" v-model:config-type="currentConfigType" v-model:select="selectWidget"></manager-form-button-group>

                <div class="button-container-title margin-top-5">明细字段设计区</div>
                <draggable v-model="element.fields" item-key="key" :group="{ name: 'people' }" ghost-class="ghost" :animation="300" , handle=".handle" chosen-class="chosen-item" tag="ul" class="draggable-main widget-form-list detail-list" @add="handleWidgetDetailAdd($event, element)">
                  <template #item="scoped">
                    <manager-form-item v-if="scoped.element && scoped.element.key" :key="scoped.element.key" :element="scoped.element" v-model:select="selectWidget" v-model:config-type="currentConfigType" :index="scoped.index" :fields="element.fields"></manager-form-item>
                  </template>
                </draggable>
              </div>
            </div>
            <el-button v-if="selectWidget && selectWidget.key === element.key" circle plain type="primary" title="查看字段" style="bottom: -20px" class="widget-action-clone" @click.stop="showDetailField">
              <i class="icon-74wodedingdan"></i>
            </el-button>
            <el-button v-if="selectWidget && selectWidget.key === element.key" circle plain type="danger" title="删除" style="bottom: -20px" class="widget-action-delete" @click.stop="handleWidgetDelete(index)">
              <i class="yrt-shanchu2"></i>
            </el-button>
          </div>
          <widget-form-item v-else-if="element && element.key" :key="'widget-form-item' + element.key" :element="element" v-model:select="selectWidget" v-model:config-type="currentConfigType" :index="index" :fields="data.editorOptions.fields" :data="data"></widget-form-item>
        </template>
      </draggable>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="manager-form">
import Draggable from 'vuedraggable';
import WidgetFormItem from './WidgetFormItem.vue';
import WidgetFormItemInline from './WidgetFormItemInline.vue';
import ManagerFormItem from './ManagerFormItem.vue';
import ManagerFormButtonGroup from './ManagerFormButtonGroup.vue';

import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { getData } from '/@/api/common/baseApi';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 双向更新事件定义
const emit = defineEmits(['update:select', 'update:configType', 'update:detailFields']);

//#region 定义父组件传过来的值
const props = defineProps({
  // 整个JSON对象，包含：dataOptions、editorOptions、dataListOptions
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
const state = reactive({});
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
  // console.log('index', newIndex, oldIndex)
};

const handleMoveStart = (params: any) => {
  // console.log("start", oldIndex, this.basicComponents);
};

const handleSelectWidget = (index: number) => {
  // console.log(index, '#####')
  selectWidget.value = props.data.editorOptions.fields[index];
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

  selectWidget.value = props.data.editorOptions.fields[newIndex];
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
  selectWidget.value = row.columns[colIndex].fields[newIndex];
};

const handleWidgetDelete = (index: any) => {
  if (props.data.editorOptions.fields.length - 1 === index) {
    if (index === 0) {
      selectWidget.value = {};
    } else {
      selectWidget.value = props.data.editorOptions.fields[index - 1];
    }
  } else {
    selectWidget.value = props.data.editorOptions.fields[index + 1];
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
  selectWidget.value = row.fields[newIndex];
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
  selectWidget.value = row.fields[newIndex];
};

// 显示明细字段列表
const showDetailField = () => {
  if (!selectWidget.value.subTableName) {
    proxy.$message.warning('请设置关联子表名称');
    return;
  }
  loadModuleFields();
};

// 加载模块字段
const loadModuleFields = async () => {
  var url = '/tool/gen/columnListByTableName/' + selectWidget.value.subTableName;
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
      selectWidget.value.options.idField = keyField.columnName;
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

// 添加单列模式
const addCol = () => {
  props.data.editorOptions.fields = [];
  const fields = props.data.editorOptions.fields;
  props.fieldComponents
    .filter((field: any) => {
      return !field.options.prop.endsWith('Id') && !field.options.prop.endsWith('ID') && !field.options.prop.endsWith('Plat');
    })
    .forEach((field, index) => {
      addField(fields, field, '280px');
    });

  // 选中第一个
  currentConfigType.value = 'WidgetConfig';
  selectWidget.value = props.data.editorOptions.fields[0];
  props.data.editorOptions.config.width = '800px';
};

// 添加多列模式
const addCols = (colCount: any) => {
  props.data.editorOptions.fields = [];
  const newIndex = props.data.editorOptions.fields.length;
  // 为拖拽到容器的元素添加唯一 key
  const randNum = Math.ceil(Math.random() * 99999);
  const key = new Date().valueOf() + '_' + randNum;
  props.data.editorOptions.fields[newIndex] = {
    type: 'grid',
    label: '栅格布局',
    columns: [],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top',
    },
    key: key,
  };
  let colIndex = 0;
  const span = 24 / colCount;
  while (colIndex < colCount) {
    props.data.editorOptions.fields[0].columns.push({
      span: span,
      fields: [],
    });
    colIndex++;
  }
  props.fieldComponents
    .filter((field: any) => {
      return !field.options.prop.endsWith('Id') && !field.options.prop.endsWith('ID') && !field.options.prop.endsWith('Plat');
    })
    .forEach((field, index) => {
      colIndex = index % colCount;
      const col = props.data.editorOptions.fields[0].columns[colIndex];
      addField(col.fields, field);
    });

  // 选中第一个
  currentConfigType.value = 'WidgetConfig';
  const col0 = props.data.editorOptions.fields[0].columns[0];
  selectWidget.value = col0.fields[0];

  // 三列时，弹出窗口设为1100px宽度
  if (colCount === 3) {
    props.data.editorOptions.config.width = '1100px';
  } else {
    props.data.editorOptions.config.width = '800px';
  }
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
      props.data.editorOptions.fields = [];
      selectWidget.value = null;
      proxy.$message.error('清空完毕');
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};
</script>
