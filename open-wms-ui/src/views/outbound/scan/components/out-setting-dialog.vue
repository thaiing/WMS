<template>
  <el-dialog v-model="currentDialogVisible" :top="common.getDialogTop()" title="应用场景设置" class="dialog-container" width="1000px" draggable overflow append-to-body>
    <div class="setting-container">
      <div class="container-left">
        <div class="left-item" :class="{ active: state.currentScene === 'scan' }" @click="selectScene('scan')">
          <div class="item-title">扫单出库</div>
          <div class="item--sub-title">扫描出库单号直接出库，极简模式，无需核验条码</div>
        </div>
        <div class="left-item" :class="{ active: state.currentScene === 'validate' }" @click="selectScene('validate')">
          <div class="item-title">验码出库</div>
          <div class="item--sub-title">扫描出库单号后，需要校验条码</div>
        </div>
        <div class="left-item" :class="{ active: state.currentScene === 'multi' }" @click="selectScene('multi')">
          <div class="item-title">多品一箱</div>
          <div class="item--sub-title">扫描出库单号后，进行混合装箱操作</div>
        </div>
        <div class="left-item" :class="{ active: state.currentScene === 'single' }" @click="selectScene('single')">
          <div class="item-title">一品一箱</div>
          <div class="item--sub-title">扫描出库单号后，进行一个商品装一下操作</div>
        </div>
        <div v-for="(item, index) in state.customScenes" :key="item.id" class="left-item custom-scene-item" :class="{ active: state.currentScene === `custom_${item.id}` }" @click="selectCustomScene(item)">
          <div class="item-title">{{ item.name }}</div>
        </div>
      </div>
      <div class="container-right">
        <el-form :model="state.config" label-width="120px">
          <el-form-item label="商品校验">
            <el-switch v-model="state.config.isValidateProductCode" />
          </el-form-item>
          <el-form-item label="开启包材">
            <el-switch v-model="state.config.isOpenWrapperBarcode" />
          </el-form-item>
          <el-form-item label="开启多包材">
            <el-switch v-model="state.config.isManyWrapperBarcode" />
          </el-form-item>
          <el-form-item label="装箱模式">
            <el-radio-group v-model="state.config.caseMode" @change="caseModeChange">
              <el-radio :label="0">未开启</el-radio>
              <el-radio :label="1">一品一箱</el-radio>
              <el-radio :label="2">多品一箱</el-radio>
              <el-radio :label="3">多单一箱</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="打印单据">
            <el-checkbox-group v-model="state.config.printBill">
              <el-checkbox value="expressBill" name="type">打印物流面单</el-checkbox>
              <el-checkbox value="orderList" name="type">打印出库清单</el-checkbox>
              <!-- <el-checkbox value="caseList" name="type">打印装箱清单</el-checkbox>
              <el-checkbox value="caseLabel" name="type">打印箱标签</el-checkbox>
              <el-checkbox value="caseNumber" name="type">打印箱号</el-checkbox> -->
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="是否自动打印">
            <el-checkbox-group v-model="state.config.autoPrintBill">
              <el-checkbox value="expressBill" name="autoPrint">打印物流面单</el-checkbox>
              <el-checkbox value="orderList" name="autoPrint">打印出库清单</el-checkbox>
              <!-- <el-checkbox value="caseList" name="autoPrint">打印装箱清单</el-checkbox>
              <el-checkbox value="caseLabel" name="autoPrint">打印箱标签</el-checkbox>
              <el-checkbox value="caseNumber" name="autoPrint">打印箱号</el-checkbox> -->
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="打印模板设置">
            <el-table :data="state.config.billPrintSettings" style="width: 100%" size="normal">
              <el-table-column prop="index" label="序号" align="center" width="65" />
              <el-table-column prop="name" label="打印名称" width="120" />
              <el-table-column prop="template" label="关联模板" width="180">
                <template #default="{ row }">
                  <el-select v-model="row.templateName" placeholder="选择打印模板" style="width: 100%">
                    <el-option v-for="item in getTemplateListFilter(row.templateType)" :key="item.printTemplateId" :label="item.templateName" :value="item.printTemplateId" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="printName" label="打印机名称">
                <template #default="{ row }">
                  <el-select v-model="row.printName" placeholder="选择打印机" style="width: 100%">
                    <el-option v-for="item in state.printList" :key="item.printName" :label="item.printName" :value="item.printName" />
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <span class="flex-end">
        <el-button v-if="state.currentScene.startsWith('custom_') && state.currentCustomSceneId" @click="deleteCustomScene" type="danger">删除自定义场景</el-button>
        <el-button @click="saveCustomScene" type="success">保存自定义场景</el-button>
        <el-button @click="currentDialogVisible = false">取 消</el-button>
        <el-button :loading="state.isLoading" type="primary" icon="ele-Select" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="inbound-scan-order">
import { ComponentInternalInstance, nextTick } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy: BaseProperties = ins.proxy as BaseProperties;
import { getLodop } from '/@/utils/lodopFuncs.js';
import { DataType, QueryBo, QueryType } from '/@/types/common';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
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
  // 当前选中的场景
  currentScene: 'scan' as string,
  // 表单是否禁用
  isFormDisabled: true,
  // 自定义场景列表
  customScenes: [] as Array<{ id: string; name: string; config: any }>,
  // 当前选中的自定义场景ID
  currentCustomSceneId: null as string | null,
  // 是否正在恢复场景（防止 watch 覆盖）
  isRestoringScene: false,
  config: {
    isValidateProductCode: true,
    isOpenWrapperBarcode: false,
    isManyWrapperBarcode: false,
    isOpenCase: false,
    printBill: [],
    autoPrintBill: [],
    caseMode: 0,
    billPrintSettings: [
      {
        index: 1,
        name: '打印物流面单',
        templateType: '物流单',
        templateName: '',
        printName: '',
      },
      {
        index: 2,
        name: '打印箱标签',
        templateType: '箱标签',
        templateName: '',
        printName: '',
      },
      {
        index: 3,
        name: '打印装箱清单',
        templateType: '订单详情',
        templateName: '',
        printName: '',
      },
      {
        index: 4,
        name: '打印出库清单',
        templateType: '订单详情',
        templateName: '',
        printName: '',
      },
    ],
  },
  templateList: [] as Array<Record<string, any>>,
  printList: [] as Array<Record<string, any>>,
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

// 合并 billPrintSettings，保留用户配置的值和顺序
const mergeBillPrintSettings = (userSettings: any[], defaultSettings: any[]) => {
  if (!userSettings || userSettings.length === 0) {
    return JSON.parse(JSON.stringify(defaultSettings));
  }

  // 如果用户配置的数量和默认配置一致，直接使用用户配置（保留顺序和值）
  if (userSettings.length === defaultSettings.length) {
    // 验证结构是否一致（通过 name 匹配）
    const userNames = userSettings.map((item) => item.name).sort();
    const defaultNames = defaultSettings.map((item) => item.name).sort();
    if (JSON.stringify(userNames) === JSON.stringify(defaultNames)) {
      return JSON.parse(JSON.stringify(userSettings));
    }
  }

  // 如果不一致，按 name 匹配合并，保留默认顺序
  const merged = defaultSettings.map((defaultItem) => {
    const userItem = userSettings.find((item) => item.name === defaultItem.name);
    if (userItem) {
      // 保留用户配置的值，但确保结构完整
      return {
        ...defaultItem,
        templateName: userItem.templateName || defaultItem.templateName,
        printName: userItem.printName || defaultItem.printName,
      };
    }
    return { ...defaultItem };
  });

  return merged;
};

watch(
  () => props.scanSetting,
  (val: any) => {
    if (!val || state.isRestoringScene) {
      return; // 正在恢复场景时，不处理 watch
    }

    // 合并 billPrintSettings，保留用户配置
    if (val.billPrintSettings && Array.isArray(val.billPrintSettings) && val.billPrintSettings.length > 0) {
      state.config.billPrintSettings = mergeBillPrintSettings(val.billPrintSettings, state.config.billPrintSettings);
    }

    // 更新其他配置
    if (val.caseMode !== undefined) {
      state.config.caseMode = val.caseMode;
      state.config.isOpenCase = !!val.caseMode;
    }
    if (val.printBill !== undefined) {
      state.config.printBill = val.printBill;
    }
    if (val.autoPrintBill !== undefined) {
      state.config.autoPrintBill = val.autoPrintBill;
    }
    if (val.isValidateProductCode !== undefined) {
      state.config.isValidateProductCode = val.isValidateProductCode;
    }
    if (val.isOpenWrapperBarcode !== undefined) {
      state.config.isOpenWrapperBarcode = val.isOpenWrapperBarcode;
    }
    if (val.isManyWrapperBarcode !== undefined) {
      state.config.isManyWrapperBarcode = val.isManyWrapperBarcode;
    }
  },
  { deep: true, immediate: true }
);

onMounted(async () => {
  await getPrintList();
  await getTemplateList();
  // 恢复之前选中的场景（内部会加载自定义场景列表）
  await restoreSelectedScene();
});

// 获得打印机列表
const getPrintList = () => {
  window.setTimeout(() => {
    const LODOP = getLodop();
    var iPrinterCount = LODOP.GET_PRINTER_COUNT();
    for (var i = 0; i < iPrinterCount; i++) {
      state.printList.push({
        index: i,
        printName: LODOP.GET_PRINTER_NAME(i),
      });
    }
  }, 1000);
};

// 获取打印模板
const getTemplateList = async () => {
  // 多条件查询
  let queryBoList: Array<QueryBo> = [
    {
      column: 'select',
      values: 'printTemplateId,templateName,templateType',
      queryType: QueryType.SELECT,
      dataType: DataType.STRING,
    },
    {
      column: 'templateType',
      values: '物流单,订单详情,箱标签',
      queryType: QueryType.IN,
      dataType: DataType.STRING,
    },
  ];

  let url = '/system/core/printTemplate/selectList';
  let params = queryBoList;

  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  if (res.result) {
    state.templateList = res.data;
  }
};

const getTemplateListFilter = (type: string) => {
  return state.templateList.filter((item) => item.templateType === type);
};

const save = async () => {
  currentDialogVisible.value = false;
  // 保存当前选中的场景信息和自定义场景列表到配置中（用于页面刷新后恢复选中状态）
  const configToSave = {
    ...state.config,
    currentScene: state.currentScene,
    currentCustomSceneId: state.currentCustomSceneId,
    customScenes: state.customScenes, // 同时保存自定义场景列表
  };
  console.log('保存设置 - 当前场景:', state.currentScene, '配置:', configToSave);
  // 后端需要 Map 格式，将 config 包装成 Map
  await common.setUserCache(UserCacheEnum.SCAN_OUT_SETTING, configToSave); // 保持设置
  // 发送给父组件的配置包含完整信息（包括场景信息），避免父组件保存时覆盖
  emit('scan-setting-change', { config: configToSave });
};

const caseModeChange = () => {
  state.config.isOpenCase = !!state.config.caseMode;
};

// 场景配置预设
const scenePresets = {
  scan: {
    isValidateProductCode: false,
    isOpenWrapperBarcode: false,
    isManyWrapperBarcode: false,
    caseMode: 0,
    printBill: [], // 扫单出库和验码出库：打印单据全部不勾选
    autoPrintBill: [], // 扫单出库和验码出库：是否自动打印全部不勾选
  },
  validate: {
    isValidateProductCode: true,
    isOpenWrapperBarcode: false,
    isManyWrapperBarcode: false,
    caseMode: 0,
    printBill: [], // 扫单出库和验码出库：打印单据全部不勾选
    autoPrintBill: [], // 扫单出库和验码出库：是否自动打印全部不勾选
  },
  multi: {
    isValidateProductCode: true,
    isOpenWrapperBarcode: false,
    isManyWrapperBarcode: false,
    caseMode: 2,
    printBill: ['expressBill', 'orderList'], // 多品一箱和一品一箱：打印单据全部勾选
    autoPrintBill: ['expressBill', 'orderList'], // 多品一箱和一品一箱：是否自动打印全部勾选
  },
  single: {
    isValidateProductCode: true,
    isOpenWrapperBarcode: false,
    isManyWrapperBarcode: false,
    caseMode: 1,
    printBill: ['expressBill', 'orderList'], // 多品一箱和一品一箱：打印单据全部勾选
    autoPrintBill: ['expressBill', 'orderList'], // 多品一箱和一品一箱：是否自动打印全部勾选
  },
};

// 选择场景
const selectScene = (sceneType: string, preserveConfig = false) => {
  state.currentScene = sceneType;
  state.currentCustomSceneId = null;
  // 所有场景都可以编辑
  state.isFormDisabled = false;

  const preset = scenePresets[sceneType as keyof typeof scenePresets];
  if (preset) {
    // 如果 preserveConfig 为 true，只更新预设相关的字段，保留其他配置（如打印设置）
    if (preserveConfig) {
      Object.assign(state.config, {
        isValidateProductCode: preset.isValidateProductCode,
        isOpenWrapperBarcode: preset.isOpenWrapperBarcode,
        isManyWrapperBarcode: preset.isManyWrapperBarcode,
        caseMode: preset.caseMode,
        printBill: preset.printBill || [],
        autoPrintBill: preset.autoPrintBill || [],
      });
    } else {
      // 应用预设配置，包括打印单据和自动打印设置
      Object.assign(state.config, {
        isValidateProductCode: preset.isValidateProductCode,
        isOpenWrapperBarcode: preset.isOpenWrapperBarcode,
        isManyWrapperBarcode: preset.isManyWrapperBarcode,
        caseMode: preset.caseMode,
        printBill: preset.printBill || [],
        autoPrintBill: preset.autoPrintBill || [],
      });
    }
    caseModeChange();
  }
};

// 选择自定义场景
const selectCustomScene = (scene: { id: string; name: string; config: any }) => {
  state.currentScene = `custom_${scene.id}`;
  state.currentCustomSceneId = scene.id;
  // 自定义场景也可以编辑
  state.isFormDisabled = false;

  // 应用自定义场景的配置
  if (scene.config) {
    // 深拷贝配置，避免引用问题
    const configCopy = JSON.parse(JSON.stringify(scene.config));

    // 合并 billPrintSettings，使用场景配置中的（因为那是保存时的配置）
    if (configCopy.billPrintSettings && Array.isArray(configCopy.billPrintSettings) && configCopy.billPrintSettings.length > 0) {
      state.config.billPrintSettings = mergeBillPrintSettings(configCopy.billPrintSettings, state.config.billPrintSettings);
    }

    // 更新其他配置字段
    if (configCopy.caseMode !== undefined) {
      state.config.caseMode = configCopy.caseMode;
      state.config.isOpenCase = !!configCopy.caseMode;
    }
    if (configCopy.printBill !== undefined) {
      state.config.printBill = configCopy.printBill;
    }
    if (configCopy.autoPrintBill !== undefined) {
      state.config.autoPrintBill = configCopy.autoPrintBill;
    }
    if (configCopy.isValidateProductCode !== undefined) {
      state.config.isValidateProductCode = configCopy.isValidateProductCode;
    }
    if (configCopy.isOpenWrapperBarcode !== undefined) {
      state.config.isOpenWrapperBarcode = configCopy.isOpenWrapperBarcode;
    }
    if (configCopy.isManyWrapperBarcode !== undefined) {
      state.config.isManyWrapperBarcode = configCopy.isManyWrapperBarcode;
    }

    caseModeChange();
  }
};

// 加载自定义场景列表
const loadCustomScenes = async () => {
  // 统一从 SCAN_OUT_SETTING 中读取自定义场景列表
  const cached = await common.getUserCache(UserCacheEnum.SCAN_OUT_SETTING);
  if (cached && cached.customScenes && Array.isArray(cached.customScenes)) {
    state.customScenes = cached.customScenes;
  }
  // 兼容旧数据：如果 SCAN_OUT_SETTING 中没有，尝试从 SCAN_OUT_CUSTOM_SCENES 读取
  if (state.customScenes.length === 0) {
    const oldCached = await common.getUserCache(UserCacheEnum.SCAN_OUT_CUSTOM_SCENES);
    if (oldCached) {
      if (oldCached.scenes && Array.isArray(oldCached.scenes)) {
        state.customScenes = oldCached.scenes;
      } else if (Array.isArray(oldCached)) {
        state.customScenes = oldCached;
      }
      // 迁移旧数据到新位置
      if (state.customScenes.length > 0) {
        const configToSave = {
          ...state.config,
          customScenes: state.customScenes,
        };
        await common.setUserCache(UserCacheEnum.SCAN_OUT_SETTING, configToSave);
      }
    }
  }
};

// 恢复之前选中的场景
const restoreSelectedScene = async () => {
  state.isRestoringScene = true;

  try {
    const cached = await common.getUserCache(UserCacheEnum.SCAN_OUT_SETTING);
    console.log('恢复场景 - 读取的缓存数据:', cached);

    if (cached) {
      // 先更新配置（排除场景信息和自定义场景列表）
      const { currentScene, currentCustomSceneId, customScenes, ...configData } = cached;

      // 加载自定义场景列表
      if (customScenes && Array.isArray(customScenes)) {
        state.customScenes = customScenes;
      } else {
        // 如果没有自定义场景列表，尝试从旧位置加载并迁移
        await loadCustomScenes();
      }

      // 更新配置数据
      if (configData && Object.keys(configData).length > 0) {
        // 合并 billPrintSettings，保留用户配置的顺序和值
        if (configData.billPrintSettings && Array.isArray(configData.billPrintSettings) && configData.billPrintSettings.length > 0) {
          state.config.billPrintSettings = mergeBillPrintSettings(configData.billPrintSettings, state.config.billPrintSettings);
        }

        // 更新其他配置字段
        if (configData.caseMode !== undefined) {
          state.config.caseMode = configData.caseMode;
          state.config.isOpenCase = !!configData.caseMode;
        } else {
          state.config.caseMode = 0;
          state.config.isOpenCase = false;
        }
        if (configData.printBill !== undefined) {
          state.config.printBill = configData.printBill;
        } else {
          state.config.printBill = [];
        }
        if (configData.autoPrintBill !== undefined) {
          state.config.autoPrintBill = configData.autoPrintBill;
        } else {
          state.config.autoPrintBill = [];
        }
        if (configData.isValidateProductCode !== undefined) {
          state.config.isValidateProductCode = configData.isValidateProductCode;
        }
        if (configData.isOpenWrapperBarcode !== undefined) {
          state.config.isOpenWrapperBarcode = configData.isOpenWrapperBarcode;
        }
        if (configData.isManyWrapperBarcode !== undefined) {
          state.config.isManyWrapperBarcode = configData.isManyWrapperBarcode;
        }
      }

      // 等待 watch 执行完成
      await nextTick();
      await nextTick(); // 双重 nextTick 确保 watch 执行完成

      // 恢复场景选择
      if (currentScene) {
        const savedScene = currentScene;
        const savedCustomSceneId = currentCustomSceneId;
        console.log('恢复场景 - 保存的场景:', savedScene, '自定义场景ID:', savedCustomSceneId);

        // 如果是自定义场景
        if (savedScene.startsWith('custom_') && savedCustomSceneId) {
          // 查找对应的自定义场景
          const customScene = state.customScenes.find((item) => item.id === savedCustomSceneId);
          if (customScene) {
            console.log('恢复场景 - 找到自定义场景:', customScene);
            selectCustomScene(customScene);
            return;
          }
        } else {
          // 预设场景：使用 preserveConfig=true 保留打印设置等配置
          const presetScenes = ['scan', 'validate', 'multi', 'single'];
          if (presetScenes.includes(savedScene)) {
            console.log('恢复场景 - 选择预设场景:', savedScene);
            selectScene(savedScene, true);
            return;
          }
        }
      } else {
        console.log('恢复场景 - 缓存中没有 currentScene，使用默认值');
      }
    }

    // 如果没有保存的场景信息，默认选中扫单出库
    await nextTick();
    selectScene('scan', true);
  } finally {
    // 延迟一下再设置为 false，确保场景恢复完成
    setTimeout(() => {
      state.isRestoringScene = false;
    }, 100);
  }
};

// 保存自定义场景
const saveCustomScene = async () => {
  // 弹出输入框让用户输入场景名称
  proxy
    .$prompt('请输入自定义场景名称', '保存自定义场景', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    .then(async ({ value }) => {
      if (!value || value.trim() === '') {
        proxy.$message.warning('场景名称不能为空');
        return;
      }

      const sceneId = `custom_${Date.now()}`;
      const newScene = {
        id: sceneId,
        name: value.trim(),
        config: JSON.parse(JSON.stringify(state.config)), // 深拷贝当前配置
      };

      state.customScenes.push(newScene);
      // 统一保存到 SCAN_OUT_SETTING 中
      const configToSave = {
        ...state.config,
        customScenes: state.customScenes,
        currentScene: state.currentScene,
        currentCustomSceneId: state.currentCustomSceneId,
      };
      await common.setUserCache(UserCacheEnum.SCAN_OUT_SETTING, configToSave);

      // proxy.$message.success('自定义场景保存成功');
      // 选中刚保存的场景
      selectCustomScene(newScene);
    })
    .catch(() => {
      // 用户取消
    });
};

// 删除自定义场景
const deleteCustomScene = () => {
  if (!state.currentCustomSceneId) {
    proxy.$message.warning('请先选择一个自定义场景');
    return;
  }

  proxy
    .$confirm('确定要删除当前自定义场景吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      state.customScenes = state.customScenes.filter((item) => item.id !== state.currentCustomSceneId);
      // 统一保存到 SCAN_OUT_SETTING 中
      const configToSave = {
        ...state.config,
        customScenes: state.customScenes,
        currentScene: state.currentScene,
        currentCustomSceneId: state.currentCustomSceneId,
      };
      await common.setUserCache(UserCacheEnum.SCAN_OUT_SETTING, configToSave);

      // proxy.$message.success('删除成功');
      // 删除后切换到扫单出库
      selectScene('scan', true);
    })
    .catch(() => {
      // 用户取消
    });
};
</script>

<style lang="scss" scoped>
.setting-container {
  display: flex;
  flex-direction: row;
  .container-left {
    width: 200px;
    border-right: 1px solid rgb(228, 228, 228);
    padding: 0 10px 0 0;
    .left-item {
      width: 180px;
      height: 93px;
      border-radius: 12px;
      background-image: linear-gradient(-65deg, rgba(99, 216, 255, 0.07) 0, rgba(82, 64, 255, 0.07) 100%);
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 10px;
      transition: all 0.6s;
      &:hover {
        transform: translateZ(0) scale(1.05);
        background-image: linear-gradient(-65deg, rgba(255, 165, 47, 0.671) 0, rgba(20, 179, 49, 0.671) 100%);
        color: #fff;
        .item--sub-title {
          color: #fff;
        }
      }
      &.active {
        background-image: linear-gradient(-65deg, rgba(255, 165, 47, 0.671) 0, rgba(20, 179, 49, 0.671) 100%);
        color: #fff;
        .item--sub-title {
          color: #fff;
        }
      }
      cursor: pointer;
      .item-title {
        display: flex;
        font-size: 18px;
        width: 100%;
        line-height: 1.5;
      }
      .item--sub-title {
        transition: all 0.6s;
        display: flex;
        font-size: 14px;
        color: #8d8d8d;
      }
    }
  }
  .container-right {
    flex: 1;
  }
}
</style>
