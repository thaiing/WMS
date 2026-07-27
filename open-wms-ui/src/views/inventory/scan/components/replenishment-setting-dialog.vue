<template>
  <el-dialog v-model="currentDialogVisible" :top="common.getDialogTop()" title="应用场景设置" class="dialog-container" width="1000px" draggable overflow append-to-body>
    <div class="setting-container">
      <div>
        <el-form :model="state.config" label-width="120px">
          <el-form-item label="扫描商品">
            <el-switch v-model="state.config.isValidateProductCode" />
          </el-form-item>
          <el-form-item label="校验存储货位">
            <el-switch v-model="state.config.isPositionName" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <span class="flex-end">
        <el-button @click="currentDialogVisible = false">取 消</el-button>
        <el-button :loading="state.isLoading" type="primary" icon="ele-Select" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="inbound-scan-order">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy: BaseProperties = ins.proxy as BaseProperties;

import common from '/@/utils/common';
import { UserCacheEnum } from '/@/enums/UserCacheEnum';
// 事件定义
const emit = defineEmits(['update:visible', 'scan-setting-change']);

//#region 定义属性
const props = defineProps({
  // 是否显示
  visible: {
    type: Boolean,
    default: false,
  },
  // 名称
  name: {
    type: String,
  },
  // 配置参数
  scanSetting: {
    type: Object,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  // 当前选中菜单下的导出模板列表
  vueDataList: [],
  // 当前选中模板
  currentTemplate: {},
  isLoading: false,
  config: {
    isValidateProductCode: true,
    isPositionName: false,
  },
});
//#endregion

//#region 计算属性
// 显示窗口
const currentDialogVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});
//#endregion

watch(
  () => props.scanSetting,
  (val: any) => {
    state.config = val;
  },
  { deep: true, immediate: true }
);

onMounted(async () => {});

const save = async () => {
  currentDialogVisible.value = false;
  await common.setUserCache(UserCacheEnum.SCAN_REPLENISHMENT, props.scanSetting); // 保持设置
  emit('scan-setting-change', { config: state.config });
};
</script>

<style lang="scss" scoped>
.setting-container {
  display: flex;
  flex-direction: row;
}
</style>
