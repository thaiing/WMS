<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" v-model="state.formData" label-width="350px">
      <h2 class="sub-title">{{ $tt('系统全局设置') }}</h2>
      <el-form-item :label="$tt('关闭自定义UI')">
        <el-switch v-model="state.formData.global_closeUserUIJson" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('列表页面开始排序')">
        <el-switch v-model="state.formData.global_openSortable" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('开启自定义菜单')">
        <el-switch v-model="state.formData.global_openCustomMenu" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('开启操作日志')">
        <el-switch v-model="state.formData.global_openUserLog" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('编辑页面禁止通过点击空白处关闭对话框')" class="padding-top-10">
        <el-switch v-model="state.formData.global_editorProhibitCloseOnClickModal" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <h2 class="sub-title">{{ $tt('扫描全局设置') }}</h2>
      <el-form-item :label="$tt('同商品同条码存在多条时默认选中第一条')">
        <el-switch v-model="state.formData.global_scanSameProductCodeAndModel" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <h2 class="sub-title">{{ $tt('数量参数设置') }}</h2>
      <el-form-item :label="$tt('数量精度（小数位数）')"> <el-input v-model.number="state.formData.global_qtyPrecision" class="w-100"></el-input> {{ $tt('位') }} </el-form-item>
      <el-form-item :label="$tt('数字输入框计数器步长')" class="padding-top-10">
        <el-input v-model.number="state.formData.global_step" class="w-100"></el-input>
      </el-form-item>
      <el-form-item :label="$tt('重量单位')" class="padding-top-10">
        <el-select v-model="state.formData.global_weightUnit" clearable class="w-100" :placeholder="$tt('请选择')">
          <el-option label="G" value="G"></el-option>
          <el-option label="KG" value="KG"></el-option>
          <el-option label="T" value="T"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$tt('体积单位')" class="padding-top-10">
        <el-select v-model="state.formData.global_cubeUnit" clearable class="w-100" :placeholder="$tt('请选择')">
          <el-option label="CM³" value="CM³"></el-option>
          <el-option label="M³" value="M³"></el-option>
        </el-select>
      </el-form-item>
      <h2 class="sub-title">{{ $tt('App设置') }}</h2>
      <el-form-item :label="$tt('app版本')">
        <el-input v-model="state.formData.global_appVersion" class="w-100"></el-input>
      </el-form-item>
      <el-form-item class="form-footer">
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
  // 编辑数据对象
  formData: {
    global_closeUserUIJson: 1,
    global_openSortable: 0,
    global_appVersion: '1.0.0.0',
    global_openCustomMenu: 0,
    global_openUserLog: 0,
    global_qtyPrecision: 2, // 数量精度（小数位数）
    global_step: 1, // 计数器步长
    global_editorProhibitCloseOnClickModal: 0, // 编辑页面禁止通过点击空白处关闭对话框
    open_time_card: 0, // 开启打卡
    global_map_manufacturer: 'baiduMap', // 地图厂商
    global_flowDataStorage: 0, // 首页待办事项是否按仓库显示
    global_flowDataBaihe: 0, // 柏合首页待办卡出库计划，出库单，入库计划
    global_strongPasswordPolicy: 0,
    global_loginUserSingle: 1, // 允许账号多会话登录
    global_openPBKDF2: 0, // 启用PBKDF2加密算法
    global_loginTimeout: 120, // 登录超时(分钟数)
    global_pwdRepeatCount: 3, // 修改密码不可重复最近次数
    global_pwdExpireDays: 5, // 密码过期提醒天数
    global_pwdValidDays: 90, // 密码有效天数
    global_loginErrorCount: 5, // 登陆密码输入错误次数
    global_loginLockMin: 10, // 登陆密码输入错误后锁定时长(分钟)
    global_weightUnit: null, // 默认重量单位
    global_cubeUnit: null, // 默认体积单位
  } as any,
  // 接口数据
  valueList: [] as any[],
});
//#endregion

let base = settingsHook({ state });
onMounted(() => {
  base.loadParam();
});
</script>

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
