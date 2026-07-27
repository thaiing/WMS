<template>
  <div v-if="state.tenantList.length" class="app-box"></div>
</template>

<script setup lang="ts" name="tenant-list">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import Cookies from 'js-cookie';
import { NextLoading } from '/@/utils/loading';
import { LoginData, TenantVO } from '/@/api/types';
import { encrypt, decrypt } from '/@/utils/jsencrypt';
import { useUserStore } from '/@/stores/modules/user';
import { formatAxis } from '/@/utils/formatTime';
import { useRoute, useRouter } from 'vue-router';
import { getCodeImg } from '/@/api/login';
import { useI18n } from 'vue-i18n';
import { ElMessageBox } from 'element-plus';
import { Session, Local } from '/@/utils/storage';
import { useRoutesList } from '/@/stores/routesList';
import pinia from '/@/stores/index';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const codeUrl = ref('');
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 需要验证验证码
const isCheck = ref(false);
// 定义变量内容
const { t } = useI18n();

const loginForm = ref<LoginData>({
  tenantId: '',
  username: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: '',
  redirect: '',
});

// 时间获取
const currentTime = computed(() => {
  return formatAxis(new Date());
});

//#region 定义变量
const state = reactive({
  tenantList: [] as any[],
  showDrawer: false,
});
//#endregion

onMounted(async () => {
  await getCookie();
  await getMyTenantList();
});

// 加载应用列表
const getMyTenantList = async () => {
  let url = '/system/tenant/tenant/getMyTenantList';
  let params = {
    mobile: loginForm.value.username,
    password: loginForm.value.password,
  };
  let header = {
    isEncrypt: true,
  };

  let [err, res] = await to(postData(url, params, header));

  if (err) {
    return;
  }

  if (res?.result) {
    state.tenantList = res.data;
  }
};

// 账号登录
const handleLogin = async (tenantInfo: any) => {
  if (tenantInfo.expandFields?.isOutLink) {
    window.open(tenantInfo.expandFields?.outLinkUrl);
    return;
  }
  loading.value = true;
  // 调用action的登录方法
  loginForm.value.tenantId = tenantInfo.tenantId;
  loginForm.value.redirect = route.query.redirect?.toString();
  const [err, res] = await to(userStore.login(loginForm.value));
  if (!err) {
    // await router.push({ path: redirect.value || '/' });
    // 初始化登录成功时间问候语
    let currentTimeInfo = currentTime.value;
    // 登录成功，跳到转首页
    // 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
    // router.push('/');
    if (route.query?.redirect) {
      if (route.query.redirect.indexOf('http') === 0) {
        location.href = res.data.redirectUrl;
      } else {
        router.push({
          path: <string>route.query?.redirect,
          query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
        });
      }
    } else {
      location.href = '/';
    }

    // 登录成功提示
    const signInText = t('message.signInText');
    ElMessage.success(`${currentTimeInfo}，${signInText}`);
    // 添加 loading，防止第一次进入界面时出现短暂空白
    NextLoading.start();
  } else {
    if (err.message === '验证码已失效') {
      await logout();
      return;
    }
    loading.value = false;
    // 重新获取验证码
    if (captchaEnabled.value) {
      await getCode();
    }
  }
};

/**
 * 获取验证码
 */
const getCode = async () => {
  const res = await getCodeImg();
  const { data } = res;
  captchaEnabled.value = data.captchaEnabled === undefined ? true : data.captchaEnabled;
  if (captchaEnabled.value) {
    codeUrl.value = 'data:image/gif;base64,' + data.img;
    isCheck.value = data.isCheck;
    loginForm.value.uuid = data.uuid;
  }
};

const getCookie = async () => {
  const tenantId = Cookies.get('tenantId');
  const username = Cookies.get('username');
  const password = Cookies.get('password');
  const rememberMe = Cookies.get('rememberMe');
  loginForm.value = {
    tenantId: tenantId === undefined ? loginForm.value.tenantId : tenantId,
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : ((await decrypt(password)) as string),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
  };
};

// 登出
const logout = async () => {
  ElMessageBox({
    closeOnClickModal: false,
    closeOnPressEscape: false,
    title: t('message.user.logOutTitle'),
    message: t('message.user.logOutMessage'),
    showCancelButton: true,
    confirmButtonText: t('message.user.logOutConfirm'),
    cancelButtonText: t('message.user.logOutCancel'),
    buttonSize: 'default',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = t('message.user.logOutExit');
        setTimeout(() => {
          done();
          setTimeout(() => {
            instance.confirmButtonLoading = false;
          }, 300);
        }, 700);
      } else {
        done();
      }
    },
  })
    .then(async () => {
      // 清除缓存/token等
      await userStore.logout();
      Session.clear();
      // 使用 reload 时，不需要调用 resetRoute() 重置路由
      window.location.reload();
    })
    .catch(() => {});
};
</script>

<style lang="scss">
.app-container {
  height: 100%;
  .container-box {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .main-box {
    flex: 1;
    .main-title {
      font-size: 18px;
      font-weight: bold;
      padding: 20px 20px 0;
      clear: both;
      width: 100%;
      display: flex;
      margin: auto;
      background: #fff;
    }
    .list-box {
      display: grid;
      grid-template-columns: 350px 350px 350px;
      grid-row-gap: 20px;
      grid-column-gap: 20px;
      clear: both;
      width: 100%;
      display: flex;
      margin: auto;
      background: #fff;
      padding: 20px;
      flex-wrap: wrap;
      justify-content: flex-start; /* 这将使子项在换行后左对齐 */
    }

    .list-box .list-item__wrapper {
      width: 240px;
      padding: 5px;
      font-size: 12px;
      background: #fff;
      border: 1px solid #e4e8ed;
      border-top: 4px solid #e9edf3;
      border-radius: 2px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }

    .list-box .list-item__wrapper--disabled {
      background-color: #f2f2f2;
      border: 1px solid #e0e0e0;
    }

    .list-box .list-item__wrapper--yxc {
      background-color: #e6faed;
      border: 1px solid #c1eed1;
    }

    .list-box .list-item__wrapper--add {
      background-color: rgb(244, 244, 245);
      border: 1px dashed #e0e0e0;
    }

    .list-box .list-item__wrapper--dh2 {
      background-color: #e2f7f7;
      border: 1px solid #beedef;
    }

    .list-box .list-item__wrapper:hover {
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
    }

    .list-box .list-item__header {
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: flex-start;
      justify-content: flex-start;
    }

    .list-box .list-item__header--yxc {
      position: relative;
    }

    .list-box .list-item__header--yxc:before {
      position: absolute;
      content: '';
      width: 4px;
      height: 20px;
      background: #05c867;
      border-radius: 0 10px 10px 0;
      top: 0;
      left: -20px;
    }

    .list-box .list-item__header--add {
      position: relative;
    }

    .list-box .list-item__header--add:before {
      position: absolute;
      content: '';
      width: 4px;
      height: 20px;
      background: #a1a1a1;
      border-radius: 0 10px 10px 0;
      top: 0;
      left: -20px;
    }

    .list-box .list-item__header--dh2 {
      position: relative;
    }

    .list-box .list-item__header--dh2:before {
      position: absolute;
      content: '';
      width: 4px;
      height: 20px;
      background: #00b8cc;
      border-radius: 0 10px 10px 0;
      top: 0;
      left: -20px;
    }

    .list-box .list-item__tag {
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-align-items: center;
      align-items: center;
      width: 52px;
      height: 22px;
      margin-right: 8px;
      color: #01a2e0;
      background: rgba(4, 148, 226, 0.1);
      border-radius: 3px;
    }

    .list-box .list-item__tag--disable {
      color: #828282;
      background: hsla(0, 0%, 51%, 0.2);
    }

    .list-box .list-item__title {
      font-size: 14px;
      color: #222;
      font-weight: 600;
      display: -webkit-box;
      overflow: hidden;
      white-space: normal !important;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      word-break: break-all;
    }

    .list-box .list-item__separate {
      width: 100%;
      height: 1px;
      margin: 5px 0;
    }

    .list-box .list-item__separate--disable {
      background: #e0e0e0;
    }

    .list-box .list-item__separate--lvt {
      background: #d3e6f4;
    }

    .list-box .list-item__separate--yxc {
      background: #cfecd9;
    }

    .list-box .list-item__separate--add {
      background: #e0e0e0;
    }

    .list-box .list-item__separate--dh2 {
      background: #d0ebed;
    }

    .list-box .list-item__line {
      display: -webkit-flex;
      display: flex;
      margin-bottom: 8px;
      color: #888;
      font-size: 12px;
      line-height: 18px;
      .show-app-dialog {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid #ccc;
        padding: 5px;
        width: 100px;
        border-radius: 5px;
      }
    }

    .list-box .list-item__line .flex {
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: flex-start;
      justify-content: flex-start;
    }

    .list-box .list-item__attribute {
      margin-left: 8px;
      color: #222;
      display: -webkit-box;
      overflow: hidden;
      white-space: normal !important;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      word-break: break-all;
    }

    .list-box .list-item__footer {
      margin-top: 10px;
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content: space-between;
      justify-content: space-between;
    }

    .list-box .list-item__system-icon {
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-align-items: center;
      align-items: center;
      width: auto;
      height: 22px;
      color: #888;
      border: 1px solid #ddd;
      border-radius: 3px;
      padding: 0 5px;
    }

    .list-box .list-item__unbind {
      cursor: pointer;
      color: #888;
      line-height: 22px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      .cancel-app {
        &:hover {
          color: #01a2e0;
        }
      }
    }

    .list-box .list-item__unbind .anticon {
      margin-left: 4px;
      margin-right: 2px;
    }

    .list-box .list-item__unbind--lvt:hover {
      color: #16b5e0;
    }

    .list-box .list-item__unbind--dh2:hover {
      color: #03b8cc;
    }

    .list-box .list-item__unbind--yxc:hover {
      color: #1bbb96;
    }

    .list-box .list-item__badge {
      position: absolute;
      right: -42px;
      top: 10px;
      background: #ffbb21;
      width: 125px;
      line-height: 24px;
      text-align: center;
      -webkit-transform: rotate(-315deg);
      transform: rotate(-315deg);
      color: #fff;
      font-size: 12px;
    }

    .list-box .list-item__badge--disable {
      background: hsla(0, 0%, 51%, 0.2) !important;
      color: #828282;
    }

    .list-box .list-item__badge.customer {
      background: #ff4821;
    }

    .list-box .list-item__badge.merchant {
      background: #13b4bd;
    }
  }
}
</style>
