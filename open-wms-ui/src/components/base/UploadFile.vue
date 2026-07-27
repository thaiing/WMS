<template>
  <div class="upload-file-container">
    <el-upload ref="upload-file" :action="uploadImgUrl" :headers="headers" :before-upload="(file:any) => beforeAvatarUpload(file)" :multiple="props.options.multiple" :on-preview="(file:any) => handlePicPreview(file)" :on-success="(res:any, file:any) => handleUploadSuccess(res, file)" :on-remove="handlePicRemove" :disabled="props.options.disabled" :file-list="picList" :list-type="props.options.listType" :class="{ 'hide-button': props.options.readonly }" class="upload-file" :show-file-list="!props.options.hiddenFileList" :accept="(props.options.acceptList || []).join(',')">
      <template #trigger>
        <i v-if="props.options.listType === 'picture-card'" class="icon-jiahao1"></i>
        <el-button v-if="props.options.listType !== 'picture-card'" size="small" type="primary">点击上传</el-button>
      </template>
      <slot :name="'file-' + props.options.prop" :file-list="picList"></slot>
    </el-upload>

    <!--预览图片-->
    <el-dialog v-model="state.dialogPicVisible" append-to-body>
      <img :src="state.dialogImageUrl" style="width: 800px; height: 800px; object-fit: scale-down" alt="" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="upload-file">
import { ComponentInternalInstance, ref } from 'vue';
import useDropdownStore from '/@/stores/modules/dropdown';
import { BaseProperties } from '/@/types/base-type';
import { globalHeaders } from '/@/utils/request';
import { UploadFile } from 'element-plus';
const dropdownStore = useDropdownStore();

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:modelValue', 'on-upload-after']);

//#region 定义属性
const props = defineProps({
  // 上传文件绑定值
  modelValue: {
    type: Array,
    default: () => {
      return [] as any[];
    },
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
        fileType: ['xls', 'xlsx', 'doc', 'docx', 'pdf', 'jpeg', 'jpg', 'png', 'bmp', 'gif', 'zip', 'mp3', 'mp4'], // 文件类型
      };
    },
  },
});
//#endregion

const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadImgUrl = ref(baseUrl + '/system/core/oss/upload'); // 上传的图片服务器地址
const headers = ref(globalHeaders());

//#region 定义变量
const state = reactive({
  uploadFiles: '',
  dialogImageUrl: '',
  dialogPicVisible: false,
});
//#endregion

//#region 计算属性
const picList = computed({
  get() {
    return props.modelValue as any[];
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});
//#endregion

// 预览图片
const handlePicPreview = (file: any) => {
  if (props.options.listType === 'text') {
    window.open(file.url);
  } else {
    state.dialogImageUrl = file.url;
    state.dialogPicVisible = true;
  }
};

// 上传成功回调
const handleUploadSuccess = (res: any, file: UploadFile) => {
  if (res.code === 200) {
    const list = picList.value;
    list.push({
      name: res.data.fileName,
      url: res.data.url,
    });
    picList.value = list; // 排除掉raw文件
    emit('on-upload-after', file, state.uploadFiles);
  } else if (res.code === 401) {
    proxy.$message.error(res.msg);
  }
};
/**
 * 图片限制
 */
const beforeAvatarUpload = (file: any) => {
  if (!props.options.multiple) {
    if (picList.value.length >= 1) {
      proxy.$message.error('已存在文件，请先删除然后重新上传');
      return false;
    }
  }
  if (props.options.listType === 'text') {
    const names = file.name.split('.');
    const extName = names[names.length - 1];
    const isLt5MB = file.size / 1024 / 1024 < 5;
    const type = ['jpeg', 'jpg', 'png', 'bmp', 'jfif', 'gif', 'xls', 'xlsx', 'doc', 'docx', 'pdf', 'zip', 'rar', 'mp3', 'mp4', 'svg', 'vsdx'];
    if (type.indexOf(extName) < 0) {
      proxy.$message.error('只能上传' + type.join(',') + '格式文档!');
    }
    if (!isLt5MB) {
      proxy.$message.error('大小不能超过 5MB!');
    }
    return type.indexOf(extName) >= 0 && isLt5MB;
  } else {
    const names = file.name.split('.');
    const extName = names[names.length - 1];
    const isLt5MB = file.size / 1024 / 1024 < 5;
    const type = ['jpeg', 'jpg', 'png', 'bmp', 'jfif', 'gif'];
    if (type.indexOf(extName) < 0) {
      proxy.$message.error('上传图片只能是' + type.join(',') + '格式!');
    }
    if (!isLt5MB) {
      proxy.$message.error('单张图片大小不能超过 5MB!');
    }
    return type.indexOf(extName) >= 0 && isLt5MB;
  }
};

// 图片删除
const handlePicRemove = (file: any, fileList: any) => {
  let urlList = fileList.map((item: any) => {
    return item.response ? item.response.Data.Url : item.url;
  });
  state.uploadFiles = urlList.join(',');
};
</script>

<style lang="scss" scoped>
.upload-file-container {
  padding: 10px;
}
</style>
