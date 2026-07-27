<template>
  <div class="dialog-container">
    <el-dialog draggable v-model="isDialogVisible" title="生成容器号" width="650px" append-to-body>
      <el-form ref="form" :model="state.formData">
        <el-form-item label="仓库名称">
          <el-select v-model="state.formData.storageId" :placeholder="$tt('请选择仓库')" class="input-300">
            <el-option v-for="item in state.dropDownStorage" :key="item.storageId" :label="item.storageName" :value="item.storageId" @click="() => (state.formData.storageName = item.storageName)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="容器类型">
          <el-select v-model="state.formData.plateType" filterable clearable placeholder="请选择容器类型">
            <el-option v-for="(item, index) in state.dropDownplateType" :key="index" :label="item.value02" :value="item.value02"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="容器规格" style="width: 270px">
          <el-input v-model="state.formData.plateSpec" placeholder="请输入规格"></el-input>
        </el-form-item>
        <el-form-item label="编号前缀">
          <el-select v-model="state.formData.codePrefix" filterable clearable placeholder="请选择编号前缀">
            <el-option v-for="(item, index) in state.dropDowncodePrefix" :key="index" :label="item.value" :value="item.label"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生成数量" style="width: 270px">
          <el-input v-model="state.formData.generate" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createCode()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="order-split-dialog">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:visible', 'on-closed']);

//#region 定义属性
const props = defineProps({
  visible: Boolean,
});
//#endregion

//#region 定义变量
const state = reactive({
  dataList: [] as any[], // 数据集合
  formData: {
    storageId: '',
    storageName: '', // 仓库名称
    plateType: '', // 容器类型
    codePrefix: '', // 编号前缀
    // serialDigit: null, // 流水号位数
    generate: 1,
    plateSpec: '', // 容器规格
  },
  // isDialogVisible: false,
  // 容器下拉值
  // dropDownplateType: [
  // 	{
  // 		value: '托盘',
  // 		label: '托盘',
  // 	},
  // 	{
  // 		value: '周转箱',
  // 		label: '周转箱',
  // 	},
  // 	{
  // 		value: '暂存箱',
  // 		label: '暂存箱',
  // 	},
  // ] as any[],
  dropDownplateType: [] as any[],

  // 仓库
  dropDownStorage: [] as any[],
  // 前缀
  dropDowncodePrefix: [
    {
      value: 'ZZ',
      label: 'ZZ',
    },
    {
      value: 'TP',
      label: 'TP',
    },
    {
      value: 'PH',
      label: 'PH',
    },
    {
      value: 'ZC',
      label: 'ZC',
    },
  ],
});

// 是否显示dialog
const isDialogVisible = computed({
  get() {
    return props.visible;
  },
  set(newValue) {
    emit('update:visible', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
  },
});
//#region onMounted
onMounted(async () => {
  await getStorageList();
  await getPlateType();
  // await getConsignorList();
});
//#endregion

// 重置
const onReset = () => {
  state.formData = {
    storageId: '',
    storageName: '', // 仓库名称
    plateType: '', // 容器类型
    codePrefix: '', // 编号前缀
    // serialDigit: null, // 流水号位数
    generate: 1,
    plateSpec: '', // 容器规格
  };
};

// 获取仓库
const getStorageList = async () => {
  const url = '/basic/storage/storage/getList';
  const params = {};
  const [err, res] = await to(postData(url, params, false));
  if (res?.result) {
    state.dropDownStorage = res.data;
  }
};
// 获取容器类型
const getPlateType = async () => {
  const url = '/basic/storage/plate/getPlateType';
  const params = {};

  const [err, res] = await to(postData(url, params, false));
  if (res?.result) {
    state.dropDownplateType = res.data;
  }
};

// 生成容器号
const createCode = async () => {
  if (!state.formData.storageId) {
    proxy.$message.info('请选择仓库名称！');
    return false;
  }
  if (!state.formData.plateType) {
    proxy.$message.info('请选择容器类型！');
    return false;
  }
  if (!state.formData.codePrefix) {
    proxy.$message.info('请选择容器前缀！');
    return false;
  }
  if (!state.formData.generate || state.formData.generate < 1) {
    proxy.$message.info('生成数量最少为1！');
    return false;
  }
  const url = '/basic/storage/plate/createPlantCode';
  const params = {
    storageId: state.formData.storageId,
    storageName: state.formData.storageName, // 仓库名称
    plateType: state.formData.plateType, // 容器类型
    codePrefix: state.formData.codePrefix, // 编号前缀
    generate: state.formData.generate,
    plateSpec: state.formData.plateSpec,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res?.result) {
    isDialogVisible.value = false;
    onReset();
    emit('on-closed'); // 关闭窗口事件
  }
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
