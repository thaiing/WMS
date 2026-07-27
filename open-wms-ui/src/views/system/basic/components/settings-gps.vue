<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" v-model="state.formData" label-width="250px">
      <h2 class="sub-title">{{ $tt('GPS账号请求') }}</h2>

      <el-form-item :label="$tt('视频接口地址')">
        <el-input v-model="state.formData.gpsVideoUrl" class="w-500"></el-input>
      </el-form-item>
      <el-form-item :label="$tt('接口地址')">
        <el-input v-model="state.formData.gpsUrl" class="w-500"></el-input>
      </el-form-item>
      <el-form-item :label="$tt('账号')">
        <el-input v-model="state.formData.gpsUserId" class="w-500"></el-input>
      </el-form-item>
      <el-form-item :label="$tt('密码')">
        <el-input v-model="state.formData.gpsPassword" class="w-500"></el-input>
        <span>平台登录密码，</span>
        <!-- link 自带的href 是在当前窗口弹出页面 -->
        <el-link :underline="false" type="primary" @click="linkClick">MD5 32位小写字母加密</el-link>
      </el-form-item>

      <el-form-item :label="$tt('sessionId')">
        <el-input v-model="state.formData.gpsSessionId" disabled class="w-500"></el-input>
      </el-form-item>
      <el-form-item class="form-footer">
        <el-button type="primary" @click="base.onSave">{{ $tt('保存') }}</el-button>

        <el-button type="success" @click="getSessionId">{{ $tt('获取sessionId') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="settings-consignor">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import settingsHook from '../hook/settingsHook';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
//#region 定义变量
const state = reactive({
  formData: {
    gpsVideoUrl: '',
    gpsUrl: '',
    gpsUserId: '',
    gpsPassword: '',
    gpsSessionId: '',
  } as any,
  valueList: [] as any[],
  expressCorpList: [] as any[],
  storageNames: [] as any[],
});
//#endregion

let base = settingsHook({ state });
onMounted(() => {
  base.loadParam();
});
const linkClick = () => {
  window.open('https://www.sojson.com/md5/');
};

const getSessionId = async () => {
  if (!state.formData.gpsUserId || !state.formData.gpsPassword) {
    proxy.$message.error('账号密码不能为空！');
    return;
  }
  var url = '/tms/biz/cartTail/getSessionId';
  var params = {
    gpsUrl: state.formData.gpsUrl,
    gpsUserId: state.formData.gpsUserId,
    gpsPassword: state.formData.gpsPassword,
  };

  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    state.formData.gpsSessionId = res.data;
  }

  proxy.common.showMsg(res);
};
</script>

<style lang="scss" scoped>
.settings-sub-container {
  padding-top: 20px;
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
    margin-bottom: 10px;
  }
  .form-footer {
    margin-top: 30px;
  }
}
</style>
