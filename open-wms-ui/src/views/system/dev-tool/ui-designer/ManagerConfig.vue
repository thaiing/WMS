<template>
  <div v-if="show" class="widget-config">
    <el-form :model="data" :label-position="'top'">
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="标题" prop="label" required>
            <el-input v-model="data.label"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="绑定字段" prop="prop" required>
            <el-input v-model="data.prop"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="数据类型" prop="dataType" required>
            <el-select v-model="data.dataType" placeholder="请选择数据类型">
              <el-option v-for="item in state.dataTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="列宽度">
            <el-input v-model.number="data.width">
              <template slot="append">px</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="查询输入框类型">
            <el-select v-model="data.type" placeholder="请选择" @change="($event:any) => dataTypeChange($event, data)">
              <el-option :key="-1" label="none" value="none"></el-option>
              <el-option v-for="(item, index) in _basicComponents" :key="index" :label="item.label" :value="item.type"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最小列宽度">
            <el-input v-model.number="data.minWidth">
              <template slot="append">px</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="是否显示">
            <el-switch v-model="data.hidden" :active-value="false" :inactive-value="true" active-text="显示" inactive-text="隐藏"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开启排序">
            <el-switch v-model="data.sortable" :active-value="true" :inactive-value="false" active-text="开启" inactive-text="关闭"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="只读">
            <el-switch v-model="data.readonly" :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扩展字段">
            <el-switch v-model="data.isExpandField"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="data.isExpandField" :gutter="15">
        <el-col :span="12">
          <el-form-item label="扩展字段名">
            <el-select v-model="data.expandFieldName" placeholder="扩展字段名">
              <el-option label="expandFields" value="expandFields"></el-option>
              <el-option label="detailExpandFields" value="detailExpandFields"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>

      <el-row v-if="data.type === 'tree'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="仅选择叶节点">
            <el-switch v-model="data.onlySelectLeaf"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下拉框主键字段">
            <el-input v-model="data.keyProp"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="data.type == 'tree'" label="ajax请求参数">
        <el-input v-model="currentAjaxParams" :rows="3" type="textarea"></el-input>
      </el-form-item>

      <template v-if="data.type === 'table-select'">
        <el-row>
          <el-col :span="24">
            <el-form-item label="接口地址">
              <el-input v-model="data.options.url"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="查询字段">
              <el-input v-model="data.options.searchFields" :rows="2" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="表格字段定义">
              <el-row v-for="(item, index) in data.options.columns" :key="index">
                <el-col :span="11">
                  <el-input v-model="item.prop" placeholder="字段英文名" class="col-param"></el-input>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="item.label" placeholder="字段中文名" class="col-param"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-input v-model.number="item.width" placeholder="宽度" class="col-param"></el-input>
                </el-col>
              </el-row>
              <el-button type="primary" link @click="(e:any) => data.options.columns.push({})">添加字段</el-button>
              <el-button type="primary" link @click="(e:any) => data.options.columns.pop()">删除字段</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="查询字段">
              <el-input v-model="data.options.valueField"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示字段">
              <el-input v-model="data.options.labelField"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <template v-if="data.type === 'input-select'">
        <el-row>
          <el-col :span="24">
            <el-form-item label="接口地址">
              <el-input v-model="data.options.url"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="查询字段">
              <el-input v-model="data.options.searchFields" :rows="2" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="value字段">
              <el-input v-model="data.options.valueField"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="label字段">
              <el-input v-model="data.options.labelField"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <el-row>
        <el-col v-if="['select'].indexOf(data.type) >= 0" :span="12" :gutter="20">
          <el-form-item label="模糊查询">
            <el-switch v-model="data.isFuzzyQuery" :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
        </el-col>
        <el-col v-if="['select', 'table-select'].indexOf(data.type) >= 0" :span="12" :gutter="20">
          <el-form-item label="下拉框主键字段">
            <el-input v-model="data.keyProp"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <template v-if="['select', 'radio', 'check'].indexOf(data.type) >= 0">
        <el-form-item v-if="data.options && Object.keys(data.options).indexOf('inline') >= 0" label="布局方式">
          <el-radio-group v-model="data.options.inline">
            <el-radio-button :label="false">块级</el-radio-button>
            <el-radio-button :label="true">行内</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="data.options && Object.keys(data.options).indexOf('options') >= 0" label="下拉框选项">
          <el-radio-group v-model="data.options.remote" size="small" style="margin-bottom: 10px">
            <el-radio-button :label="'bindDropdown'">下拉框ID</el-radio-button>
            <el-radio-button :label="false">静态数据</el-radio-button>
            <el-radio-button :label="true">远端数据</el-radio-button>
          </el-radio-group>
          <template v-if="data.options.remote === true">
            <div>
              <!-- <el-input v-model="data.options.remoteFunc" size="small" style="">
                <template slot="prepend">远端方法</template>
              </el-input> -->
              <el-input v-model="data.options.props.value" size="small" style="">
                <template #prepend>值</template>
              </el-input>
              <el-input v-model="data.options.props.label" size="small" style="">
                <template #prepend>标签</template>
              </el-input>
            </div>
          </template>
          <template v-else-if="data.options.remote === 'bindDropdown'">
            <el-input v-model.number="data.options.dropdownId" type="number" size="small">
              <template #prepend>关联下拉框ID</template>
            </el-input>
          </template>
          <template v-else>
            <template v-if="data.type == 'radio' || (data.type == 'select' && !data.options.multiple)">
              <el-radio-group v-model="data.options.defaultValue">
                <draggable :list="data.options.options" item-key="value" :group="{ name: 'options' }" ghost-class="ghost" handle=".drag-item" tag="ul">
                  <template #item="{ element, index }">
                    <li>
                      <el-radio :label="element.value" style="margin-right: 5px">
                        <el-input v-model="element.value" style="width: 90px" size="small"></el-input>
                        <el-input v-model="element.label" style="width: 90px" size="small"></el-input>
                        <!-- <input v-model="item.value"/> -->
                      </el-radio>
                      <i class="drag-item yrt-yidong1" style="font-size: 16px; margin: 0 5px; cursor: move"></i>
                      <el-button circle plain type="danger" size="small" icon="el-icon-minus" style="padding: 4px; margin-left: 5px" @click="handleOptionsRemove(index)"></el-button>
                    </li>
                  </template>
                </draggable>
              </el-radio-group>
            </template>

            <template v-if="data.type == 'checkbox' || (data.type == 'select' && data.options.multiple)">
              <el-checkbox-group v-model="data.options.defaultValue">
                <draggable :list="data.options.options" item-key="value" :group="{ name: 'options' }" ghostClass="ghost" handle=".drag-item" tag="ul">
                  <template #item="{ element, index }">
                    <li>
                      <el-checkbox :label="element.value" style="margin-right: 5px">
                        <el-input v-model="element.value" :style="{ width: data.options.showLabel ? '90px' : '190px' }" size="small"></el-input>
                        <el-input v-if="data.showLabel" v-model="element.label" style="width: 100px" size="small"></el-input>
                      </el-checkbox>
                      <i class="drag-item yrt-yidong1" style="font-size: 16px; margin: 0 5px; cursor: move"></i>
                      <el-button circle plain type="danger" size="small" icon="el-icon-minus" style="padding: 4px; margin-left: 5px" @click="handleOptionsRemove(index)"></el-button>
                    </li>
                  </template>
                </draggable>
              </el-checkbox-group>
            </template>
            <div style="margin-left: 22px">
              <el-button type="primary" link @click="handleAddOption">添加选项</el-button>
            </div>
          </template>
        </el-form-item>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="是否显示标签">
              <el-switch v-model="data.showLabel"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="data.type == 'tree'" label="仅选择叶节点"> <el-switch v-model="data.options.onlySelectLeaf"></el-switch> </el-form-item>
            <el-form-item v-if="data.type == 'select'" label="显示清除按钮">
              <el-switch v-model="data.clearable"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="data.type === 'select'" :gutter="3">
          <el-col :span="12">
            <el-form-item label="远程搜索">
              <el-switch v-model="data.remoteQuery"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选中后保留关键词">
              <el-switch v-model="data.reserveKeyword"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="data.type === 'select'" :gutter="20">
          <el-col :span="12">
            <el-form-item label="下拉框可多选">
              <el-switch v-model="data.multiple" :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下拉框可筛选">
              <el-switch v-model="data.filterable" :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="快速查询字段">
            <el-switch v-model="data.isQuickSearch" :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="查询顺序(大于0显示)">
            <el-input v-model.number="data.searchRowNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="查询默认值">
            <el-input v-model="data.searchDefaultValue"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="查询框宽度(px)">
            <el-input v-model.number="data.searchWidth"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="表头对齐方式">
            <el-select v-model="data.headerAlign" placeholder="请选择">
              <el-option label="left" value="left"></el-option>
              <el-option label="center" value="center"></el-option>
              <el-option label="right" value="right"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单元对齐方式">
            <el-select v-model="data.align" placeholder="请选择">
              <el-option label="left" value="left"></el-option>
              <el-option label="center" value="center"></el-option>
              <el-option label="right" value="right"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="格式化">
            <el-select v-model="data.formatter">
              <el-option label="YYYY-MM" value="YYYY-MM"></el-option>
              <el-option label="YYYY-MM-DD" value="YYYY-MM-DD"></el-option>
              <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss"></el-option>
              <el-option label="￥0.00" value="￥0.00"></el-option>

              <el-option label="#" value="#"></el-option>
              <el-option label="#.#" value="#.#"></el-option>
              <el-option label="0.#" value="0.#"></el-option>
              <el-option label="0.##" value="0.##"></el-option>
              <el-option label="0.###" value="0.###"></el-option>
              <el-option label="0.####" value="0.####"></el-option>
              <el-option label="0.#####" value="0.#####"></el-option>
              <el-option label="0.######" value="0.######"></el-option>
              <el-option label="0.#######" value="0.#######"></el-option>
              <el-option label="0.########" value="0.########"></el-option>
              <el-option label="0.0" value="0.0"></el-option>
              <el-option label="0.00" value="0.00"></el-option>
              <el-option label="0.000" value="0.000"></el-option>
              <el-option label="0.0000" value="0.0000"></el-option>
              <el-option label="0.00000" value="0.00000"></el-option>
              <el-option label="0.000000" value="0.000000"></el-option>
              <el-option label="0.0000000" value="0.0000000"></el-option>
              <el-option label="0.00000000" value="0.00000000"></el-option>
              <el-option label="%" value="%"></el-option>
              <el-option label="大单位格式化" value="大单位格式化"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否求和">
            <el-switch v-model="data.isSum" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="列固定位置">
            <el-select v-model="data.fixed">
              <el-option label="固定左侧" value="left"></el-option>
              <el-option label="固定右侧" value="YYYY-MM-DD"></el-option>
              <el-option label="不固定" value=""></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12"> </el-col>
      </el-row>

      <el-row v-if="dataOptions.openGroupBy" :gutter="3">
        <el-col :span="12">
          <el-form-item label="分组函数">
            <el-select v-model="data.groupBy">
              <el-option label="GROUP" value="GROUP"></el-option>
              <el-option label="SUM" value="SUM"></el-option>
              <el-option label="COUNT" value="COUNT"></el-option>
              <el-option label="AVG" value="AVG"></el-option>
              <el-option label="MAX" value="MAX"></el-option>
              <el-option label="MIN" value="MIN"></el-option>
              <el-option label="MAXDISTINCT" value="MAXDISTINCT"></el-option>
              <el-option label="CustomExpress" value="CustomExpress"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分组表达式">
            <el-input v-model="data.groupExpress" type="textarea" :rows="1"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-form-item label="显示标签颜色">
          <draggable :list="data.tagColorList" item-key="value" :group="{ name: 'tagColorList' }" ghost-class="ghost" handle=".drag-item" tag="ul">
            <template #item="{ element, index }">
              <li style="display: flex; margin-top: 5px">
                <el-select v-model="element.operator" :default-first-option="true" :placeholder="$tt('请选择')" class="operator" style="width: 70px" size="small">
                  <el-option v-for="op in state.operators" :key="op.value" :label="op.label" :value="op.value"></el-option>
                </el-select>
                <el-input v-model="element.value" style="width: 80px" size="small"></el-input>
                <el-color-picker v-model="element.backgroudColor" size="small" style="vertical-align: -9px; margin-left: 5px" title="背景颜色" :predefine="state.predefineColors" show-alpha></el-color-picker>
                <el-color-picker v-model="element.color" size="small" style="vertical-align: -9px; margin-left: 5px" title="字体颜色" :predefine="state.predefineColors" show-alpha></el-color-picker>
                <i class="drag-item yrt-yidong1" style="font-size: 16px; margin: 0 5px; cursor: move; align-items: center; height: 24px"></i>
                <el-button circle plain type="danger" size="small" icon="el-icon-minus" style="padding: 4px; margin-left: 5px" @click="data.tagColorList.splice(index, 1)"></el-button>
              </li>
            </template>
          </draggable>
          <div style="margin-left: 22px">
            <el-button type="primary" link @click="data.tagColorList.push({ operator: '=', value: null, color: null, backgroudColor: null })">添加选项</el-button>
          </div>
        </el-form-item>
      </el-row>

      <el-form-item label="关联脚本(row, field, data)">
        <el-input v-model="data.script" type="textarea" :rows="2"></el-input>
      </el-form-item>

      <el-form-item label="字段说明">
        <el-input v-model="data.remark" type="textarea"></el-input>
      </el-form-item>
      <el-divider content-position="left">自定义事件</el-divider>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="事件类型">
            <el-select v-model="data.calcType" clearable>
              <el-option label="数据修改change" value="change"></el-option>
              <el-option label="按键抬起keyup" value="keyup"></el-option>
              <el-option label="按键抬起keydown" value="keydown"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主表合计字段">
            <el-input v-model="data.calcMainField"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="data.calcType === 'change'" :gutter="3">
        <el-form-item label="事件表达式(field, row, rows)">
          <el-input v-model="data.calcExpress" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="关联触发字段">
          <el-input v-model="data.calcEmitFields" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="manager-config">
import Draggable from 'vuedraggable';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { BaseObject } from '/@/types/common';
const _dataTypeList = [
  { id: 'none', name: 'none' },
  { id: 'string', name: 'string' },
  { id: 'byte', name: 'byte' },
  { id: 'integer', name: 'integer' },
  { id: 'long', name: 'long' },
  { id: 'double', name: 'double' },
  { id: 'bigDecimal', name: 'bigDecimal' },
  { id: 'boolean', name: 'boolean' },
  { id: 'datetime', name: 'datetime' },
  { id: 'date', name: 'date' },
  { id: 'month', name: 'month' },
];
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 定义父组件传过来的值
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
  dataOptions: {
    type: Object,
    default: () => {
      return {};
    },
  },
  basicComponents: {
    type: Array,
    default: () => {
      return [] as Array<any>;
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  // 验证规则
  validator: {
    type: null,
    required: null,
    pattern: null,
    range: null,
    length: null,
  } as Record<string, any>,
  // 数据类型列表
  dataTypeList: _dataTypeList,
  // 运算符
  operators: [
    { value: 'like', label: '模糊' },
    { value: 'null', label: '空值' },
    { value: '>', label: '>' },
    { value: '>=', label: '>=' },
    { value: '<', label: '<' },
    { value: '<=', label: '<=' },
    { value: '=', label: '=' },
    { value: '<>', label: '<>' },
    { value: 'in', label: '多行' },
  ],
  predefineColors: ['rgba(5, 200, 5, 1)', 'rgba(0, 255, 0, 1)', '#90ee90', '#409EFF', 'rgb(102, 177, 255)', 'rgb(140, 197, 255);', 'rgb(217, 236, 255)', '#00ced1', '#c71585', 'rgb(255, 120, 0)', '#ff0000', '#ff4500', '#ff8c00', '#ffd700', 'rgba(255, 255, 0, 1)', 'rgba(201, 241, 3, 1)', 'hsva(120, 40, 94, 0.5)', 'hsl(181, 100%, 37%)', 'hsla(209, 100%, 56%, 0.73)', '#c7158577', '#303133', '#606266', '#909399', '#DCDFE6', '#E4E7ED', '#F2F6FC', '#ffffff', 'rgba(208, 3, 208, 1)', 'rgba(252, 68, 252, 1)', 'rgba(255, 0, 255, 1)'],
});
//#endregion

//#region 计算属性
const show = computed(() => {
  if (props.data && Object.keys(props.data).length > 0) {
    return true;
  }
  return false;
});

const currentAjaxParams = computed({
  get: function () {
    var params = props.data.ajaxParams;
    if (params) {
      return JSON.stringify(params, null, 2);
    } else {
      return '';
    }
  },
  set: function (val) {
    try {
      props.data.ajaxParams = JSON.parse(val);
      proxy.$message.success('json格式正确');
    } catch (error: any) {
      proxy.$message.error('数据结构不正确，不是有效的json格式，' + error.message);
    }
  },
});

const _basicComponents = computed(() => {
  return props.basicComponents as Array<any>;
});
//#endregion

//#region wacth
watch(
  () => 'props.data.type',
  (val) => {
    if (val === 'select') {
      // 默认值设置
      switch (props.data.prop) {
        case 'consignorName':
          props.data.dropdownId = 797;
          props.data.keyProp = 'consignor_Id';
          break;
        case 'enable':
          props.data.dropdownId = 20;
          break;
        case 'auditing':
          props.data.dropdownId = 21;
          break;
        case 'userTrueName':
          props.data.dropdownId = 22;
          props.data.keyProp = 'user_Id';
          break;
        case 'deptName':
          props.data.dropdownId = 23;
          props.data.keyProp = 'dept_Id';
          break;
        case 'roleName':
          props.data.dropdownId = 24;
          props.data.keyProp = 'role_Id';
          break;
        case 'storageName':
          props.data.dropdownId = 31;
          props.data.keyProp = 'storage_Id';
          break;
        case 'providerShortName':
          props.data.dropdownId = 33;
          props.data.keyProp = 'provider_Id';
          break;
        case 'productName':
          props.data.dropdownId = 34;
          props.data.keyProp = 'productId';
          break;
        case 'brandName':
          props.data.dropdownId = 909;
          props.data.keyProp = 'brand_Id';
          break;
        case 'typeName':
          props.data.dropdownId = 531;
          props.data.keyProp = 'typeId';
          break;
        case 'sortingStatus':
          props.data.dropdownId = 518;
          break;
      }
    }
  },
  { deep: true, immediate: true }
);
//#endregion

// 编辑框类型改变
const dataTypeChange = (selectVal: any, data: any) => {
  const item: any = props.basicComponents.find((item: any) => {
    return item.type === selectVal;
  });
  let customJson = {};
  // 表格下拉框时设置默认参数
  if (item.type === 'table-select') {
    // 仓库默认值
    if (data.options.prop === 'storageName') {
      customJson = {
        columns: [
          {
            prop: 'storageCode',
            label: '仓库编号',
            width: 100,
          },
          {
            prop: 'storageName',
            label: '仓库名称',
            width: 150,
          },
        ],
        url: '/basic/storage/storage/getList',
        searchFields: 'storageId,storageCode,storageName',
      };
    } else if (data.options.prop === 'consignorName') {
      // 货主默认值
      customJson = {
        columns: [
          {
            prop: 'consignorCode',
            label: '货主编号',
            width: 100,
          },
          {
            prop: 'consignorName',
            label: '货主名称',
            width: 150,
          },
        ],
        url: '/basic/base/consignor/getList',
        searchFields: 'consignorId,consignorCode,consignorName',
      };
    } else if (data.options.prop === 'productName') {
      // 商品默认值
      customJson = {
        columns: [
          {
            prop: 'productCode',
            label: '商品编号',
            width: 100,
          },
          {
            prop: 'productName',
            label: '商品名称',
            width: 150,
          },
        ],
        url: '/basic/product/product/getList',
        searchFields: 'productId,productCode,productModel,productName,productSpec',
      };
    } else if (data.options.prop === 'providerShortName') {
      // 供应商默认值
      customJson = {
        columns: [
          {
            prop: 'providerCode',
            label: '供应商编号',
            width: 100,
          },
          {
            prop: 'providerShortName',
            label: '供应商名称',
            width: 150,
          },
        ],
        url: '/basic/product/provider/getList',
        searchFields: 'providerId,providerCode,providerShortName,providerName',
      };
    } else if (data.options.prop === 'clientShortName') {
      // 客户默认值
      customJson = {
        columns: [
          {
            prop: 'clientCode',
            label: '客户编号',
            width: 100,
          },
          {
            prop: 'clientShortName',
            label: '客户名称',
            width: 150,
          },
        ],
        url: '/basic/client/client/getList',
        searchFields: 'clientId,clientCode,clientShortName,clientFullName',
      };
    }
  }
  let options = {};
  if (item && item.options) {
    options = item.options;
  }
  data.options = Object.assign({}, options, customJson);
  if (data.type === 'radio') {
    data.options.inline = true;
  }
};

const handleOptionsRemove = (index: number) => {
  if (props.data.type === 'grid') {
    props.data.columns.splice(index, 1);
  } else {
    props.data.options.options.splice(index, 1);
  }
};

const handleAddOption = () => {
  if (props.data.options.showLabel) {
    props.data.options.options.push({
      value: '新选项',
      label: '新选项',
    });
  } else {
    props.data.options.options.push({
      value: '新选项',
    });
  }
};

const handleAddColumn = () => {
  props.data.columns.push({
    span: '',
    fields: [],
  });
};

const generateRule = () => {
  props.data.rules = [];
  Object.keys(state.validator).forEach((key) => {
    if (state.validator[key]) {
      props.data.rules.push(state.validator[key]);
    }
  });
};

const handleSelectMuliple = (value: any) => {
  if (value) {
    if (props.data.options.defaultValue) {
      props.data.options.defaultValue = [props.data.options.defaultValue];
    } else {
      props.data.options.defaultValue = [];
    }
  } else {
    if (props.data.options.defaultValue.length > 0) {
      props.data.options.defaultValue = props.data.options.defaultValue[0];
    } else {
      props.data.options.defaultValue = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.widget-config {
  .col-param {
    :deep(.el-input__inner) {
      padding: 0 5px;
    }
  }

  :deep(.el-input__inner) {
    padding: 0 5px;
  }

  :deep(.el-input-number .el-input__inner) {
    padding-left: 5px;
    padding-right: 40px;
  }

  :deep(.el-form-item) {
    margin-bottom: 5px !important;
  }

  :deep(.el-form-item__label) {
    margin-bottom: 0px !important;
    line-height: 22px !important;
    height: 22px !important;
    justify-content: flex-start;
  }
}
</style>
