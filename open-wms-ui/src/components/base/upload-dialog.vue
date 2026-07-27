<template>
  <div class="upload-contianer">
    <el-dialog v-model="currentDialogVisible" :width="700" title="上传文件对话框" draggable>
      <!--自定义对话框标题，可拖动-->
      <template #title>
        <div v-drag>上传文件对话框</div>
      </template>
      <upload-file v-model="state.fileList" :options="options"></upload-file>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="currentDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="fileClick"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="upload-file">
import { toRefs, reactive, getCurrentInstance, onMounted, computed, ComponentInternalInstance } from 'vue';
import UploadFile from '/@/components/base/UploadFile.vue';
import { BaseProperties } from '/@/types/base-type';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:modelValue', 'on-upload-after', 'on-closed']);

//#region 定义属性
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  // 参数配置
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

//#region 变量
const state = reactive({
  fileList: [] as any[],
});
//#endregion

let currentDialogVisible = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emit('update:modelValue', val);
  },
});

onMounted(() => {});

const fileClick = () => {
  if (!state.fileList.length) {
    proxy.$message.error('请选择要上传的文件');
    return;
  }
  currentDialogVisible.value = false;
  emit('on-closed', state.fileList); // 关闭窗口事件
};
</script>
