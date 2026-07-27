<template>
  <div class="form-config-container">
    <el-form label-position="top" :model="dataOptions">
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="模板名称" prop="title" required>
            <el-input v-model="dataOptions.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="dataOptions.projectName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="关联表名" prop="tableName">
            <el-input v-model="dataOptions.tableName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主键" prop="idField">
            <el-input v-model="dataOptions.idField"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="16">
          <el-form-item label="API接口地址" prop="router">
            <el-input v-model="dataOptions.router"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="menuId" prop="menuId" required>
            <el-input v-model.number="dataOptions.menuId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="模板分类" prop="templateType" required>
            <el-select v-model="dataOptions.templateType">
              <el-option label="常规模板" value="常规模板"></el-option>
              <el-option label="物流单" value="物流单"></el-option>
              <el-option label="订单详情" value="订单详情"></el-option>
              <el-option label="箱标签" value="箱标签"></el-option>
              <el-option label="条码设置" value="条码设置"></el-option>
              <el-option label="预到货模板" value="预到货模板"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="model路径">
            <el-input v-model.number="dataOptions.folder"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="画布宽"> <el-input-number v-model.number="dataOptions.width" :min="0" :max="1000" :step="10" controls-position="right" class="w-100"></el-input-number> mm </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="画布高"> <el-input-number v-model.number="dataOptions.height" :min="0" :max="2000" :step="10" controls-position="right" class="w-100"></el-input-number> mm </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="上边距"> <el-input-number v-model.number="dataOptions.paddingTop" :min="0" :max="100" :step="10" controls-position="right" class="w-100"></el-input-number> mm </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下边距"> <el-input-number v-model.number="dataOptions.paddingBottom" :min="0" :max="100" :step="10" controls-position="right" class="w-100"></el-input-number> mm </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="左边距"> <el-input-number v-model.number="dataOptions.paddingLeft" :min="0" :max="100" :step="10" controls-position="right" class="w-100"></el-input-number> mm </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="右边距"> <el-input-number v-model.number="dataOptions.paddingRight" :min="0" :max="100" :step="10" controls-position="right" class="w-100"></el-input-number> mm </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    dataOptions: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.form-config-container {
  padding-bottom: 20px;
  :deep(.el-input-number--medium .el-input-number__decrease),
  :deep(.el-input-number--medium .el-input-number__increase) {
    width: 28px;
  }
  :deep(.el-input-number--medium .el-input__inner) {
    padding-left: 10px;
    padding-right: 33px;
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
