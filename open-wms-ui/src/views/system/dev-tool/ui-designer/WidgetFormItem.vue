<template>
  <el-form-item v-if="element && element.key" :class="{ active: selectWidget && selectWidget.key === element.key, is_req: element.options.required, 'no-margin': element.options.noMargin, 'readonly-item': element.options.readonly }" :label="element.options.noLabel ? null : element.label" :label-width="labelWidth" class="widget-view" @click.stop="handleSelectWidget(index)">
    <template #label>
      <slot :name="'label-' + element.options.prop">
        <el-tooltip v-if="element.options.remark" effect="dark" placement="top">
          <template #content>
            <pre style="margin: 0px">{{ element.options.remark }}</pre>
          </template>
          <SvgIcon name="ele-QuestionFilled" class="margin-right-5" />
        </el-tooltip>
        {{ element.options.noLabel ? null : element.label }}
      </slot>
    </template>
    <template v-if="element.type === 'input'">
      <el-input v-model="element.options.defaultValue" :style="{ width: element.options.width }" :placeholder="element.options.placeholder" :readonly="element.options.readonly"></el-input>
    </template>

    <template v-if="element.type === 'textarea'">
      <el-input v-model="element.options.defaultValue" :style="{ width: element.options.width }" :placeholder="element.options.placeholder" :rows="5" type="textarea" :readonly="element.options.readonly"></el-input>
    </template>

    <template v-if="element.type === 'number'">
      <el-input-number v-model="element.options.defaultValue" :disabled="element.options.disabled" :controls-position="element.options.controlsPosition" :style="{ width: element.options.width }" :readonly="element.options.readonly"></el-input-number>
    </template>

    <template v-if="element.type === 'radio'">
      <el-radio-group v-model="element.options.defaultValue" :style="{ width: element.options.width }">
        <el-radio v-for="(item, index2) in element.options.options" :key="item.value + index2" :style="{ display: element.options.inline ? 'inline-block' : 'block' }" :label="item.value">
          {{ element.options.showLabel ? item.label : item.value }}
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="element.type === 'checkbox'">
      <el-checkbox-group v-model="element.options.defaultValue" :style="{ width: element.options.width }">
        <el-checkbox v-for="(item, index2) in element.options.options" :key="item.value + index2" :style="{ display: element.options.inline ? 'inline-block' : 'block' }" :label="item.value">
          {{ element.options.showLabel ? item.label : item.value }}
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="element.type === 'cascader'">
      <el-cascader :placeholder="element.options.placeholder" :options="element.options.options" :style="{ width: element.options.width }" filterable change-on-select></el-cascader>
    </template>

    <template v-if="element.type === 'tree'">
      <el-input slot="reference" v-model="element.options.defaultValue" :style="{ width: element.options.width }" :placeholder="element.options.placeholder">
        <template #suffix>
          <svg-icon name="icon-xiangxiajiantou1"></svg-icon>
        </template>
      </el-input>
    </template>

    <!-- 输入选择框 -->
    <template v-if="element.type === 'input-select'">
      <input-select v-model="element.options.defaultValue" :style="{ width: element.options.width }" :options="[]"></input-select>
    </template>

    <!-- 表格选择框 -->
    <template v-if="element.type === 'table-select'">
      <table-select v-model="element.options.defaultValue" :input-width="element.options.width" :options="element.options"></table-select>
    </template>

    <template v-if="element.type === 'time'">
      <el-time-picker v-model="element.options.defaultValue" :is-range="element.options.isRange" :placeholder="element.options.placeholder" :start-placeholder="element.options.startPlaceholder" :end-placeholder="element.options.endPlaceholder" :readonly="element.options.readonly" :disabled="element.options.disabled" :editable="element.options.editable" :clearable="element.options.clearable" :arrow-control="element.options.arrowControl" :style="{ width: element.options.width }"></el-time-picker>
    </template>

    <template v-if="['date', 'datetime'].indexOf(element.type) >= 0">
      <el-date-picker v-model="element.options.defaultValue" :type="element.options.type" :is-range="element.options.isRange" :placeholder="element.options.placeholder" :start-placeholder="element.options.startPlaceholder" :end-placeholder="element.options.endPlaceholder" :readonly="element.options.readonly" :disabled="element.options.disabled" :editable="element.options.editable" :clearable="element.options.clearable" :style="{ width: element.options.width }"></el-date-picker>
    </template>

    <template v-if="element.type === 'rate'">
      <el-rate v-model="element.options.defaultValue" :max="element.options.max" :disabled="element.options.disabled" :allow-half="element.options.allowHalf"></el-rate>
    </template>

    <template v-if="element.type === 'color'">
      <el-color-picker v-model="element.options.defaultValue" :disabled="element.options.disabled" :show-alpha="element.options.showAlpha"></el-color-picker>
    </template>

    <template v-if="element.type === 'select'">
      <el-select v-model="element.options.defaultValue" :disabled="element.options.disabled" :multiple="element.options.multiple" :clearable="element.options.clearable" :placeholder="element.options.placeholder" :style="{ width: element.options.width }">
        <el-option v-for="item in element.options.options" :key="item.value" :value="item.value" :label="element.options.showLabel ? item.label : item.value"></el-option>
      </el-select>
    </template>

    <template v-if="element.type === 'switch'">
      <el-switch v-model="element.options.defaultValue" :disabled="element.options.disabled" :active-value="element.options['active-value']" :inactive-value="element.options['inactive-value']"></el-switch>
    </template>

    <template v-if="element.type === 'slider'">
      <el-slider v-model="element.options.defaultValue" :min="element.options.min" :max="element.options.max" :disabled="element.options.disabled" :step="element.options.step" :show-input="element.options.showInput" :range="element.options.range" :style="{ width: element.options.width }"></el-slider>
    </template>

    <template v-if="element.type === 'upload-image'">
      <el-upload :action="element.options.serverAction" :list-type="element.options.listType">
        <template #trigger>
          <i v-if="element.options.listType === 'picture-card'" class="icon-jiahao1"></i>
          <el-button v-if="element.options.listType !== 'picture-card'" size="small" type="primary">点击上传</el-button>
        </template>
      </el-upload>
    </template>

    <template v-if="element.type === 'imgupload'">
      <fm-upload v-model="element.options.defaultValue" :disabled="element.options.disabled" :style="{ width: element.options.width }" :width="element.options.size.width" :height="element.options.size.height" token="xxx" domain="xxx"></fm-upload>
    </template>

    <template v-if="element.type === 'blank'">
      <div style="color: #666">空白字段{{ element.options.noLabel ? ' - ' + element.label : null }}</div>
    </template>

    <!--富文本编辑器-->
    <template v-if="element.type === 'tinymce-editor'">
      <tinymce v-model="element.options.defaultValue" :height="element.options.size.height" />
    </template>

    <el-button v-if="selectWidget && selectWidget.key === element.key" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(index)">
      <i class="yrt-shanchu2"></i>
    </el-button>
    <el-button v-if="selectWidget && selectWidget.key === element.key" title="复制" class="widget-action-clone" circle plain type="primary" @click.stop="handleWidgetClone(index)">
      <i class="yrt-fuzhi4"></i>
    </el-button>
  </el-form-item>
</template>

<script setup lang="ts" name="manager-form-item">
import FmUpload from './upload/index.vue';
import Tinymce from '/@/components/tinymce/index.vue';
import InputSelect from '/@/components/base/InputSelect.vue';
import TableSelect from '/@/components/base/TableSelect.vue';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 双向更新事件定义
const emit = defineEmits(['update:select', 'update:configType']);

//#region 定义父组件传过来的值
const props = defineProps({
  // 整个JSON对象，包含：dataOptions、editorOptions、dataListOptions
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
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
      return [];
    },
  },
  configType: {
    type: String,
    default: null,
  },
});
//#endregion

//#region 定义变量
const state = reactive({});
//#endregion

//#region 计算属性
// 可用字段
const selectWidget: Record<string, any> = computed({
  get: function () {
    return props.select;
  },
  set: function (val) {
    emit('update:select', val);
  },
});

const labelWidth: any = computed(() => {
  return props.element.options['label-width'] != null ? props.element.options['label-width'] + 'px' : null;
});

const _fields: any = computed(() => {
  return props.fields;
});
//#endregion

const handleSelectWidget = (index: number) => {
  selectWidget.value = props.fields[index];
  // pda模式
  // if (props.data.dataOptions.isPDA) {
  //   // 初始化属性
  //   selectWidget.value.labelOptions.styles['color'] = selectWidget.value.labelOptions.styles['color'] || null;
  //   selectWidget.value.labelOptions.styles['background-color'] = selectWidget.value.labelOptions.styles['background-color'] || null;

  //   selectWidget.value.textOptions.styles['color'] = selectWidget.value.textOptions.styles['color'] || null;
  //   selectWidget.value.textOptions.styles['background-color'] = selectWidget.value.textOptions.styles['background-color'] || null;
  // }
  emit('update:configType', 'WidgetConfig');
  let btn = window.document.getElementById('btnsave');
  if (btn) btn.focus();
};

const handleWidgetDelete = (index: number) => {
  if (props.fields.length - 1 === index) {
    if (index === 0) {
      selectWidget.value = {};
    } else {
      selectWidget.value = props.fields[index - 1];
    }
  } else {
    selectWidget.value = props.fields[index + 1];
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
    selectWidget.value = props.fields[index + 1];
  });
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.widget-view {
  div.el-input:not(.no-bg) {
    :deep(input.el-input__inner[readonly]) {
      background-color: #f5f7fa;
      cursor: not-allowed;
    }
  }
  :deep(.el-upload--picture-card) {
    margin-bottom: 10px;
    position: relative;
  }
  .icon-jiahao1 {
    position: absolute;
    top: 55px;
    left: 24px;
    font-size: 100px;
  }
}
</style>
