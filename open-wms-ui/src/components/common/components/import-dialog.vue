<template>
  <el-dialog v-model="currentDialogVisible" :title="title + ` - 导入模板ID：${importOptions.importId}`" class="import-dialog-container" width="980px" draggable append-to-body @close="dialogClose">
    <el-row :gutter="10">
      <el-col :span="10">
        <!-- 上传到服务器-->
        <el-upload ref="uploadRef" name="file" :limit="1" :auto-upload="false" :before-upload="beforeUpload" :on-exceed="onExceed" :data="state.uploadData" :file-list="state.fileList" :action="serverAction" :headers="headers" :on-success="onSuccess" :accept="state.importConfig.accept || '.xlsx'" class="upload-demo" drag>
          <svg-icon name="icon-yunshangchuan_o" :size="60"></svg-icon>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              {{ state.importConfig.uploadTip || '只能上传xlsx文件，且不超过2Mb' }}
            </div>
          </template>
        </el-upload>
      </el-col>
      <el-col :span="14">
        <el-alert :closable="false" :title="state.importConfig.errorTip || '可以根据下面红色提示提示，对excel数据做相应调整'" type="success" class="alert-msg"></el-alert>
        <div class="body-content">
          <slot />
        </div>
        <el-scrollbar ref="scrollbarRef" :noresize="false" :native="false" wrap-class="scrollbar-wrap">
          <ul class="msg-container">
            <template v-for="(item, index) in state.msgList">
              <li class="msg-item" v-html="item"></li>
            </template>
          </ul>
        </el-scrollbar>
        <div ref="loading"></div>
      </el-col>
    </el-row>
    <template #footer>
      <span class="flex-end">
        <el-button @click="currentDialogVisible = false">关闭</el-button>
        <el-button v-if="isShowTemplateButton" type="success" icon="Bottom" @click="downLoadTemplate">下载模板</el-button>
        <el-button :loading="state.isImporting" type="primary" icon="Check" @click="startImport">{{ state.importConfig.buttonText || '开始导入' }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="import-dialog">
import { ComponentInternalInstance, ref } from 'vue';
import { BaseProperties, DataOptions } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { globalHeaders } from '/@/utils/request';
import { genFileId } from 'element-plus';
import type { UploadInstance, ScrollbarInstance, UploadProps, UploadRawFile } from 'element-plus';
import { DetailInfo } from '/@/api/types';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 事件定义
const emit = defineEmits(['on-close', 'update:visible']);
const headers = ref(globalHeaders());

const uploadRef = ref<UploadInstance>();
const scrollbarRef = ref<ScrollbarInstance>();

//#region 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: null,
  },
  // 数据参数
  dataOptions: {
    type: Object as PropType<DataOptions>,
    default: () => {
      return {
        total: 10,
      };
    },
  },
  importOptions: {
    type: Object,
    default: () => {
      return {
        visible: false,
        label: '批量导入',
        url: '/api/common/uploadSingleFile',
        importId: 0,
        menuId: 0, // 模块ID
        tableName: '', // 表名
        detailInfo: {} as DetailInfo,
      };
    },
  },
  importData: {
    type: Function,
    default: () => {
      return () => {};
    },
  },
  // 导入前事件
  beforeImportSubmit: {
    type: Function,
    default: () => {
      return () => {};
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  importConfig: {
    // 显示导入对话框
    isShowDialog: false,
    title: '数据导入',
    // 上传接口地址
    url: '',
    // 上传地址
    // fileUrl:"\upload\",
    // 按钮名称
    buttonText: '开始上传',
    // 提示描述
    errorTip: '可以根据下面红色提示提示，对excel数据做相应调整',
    // 上传提示
    uploadTip: '只能上传xlsx文件，且不超过2Mb',
    // 上传文件格式
    accept: '.xlsx',
    isShowTemplateButton: true, // 设为false不显示下载模板按钮
    // 不异步加载消息
    noMsg: false,
    // 上传到阿里云
    isAliOss: false,
  },
  // 上传附加字段信息
  uploadData: {
    folder: 'import',
    importId: 0, // 导入配置ID
    mainId: 0, // 主表ID值
    key: '',
    menuId: 0, // 模块ID
    tableName: '', // 表面
  },
  // 上传后文件服务器路径
  fileUrl: null,
  fileList: [] as any[],
  // 正在导入
  isImporting: false,
  // 消息内容
  msgList: [] as any[],
  // 导入获得消息interval handle
  intervalHandler: 0,
  // 导入key
  uploadKey: '',
});
//#endregion

//#region 计算属性
// 标题
const title = computed(() => {
  return state.importConfig.title || '批量导入操作';
});
// 显示窗口
const currentDialogVisible = computed({
  get: function () {
    return props.visible;
  },
  set: function (val) {
    emit('update:visible', val);
  },
});
// 上传接口地址
const serverAction = computed(() => {
  let prefixRouter = props.dataOptions.prefixRouter || props.importOptions.prefixRouter;
  let url = prefixRouter + '/importData'; // 主表导入

  // 明细表导入
  if (props.importOptions.detailInfo) {
    url = props.importOptions.detailInfo.options.prefixRouter + '/importData';
  }
  return import.meta.env.VITE_APP_BASE_API + url;
});
// 显示导入模板按钮
const isShowTemplateButton = computed(() => {
  // menuId=1888时,干线运输单导入弹窗下载模板按钮隐藏
  if (state.uploadData.menuId === 1888) {
    state.importConfig.isShowTemplateButton = true; // 为true时，隐藏
    return;
  }
  if (!state.importConfig.isAliOss) {
    const url = '/api/common/uploadSingleFile';
    return proxy.common.domain + url;
  } else {
    return '';
  }
});
//#endregion

//#region wacth
watch(
  () => props.importOptions,
  (newVal) => {
    state.uploadData.importId = props.importOptions.importId;
    state.uploadData.mainId = props.importOptions.mainId;
    state.uploadData.menuId = props.importOptions.menuId;
    state.uploadData.tableName = props.importOptions.tableName;
    state.uploadData.key = state.uploadKey;
  },
  { deep: true, immediate: true }
);
//#endregion

onMounted(() => {});

// 开始导入数据
const startImport = async () => {
  state.msgList = [];

  // 导入前事件
  const reVal = props.beforeImportSubmit();
  if (reVal === false) return;
  window.clearTimeout(state.intervalHandler);
  state.intervalHandler = 0;

  uploadRef.value!.submit();
};

// 获得导入消息
const getMsg = async () => {
  state.isImporting = true;
  // 获得同步消息
  let url = '/system/core/common/getMsg';
  const params = {
    key: state.uploadKey,
  };
  let headers = {
    noLoading: true,
  };
  const [err, res] = await to(postData(url, params, headers));
  state.isImporting = false;
  if (err) {
    return;
  }
  // 自动滚动到最后一行
  window.setTimeout(() => {
    const div = scrollbarRef.value!.scrollTo(10000);
  }, 1500);
  if (!res.result) {
    window.clearInterval(state.intervalHandler);
    state.intervalHandler = 0;
    if (Array.isArray(res.data)) {
      state.msgList = state.msgList.concat(res.data);
    }
    return;
  }
  if (Array.isArray(res.data)) {
    state.msgList = state.msgList.concat(res.data.filter((item: any) => item !== '-1'));
    const isFinished = res.data.some((item: any) => item && item === '-1');
    if (isFinished) {
      window.clearTimeout(state.intervalHandler);
      state.intervalHandler = 0;
      return;
    }
  }
  state.intervalHandler = window.setTimeout(getMsg, 2000);
};

// 上传前事件
const beforeUpload = () => {
  state.uploadKey = proxy.common.getGUID();
  state.uploadData.key = state.uploadKey;

  window.clearTimeout(state.intervalHandler);
  state.intervalHandler = 0;
  state.msgList = [];
  state.fileUrl = null;
};

// 文件选择超上限
const onExceed: UploadProps['onExceed'] = (files) => {
  // proxy.$message.error('只能选择一个文件上传，请先删除已经上传的文件！');
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};

// 文件上传成功
const onSuccess = (res: any) => {
  proxy.common.showMsg(res);
  getMsg();
  state.fileList = [];
};

// 下载模板
const downLoadTemplate = async () => {
  let url = '/system/dataHandler/import/importTemplate';
  let params = {
    importId: props.importOptions.importId,
  };
  proxy?.download(url, params);
};

// 关闭窗口
const dialogClose = () => {
  window.clearTimeout(state.intervalHandler);
  state.intervalHandler = 0;
  emit('on-close'); // 关闭事件
};
</script>

<style lang="scss" scoped>
:deep(.scrollbar-wrap) {
  max-height: 400px;
  overflow-x: hidden;
  padding: 0px;
  padding-bottom: 30px !important;
  padding-top: 0px !important;
}
.import-dialog-container {
  :deep(.el-upload-list) {
    margin-right: 20px;
  }
  .msg-container {
    margin: 0;
    padding: 0;
    .msg-item {
      margin: 0;
      padding: 5px 0;
      word-wrap: break-word;
    }
  }
  .body-content {
    margin-top: 20px;
  }
}
</style>
