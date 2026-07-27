<template>
  <div class="form-config-container">
    <el-form label-position="top" :model="dataOptions">
      <!-- <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="PDA模式" required>
            <el-switch v-model="dataOptions.isPDA" :active-value="true" :inactive-value="false" active-text="是"
              inactive-text="否" @change="isPdaChange">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="UI类型">
            <el-select v-model="dataOptions.vueType">
              <el-option value="pcUI"></el-option>
              <el-option value="app扫描UI"></el-option>
              <el-option value="app查询UI"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row :gutter="3">
        <el-col :span="24">
          <el-form-item label="表名" prop="tableName" required>
            <el-input v-model="dataOptions.tableName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="24">
          <el-form-item label="前端路由" prop="webRouter" required>
            <el-input v-model="dataOptions.webRouter"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="24">
          <el-form-item label="后端路由" prop="prefixRouter" required>
            <el-input v-model="dataOptions.prefixRouter"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="列表自定义方法">
            <el-input v-model="dataOptions.listMethod"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编辑开启tab分组">
            <el-switch v-model="dataOptions.openTabGroup" :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="固定条件">
        <el-input v-model="currentFixedWhere" :rows="3" type="textarea"></el-input>
      </el-form-item>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="主键idField" prop="idField" required>
            <el-input v-model="dataOptions.idField"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自动编码字段">
            <el-input v-model="dataOptions.codeRegular"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="连接字段" prop="linkColumn">
            <el-input v-model="dataOptions.linkColumn"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="menuId" prop="menuId" required>
            <el-input v-model.number="dataOptions.menuId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="6">
          <el-form-item label="分页大小">
            <el-input v-model.number="dataOptions.pageSize"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="列表排序方式">
            <el-input v-model="orderBy"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="列表显示操作列">
            <el-switch v-model="dataOptions.showActionField" :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="列表显示求和行">
            <el-switch v-model="dataOptions.showSumField" :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="编辑页面内嵌">
            <el-select v-model="dataOptions.editorType">
              <el-option value="inner" label="内嵌多页面"></el-option>
              <el-option value="dialog" label="对话框模式"></el-option>
              <el-option value="single" label="内嵌单页面"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行字段策略">
            <el-switch v-model="dataOptions.fieldStrategy" :active-value="true" :inactive-value="false"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <!--用户指定VueData_Id-->
      <!-- <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="orginVueData_Id">
            <el-input v-model="dataOptions.orginVueData_Id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row> -->

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="行内表单">
            <el-switch v-model="dataOptions.formInline" :active-value="false" :inactive-value="true" active-text="单独行" inactive-text="行内"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="查询独立行">
            <el-switch v-model="dataOptions.searchOnlyLine" :active-value="true" :inactive-value="false"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="标签对齐方式">
        <el-radio-group v-model="editorConfig.labelPosition">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
          <el-radio-button label="top">顶部对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="表单字段宽度"> <el-input-number v-model="labelWidth" :min="0" :max="200" :step="10" controls-position="right" style="width: 90px !important"></el-input-number> px </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表单宽度"> <el-input-number v-model="formWidth" :min="0" :max="1000" :step="10" controls-position="right" style="width: 90px !important"></el-input-number> px </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="对话框宽度">
            <el-input v-model="editorConfig.width"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对话框顶部距离">
            <el-input v-model="editorConfig.top"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="表格最大高度">
            <el-input v-model.number="dataOptions.maxHeight"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开启瀑布流">
            <el-switch v-model="dataOptions.openWaterfall" :active-value="true" :inactive-value="false"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="对话框标题">
            <el-input v-model="editorConfig.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="提交按钮名称">
            <el-input v-model="editorConfig.saveButtonText"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="开启分组查询">
            <el-switch v-model="dataOptions.openGroupBy" :active-value="true" :inactive-value="false"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开启审核流">
            <el-switch v-model="dataOptions.openAuditFlow" :active-value="true" :inactive-value="false"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="关联流程部署ID">
        <el-input v-model="dataOptions.deployId"></el-input>
      </el-form-item>
      <el-form-item label="编辑页面默认值(JSON对象)">
        <el-input v-model="currentEditorDefaultValue" :rows="3" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="数据执行脚本(dataList)">
        <el-input v-model="dataOptions.script" :rows="3" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="列表页面备注">
        <el-input v-model="dataOptions.dataListRemark" :rows="3" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="编辑页面备注">
        <el-input v-model="dataOptions.editorRemark" :rows="3" type="textarea"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="form-config">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 双向更新事件定义
const emit = defineEmits([]);

//#region 定义父组件传过来的值
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
  editorConfig: {
    type: Object,
    default: () => {
      return {};
    },
  },
  dataOptions: {
    type: Object,
    default: () => {
      return {
        folder: '',
        tableName: '',
        vueType: '',
      };
    },
  },
});
//#endregion

//#region 计算属性
const labelWidth = computed({
  get: function () {
    return parseInt(props.editorConfig.labelWidth);
  },
  set: function (val) {
    props.editorConfig.labelWidth = val + 'px';
  },
});

const formWidth = computed({
  get: function () {
    return parseInt(props.editorConfig.formWidth);
  },
  set: function (val) {
    if (val) {
      props.editorConfig.formWidth = val + 'px';
    } else {
      props.editorConfig.formWidth = null;
    }
  },
});

const orderBy = computed({
  get: function () {
    return JSON.stringify(props.dataOptions.orderBy);
  },
  set: function (val) {
    try {
      if (!val) {
        props.dataOptions.orderBy = null;
        return;
      }
      const orderBy = JSON.parse(val);
      props.dataOptions.orderBy = orderBy;
      proxy.$message.success('列表排序方式格式正确');
    } catch (error) {
      proxy.$message.error('列表排序方式不是有效的JSON格式');
    }
  },
});

// fixedWhere JSON加载属性
const currentFixedWhere = computed({
  get: function () {
    var params = props.dataOptions.fixedWhere;
    if (params) {
      return JSON.stringify(params, null, 2);
    } else {
      return '';
    }
  },
  set: function (val) {
    try {
      props.dataOptions.fixedWhere = JSON.parse(val);
      proxy.$message.success('json格式正确');
    } catch (error: any) {
      proxy.$message.error('数据结构不正确，不是有效的json格式，' + error.message);
    }
  },
});

// editorDefaultValue JSON加载属性
const currentEditorDefaultValue = computed({
  get: function () {
    var params = props.dataOptions.editorDefaultValue;
    if (params) {
      return JSON.stringify(params, null, 2);
    } else {
      return '';
    }
  },
  set: function (val) {
    try {
      props.dataOptions['editorDefaultValue'] = JSON.parse(val);
      proxy.$message.success('json格式正确');
    } catch (error) {
      proxy.$message.error('数据结构不正确，不是有效的json格式，' + (error as Error).message);
    }
  },
});
//#endregion

// 改变模式，清空列表页面字段
const isPdaChange = () => {
  props.data.dataListOptions.fields = [];
};
</script>

<style lang="scss" scoped>
.form-config-container {
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
