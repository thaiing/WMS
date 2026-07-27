<template>
  <div>
    <el-dialog draggable v-model="currentVisible" title="销售等级设置" width="20%" class="dialog-container">
      <el-form ref="form" class="mt-20">
        <!-- <el-form-item label="发货日期">
          <el-date-picker v-model="state.deliveryDate" type="date" placeholder="Pick a day" />
        </el-form-item> -->

        <el-form-item :label="$tt('Level C Shop')">
          <el-input-number v-model="state.formData.gradeC" class="mx-4" controls-position="right" style="max-width: 180px" />
        </el-form-item>
        <el-form-item :label="$tt('Level B Shop')">
          <el-input-number v-model="state.formData.gradeB" class="mx-4" controls-position="right" style="max-width: 180px" />
        </el-form-item>
        <el-form-item :label="$tt('Level A Shop')">
          <el-input-number v-model="state.formData.gradeA" class="mx-4" controls-position="right" style="max-width: 180px" />
        </el-form-item>
        <el-form-item :label="$tt('Level S Shop')">
          <el-input-number v-model="state.formData.gradeS" class="mx-4" controls-position="right" style="max-width: 180px" />
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

<script setup lang="ts" name="sales-level-setting">
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
});
//#endregion

//#region 定义变量
const state = reactive({
  deliveryDate: new Date(),
  formData: {
    gradeC: '',
    gradeB: '',
    gradeA: '',
    gradeS: '',
  } as any,
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
// 等级判断
const save = async () => {
  if (!state.formData.gradeC) {
    proxy.$message.error('请输入Level C Shop！');
    return;
  }
  if (!state.formData.gradeA) {
    proxy.$message.error('请输入Level A Shop！');
    return;
  }
  if (!state.formData.gradeB) {
    proxy.$message.error('请输入Level B Shop！');
    return;
  }
  if (!state.formData.gradeS) {
    proxy.$message.error('请输入Level S Shop！');
    return;
  }
  const url = '/composite/basic/baseConsignorComposite/saveGrade';

  const [err, res] = await to(postData(url, state.formData));
  if (err) return;
  proxy.$message.success('等级匹配成功！');
  currentVisible.value = false;
  emit('on-closed'); // 关闭窗口事件
};

// 接受货主id
const initData = async () => {
  const url = '/composite/basic/baseConsignorComposite/getGrade';

  const [err, res] = await to(postData(url, {}));
  if (err) return;
  // state.formData.consignorId = consignorId;
  state.formData.gradeA = res.data.dataList.salesLevelA;
  state.formData.gradeB = res.data.dataList.salesLevelB;
  state.formData.gradeC = res.data.dataList.salesLevelC;
  state.formData.gradeS = res.data.dataList.salesLevelS;
};

// 对外暴露属性和方法
defineExpose({
  initData,
});
</script>
