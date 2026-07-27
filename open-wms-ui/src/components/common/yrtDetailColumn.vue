<template>
  <el-table-column v-if="isShowField()" :sortable="!!col.sortable" :prop="col.prop" :label="col.label" :width="col.width || 'auto'" :min-width="col.minWidth || 'auto'" :header-align="col.headerAlign || 'center'" :align="col.align || 'center'" :filters="col.filters" :filter-method="col.filterMethod" :filtered-value="comFilteredValue" :fixed="col.fixed" class-name="col-container">
    <template #header>
      <span>{{ col.label }}</span>
      <el-tooltip v-if="col.remark" class="item" effect="dark" placement="top">
        <template #content>
          <span>
            <pre style="margin: 0px">{{ col.remark }}</pre>
          </span>
        </template>
        <SvgIcon name="ele-QuestionFilled" class="margin-left-5" />
      </el-tooltip>
    </template>
    <template #default="{ row, column, $index }">
      <!--通用列插槽-->
      <slot :row="row" :column="col" :index="$index" name="column-slot">
        <template v-if="!col.readonly && !disabled && ['input', 'textarea'].indexOf(col.type) >= 0 && row === currentRow">
          <el-switch v-if="['byte'].indexOf(col.dataType) >= 0" :ref="'switch-' + col.prop" v-model="row[col.prop]" active-value="1" inactive-value="0" size="small" @change="(val: any) => change(proxy.$refs['switch-' + col.prop], val, row, col)"></el-switch>
          <el-input-number v-else-if="['byte', 'integer', 'long'].indexOf(col.dataType) >= 0" :ref="'input-number-' + col.prop" v-model.number="row[col.prop]" :style="{ width: '100%' }" controls-position="right" size="small" @change="(val: any) => change(proxy.$refs['input-number-' + col.prop], val, row, col)"></el-input-number>
          <el-input v-else-if="['double', 'bigDecimal'].indexOf(col.dataType) >= 0" :ref="'input-' + col.prop" v-model="row[col.prop]" :style="{ width: '100%' }" :step="0.01" size="small" type="number" @change="(val: any) => change(proxy.$refs['input-' + col.prop], val, row, col)"></el-input>
          <el-input v-else :ref="'input-' + col.prop" v-model="row[col.prop]" :style="{ width: '100%' }" size="small" :type="col.type === 'textarea' ? 'textarea' : 'text'" :rows="1" @change="(val: any) => change(proxy.$refs['input-' + col.prop], val, row, col)"></el-input>
        </template>

        <el-cascader v-else-if="!col.readonly && !disabled && col.type == 'cascader' && row === currentRow" :ref="'cascader-' + col.prop" v-model="row[col.prop]" :options="comCol" :style="{ width: '100%' }" size="small" @change="(val: any) => change(proxy.$refs['cascader-' + col.prop], val, row, col)"></el-cascader>

        <el-select v-else-if="!col.readonly && !disabled && col.type == 'select' && row === currentRow" :ref="'select-' + col.prop" v-model="row[col.prop]" :style="{ width: '100%' }" :field="col" :options="getOptions(col)" :filterable="!!col.filterable" :multiple="!!col.multiple" :remote="!!col.remoteQuery" :reserve-keyword="!!col.reserveKeyword" :clearable="!!col.clearable" :remote-method="(query: string) => {detailRemoteMethod(query, row, col)}" remote-show-suffix size="small" @change="(val: any) => change(proxy.$refs['select-' + col.prop], val, row, col)">
          <el-option v-for="item in getOptions(col)" :key="item.id" v-bind="item" :label="item.label" :value="item.value" :option="item" @change="(val: any) => change(proxy.$refs['input-' + col.prop], val, row, col)"></el-option>
        </el-select>

        <template v-else-if="!col.readonly && !disabled && col.type === 'time' && row === currentRow">
          <el-time-picker :ref="'time-picker-' + col.prop" v-model="row[col.prop]" :is-range="col.isRange" :placeholder="col.placeholder" :start-placeholder="col.startPlaceholder" :end-placeholder="col.endPlaceholder" :readonly="col.readonly" :disabled="col.disabled" :editable="col.editable" :clearable="col.clearable" :arrow-control="col.arrowControl" :style="{ width: col.width }" size="small" @change="(val: any) => { change(proxy.$refs['time-picker-' + col.prop], val, row, col); }" @calendar-change="(val: any) => { change(proxy.$refs['date-picker-' + col.prop], val, row, col); }"></el-time-picker>
        </template>

        <template v-else-if="!col.readonly && !disabled && ['date', 'datetime'].indexOf(col.type) >= 0 && row === currentRow">
          <el-date-picker :ref="'date-picker-' + col.prop" v-model="row[col.prop]" :type="col.type" :is-range="col.isRange" :placeholder="col.placeholder" :start-placeholder="col.startPlaceholder" :end-placeholder="col.endPlaceholder" :readonly="col.readonly" :disabled="col.disabled" :editable="col.editable" :clearable="col.clearable" :format="col.formatter" :value-format="col.formatter" class="w-100pc" size="small" @change="(val: any) => { change(proxy.$refs['date-picker-' + col.prop], val, row, col); }" @calendar-change="(val: any) => { change(proxy.$refs['date-picker-' + col.prop], val, row, col); }"></el-date-picker>
        </template>

        <!-- 输入选择框 -->
        <template v-else-if="!col.readonly && !disabled && col.type === 'input-select' && row === currentRow">
          <input-select v-model="row[col.prop]" :field="col" :options="[]" :props="{ label: col.options.labelField, value: col.options.valueField }" :label="col.label" :disabled="getInputSelectOptions(col).disabled" :input-width="getInputSelectOptions(col).width" :placeholder="getInputSelectOptions(col).placeholder" :load-data-before="loadDataBefore" @on-row-click="(ref: any, val: any, itemData: any) => { onRowClick(ref, val, itemData, col, row); }" @on-change="(ref: any, val: any) => { change(ref, val, row, col); }"></input-select>
        </template>

        <!-- 表格选择框 -->
        <template v-else-if="!col.readonly && !disabled && col.type === 'table-select' && row === currentRow">
          <table-select v-model="row[col.prop]" :form-data="row" :field="col" :columns="col.options.columns" :label="col.label" :disabled="currentDisabled || col.options.disabled" :input-width="col.options.width" :placeholder="col.options.placeholder" @on-row-click="(ref: any, val: any, itemData: any) => { onRowClick(ref, val, itemData, col, row); }" @on-change="(ref: any, val: any) => { change(ref, val, row, col); }" @on-key-up="(ref: any, val: any, event: any, tableData: any) => { onKeyup(ref, val, event, col, tableData); }"></table-select>
        </template>

        <template v-else>
          <!-- 通用标签颜色着色 -->
          <template v-if="col.tagColorList && col.tagColorList.length && row[col.prop] !== undefined">
            <el-tag :color="common.getTagBgColor(row, col, row[col.prop])" :style="common.getTagColor(row, col, row[col.prop])">
              {{ common.formatData(row, col) }}
            </el-tag>
          </template>
          <template v-else>
            {{ common.formatData(row, col) }}
          </template>
        </template>
      </slot>
    </template>
  </el-table-column>
</template>

<script setup lang="ts" name="yrt-detail-column">
import { ComponentInternalInstance } from 'vue';
import InputSelect from '/@/components/base/InputSelect.vue';
import TableSelect from '/@/components/base/TableSelect.vue';
import { ResultInfo, BaseProperties } from '/@/types/base-type';
import useDropdownStore from '/@/stores/modules/dropdown';
import { BaseObject } from '/@/types/common';
const dropdownStore = useDropdownStore();

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:disabled', 'on-key-up', 'on-row-click', 'tree-load', 'on-detail-change']);

//#region 定义属性
const props = defineProps({
  // 列数据对象
  col: {
    type: Object,
    required: true,
  },
  // 数据参数
  dataOptions: {
    type: Object,
    default: () => {},
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 控制显示字段,true=显示所有字段，Array=只显示数组内的字段
  showFields: {
    type: [Boolean, Array],
    default: true,
  },
  // 自定义查询条件
  filteredValue: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 当前行
  currentRow: {
    type: Object,
    default: () => {},
  },
  // 输入选择框加载前方法
  loadDataBefore: {
    type: Function,
    default: () => {
      return () => {};
    },
  },
  // 下拉框远程搜索事件
  detailRemoteMethod: {
    type: Function,
    default: () => {
      return (query: string, row: any, col: any) => {};
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({});
//#endregion

//#region 计算属性
// 是否禁用
const currentDisabled = computed({
  get() {
    return props.disabled;
  },
  set(newValue) {
    emit('update:disabled', newValue);
  },
});

// 获得下拉框options
const getOptions = computed(() => {
  return function (field: any) {
    const dropdownId = field.options && field.options.dropdownId ? field.options.dropdownId : field.dropdownId;
    let options = [];
    if (dropdownId) {
      let key = 'dropdown' + dropdownId;
      const ddlItem = dropdownStore.state.dataList.find((item) => item.key === key);
      if (ddlItem) {
        options = ddlItem.value;
      }
    } else {
      if (field.options) {
        options = field.options.options;
      }
    }
    return options;
  };
});

// 获得下拉框options
const getInputSelectOptions = computed(() => {
  return function (field: any) {
    if (field.options.remote === 'bindDropdown') {
      let key = 'dropdown' + field.options.dropdownId;
      const ddlItem = dropdownStore.state.dataList.find((item) => item.key === key);
      if (!ddlItem) return;
      field.options.options = ddlItem.value;
    }

    return field.options;
  };
});

const comFilteredValue = computed(() => {
  return props.filteredValue as Array<any>;
});

const comCol = computed(() => {
  return props.col as Array<any>;
}); //#endregion

//#region  watch
// watch(
// 	() => props.currentRow,
// 	(newVal, oldVal) => {
// 		const col = props.col;
// 		// 将多选值下拉框转为数组
// 		if (col.multiple && newVal) {
// 			const v = newVal[col.prop];
// 			if (v) {
// 				if (!Array.isArray(v)) {
// 					newVal[col.prop] = v.split('/');
// 				}
// 			} else {
// 				newVal[col.prop] = [];
// 			}
// 		}
// 		if (col.multiple && oldVal) {
// 			const v = oldVal[col.prop];
// 			if (Array.isArray(v)) {
// 				oldVal[col.prop] = v.join('/');
// 			} else {
// 				oldVal[col.prop] = v;
// 			}
// 		}
// 	},
// 	{ deep: true, immediate: true }
// );
//#endregion

onMounted(() => {
  loadCascaderData();
});

// 是否显示字段
const isShowField = () => {
  let isShow = props.col.prop !== '_action' && !props.col.hidden;
  if (!(props.showFields === true || (Array.isArray(props.showFields) && props.showFields.indexOf(props.col.prop) >= 0))) {
    isShow = false;
  }

  return isShow;
};

// 字段change事件
const change = (ref: any, val: any, row: any, field: any) => {
  if (field.type === 'select') {
    // 设置表单数据，附加下拉框其他字段，非多选时使用
    if (!Array.isArray(val)) {
      let prop = field.keyProp || field.prop;
      let items = getOptions.value(field);
      const itemOption = items.find((item: any) => item[prop] === val);
      if (itemOption) {
        Object.keys(itemOption).forEach((key) => {
          if (['value', 'code', 'label'].indexOf(key) < 0) {
            row[key] = itemOption[key];
          }
        });
      }
    } else {
      const ids = [];
      const names = [];
      let prop = field.prop;
      let keyProp = field.keyProp;
      if (keyProp) {
        for (const itemVal of val) {
          let items = getOptions.value(field);
          const itemOption = items.find((item: any) => item[prop] === itemVal);
          if (!itemOption) continue;

          const id = itemOption[prop] || itemOption.value;
          const label = itemOption[keyProp] || itemOption.label;
          ids.push(id);
          names.push(label);
        }
        row[prop] = ids;
        row[keyProp] = names;
      }
    }
  }
  if (['decimal', 'double', 'int', 'int64', 'bigDecimal'].indexOf(field.dataType) >= 0) {
    row[field.prop] = Number(val);
  }
  proxy.$emit('on-detail-change', ref, val, row, field);
  // 自定义
};

// 翻译下拉框值
const translateText = (col: any, val: any, dropdownId: any) => {
  if (col.options.remote === false) {
    const ddList = col.options.options;
    if (!ddList) return val;
    const item = ddList.find((item: any, index: any, arr: any) => {
      return item.value === val;
    });
    if (!item) return val;
    return item.label;
  } else {
    let key = 'dropdown' + dropdownId;
    const ddlItem = dropdownStore.state.dataList.find((item) => item.key === key);
    if (!ddlItem) return val;
    const item = ddlItem.value.find((item: BaseObject, index: any, arr: any) => {
      return item.value === val;
    });
    if (!item) return val;
    return item.label;
  }
};

// 树形下拉框获得点击项
const onTreeNodeClick = (data: any, node: any, el: any, field: any) => {
  // 仅选择叶节点
  if (!node.isLeaf && field.options.onlySelectLeaf) return;

  var key = field.options.prop;
  // 将下拉框中的值赋给表单
  if (Object.keys(data).findIndex((item) => item === key) >= 0) {
    Object.keys(data).forEach((key, index) => {
      if (['value', 'label', 'hasChild', 'hasFactChild', 'state', 'attributes'].indexOf(key) < 0) {
        props.currentRow[key] = data[key];
      }
    });
  } else {
    props.currentRow[key] = data[key];
  }
};

// 加载级联数据
const loadCascaderData = () => {
  proxy.$nextTick(() => {
    Object.keys(proxy.$refs).forEach((refName) => {
      if (refName.indexOf('cascader') >= 0) {
        var ref = proxy.$refs[refName];
        var field = ref.$attrs['field'];
        proxy.$emit('on-focus', ref, null, field);
      }
    });
  });
};

// 树形输入框load
const treeLoad = (node: any, resolve: any, subField: any) => {
  emit('tree-load', node, resolve, subField);
  // 默认加载数据
  if (!subField.isLoaded) {
    var keyName = subField.ajaxParams.keyName;
    if (!keyName) {
      proxy.$message.error('未设置tree下拉框ajax加载参数！');
      return;
    }
    proxy.$nextTick(() => {
      var where = '';
      if (node.level === 0) {
        where = `parentId=0`;
      } else {
        where = `parentId=${node.data[subField.ajaxParams.keyName]}`;
      }

      var url = '/api/common/loadTreeNode';
      var params = subField.ajaxParams;
      params.where = where;
      // proxy.common.ajax(
      //   url,
      //   params,
      //   (res: ResultInfo) => {
      //     if (res.result) {
      //       resolve(res.data);
      //     } else {
      //       proxy.$message.error(res.msg);
      //     }
      //   },
      //   true
      // );
    });
  }
};

// input-select item click event
const onRowClick = (ref: any, val: any, itemData: any, field: any, row: any) => {
  emit('on-row-click', ref, val, itemData, field, row);
};

// table-select keyup event
const onKeyup = (ref: any, val: any, event: any, col: any, tableData: any) => {
  emit('on-key-up', ref, val, event, col, tableData);
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.col-container {
  padding: 0px;
}
</style>
