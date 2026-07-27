<template>
  <el-form-item v-if="!hideFeilds.find((item) => item == field.options.prop)" :prop="field.options.prop" :readonly="field.options.readonly" :required="field.options.required" :rules="changeRules(field)" :label-width="field.options['label-width'] ? field.options['label-width'] + 'px' : ''" :class="{ 'no-margin': field.options.noMargin, 'readonly-item': field.options.readonly }" class="input-container" v-show="!field.options.hidden">
    <template #label>
      <slot :name="'label-' + field.options.prop">
        <el-tooltip v-if="field.options.remark" effect="dark" placement="top">
          <template #content>
            <pre style="margin: 0px">{{ field.options.remark }}</pre>
          </template>
          <SvgIcon name="ele-QuestionFilled" class="margin-right-5" />
        </el-tooltip>
        {{ field.options.noLabel ? null : field.label }}
      </slot>
    </template>
    <!--单行分组-->
    <template v-if="field.type == 'inline-group'">
      <template v-for="subField in field.fields">
        <el-input v-if="subField.type == 'input'" :ref="'input-' + subField.options.prop" :key="subField.key" v-model="formData[subField.options.prop]" v-bind="subField.options" :style="{ width: subField.options.width }" class="inline-input" @blur="(event:any) => onBlur(proxy.$refs['input-' + subField.options.prop], formData[subField.options.prop], event, subField)" @focus="(event:any) => onFocus(proxy.$refs['input-' + subField.options.prop], formData[subField.options.prop], event, subField)"></el-input>

        <el-cascader v-else-if="subField.type == 'cascader'" :key="'cascader-' + subField.key" v-model="formData[subField.options.prop]" :options="subField.options" :style="{ width: subField.options.width }" class="inline-input" @focus="(event:any) => onFocus(proxy.$refs['cascader-' + subField.options.prop], formData[subField.options.prop], event, subField)" @change="(val:any) => change(proxy.$refs['cascader-' + subField.key], val, subField)"></el-cascader>

        <!--下拉框选择器-->
        <template v-else-if="subField.type == 'select'">
          <el-select v-if="subField.options.keyProp" :ref="'select-' + subField.options.prop" :key="subField.key" v-model="formData[subField.options.keyProp]" :style="{ width: subField.options.width }" :field="subField" :disabled="subField.options.disabled" :multiple="subField.options.multiple" :filterable="!!subField.options.filterable" class="inline-input" @change="(val:any) => change(proxy.$refs['select-' + subField.options.prop], val, subField)">
            <el-option v-for="(item, index) in getOptions(subField)" :key="index" v-bind="item" :label="item.label || ''" :value="item.value === null ? '' : item.value" :option="item"></el-option>
          </el-select>
          <el-select v-else :ref="'select-' + subField.options.prop" :key="'select-' + subField.key" v-model="formData[subField.options.prop]" :style="{ width: subField.options.width }" :field="subField" :disabled="subField.options.disabled" :multiple="subField.options.multiple" :filterable="!!subField.options.filterable" class="inline-input" @change="(val:any) => change(proxy.$refs['select-' + subField.options.prop], val, subField)">
            <el-option v-for="(item, index) in getOptions(subField)" :key="index" v-bind="item" :label="item.label || ''" :value="item.value === null ? '' : item.value" :option="item"></el-option>
          </el-select>
        </template>

        <template v-else-if="subField.type === 'time'">
          <el-time-picker :key="subField.key" v-model="formData[subField.options.prop]" :is-range="subField.options.isRange" :placeholder="subField.options.placeholder" :start-placeholder="subField.options.startPlaceholder" :end-placeholder="subField.options.endPlaceholder" :readonly="subField.options.readonly" :disabled="subField.options.disabled" :editable="subField.options.editable" :clearable="subField.options.clearable" :arrow-control="subField.options.arrowControl" :style="{ width: subField.options.width }"></el-time-picker>
        </template>

        <template v-else-if="subField.type === 'date'">
          <el-date-picker :key="subField.key" v-model="formData[subField.options.prop]" :type="subField.options.type" :is-range="subField.options.isRange" :placeholder="subField.options.placeholder" :start-placeholder="subField.options.startPlaceholder" :end-placeholder="subField.options.endPlaceholder" :readonly="subField.options.readonly" :disabled="subField.options.disabled" :editable="subField.options.editable" :clearable="subField.options.clearable" :format="changeFormat(field.options.formatter)" :value-format="changeFormat(field.options.formatter)" :style="{ width: subField.options.width }"></el-date-picker>
        </template>

        <!-- 单选组 -->
        <el-radio-group v-else-if="subField.type == 'radio'" :key="'radio-' + subField.key" v-model="formData[subField.options.prop]" :style="{ display: subField.options.inline ? 'inline-block' : 'block' }" class="margin-right-10" @change="(val:any) => change(proxy.$refs['radio-' + subField.options.prop], val, subField)">
          <!-- 静态数据 -->
          <template v-if="subField.options.remote === false">
            <el-radio v-for="(item, optionIndex) in subField.options.options" :key="subField.key + '_ops_' + optionIndex" :label="item.value">{{ item.label }}</el-radio>
          </template>
          <!-- 远程动态函数 -->
          <template v-else-if="subField.options.remote === true"></template>
          <!-- 下拉框绑定 -->
          <template v-else-if="subField.options.remote === 'bindDropdown'">
            <el-radio v-for="(item, optionIndex) in getOptions(subField)" :key="subField.key + '_ops_' + optionIndex" :label="item.value">{{ item.label }}</el-radio>
          </template>
        </el-radio-group>

        <!-- 复选组 -->
        <el-checkbox-group v-else-if="subField.type == 'checkbox'" :ref="'checkbox-' + subField.options.prop" :key="'checkbox-' + subField.key" v-model="formData[subField.options.prop]" @change="(val:any) => change(proxy.$refs['checkbox-' + subField.options.prop], val, subField)">
          <!-- 静态数据 -->
          <template v-if="subField.options.remote === false">
            <el-checkbox v-for="(item, optionIndex) in subField.options.options" :key="subField.key + '_ops_' + optionIndex" :label="item.value">{{ item.label }}</el-checkbox>
          </template>
          <!-- 远程动态函数 -->
          <template v-else-if="subField.options.remote === true"></template>
          <!-- 下拉框绑定 -->
          <template v-else-if="subField.options.remote === 'bindDropdown'">
            <el-checkbox v-for="(item, optionIndex) in getOptions(subField)" :key="subField.key + '_ops_' + optionIndex" :label="item.value">{{ item.label }}</el-checkbox>
          </template>
        </el-checkbox-group>

        <!--空白-->
        <template v-else-if="subField.type == 'blank'">
          <slot :name="'blank-' + subField.options.prop" :formData="formData"></slot>
        </template>
      </template>
    </template>
    <!--独立行-->
    <template v-else>
      <template v-if="'input,textarea'.indexOf(field.type) >= 0">
        <el-input v-if="['byte', 'integer', 'long'].indexOf(field.options.dataType) >= 0 && !field.options.valueFormatter" :ref="'input-' + field.options.prop" v-model.number="formData[field.options.prop]" :type="field.type" :style="{ width: field.options.width || 'auto' }" :readonly="!!field.options.readonly" :placeholder="field.options.placeholder" clearable @blur="(event:any) => onBlur(proxy.$refs['input-' + field.options.prop], formData[field.options.prop], event, field)" @focus="(event:any) => onFocus(proxy.$refs['input-' + field.options.prop], formData[field.options.prop], event, field)" @change="(val:any) => change(proxy.$refs['input-' + field.options.prop], val, field)" :disabled="props.disabled || field.options.disabled"></el-input>
        <el-input v-else-if="['double', 'bigDecimal'].indexOf(field.options.dataType) >= 0 && !field.options.valueFormatter" :ref="'input-' + field.options.prop" v-model="formData[field.options.prop]" :style="{ width: field.options.width || 'auto' }" type="number" :readonly="!!field.options.readonly" :placeholder="field.options.placeholder" clearable @blur="(event:any) => onBlur(proxy.$refs['input-' + field.options.prop], formData[field.options.prop], event, field)" @focus="(event:any) => onFocus(proxy.$refs['input-' + field.options.prop], formData[field.options.prop], event, field)" @change="(val:any) => change(proxy.$refs['input-' + field.options.prop], val, field)" @keyup="(event: any) => { onKeyup(proxy.$refs['input-' + field.options.prop], formData[field.options.prop], event, field) }" :disabled="props.disabled || field.options.disabled"></el-input>
        <el-input v-else :ref="'input-' + field.options.prop" v-model="formData[field.options.prop]" :type="field.type" :style="{ width: field.options.width || 'auto' }" :readonly="!!field.options.readonly" :placeholder="field.options.placeholder" clearable :formatter="(value:any) => valueFormater(value, field)" :parser="(value:any) => valueParser(value, field)" @blur="(event:any) => onBlur(proxy.$refs['input-' + field.options.prop], formData[field.options.prop], event, field)" @focus="(event:any) => onFocus(proxy.$refs['input-' + field.options.prop], formData[field.options.prop], event, field)" @change="(val:any) => change(proxy.$refs['input-' + field.options.prop], val, field)" :disabled="props.disabled || field.options.disabled"></el-input>
      </template>
      <!--下拉框选择器-->
      <template v-else-if="field.type == 'select'">
        <!--有关联主键字段-->
        <el-select v-if="field.options.keyProp" :ref="'select-' + field.options.prop" :key="field.key" v-model="formData[field.options.keyProp]" :style="{ width: field.options.width }" :field="field" :disabled="props.disabled || field.options.disabled" :multiple="field.options.multiple" :filterable="!!field.options.filterable" :clearable="!!field.options.clearable" :allow-create="field.options.allowCreate" class="inline-input" @change="(val:any) => change(proxy.$refs['select-' + field.options.prop], val, field)" :remote="field.options.remote" :remote-method="(query: string) => {selectRemoteMethod(query, field)}">
          <el-option v-for="(item, index) in getOptions(field)" :key="index" v-bind="item" :label="item.label || ''" :value="item.value === null ? '' : item.value" :option="item"></el-option>
        </el-select>
        <!--无关联主键字段-->
        <el-select v-else :ref="'select-' + field.options.prop" :key="'select-' + field.key" v-model="formData[field.options.prop]" :style="{ width: field.options.width }" :field="field" :disabled="props.disabled || field.options.disabled" :multiple="field.options.multiple" :filterable="!!field.options.filterable" :clearable="!!field.options.clearable" :allow-create="field.options.allowCreate" class="inline-input" @change="(val:any) => change(proxy.$refs['select-' + field.options.prop], val, field)" :remote="field.options.remote" :remote-method="(query: string) => {selectRemoteMethod(query, field)}">
          <el-option v-for="(item, index) in getOptions(field)" :key="index" v-bind="item" :label="item.label || ''" :value="item.value === null ? '' : item.value" :option="item"></el-option>
        </el-select>
      </template>

      <!-- 级联 -->
      <div v-else-if="field.type == 'cascader'" :style="{ width: field.options.width }">
        <el-cascader :ref="'cascader-' + field.options.prop" v-model="formData[field.options.prop]" :options="field.options.options" :placeholder="field.options.placeholder" :props="state.casaderProps" filterable @focus="(event:any) => onFocus(proxy.$refs['cascader-' + field.options.prop], formData[field.options.prop], event, field)" @change="(val:any) => change(proxy.$refs['cascader-' + field.options.prop], val, field)"></el-cascader>
      </div>
      <!-- 单选组 -->
      <el-radio-group v-else-if="field.type == 'radio'" :ref="'radio-' + field.options.prop" :key="field.key" v-model="formData[field.options.prop]" @change="(val:any) => change(proxy.$refs['radio-' + field.options.prop], val, field)" :disabled="currentDisabled || getInputSelectOptions(field).disabled">
        <!-- 静态数据 -->
        <template v-if="field.options.remote === false">
          <el-radio v-for="(item, optionIndex) in field.options.options" :key="field.key + '_ops_' + optionIndex" :value="item.value" :label="item.label" :style="{ display: field.options.inline ? 'inline-block' : 'block', 'margin-bottom': field.options.inline ? 0 : '15px' }">{{ item.label }}</el-radio>
        </template>
        <!-- 远程动态函数 -->
        <template v-else-if="field.options.remote === true"></template>
        <!-- 下拉框绑定 -->
        <template v-else-if="field.options.remote === 'bindDropdown'">
          <el-radio v-for="(item, optionIndex) in getOptions(field)" :key="field.key + '_ops_' + optionIndex" :value="item.value" :label="item.label" :style="{ display: field.options.inline ? 'inline-block' : 'block' }">{{ item.label }}</el-radio>
        </template>
      </el-radio-group>

      <!-- 复选组 -->
      <el-checkbox-group v-else-if="field.type == 'checkbox'" :ref="'checkbox-' + field.options.prop" :key="'checkbox-' + field.key" v-model="formData[field.options.prop]" @change="(val:any) => change(proxy.$refs['checkbox-' + field.options.prop], val, field)">
        <!-- 静态数据 -->
        <template v-if="field.options.remote === false">
          <el-checkbox v-for="(item, optionIndex) in field.options.options" :key="field.key + '_ops_' + optionIndex" :label="item.value">{{ item.label }}</el-checkbox>
        </template>
        <!-- 远程动态函数 -->
        <template v-else-if="field.options.remote === true"></template>
        <!-- 下拉框绑定 -->
        <template v-else-if="field.options.remote === 'bindDropdown'">
          <el-checkbox v-for="(item, optionIndex) in getOptions(field)" :key="field.key + '_ops_' + optionIndex" :label="item.value">{{ item.label }}</el-checkbox>
        </template>
      </el-checkbox-group>
      <!-- 开关 -->
      <el-switch v-else-if="field.type == 'switch'" :ref="'switch-' + field.options.prop" :key="'swicth-' + field.key" v-model.number="formData[field.options.prop]" v-bind="field.options" @change="(val:any) => change(proxy.$refs['switch-' + field.options.prop], val, field)"></el-switch>

      <!-- 树选择框 -->
      <template v-else-if="field.type === 'tree'">
        <tree-select v-model="formData[field.options.prop]" :options="field.options" :label="field.label" :tree-load="(node: any, resolve: any) => { treeLoad(node, resolve, field) }" :disabled="currentDisabled" :node-key-value="getNodeKeyValue(field)" @on-focus="(ref: any, val: any, event: any) => { onFocus(ref, val, event, field); }" @on-change="(ref: any, val: any) => { change(ref, val, field); }" @on-tree-node-click="(data: any, node: any, el: any, labels: any, values: any) => { onTreeNodeClick(data, node, el, labels, values, field) }"></tree-select>
      </template>

      <!-- 输入选择框 -->
      <template v-else-if="field.type === 'input-select'">
        <input-select v-model="formData[field.options.prop]" :options="getInputSelectOptions(field).options" :props="inputSelectProps(field)" :label="field.label" :disabled="currentDisabled || getInputSelectOptions(field).disabled" :input-width="getInputSelectOptions(field).width" :placeholder="getInputSelectOptions(field).placeholder" @on-focus="(ref: any, val: any, event: any) => { onFocus(ref, val, event, field); }" @on-row-click="(ref: any, val: any, itemData: any) => { onRowClick(ref, itemData, field,val); }" @on-change="(ref: any, val: any) => { change(ref, val, field); }" @on-key-down="(ref: any, val: any, e: any) => onKeyDown(ref, val, e, field)" @on-key-up="(ref: any, val: any, event: any, selectedRow: any) => { onKeyup(ref, val, event, field, selectedRow); }"></input-select>
      </template>

      <!-- 表格选择框 -->
      <template v-else-if="field.type === 'table-select'">
        <table-select v-model="formData[field.options.prop]" :form-data="formData" :field="field" :columns="field.options.columns" :label="field.label" :disabled="currentDisabled || field.options.disabled" :input-width="field.options.width" :popover-width="field.options.popoverWidth || '300px'" :placeholder="field.options.placeholder" @on-focus="(ref: any, val: any, event: any) => { onFocus(ref, val, event, field); }" @on-change="(ref: any, val: any) => { change(ref, val, field); }" @on-key-up="(ref: any, val: any, event: any, tableData: any) => { onKeyup(ref, val, event, field, tableData); }" @on-row-change="(ref: any, selectedRow: any) => { onRowChange(ref, selectedRow, field); }" @on-row-click="(ref: any, selectedRow: any) => { onRowClick(ref, selectedRow, field); }"></table-select>
      </template>

      <template v-else-if="field.type === 'time'">
        <el-time-select v-if="field.options.fixedTimeSelect" v-model="formData[field.options.prop]" :placeholder="field.options.placeholder" :readonly="field.options.readonly" :disabled="field.options.disabled" :editable="field.options.editable" :clearable="field.options.clearable" :style="{ width: field.options.width }" :picker-options="{ start: field.options.start, end: field.options.end, step: field.options.step }"></el-time-select>
        <el-time-picker v-else v-model="formData[field.options.prop]" :is-range="field.options.isRange" :placeholder="field.options.placeholder" :start-placeholder="field.options.startPlaceholder" :end-placeholder="field.options.endPlaceholder" :readonly="field.options.readonly" :disabled="field.options.disabled" :editable="field.options.editable" :clearable="field.options.clearable" :arrow-control="field.options.arrowControl" :style="{ width: field.options.width }"></el-time-picker>
      </template>

      <template v-else-if="['date', 'datetime'].indexOf(field.type) >= 0">
        <el-date-picker :ref="'date-' + field.options.prop" v-model="formData[field.options.prop]" :type="field.options.type" :is-range="field.options.isRange" :placeholder="field.options.placeholder" :start-placeholder="field.options.startPlaceholder" :end-placeholder="field.options.endPlaceholder" :readonly="field.options.readonly" :disabled="currentDisabled || field.options.disabled" :editable="field.options.editable" :clearable="field.options.clearable" :format="changeFormat(field.options.formatter)" :value-format="changeFormat(field.options.formatter)" :style="{ width: field.options.width }" @change="(val: any) => { change(proxy.$refs['date-' + field.options.prop], val, field); }"></el-date-picker>
      </template>

      <!--上传图片-->
      <template v-else-if="field.type == 'upload-image'">
        <el-upload :ref="'upload-' + field.options.prop" :action="uploadImgUrl" :headers="headers" :before-upload="(file:any) => beforeAvatarUpload(file, field)" :multiple="field.options.multiple" :on-preview="(file:any) => handlePicPreview(file, field)" :on-success="(res:any, file:any) => handleUploadSuccess(res, file, field)" :on-remove="handlePicRemove" :disabled="field.options.disabled" :file-list="picList" :list-type="field.options.listType" :class="{ 'hide-button': field.options.readonly }" class="upload-file" :show-file-list="!field.options.hiddenFileList" :accept="(field.options.acceptList || []).join(',')">
          <template #trigger>
            <i v-if="field.options.listType === 'picture-card'" class="icon-jiahao1"></i>
            <el-button v-if="field.options.listType !== 'picture-card'" size="small" type="primary">点击上传</el-button>
          </template>
          <slot :name="'file-' + field.options.prop" :file-list="picList"></slot>
        </el-upload>

        <!--预览图片-->
        <el-dialog v-model="state.dialogPicVisible" append-to-body>
          <img :src="state.dialogImageUrl" style="width: 800px; height: 800px; object-fit: scale-down" alt="" />
        </el-dialog>
      </template>

      <!--空白-->
      <template v-else-if="field.type == 'blank'">
        <slot :name="'blank-' + field.options.prop" :formData="formData"></slot>
      </template>

      <!--富文本编辑器-->
      <template v-else-if="field.type === 'tinymce-editor'">
        <editor api-key="gu8x8flf7qbagto3ci6oulfkta5wesld173lueot36c20mrf" :init="state.editorInit" v-model="formData[field.options.prop]" />
        <!-- <tinymce ref="tinymce" v-model="formData[field.options.prop]" :height="field.options.size.height" /> -->
      </template>

      <!--静态文本-->
      <template v-else-if="field.type == 'static'">
        <div :style="{ 'font-size': field.options.styles.fontSize + 'px', 'line-height': field.options.styles.lineHeight + 'px' }">
          {{ common.formatData(formData, field) }}
        </div>
      </template>
    </template>
    <slot :name="'suffix-' + field.options.prop"></slot>
  </el-form-item>
</template>

<script setup lang="ts" name="yrt-editor-input">
import { ComponentInternalInstance } from 'vue';
import TreeSelect from '/@/components/base/TreeSelect.vue';
import InputSelect from '/@/components/base/InputSelect.vue';
import TableSelect from '/@/components/base/TableSelect.vue';
import Editor from '@tinymce/tinymce-vue';
import { to } from 'await-to-js';
import { BaseProperties } from '/@/types/base-type';
import axios from 'axios';
import { postData } from '/@/api/common/baseApi';
import { BaseObject, DataType, QueryBo, QueryType } from '/@/types/common';
import { globalHeaders } from '/@/utils/request';
import { UploadFile } from 'element-plus';

import useDropdownStore from '/@/stores/modules/dropdown';
const dropdownStore = useDropdownStore();

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:disabled', 'on-change', 'on-tree-node-click', 'tree-load', 'on-blur', 'on-focus', 'on-key-up', 'on-key-down', 'on-row-change', 'on-upload-after', 'on-row-click']);

//#region 定义属性
const props = defineProps({
  // 字段数据
  field: {
    type: Object,
    required: true,
  },
  // 校验规则
  formData: {
    type: Object,
    required: true,
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    required: true,
  },
  // 下拉框值集合
  dropdownData: {
    type: Object,
    required: true,
  },
  // 校验规则
  rules: {
    type: Object,
    default: () => {
      return null;
    },
  },
  // 隐藏字段
  hideFeilds: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 下拉框远程搜索事件
  dataRemoteMethod: {
    type: Function,
    default: () => {
      return (query: string, col: any) => {};
    },
  },
});
//#endregion

const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadImgUrl = ref(baseUrl + '/system/core/oss/upload'); // 上传的图片服务器地址
const headers = ref(globalHeaders());

//#region 定义变量
const state = reactive({
  dialogImageUrl: '',
  dialogPicVisible: false,
  // 级联参数设置
  casaderProps: {
    checkStrictly: true, // 是否可以选择任意节点
  },
  editorInit: {
    language_url: '/tinymce/langs/zh_CN.js', //引入语言包文件
    language: 'zh_CN', //语言类型
    skin_url: '/tinymce/skins/ui/oxide', //皮肤：浅色
    height: 300,
    menubar: true,
    placeholder: '在这里输入文字',
    fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px', //字体大小
    plugins: ['print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave'],
    toolbar: 'fullscreen undo redo restoredraft | formatselect | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | styleselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | table insertfile image media charmap hr pagebreak insertdatetime print preview | code selectall searchreplace visualblocks | indent2em lineheight formatpainter axupimgs',
    paste_data_images: true, //图片是否可粘贴
    images_upload_handler: (blobInfo: any, success: any, failure: any) => {
      if (blobInfo.blob().size / 1024 / 1024 > 2) {
        failure('上传失败，图片大小请控制在 2M 以内');
      } else {
        let params = new FormData();
        params.append('file', blobInfo.blob());
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
        axios
          .post(`${proxy.common.domain}/api-upload/uploadimg`, params, config)
          .then((res: any) => {
            if (res.data.code == 200) {
              success(res.data.msg); //上传成功，在成功函数里填入图片路径
            } else {
              failure('上传失败');
            }
          })
          .catch(() => {
            failure('上传出错，服务器开小差了呢');
          });
      }
    },
  },
  // 选中的文件字段
  currentProp: {},
});
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

// 获得输入选择框options
const getInputSelectOptions = computed(() => {
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

// 图片列表
const picList = computed({
  get() {
    let values = props.formData[props.field.options.prop];
    let valueList = [];
    if (proxy.common.isJSON(values)) {
      return JSON.parse(values); // 存储的为JSON，直接返回
    } else if (Array.isArray(values)) {
      valueList = values;
    } else {
      valueList = values ? values.split(',') : [];
    }

    return valueList.map((item: any) => {
      const f = item.split('/');
      let name = decodeURI(f[f.length - 1]);
      name = name.substring(name.length > 22 ? 10 : name.length);
      return {
        name: name,
        url: item,
      };
    });
  },
  set(newValue) {
    props.formData[props.field.options.prop] = JSON.stringify(newValue);
  },
});
//#endregion

//#region  watch
watch(
  () => props.formData,
  (newVal, oldVal) => {
    if (proxy.$refs.tinymce) {
      if (props.formData) {
        const val = props.formData[props.field.options.prop];
        proxy.$refs.tinymce.setContent(val || '');
      }
    }
  },
  { deep: true, immediate: true }
);
//#endregion

// 初始化
const init = () => {
  if (proxy.$refs.tinymce) {
    proxy.$refs.tinymce.initTinymce();
  }
  if (props.field.type === 'cascader') {
    loadCascaderData();
  }
};

// 字段change事件
const change = (ref: any, val: any, fieldInfo: any) => {
  if (['decimal'].indexOf(fieldInfo.options.dataType) >= 0) {
    props.formData[fieldInfo.options.prop] = Number(val);
  }
  let selectItemOptions: any[] = [];
  if (fieldInfo.type === 'select') {
    // 设置表单数据
    if (!Array.isArray(val)) {
      let prop = fieldInfo.options.keyProp || fieldInfo.options.prop;
      let items = getOptions.value(fieldInfo);
      let itemOption = items.find((item: any) => item[prop] === val);
      selectItemOptions.push(itemOption);
      if (itemOption) {
        Object.keys(itemOption).forEach((key) => {
          if (['value', 'code', 'label'].indexOf(key) < 0) {
            props.formData[key] = itemOption[key];
          }
        });
      }
    } else {
      const names = [];
      const keys = [];
      let prop = fieldInfo.options.prop;
      let keyProp = fieldInfo.options.keyProp;
      let itemOptions = getOptions.value(fieldInfo);
      for (const item of val) {
        if (prop.charAt(prop.length - 1) === 's') {
          prop = prop.substr(0, prop.length - 1);
        }
        let itemOption = itemOptions.find((row: any) => row.value === item);
        selectItemOptions.push(itemOption);

        // 主键值获取
        if (keyProp) {
          const keyValue = itemOption[keyProp] || itemOption.value;
          keys.push(keyValue);
          const v = itemOption[prop] || itemOption.label;
          names.push(v);
        } else {
          const v = itemOption[prop] || itemOption.value;
          names.push(v);
        }
      }
      props.formData[fieldInfo.options.prop] = names;
      if (keyProp) props.formData[keyProp] = keys;
    }
  } else if (fieldInfo.type === 'cascader') {
    let getName: any = (key: any, items: any) => {
      if (!Array.isArray(items)) {
        return '';
      }

      for (let item of items) {
        if (item.value === key) {
          return item.label;
        } else {
          let label = getName(key, item.children);
          if (label) {
            return label;
          }
        }
      }
    };
    let prop = fieldInfo.options.prop; // 绑定主键字段
    let nameProp = fieldInfo.options.nameProp; // 关联名称字段
    if (nameProp) {
      let options = props.field.options.options;
      let keys = props.formData[prop];
      let names = [];
      for (let key of keys) {
        let name = getName(key, options);
        names.push(name);
      }
      props.formData[nameProp] = names.join(' / ');
      props.formData.parentId = keys[keys.length - 1];
    }
  }
  emit('on-change', ref, val, fieldInfo, props.formData, selectItemOptions);
};

// 树形下拉框获得点击项
const onTreeNodeClick = (data: any, node: any, el: any, labels: any, values: any, field: any) => {
  // 仅选择叶节点
  if (!node.isLeaf && field.options.onlySelectLeaf) return;
  let prop = field.options.prop;
  // 将下拉框中的值赋给表单
  if (Object.keys(data).findIndex((item) => item === prop) >= 0) {
    Object.keys(data).forEach((key) => {
      if (['value', 'label', 'hasChild', 'hasFactChild', 'state', 'attributes'].indexOf(key) < 0) {
        props.formData[key] = data[key];
      }
    });
  } else {
    props.formData[prop] = data[prop];
  }
  emit('on-tree-node-click', data, node, el, labels, values, field);
};

// 加载级联数据
const loadCascaderData = async () => {
  // let userInfo = proxy.common.getUserInfo();
  // let url = '/api/common/loadTreeNodeAll';
  // let params = props.field.ajaxParams || {};
  // params.where = {
  // 	parentId: 0,
  // 	userProduct_Id: userInfo.userProduct_Id,
  // };
  // const [err, res] = await to(postData(url, params));
  // if (err) {
  // 	return;
  // }
  // if (res.result) {
  // 	props.field.options.options = [
  // 		{
  // 			parentId: -1,
  // 			value: 0,
  // 			label: '根',
  // 			hasChild: 1,
  // 			children: res.data,
  // 		},
  // 	];
  // } else {
  // 	proxy.$message.error(res.msg);
  // }
};

// 树形输入框load
const treeLoad = (node: any, resolve: any, subField: any) => {
  emit('tree-load', node, resolve, subField);
  // 默认加载数据
  if (!subField.isLoaded) {
    let keyName = subField.ajaxParams.keyName;
    if (!keyName) {
      proxy.$message.error('未设置tree下拉框ajax加载参数！');
      return;
    }
    proxy.$nextTick(async () => {
      let whereList: Array<QueryBo> = []; // 查询条件
      if (node.level === 0) {
        whereList.push({
          column: 'parentId',
          values: 0,
          queryType: QueryType.EQ,
          dataType: DataType.INT,
        });
      } else {
        whereList.push({
          column: 'parentId',
          values: node.data[subField.ajaxParams.keyName],
          queryType: QueryType.EQ,
          dataType: DataType.INT,
        });
      }
      if (Array.isArray(subField.ajaxParams.whereList)) {
        for (let item of subField.ajaxParams.whereList) {
          if (!whereList.some((s) => s.column === item.column)) {
            whereList.push(item);
          }
        }
      }

      let url = '/system/core/common/loadTreeNode';
      let params = subField.ajaxParams;
      params.whereList = whereList;
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      if (res.result) {
        resolve(res.data);
      } else {
        proxy.$message.error(res.msg);
      }
    });
  }
};

// tree当前Key Value
const getNodeKeyValue = (field: any) => {
  if (field.options.keyProp) {
    return props.formData[field.options.keyProp];
  } else {
    return props.formData[field.options.prop];
  }
};

// 失去焦点事件
const onBlur = (ref: any, val: any, event: any, field: any) => {
  emit('on-blur', ref, val, event, field);
};

// 获得焦点
const onFocus = (ref: any, val: any, event: any, field: any) => {
  emit('on-focus', ref, val, event, field);
};

// 按键抬起
const onKeyup = (ref: any, val: any, event: any, field: any, tableData?: any) => {
  // if (["decimal"].indexOf(field.options.dataType) >= 0) {
  //   props.formData[field.options.prop] = Number(val:any);
  // }
  emit('on-key-up', ref, val, event, field, tableData);
};

// 按键抬起
const onKeyDown = (ref: any, val: any, event: any, field: any, tableData?: any) => {
  emit('on-key-down', ref, val, event, field, tableData);
};

// 获得焦点
const onRowChange = (ref: any, selectedRow: any, field: any) => {
  emit('on-row-change', ref, selectedRow, field);
};

// 获得焦点
const onRowClick = (ref: any, selectedRow: any, field: any, val?: any) => {
  emit('on-row-click', ref, selectedRow, field, props.formData, val);
};

// 转换验证规则
const changeRules = (field: any) => {
  if (props.rules && props.rules[field.options.prop]) {
    return props.rules[field.options.prop];
  }
  return field.rules;
};

// 图片删除
const handlePicRemove = (file: any, fileList: any) => {
  let urlList = fileList.map((item: any) => {
    return item.response ? item.response.Data.Url : item.url;
  });
  props.formData[props.field.options.prop] = urlList.join(',');
};

// 预览图片
const handlePicPreview = (file: any, field: any) => {
  if (field.options.listType === 'text') {
    window.open(file.url);
  } else {
    state.dialogImageUrl = file.url;
    state.dialogPicVisible = true;
  }
};

// 上传成功回调
const handleUploadSuccess = (res: any, file: UploadFile, field: any) => {
  if (res.code === 200) {
    const list = picList.value;
    list.push({
      name: res.data.fileName,
      url: res.data.url,
    });
    picList.value = list; // 排除掉raw文件
    emit('on-upload-after', file, field, props.formData);
  }
};
/**
 * 图片限制
 */
const beforeAvatarUpload = (file: any, field: any) => {
  if (!field.options.multiple) {
    if (picList.value.length >= 1) {
      proxy.$message.error('已存在文件，请先删除然后重新上传');
      return false;
    }
  }
  if (field.options.listType === 'text') {
    const names = file.name.split('.');
    const extName = names[names.length - 1];
    const isLt5MB = file.size / 1024 / 1024 < 5;
    const type = ['jpeg', 'jpg', 'png', 'bmp', 'jfif', 'gif', 'xls', 'xlsx', 'doc', 'docx', 'pdf', 'zip', 'rar', 'mp3', 'mp4'];
    if (type.indexOf(extName) < 0) {
      proxy.$message.error('只能上传' + type.join(',') + '格式文档!');
    }
    if (!isLt5MB) {
      proxy.$message.error('大小不能超过 5MB!');
    }
    return type.indexOf(extName) >= 0 && isLt5MB;
  } else {
    const names = file.name.split('.');
    const extName = names[names.length - 1];
    const isLt5MB = file.size / 1024 / 1024 < 5;
    const type = ['jpeg', 'jpg', 'png', 'bmp', 'jfif', 'gif'];
    if (type.indexOf(extName) < 0) {
      proxy.$message.error('上传图片只能是' + type.join(',') + '格式!');
    }
    if (!isLt5MB) {
      proxy.$message.error('单张图片大小不能超过 5MB!');
    }
    return type.indexOf(extName) >= 0 && isLt5MB;
  }
};

// input-select props参数
const inputSelectProps = (col: any) => {
  let props = {
    label: 'label',
    value: 'value',
  };
  if (col.options && col.options.labelField && col.options.valueField) {
    props = {
      label: col.options.labelField,
      value: col.options.valueField,
    };
  }

  return props;
};

// moment日期格式符转换为element日期格式符转换
const changeFormat = (formatter: string) => {
  return formatter;
};

// 输入框格式化
const valueFormater = (value: any, field: any) => {
  if (field.options && field.options.valueFormatter) {
    try {
      eval(field.options.valueFormatter);
    } catch (ex) {}
  }
  return value;
};
// 输入框格式化数据提取
const valueParser = (value: any, field: any) => {
  if (field.options && field.options.valueParser) {
    try {
      eval(field.options.valueParser);
    } catch (ex) {}
  }
  return value;
};

// 下拉框远程加载
const selectRemoteMethod = (query: any, field: any) => {
  props.dataRemoteMethod(query, field);
};

// 对外暴露属性和方法
defineExpose({
  init,
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.input-container {
  .inline-input {
    & + .inline-input {
      margin-left: 10px;
    }
  }
  :deep(input.el-input__inner[readonly]) {
    cursor: pointer;
  }

  :deep(.el-select),
  :deep(.el-cascader) {
    width: 100%;

    input.el-input__inner[readonly] {
      background-color: white;
      cursor: pointer;
    }
  }

  :deep(.el-upload--picture-card) {
    margin-bottom: 10px;
    position: relative;
  }

  :deep(.el-upload-list__item) {
    -webkit-transition: all 0s cubic-bezier(0.55, 0, 0.1, 1);
    transition: all 0s cubic-bezier(0.55, 0, 0.1, 1);
    width: auto;
    height: auto;
    max-width: 250px;
    min-width: 250px;
    max-height: 148px;
  }

  .hide-button {
    :deep(.el-upload--text) {
      display: none;
    }

    :deep(.el-upload-list__item-status-label) {
      display: none;
    }

    :deep .el-upload-list__item:hover .el-icon-close {
      display: none;
    }
  }
  .icon-jiahao1 {
    position: absolute;
    top: 55px;
    left: 24px;
    font-size: 100px;
  }
}
</style>
