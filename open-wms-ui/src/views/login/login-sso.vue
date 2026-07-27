<template>
  <div style="margin: 20px; text-align: center">
    <div>正在单点登录验证...</div>
    <div style="color: white">{{ state.phoneNumber }} - {{ state.userName }}</div>
    <div v-if="!state.phoneNumber" style="color: red; line-height: 2">手机号不能为空</div>
    <div v-if="!state.userName" style="color: red; line-height: 2">用户名不能为空</div>
  </div>
</template>

<script setup lang="ts" name="loginIndex">
import { onMounted, reactive, computed, ComponentInternalInstance } from 'vue';
import Cookies from 'js-cookie';
import useUserStore from '/@/stores/modules/user';
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

// 定义变量内容
const state = reactive({
  phoneNumber: '',
  userName: '',
  tenantId: '',
});

// 页面加载时
onMounted(async () => {
  state.phoneNumber = (route.query?.phone as string) || Cookies.get('phone') || '';
  state.userName = (route.query?.userName as string) || Cookies.get('userName') || '';
  state.tenantId = (route.query?.tenantId as string) || Cookies.get('tenantId') || '000000';
  autoLogin();
});

const autoLogin = async () => {
  if (!state.userName) {
    proxy.$message.error('用户名不能为空！');
    return;
  }
  if (!state.phoneNumber) {
    proxy.$message.error('手机号不能为空！');
    return;
  }
  const params = {
    tenantId: state.tenantId,
    username: state.userName,
    phoneNumber: state.phoneNumber,
    password: '',
  };
  const [err, res] = await to(userStore.loginSso(params));
  if (err) return;

  if (res) {
    router.push('/');
  }
};
</script>

<style scoped lang="scss">
.login-container {
  height: 100%;
  background: let(--el-color-white);
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
      border: 1px solid let(--el-color-primary-light-3);
      border-radius: 3px;
      width: 500px;
      height: 600px;
      position: relative;
      overflow: hidden;
      background-color: let(--el-color-white);
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
          background: linear-gradient(90deg, transparent, let(--el-color-primary));
          animation: loginLeft 5s linear infinite;
        }
        &::after {
          filter: hue-rotate(60deg);
          top: -100%;
          right: 2px;
          width: 3px;
          height: 100%;
          background: linear-gradient(180deg, transparent, let(--el-color-primary));
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
          background: linear-gradient(270deg, transparent, let(--el-color-primary));
          animation: loginRight 5s linear infinite;
          animation-delay: 3s;
        }
        &::after {
          filter: hue-rotate(300deg);
          bottom: -100%;
          left: 0px;
          width: 3px;
          height: 100%;
          background: linear-gradient(360deg, transparent, let(--el-color-primary));
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
          color: let(--el-text-color-primary);
          background: let(--Gradient, linear-gradient(90deg, #02c980 10%, #01b6ce 50%));
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
            color: let(--el-color-primary);
            &-delta {
              position: absolute;
              width: 35px;
              height: 70px;
              z-index: 2;
              top: 2px;
              right: 21px;
              background: let(--el-color-white);
              transform: rotate(-45deg);
            }
            &:hover {
              opacity: 1;
              transition: all ease 0.3s;
              color: let(--el-color-primary) !important;
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
