<template>
  <div class="login-container flex">
    <div class="login-left" :style="{ 'background-color': getBgColor() }">
      <div class="login-left-logo">
        <img src="/dti-logo.png" alt="DTI" />
        <!-- <div class="login-left-logo-text">
					<span>{{ userStore.tenantInfo.sysFullName }}</span>
					<span class="login-left-logo-text-msg">{{ userStore.tenantInfo.sysShortName }}</span>
				</div> -->
      </div>
      <div class="login-left-img">
        <img :src="userStore.tenantInfo.expandFields?.bigPic || loginMain" />
      </div>
      <svg width="100" height="969" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" shape-rendering="auto" preserveAspectRatio="none" class="layout-footer-waves login-left-waves">
        <g id="Layer_1">
          <title>Layer 1</title>
          <g transform="rotate(2.18686 -4.09974 506.2)" stroke="null" id="svg_5">
            <defs
              stroke="null"
              transform="translate(0.00121616 0.0635973) translate(-0.844727 0.185777) translate(-4.69751 0.0674522) translate(4.80739 0.470252) translate(4.47211 0.0666505) translate(-47.1425 4.28569) translate(7.74305 4.90188) translate(-28.5712 -22.857) translate(-0.219291 4.06319) translate(-1.32311 -4.516) translate(22.5706 18.2109) translate(-49.4342 -5.96675) translate(-0.909089 0) translate(0.909089 0) translate(-0.909089 0) translate(-0.909089 0) translate(-0.909089 0) translate(-3.33335 0) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(0 -3.33335) translate(-7.34665 -0.396492) translate(-1.66666 0) translate(-1.66666 0) translate(-0.12551 2.32567) translate(-0.707827 0.218105) translate(-1.66666 0) translate(1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-2.15731 0.0264734) translate(1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(0 -1.66666) translate(0 -1.66666) translate(1.66666 0) translate(0 -1.66666) translate(1.66666 0) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(1.66666 0) translate(1.66666 0) translate(1.66666 0) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(1.66666 0) translate(1.66666 0) translate(1.66666 0) translate(1.66666 0) translate(1.66666 0) translate(1.66666 0) translate(1.66666 0) translate(1.66666 0) translate(1.66666 0) translate(1.66666 0) translate(1.66666 0) translate(1.66666 0) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(0 -1.66666) translate(0 -1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(-1.66666 0) translate(0 1.66666) translate(-1.66666 0) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(0 -1.66666) translate(0 -1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(0 -1.66666) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.66666 0) translate(-1.56355 1.02885) translate(-7.50004 -25.0001) translate(-3.19245 0.846904) translate(5.00003 -97.5005) translate(-9.62431 -0.829817) translate(27.5002 -220.001) translate(-6.96615 1.62281) translate(1.10472 -2.23004) translate(-9.63847 0.899196) translate(7.04019 0.0560654) translate(-11.25 -16.25) translate(2.11523 2.02597) translate(-27.1193 -20.3394) translate(-10.8798 -0.397069) translate(-44.0688 -110.172) translate(-1.69495 5.08486) translate(-8.57191 2.416) translate(-67.7982 -69.4931) translate(-0.127168 3.4846) translate(-16.9495 -283.057) translate(-4.64027 -0.169348) translate(1 0) translate(71.5022 0) translate(0 127.337) translate(-78.8263 -168.947) scale(0.564803 0.937256) translate(78.8263 168.947) translate(-139.564 1126.64) scale(1 0.752632) translate(139.564 -1126.64) translate(-139.564 190.036) scale(1 0.902375) translate(139.564 -190.036) translate(-139.564 210.595) scale(1.30003 1) translate(139.564 -210.595) translate(-107.355 1517.49) scale(1 1.16096) translate(107.355 -1517.49) translate(-107.355 0.205247) scale(1 1.13183) translate(107.355 -0.205247) translate(-136.758 -338.436) scale(1.50148 1) translate(136.758 338.436) translate(-152.694 -417.354) scale(1.2612 1.21266) translate(152.694 417.354) translate(-160.148 -445.389) scale(1 1.22519) translate(160.148 445.389) translate(-187.477 -380.211) scale(1.1479 0.963065) translate(187.477 380.211) translate(-169.043 -406.673) scale(0.986706 0.876627) translate(169.043 406.673) translate(-166.85 -463.854) scale(1.08382 1.19196) translate(166.85 463.854) translate(-159.592 918.456) scale(0.859634 1.01716) translate(159.592 -918.456) translate(-184.899 -405.678) scale(1.135 1.11385) translate(184.899 405.678) translate(-150.577 -518.346) scale(0.986699 1.09676) translate(150.577 518.346) translate(-155.421 -535.896) scale(1.04426 1.02871) translate(155.421 535.896) translate(-155.064 -536.049) scale(1.0463 1.01338) translate(155.064 536.049) translate(-165.783 -521.136) scale(1.00568 1.01887) translate(165.783 521.136) translate(-170.657 -511.469) scale(1.01013 1.00598) translate(170.657 511.469) translate(-169.334 -508.298) scale(1.09126 1) translate(169.334 508.298) translate(-156.911 -506.897) scale(1 1.06292) translate(156.911 506.897) translate(-163.644 765.54) scale(0.881707 0.600266) translate(163.644 -765.54) translate(45.8836 -37.1657) scale(0.309 0.684766) translate(-45.8836 37.1657) translate(-69.5385 1277.7) scale(0.415094 0.969376) translate(69.5385 -1277.7) translate(-173.403 4.77105) scale(2.29193 1) translate(173.403 -4.77105) translate(-131.465 -21.955) scale(1.62026 0.838547) translate(131.465 21.955) translate(-128.274 -10.6013) scale(0.965372 1.26492) translate(128.274 10.6013) translate(-127.333 -8.29175) scale(0.874565 1.22473) translate(127.333 8.29175) translate(-138.784 -6.2554) scale(1.00883 0.82026) translate(138.784 6.2554) translate(-144.168 -7.53605) scale(1.05722 1.04501) translate(144.168 7.53605) translate(-137.487 -6.97423) scale(1.01704 0.999876) translate(137.487 6.97423)"
            >
              <path stroke="null" id="svg_3" d="m-160,44c30,0 58,-18 88,-18s58,18 88,18s58,-18 88,-18s58,18 88,18l0,44l-352,0l0,-44z" />
            </defs>
            <g stroke="null" id="svg_6">
              <title stroke="null">Layer 1</title>
              <g stroke="null" transform="matrix(-0.0217456 0.782606 -0.765199 -0.0222404 584.591 1129.22)" class="layout-footer-waves-g" id="svg_1">
                <use stroke="null" href="#svg_3" x="-328.61098" y="405.36815" :fill="getBgColor()" id="svg_4" transform="matrix(3.69628 0 0 3.42743 381.903 -787.25)" />
                <use stroke="null" href="#svg_3" x="-333.61098" y="401.76815" :fill="getBgColor(0.5)" id="svg_2" transform="matrix(3.69628 0 0 3.42743 381.903 -787.25)" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
    <div class="login-right flex">
      <div class="login-right-warp flex-margin">
        <span class="login-right-warp-one"></span>
        <span class="login-right-warp-two"></span>
        <div class="login-right-warp-mian">
          <div class="login-right-warp-main-title">DTI</div>
          <div class="login-right-warp-main-form">
            <div v-if="!state.isScan">
              <el-tabs v-model="state.tabsActiveName">
                <el-tab-pane :label="$t('message.label.one1')" name="account">
                  <Account />
                </el-tab-pane>
                <el-tab-pane :label="$t('message.label.two2')" name="mobile">
                  <Mobile />
                </el-tab-pane>
              </el-tabs>
            </div>
            <Scan v-if="state.isScan" />
            <!-- <div class="login-content-main-scan" @click="state.isScan = !state.isScan">
							<i class="iconfont" :class="state.isScan ? 'icon-diannao1' : 'icon-barcode-qr'"></i>
							<div class="login-content-main-scan-delta"></div>
						</div> -->
          </div>
        </div>
      </div>
    </div>

    <!--注册弹窗-->
    <reg-dialog v-model:visible="state.regVisible"></reg-dialog>

    <!--商家注册弹窗-->
    <mer-dialog v-model:visible="state.merVisible"></mer-dialog>
  </div>
</template>

<script setup lang="ts" name="loginIndex">
import { defineAsyncComponent, onMounted, reactive, computed, ComponentInternalInstance } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';
import loginMain from '/@/assets/login-main.png';
import loginBg from '/@/assets/login-bg.svg';
const RegDialog = defineAsyncComponent(() => import('./component/reg-dialog.vue'));
const MerDialog = defineAsyncComponent(() => import('./component/mer-dialog.vue'));

import useUserStore from '/@/stores/modules/user';
const userStore = useUserStore();

import { BaseProperties } from '/@/types/base-type';
import { anyToRgba } from '/@/utils/colorUtil';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

// 引入组件
const Account = defineAsyncComponent(() => import('/@/views/login/component/account.vue'));
const Mobile = defineAsyncComponent(() => import('/@/views/login/component/mobile.vue'));
const Scan = defineAsyncComponent(() => import('/@/views/login/component/scan.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
  tabsActiveName: 'account',
  isScan: false,
  regVisible: false,
  merVisible: false,
});

const getBgColor = (alpha?: number) => {
  return anyToRgba(userStore.tenantInfo.expandFields?.bgColor, alpha || 1) || '#95b7e4';
};

// 获取布局配置信息
const getThemeConfig = computed(() => {
  return themeConfig.value;
});
// 页面加载时
onMounted(async () => {
  NextLoading.done();
  await userStore.getTenantInfo(true);
  proxy.$forceUpdate();
});
</script>

<style scoped lang="scss">
.login-container {
  height: 100%;
  background: var(--el-color-white);
  .login-left {
    flex: 1;
    position: relative;
    background-color: #95b7e4;
    margin-right: 100px;
    .login-left-logo {
      display: flex;
      align-items: center;
      position: absolute;
      top: 50px;
      left: 80px;
      z-index: 1;
      animation: logoAnimation 0.3s ease;
      img {
        height: 60px;
      }
      .login-left-logo-text {
        display: flex;
        flex-direction: column;
        span {
          margin-left: 10px;
          font-size: 28px;
          color: #26a59a;
        }
        .login-left-logo-text-msg {
          font-size: 12px;
          color: #32a99e;
        }
      }
    }
    .login-left-img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      img {
        width: 100%;
        animation: error-num 0.6s ease;
      }
    }
    .login-left-waves {
      position: absolute;
      top: 0;
      right: -100px;
    }
  }
  .login-right {
    width: 700px;
    .login-right-warp {
      border: 1px solid var(--el-color-primary-light-3);
      border-radius: 3px;
      width: 500px;
      height: 600px;
      position: relative;
      overflow: hidden;
      background-color: var(--el-color-white);
      .login-right-warp-one,
      .login-right-warp-two {
        position: absolute;
        display: block;
        width: inherit;
        height: inherit;
        &::before,
        &::after {
          content: '';
          position: absolute;
          z-index: 1;
        }
      }
      .login-right-warp-one {
        &::before {
          filter: hue-rotate(0deg);
          top: 0px;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--el-color-primary));
          animation: loginLeft 5s linear infinite;
        }
        &::after {
          filter: hue-rotate(60deg);
          top: -100%;
          right: 2px;
          width: 3px;
          height: 100%;
          background: linear-gradient(180deg, transparent, var(--el-color-primary));
          animation: loginTop 5s linear infinite;
          animation-delay: 1.5s;
        }
      }
      .login-right-warp-two {
        &::before {
          filter: hue-rotate(120deg);
          bottom: 2px;
          right: -100%;
          width: 100%;
          height: 3px;
          background: linear-gradient(270deg, transparent, var(--el-color-primary));
          animation: loginRight 5s linear infinite;
          animation-delay: 3s;
        }
        &::after {
          filter: hue-rotate(300deg);
          bottom: -100%;
          left: 0px;
          width: 3px;
          height: 100%;
          background: linear-gradient(360deg, transparent, var(--el-color-primary));
          animation: loginBottom 5s linear infinite;
          animation-delay: 4.5s;
        }
      }
      .login-right-warp-mian {
        display: flex;
        flex-direction: column;
        height: 100%;
        .login-right-warp-main-title {
          height: 130px;
          line-height: 130px;
          font-size: 27px;
          text-align: center;
          letter-spacing: 3px;
          animation: logoAnimation 0.3s ease;
          animation-delay: 0.3s;
          color: var(--el-text-color-primary);
          background: var(--Gradient, linear-gradient(90deg, #02c980 10%, #01b6ce 50%));
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .login-right-warp-main-form {
          flex: 1;
          padding: 0 50px 50px;
          .login-content-main-scan {
            position: absolute;
            top: 0;
            right: 0;
            width: 50px;
            height: 50px;
            overflow: hidden;
            cursor: pointer;
            transition: all ease 0.3s;
            color: var(--el-color-primary);
            &-delta {
              position: absolute;
              width: 35px;
              height: 70px;
              z-index: 2;
              top: 2px;
              right: 21px;
              background: var(--el-color-white);
              transform: rotate(-45deg);
            }
            &:hover {
              opacity: 1;
              transition: all ease 0.3s;
              color: var(--el-color-primary) !important;
            }
            i {
              width: 47px;
              height: 50px;
              display: inline-block;
              font-size: 48px;
              position: absolute;
              right: 1px;
              top: 0px;
            }
          }
        }
      }
    }

    .login-register-button {
      padding: 10px 32px;
      color: #0854aa;
      background: linear-gradient(to right, #fafafa, #fafafa);
      border-radius: 4px;
      width: 100%;
      text-align: center;
      cursor: pointer;
      position: relative;
      transition: background 0.3s;
      border: 1px solid #f3f3f3;
    }

    .login-register-button:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 0;
      height: 100%;
      background: linear-gradient(to right, #fafafa, #fafafa);
      z-index: -2;
      border-radius: 4px;
    }

    .login-register-button:hover {
      z-index: 1;
      color: #ffffff !important;
    }

    .login-register-button:before {
      transition: 0.3s;
      background: linear-gradient(270deg, #ffa328 0%, #ff761a 100%);
      z-index: -1;
    }

    .login-register-button:hover:before {
      width: 100%;
    }
  }
}
</style>
