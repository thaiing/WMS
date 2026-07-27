<template>
  <div>
    <el-dialog draggable v-model="currentVisible" title="批量出库" width="30%" class="dialog-container">
      <el-alert title="确定要批量进行批量出库操作吗?" type="warning" />
      <el-form ref="form" class="mt-20">
        <el-form-item label="发货日期">
          <el-date-picker v-model="state.deliveryDate" type="date" placeholder="Pick a day" />
        </el-form-item>
      </el-form>
      <template class="right" #footer>
        <span>
          <el-button @click="currentVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="create-order-dialog">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const emit = defineEmits(['update:visible', 'on-closed']);
//#region 定义属性
const props = defineProps({
  visible: Boolean,
  ids: Array<number>,
});
//#endregion

//#region 定义变量
const state = reactive({
  deliveryDate: new Date(),
});

//#endregion

//#region onMounted

onMounted(() => {});
//#endregion

// 是否显示dialog
const currentVisible = computed({
  get() {
    return props.visible;
  },
  set(newValue) {
    emit('update:visible', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
  },
});
// 批量出库
const save = async () => {
  const url = '/outbound/out/order/batchOut';
  const params = {
    scanInType: 'PC_BATCH_OUT', // PC批量出库"
    idList: props.ids?.join(','),
    deliveryDate: state.deliveryDate,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }

  currentVisible.value = false;
  emit('on-closed'); // 关闭窗口事件
};

// 对外暴露属性和方法
defineExpose({
  // addwhere,
});
</script>
