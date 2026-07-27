<template>
  <div v-loading="state.isLoading" class="dialog-container">
    <el-dialog v-model="currentDialogVisible" :top="common.getDialogTop()" :destroy-on-close="true" title="单据打印操作" class="dialog-container" width="900px" draggable @opened="dialogOpened">
      <el-form :label-width="state.formLabelWidth">
        <el-form-item label="选择模板">
          <template v-for="item in state.printTemplateList" :key="item.printTemplateId">
            <el-radio v-model="state.printTemplateId" :label="item.printTemplateId" border>{{ item.templateName }}</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="自动打印">
          <el-switch v-model="state.autoPrint" @change="changePrint"></el-switch>
        </el-form-item>
      </el-form>
      <!-- 插件 -->
      <slot name="print-bottom-slot"> </slot>
      <iframe v-if="state.autoPrint" id="bdIframe" ref="iframe" src="" frameborder="0" scrolling="auto" height="300" width="100%"></iframe>
      <div slot="footer" class="dialog-footer">
        <el-button @click="currentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="customPrintBill">打印单据</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="custom-print">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { Local } from '/@/utils/storage';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 事件定义
const emit = defineEmits(['on-close', 'update:visible']);

//#region 定义属性
const props = defineProps({
  // 显示对话框
  visible: {
    type: Boolean,
    default: false,
    required: true,
  },
  // 管理列表dataOptions参数
  dataOptions: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 选中行集合
  dataListSelections: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 当前按钮参数
  printOptions: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 自定义打印确认事件
  onCustomPrint: {
    type: Function,
    default: null,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  formLabelWidth: '120px',
  printTemplateList: [] as any[],
  // 模板ID
  printTemplateId: 0,
  // 自动打印
  autoPrint: true,
  // 加载loading
  isLoading: false,
});

//#region 计算属性
// 显示对话框
const currentDialogVisible = computed({
  get: function () {
    return props.visible;
  },
  set: function (val) {
    emit('update:visible', val);
  },
});
//#endregion

onMounted(() => {
  // 加载默认值
  state.autoPrint = localStorage['autoPrint'] === 'true';
  window.closePrintDialog = closeDialog;
});

// 单据打印
const customPrintBill = () => {
  state.isLoading = true;
  if (!state.printTemplateId) {
    proxy.$message.error('模板不能为空！');
    return;
  }
  // 自定义打印确认事件
  if (props.onCustomPrint) {
    props.onCustomPrint(props.dataOptions, state.printTemplateId);
    return;
  }

  let key = 'printTemplateId-' + props.dataOptions.menuId;
  Local.set(key, state.printTemplateId);

  const idField = props.dataOptions.idField;
  var ids = props.dataListSelections.map((item: any) => item[idField]);
  if (!ids.length) {
    proxy.$message.error('至少选择一项！');
    return;
  }
  // 打印模版信息
  let printInfo = state.printTemplateList.find((item: any) => item.printTemplateId === state.printTemplateId);
  if (printInfo.printTemplateType === 'baskreport') {
    // 调用baskreport打印
    for (let id of ids) {
      var data = encodeURIComponent(JSON.stringify({ [idField]: id }));

      let url = printInfo.url.replace('${id}', data);
      window.open(url);
    }
    return;
  }

  var params = Object.assign({}, props.dataOptions);

  key = proxy.common.getGUID();
  sessionStorage[key] = JSON.stringify(params);

  const url = `/system/print/base-template-id/${props.dataOptions.menuId}/${state.printTemplateId}/${ids.join(',')}?key=${key}&autoPrint=${state.autoPrint}&isAutoLoad=true`;
  if (state.autoPrint) {
    const oIframe: any = document.getElementById('bdIframe');
    oIframe.src = url;
    // oIframe.addEventListener(
    //   "load",
    //   () => {
    //     window.setTimeout(() => {
    //       state.common.loaded(true);
    //       state.currentDialogVisible = false;
    //     }, 5 * 1000);
    //   },
    //   false
    // );
  } else {
    state.isLoading = false;
    window.open(url);
  }
};

// 获取模板
const getTemplateList = async () => {
  const url = '/system/core/printTemplate/getTemplateListByMenuId';
  const params = {
    menuId: props.dataOptions.menuId,
  };
  let key = 'printTemplateId-' + props.dataOptions.menuId;
  state.printTemplateId = Local.get(key);

  const [err, res] = await to(postData(url, params, false));
  if (err) {
    return;
  }
  state.printTemplateList = res.data;
  // 拼接在UI设计器中设置的URL地址，例如baskreport地址
  let baskReportUrl = props.printOptions.baskReportUrl;
  if (baskReportUrl) {
    try {
      let baskReportUrlObj = JSON.parse(baskReportUrl);
      if (Array.isArray(baskReportUrlObj)) {
        state.printTemplateList.push(
          ...baskReportUrlObj.map((m, index) => {
            return {
              printTemplateId: 'baskreport-' + index,
              printTemplateType: 'baskreport',
              templateName: m.title,
              url: m.url,
            };
          })
        );
      } else {
        state.printTemplateList.push({
          printTemplateId: 'baskreport-' + 0,
          printTemplateType: 'baskreport',
          templateName: baskReportUrlObj.title,
          url: baskReportUrlObj.url,
        });
      }
    } catch (error) {}
  }

  if (state.printTemplateList.length && !state.printTemplateId) {
    state.printTemplateId = state.printTemplateList[0].printTemplateId;
  }
};

// 对话框打开时
const dialogOpened = () => {
  getTemplateList();
};

// 关闭对话框
const closeDialog = () => {
  state.isLoading = false;
  currentDialogVisible.value = false;
};

// 改变自动打印
const changePrint = () => {
  localStorage['autoPrint'] = state.autoPrint;
};
</script>
