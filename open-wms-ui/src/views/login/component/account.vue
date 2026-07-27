<template>
  <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-content-form">
    <!-- <el-form-item prop="tenantId" v-if="tenantEnabled">
			<el-select v-model="loginForm.tenantId" filterable placeholder="请选择/输入公司名称" style="width: 100%">
				<el-option v-for="item in tenantList" :key="item.tenantId" :label="item.companyName" :value="item.tenantId"> </el-option>
				<template #prefix><svg-icon icon-class="company" class="el-input__icon input-icon" /></template>
			</el-select>
		</el-form-item> -->
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" type="primary" text size="large" auto-complete="off" placeholder="手机号/电子邮箱">
        <template #prefix>
          <el-icon class="el-input__icon"><ele-User /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off" placeholder="密码" @keyup.enter="handleLoginProfile">
        <template #prefix>
          <el-icon class="el-input__icon"><ele-Unlock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="code" v-if="captchaEnabled && isCheck">
      <el-input v-model="loginForm.code" size="large" auto-complete="off" placeholder="验证码" style="width: 280px" @keyup.enter="handleLoginProfile">
        <template #prefix>
          <el-icon class="el-input__icon"><ele-Unlock /></el-icon>
        </template>
      </el-input>
      <div class="login-code">
        <img :src="codeUrl" @click="getCode" class="login-code-img" />
      </div>
    </el-form-item>
    <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
    <el-form-item style="width: 100%">
      <el-button :loading="loading" size="large" type="primary" style="width: 100%" @click.prevent="handleLoginProfile">
        <span v-if="!loading">登 录</span>
        <span v-else>登 录 中...</span>
      </el-button>
      <div style="float: right" v-if="register">
        <router-link class="link-type" :to="'/register'">立即注册</router-link>
      </div>
    </el-form-item>
  </el-form>

  <!-- <el-form size="large" class="login-content-form">
    <el-form-item class="login-animation1">
      <el-input text :placeholder="$t('message.account.accountPlaceholder1')" v-model="state.ruleForm.userName" clearable autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon"><ele-User /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2">
      <el-input :type="state.isShowPassword ? 'text' : 'password'" :placeholder="$t('message.account.accountPlaceholder2')" v-model="state.ruleForm.password" autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon"><ele-Unlock /></el-icon>
        </template>
        <template #suffix>
          <i class="iconfont el-input__icon login-content-password" :class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'" @click="state.isShowPassword = !state.isShowPassword">
          </i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation3">
      <el-col :span="15">
        <el-input text maxlength="4" :placeholder="$t('message.account.accountPlaceholder3')" v-model="state.ruleForm.code" clearable autocomplete="off">
          <template #prefix>
            <el-icon class="el-input__icon"><ele-Position /></el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="8">
        <el-button class="login-content-code" v-waves>1234</el-button>
      </el-col>
    </el-form-item>
    <el-form-item class="login-animation4">
      <el-button type="primary" class="login-content-submit" round v-waves @click="onSignIn" :loading="state.loading.signIn">
        <span>{{ $t('message.account.accountBtnText') }}</span>
      </el-button>
    </el-form-item>
  </el-form> -->
</template>

<script setup lang="ts" name="loginAccount">
import { reactive, computed, onMounted, ref, ComponentInternalInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElForm, ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import Cookies from 'js-cookie';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { Session } from '/@/utils/storage';
import { formatAxis } from '/@/utils/formatTime';
import { NextLoading } from '/@/utils/loading';

import { FormRules } from 'element-plus';
import { getCodeImg, getTenantList } from '/@/api/login';
import { encrypt, decrypt } from '/@/utils/jsencrypt';
import { useUserStore } from '/@/stores/modules/user';
import { LoginData, TenantVO } from '/@/api/types';

import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const userStore = useUserStore();
const router = useRouter();

const loginForm = ref<LoginData>({
  tenantId: '000000',
  username: 'admin',
  password: 'admin123',
  rememberMe: false,
  code: '',
  uuid: '',
});

const loginRules: FormRules = {
  tenantId: [{ required: true, trigger: 'blur', message: '请输入您的租户编号' }],
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
};

const codeUrl = ref('');
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 需要验证验证码
const isCheck = ref(false);

// 租户开关
const tenantEnabled = ref(true);

// 注册开关
const register = ref(false);
const redirect = ref(undefined);
const loginRef = ref(ElForm);
// 租户列表
const tenantList = ref<TenantVO[]>([]);

// 时间获取
const currentTime = computed(() => {
  return formatAxis(new Date());
});

const handleLogin = () => {
  loginRef.value.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set('tenantId', loginForm.value.tenantId, { expires: 30 });
        Cookies.set('username', loginForm.value.username, { expires: 30 });
        Cookies.set('password', String(encrypt(loginForm.value.password)), { expires: 30 });
        Cookies.set('rememberMe', String(loginForm.value.rememberMe), { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove('tenantId');
        Cookies.remove('username');
        Cookies.remove('password');
        Cookies.remove('rememberMe');
      }
      // 调用action的登录方法
      // prittier-ignore
      const [err] = await to(userStore.login(loginForm.value));
      if (!err) {
        // await router.push({ path: redirect.value || '/' });
        // 初始化登录成功时间问候语
        let currentTimeInfo = currentTime.value;
        // 登录成功，跳到转首页
        // 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
        if (route.query?.redirect) {
          router.push({
            path: <string>route.query?.redirect,
            query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
          });
        } else {
          router.push('/');
        }
        // 登录成功提示
        const signInText = t('message.signInText');
        ElMessage.success(`${currentTimeInfo}，${signInText}`);
        // 添加 loading，防止第一次进入界面时出现短暂空白
        NextLoading.start();
      } else {
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          await getCode();
        }
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

const handleLoginProfile = () => {
  loginRef.value.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true;
      Cookies.set('username', loginForm.value.username, { expires: 30 });
      Cookies.set('password', String(encrypt(loginForm.value.password)), { expires: 30 });

      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set('rememberMe', String(loginForm.value.rememberMe), { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove('rememberMe');
      }

      // 调用action的登录方法
      // prittier-ignore
      const [err, res] = await to(userStore.loginProfile(loginForm.value));
      if (!err) {
        // await router.push({ path: redirect.value || '/' });
        // 初始化登录成功时间问候语
        // let currentTimeInfo = currentTime.value;
        // 登录成功，跳到转首页
        if (res.data.scope === 'real_login') {
          // 初始化登录成功时间问候语
          let currentTimeInfo = currentTime.value;
          // 登录成功，跳到转首页
          // 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
          if (route.query?.redirect && route.query?.redirect !== '/system/tenant/tenant-list') {
            router.push({
              path: <string>route.query?.redirect,
              query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
            });
          } else {
            router.push('/');
          }
          // 登录成功提示
          const signInText = t('message.signInText');
          ElMessage.success(`${currentTimeInfo}，${signInText}`);
          // 添加 loading，防止第一次进入界面时出现短暂空白
          NextLoading.start();
        } else {
          let redirect = route.query?.redirect;
          if (redirect === '/system/tenant/tenant-list') {
            redirect = '';
          }
          if (redirect) {
            redirect = '?redirect=' + redirect;
            let params = route.query?.params;
            if (params) redirect += '&params=' + params;
          }
          router.push('/system/tenant/tenant-list' + redirect);
        }
        // 登录成功提示
        // const signInText = t('message.signInText');
        // ElMessage.success(`${currentTimeInfo}，${signInText}`);
        // 添加 loading，防止第一次进入界面时出现短暂空白
        // NextLoading.start();
      } else {
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          await getCode();
        }
      }
    } else {
      console.log('error submit!', fields);
    }
  });
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

/**
 * 获取租户列表
 */
const initTenantList = async () => {
  const { data } = await getTenantList();
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled;
  if (tenantEnabled.value) {
    tenantList.value = data.voList;
    if (tenantList.value != null && tenantList.value.length !== 0) {
      loginForm.value.tenantId = tenantList.value[0].tenantId;
    }
  }
};

onMounted(() => {
  getCode();
  // initTenantList();
  getCookie();
});

// 定义变量内容
const { t } = useI18n();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const route = useRoute();
// const router = useRouter();
const state = reactive({
  isShowPassword: false,
  ruleForm: {
    userName: 'admin',
    password: '123456',
    code: '1234',
  },
  loading: {
    signIn: false,
  },
});

// 登录
const onSignIn = async () => {
  state.loading.signIn = true;
  // 存储 token 到浏览器缓存
  Session.set('token', Math.random().toString(36).substr(0));
  // 模拟数据，对接接口时，记得删除多余代码及对应依赖的引入。用于 `/src/stores/userInfo.ts` 中不同用户登录判断（模拟数据）
  Cookies.set('userName', state.ruleForm.userName);
  if (!themeConfig.value.isRequestRoutes) {
    // 前端控制路由，2、请注意执行顺序
    const isNoPower = await initFrontEndControlRoutes();
    signInSuccess(isNoPower);
  } else {
    // 模拟后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
    // 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
    const isNoPower = await initBackEndControlRoutes();
    // 执行完 initBackEndControlRoutes，再执行 signInSuccess
    signInSuccess(isNoPower);
  }
};
// 登录成功后的跳转
const signInSuccess = (isNoPower: boolean | undefined) => {
  if (isNoPower) {
    ElMessage.warning('抱歉，您没有登录权限');
    Session.clear();
  } else {
    // 初始化登录成功时间问候语
    let currentTimeInfo = currentTime.value;
    // 登录成功，跳到转首页
    // 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
    if (route.query?.redirect) {
      router.push({
        path: <string>route.query?.redirect,
        query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
      });
    } else {
      router.push('/');
    }
    // 登录成功提示
    const signInText = t('message.signInText');
    ElMessage.success(`${currentTimeInfo}，${signInText}`);
    // 添加 loading，防止第一次进入界面时出现短暂空白
    NextLoading.start();
  }
  state.loading.signIn = false;
};
</script>

<style scoped lang="scss">
.login-content-form {
  margin-top: 20px;

  @for $i from 1 through 4 {
    .login-animation#{$i} {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/10) + s;
    }
  }

  .login-content-password {
    display: inline-block;
    width: 20px;
    cursor: pointer;

    &:hover {
      color: #909399;
    }
  }

  .login-content-code {
    width: 100%;
    padding: 0;
    font-weight: bold;
    letter-spacing: 5px;
  }

  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }
}
</style>

<style lang="scss" scoped>
.login-code {
  width: 110px;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial, serif;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>

<style>
input:-webkit-autofill {
  transition: background-color 5000s ease-in-out 0s;
  /*延时渲染背景色来去除背景色*/
  caret-color: #acfff2;
  /*光标颜色*/
}
</style>
