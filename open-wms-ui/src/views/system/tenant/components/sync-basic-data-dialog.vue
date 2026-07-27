<template>
  <el-dialog v-model="currentDialogVisible" :top="common.getDialogTop()" title="同步基础数据" class="dialog-container" width="650px" draggable overflow append-to-body destroy-on-close :close-on-click-modal="false" @open="onOpen">
    <div class="fx-solution-center-wrapper">
      <el-checkbox v-model="state.checkAll" :indeterminate="state.isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="state.checkedMenuList" @change="handleCheckedMenuListChange">
        <el-checkbox v-for="menuInfo in state.menuList" :key="menuInfo" :label="menuInfo.menuName" :value="menuInfo.menuId"> </el-checkbox>
      </el-checkbox-group>
    </div>
    <template #footer>
      <span class="flex-end">
        <el-button @click="currentDialogVisible = false">取 消</el-button>
        <el-button @click="submitData" type="primary">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="phone-modify-dialog">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import { useUserStore } from '/@/stores/modules/user';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy: BaseProperties = ins.proxy as BaseProperties;
// 事件定义
const emit = defineEmits(['update:visible', 'on-closed']);

//#region 定义属性
const props = defineProps({
  // 是否显示
  visible: {
    type: Boolean,
    default: false,
  },
  // 租户信息
  tenantInfo: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  checkAll: false,
  isIndeterminate: false,
  checkedMenuList: [] as number[],
  menuList: [
    {
      menuId: 1055,
      menuName: '单据编码规则',
    },
    {
      menuId: 106,
      menuName: '打印模板',
    },
    {
      menuId: 1502,
      menuName: '导入设置',
    },
    {
      menuId: 1058,
      menuName: '导出设置',
    },
    {
      menuId: 2233,
      menuName: 'OSS配置管理',
    },
    {
      menuId: 2083,
      menuName: '页面装修',
    },
    {
      menuId: 2263,
      menuName: 'magic-ui设计器',
    },
  ],
});
//#endregion

//#region 计算属性
// 显示窗口
const currentDialogVisible = computed({
  get() {
    return props.visible;
  },
  set(val: boolean) {
    emit('update:visible', val);
  },
});
//#endregion

onMounted(() => {});

const onOpen = () => {};

const submitData = async () => {
  if (!props.tenantInfo.tenantId) {
    proxy.$message.error('账套ID不能为空！');
    return;
  }
  if (!state.checkedMenuList.length) {
    proxy.$message.error('至少勾选一项！');
    return;
  }
  let url = '/system/tenant/tenant/syncBasicData';
  let params = {
    targetTenantId: props.tenantInfo.tenantId,
    menuIdList: state.checkedMenuList,
  };
  let [err, res] = await to(postData(url, params));
  if (err) return;

  if (res?.result) {
    currentDialogVisible.value = false;
  }
};

const handleCheckAllChange = (val: boolean) => {
  state.checkedMenuList = val ? state.menuList.map((m) => m.menuId) : [];
  state.isIndeterminate = false;
};
const handleCheckedMenuListChange = (value: string[]) => {
  const checkedCount = value.length;
  state.checkAll = checkedCount === state.menuList.length;
  state.isIndeterminate = checkedCount > 0 && checkedCount < state.menuList.length;
};
</script>

<style lang="scss">
.dialog-container {
  position: relative;
  .el-dialog__body {
    padding: 0px !important;
    padding-bottom: 10px !important;
  }
  .el-dialog__footer {
    padding: 0px !important;
    box-sizing: border-box;
  }
}
.sm-btn {
  line-height: 42px;
  border: 1px solid #ddd;
  cursor: pointer;
  overflow: hidden;
}
.user-detail-modal-aliyun {
  margin: 10px 0 20px 10px;
  background: #fff;
  text-align: center;
}

.user-detail-modal-aliyun .sm-btn {
  border: 1px solid #dae1ea;
  border-radius: 4px;
}

.user-detail-modal-aliyun .sm-txt {
  vertical-align: top;
}

.user-detail-modal-aliyun .rect-bottom,
.user-detail-modal-aliyun .rect-top,
.user-detail-modal-aliyun .sm-pop-close {
  display: none;
}
#rectMask {
  overflow: hidden;
  position: absolute;
}
.sm-btn-default .sm-ico {
  position: relative;
  background: none;
  display: inline-block;
  margin-top: -3px;
  margin-left: 12px;
  margin-right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  line-height: 36px;
  text-align: center;
  vertical-align: middle;
}
#rectMask {
  top: 0;
  left: 0;
}
.sm-btn-wrapper {
  position: relative;
}

.sm-btn-default .right-tick {
  display: none;
}
.sm-btn-default .shield {
  animation: shieldanimation 1.5s infinite;
}

.sm-btn-default .sm-ico:hover {
  box-shadow: 0 0 10px #00de76;
  background: rgba(0, 222, 118, 0.3);
}
.sm-btn-default:hover {
  box-shadow: 0 0 8px #65f4b5;
}
.sm-btn-default .sm-ico {
  position: relative;
  background: none;
  display: inline-block;
  margin-top: -3px;
  margin-left: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  line-height: 36px;
  text-align: center;
  vertical-align: middle;
}
.sm-btn-default .sm-ico-wave {
  animation: defaultWave 1.5s ease infinite;
}
.sm-btn-default .sm-ico-wave {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  position: relative;
  z-index: 800;
  left: 5px;
  top: 5px;
}
.sm-btn-default .sm-ico-wave {
  background-image: linear-gradient(0deg, #3a9afa, #00de76);
}
.sm-btn-default .shield,
.sm-btn-fail .shield,
.sm-btn-loading .shield,
.sm-btn-success .shield {
  width: 12px;
  height: 14px;
  line-height: 38px;
  left: 12px;
  position: absolute;
  z-index: 1000;
  top: -1px;
}
.sm-btn-default .shield {
  animation: shieldanimation 1.5s infinite;
}

@keyframes shieldanimation {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(1.15);
  }
  40% {
    transform: scale(1);
  }
  to {
    transform: scale(1);
  }
}
@keyframes defaultWave {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(1.23);
  }
  40% {
    transform: scale(1);
  }
  to {
    transform: scale(1);
  }
}
@keyframes defaultOutsideWave {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(0.8125);
  }
  40% {
    transform: scale(1);
  }
  to {
    transform: scale(1);
  }
}
</style>
