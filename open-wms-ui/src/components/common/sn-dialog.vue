<template>
  <el-dialog v-model="currentDialogVisible" :top="common.getDialogTop()" title="SN列表" class="dialog-container" width="1000px" append-to-body>
    <el-table :data="state.dataList" size="small" style="width: 100%" max-height="500px">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="snNo" label="SN号"></el-table-column>
      <el-table-column prop="enable" label="是否可用" width="100"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="140"></el-table-column>
      <el-table-column prop="sourceType" label="来源类型" width="140"></el-table-column>
      <el-table-column prop="positionName" label="货位" width="130"></el-table-column>
      <el-table-column prop="inStorageDate" label="入库日期" width="140"></el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="currentDialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="sn-dialog">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy: BaseProperties = ins.proxy as BaseProperties;
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
// 事件定义
const emit = defineEmits(['update:visible', 'field-change']);

//#region 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  // 数据列表
  snDataList: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 库存ID
  ppid: {
    type: Number,
    default: 0,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  dataList: [] as any[],
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

onMounted(() => {});

// 查看SN列表
const viewSn = async () => {
  if (!props.ppid) {
    return;
  }
  const url = '/api/storage/productPosition/getSnList';
  const params = {
    productPosition_Id: props.ppid,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  if (res?.result) {
    state.dataList = res.data.map((item: any) => {
      item.enable = item.enable === 1 ? '是' : '否';
      item.createDate = proxy.common.formatDate(item.createDate, 'YYYY-MM-DD HH:mm:ss');
      if (item.outDate) {
        item.outDate = proxy.common.formatDate(item.outDate, 'YYYY-MM-DD HH:mm:ss');
      }
      return item;
    });
    state.dataList.sort((a, b) => {
      return a.enable > b.enable ? -1 : 1;
    });
  }
};

//#region watch
watch(
  () => props.snDataList,
  (val) => {
    state.dataList = val;
  },
  { deep: true, immediate: true }
);

watch(
  () => props.ppid,
  (val) => {
    viewSn();
  },
  { deep: true, immediate: true }
);
//#endregion
</script>
