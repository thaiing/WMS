<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" v-model="state.formData" label-width="350px">
      <h2 class="sub-title">{{ $tt('基础参数设置') }}</h2>
      <el-form-item :label="$tt('自动创建同名仓库')">
        <el-switch v-model="state.formData.consignor_createStorage" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('自动创建同客户')">
        <el-switch v-model="state.formData.consignor_createClient" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('自动创建当前用户货主数据权限')">
        <el-switch v-model="state.formData.consignor_createDataAuth" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <!-- <el-form ref="form" label-width="120px" @submit.prevent>
      <el-form-item :label="$tt('货主类型')">
        <template v-for="(item, index) in state.valueList">
          <el-input v-if="state.modifyInputVisible == item" :key="index" :ref="'modifyTagInput' + index" v-model="state.modifyInputValue" class="input-new-tag" size="small" @keyup.enter="modifyInputConfirm(item)" @blur="modifyInputConfirm(item)"></el-input>
          <el-tag v-else :key="'tag-' + index" :disable-transitions="false" closable @close="handleClose(item)" @click="modifyShowInput(item as any, index)">
            {{ item.value }}
          </el-tag>
        </template>

        <el-input v-if="state.addInputVisible" ref="addTagInput" v-model="state.addInputValue" class="input-new-tag" size="small" @keyup.enter="addInputConfirm" @blur="addInputConfirm"></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="addShowInput">+ {{ $tt('添加项') }}</el-button>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="base.onSave">{{ $tt('保存') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="settings-consignor">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import settingsHook from '../hook/settingsHook';

//#region 定义变量
const state = reactive({
  valueList: [] as any[],
  addInputVisible: false,
  modifyInputVisible: false,
  addInputValue: '',
  modifyInputValue: '',

  // 编辑数据对象
  formData: {
    consignor_createStorage: 0,
    consignor_createClient: 0,
    consignor_createDataAuth: 0,
  },
});
//#endregion

onMounted(() => {});

const handleClose = (tag: any) => {
  state.valueList.splice(state.valueList.indexOf(tag), 1);
};

const modifyShowInput = async (item: { value02: any }, index: number) => {
  state.modifyInputValue = item.value02;
  state.modifyInputVisible = Boolean(item);
  await nextTick(() => {
    proxy.$refs['modifyTagInput' + index][0].$refs.input.focus();
  });
};

const modifyInputConfirm = (item: any) => {
  item.value02 = state.modifyInputValue;
  state.modifyInputVisible = false;
  state.modifyInputValue = '';
};

const addShowInput = async () => {
  state.addInputVisible = true;
  await nextTick(() => {
    proxy.$refs.addTagInput.$refs.input.focus();
  });
};

const addInputConfirm = () => {
  const addInputValue = state.addInputValue;
  if (addInputValue) {
    state.valueList.push({
      params_Id: 0,
      userProduct_Id: null,
      value02: addInputValue,
    });
  }
  state.addInputVisible = false;
  state.addInputValue = '';
};

let base = settingsHook({ state });
onMounted(() => {
  base.loadParam();
});
</script>

<style lang="scss" scoped>
.settings-sub-container {
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px !important;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px !important;
    margin-left: 10px;
    margin-right: 10px;
    vertical-align: bottom;
  }

  .footer {
    width: 920px;
    padding: 40px 10px 20px;
    text-align: center;
    .msg {
      line-height: 1.5;
      margin-top: 30px;
      text-align: left;
      font-size: 14px;
    }
  }
  .demo.el-alert {
    display: inline-table;
    ::v-deep .el-alert__icon {
      position: relative;
      top: 20px;
    }
  }
}
</style>

<style lang="scss" scoped>
.settings-sub-container {
  ::v-deep .sub-title {
    font-size: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    padding-top: 20px;
    margin-bottom: 10px;
  }
  ::v-deep .el-form-item__label {
    font-weight: normal;
  }
  .remark {
    color: #888;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0px;
  }
  .form-footer {
    margin-top: 30px;
  }
}
</style>
