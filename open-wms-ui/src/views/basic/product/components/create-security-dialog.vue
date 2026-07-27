<template>
  <el-dialog v-model="currentVisible" title="批量导出操作" class="dialog-container" draggable>
    <el-form label-width="120px">
      <el-form-item label="产品名称">
        <el-input v-model="state.productInfo.productName" class="w-250" placeholder="请输入产品名称" disabled></el-input>
      </el-form-item>
      <!-- <el-form-item label="单位">
          <el-select v-model="state.productInfo.unit" placeholder="请选择单位" class="w-250">
            <el-option v-for="(item, index) in dropDownList_unit" :key="index" :label="item.value01" :value="item.value02"></el-option>
          </el-select>
        </el-form-item> -->
      <el-form-item label="批次名称">
        <el-input v-model="state.productInfo.batchNumber" class="w-250" placeholder="请输入批次名称"></el-input>
      </el-form-item>
      <el-form-item label="批次编号">
        <el-input v-model="state.productInfo.batchCode" class="w-250" placeholder="请输入批次编号"></el-input>
      </el-form-item>
      <el-form-item label="生产企业">
        <el-input v-model="state.productInfo.produceEnterprise" class="w-250" placeholder="请输入生产企业" disabled></el-input>
      </el-form-item>
      <el-form-item label="原产地">
        <el-input v-model="state.productInfo.originPlace" class="w-250" placeholder="请输入原产地" disabled></el-input>
      </el-form-item>
      <el-form-item label="生成标签数量">
        <el-input v-model="state.productInfo.quantity" type="number" class="w-250" placeholder="请输入生成标签数量"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="state.productInfo.remark" class="w-250" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="上传图片" class="margin-bottom-10">
        <upload-file v-model="state.productInfo.productImageUrl" :options="options"></upload-file>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="currentVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts" name="shelve-create">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';

const emit = defineEmits(['update:visible', 'closed']);
//#region 定义属性
const props = defineProps({
  visible: Boolean,
  options: {
    type: Object,
    default: () => {
      return {
        multiple: true,
        disabled: false,
        listType: 'text', // text/picture/picture-card
        buttonType: 'text',
      };
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  productInfo: {} as any,
});

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

const initData = async (productInfo: any) => {
  state.productInfo = productInfo;
};

const save = async () => {
  if (!state.productInfo.batchNumber) {
    proxy.$message.error('批次名称不能为空');
    return;
  }
  if (!state.productInfo.batchCode) {
    proxy.$message.error('批次编号不能为空');
    return;
  }
  if (!state.productInfo.quantity) {
    proxy.$message.error('生成标签数量不能为空');
    return;
  }

  state.productInfo.productImageUrl = state.productInfo.productImageUrl ? state.productInfo.productImageUrl[0].url : null;
  state.productInfo.expandFields = null;

  proxy
    .$confirm('提示：确认生成防伪码', '生成防伪码', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/basic/product/productSecurity/createSecurity';
      const params = state.productInfo;

      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      proxy.common.showMsg(res);
      if (res.result) {
        currentVisible.value = false;
        emit('closed');
      }
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};

// 对外暴露属性和方法
defineExpose({
  initData,
});
</script>
