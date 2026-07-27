import { to } from 'await-to-js';
import store from '/@/stores';
import { getToken, openSessionToken, removeToken, setToken } from '/@/utils/auth';
import { login as loginApi, loginProfile as loginProfileApi, loginSso as loginSsoApi, loginSsoTemp as loginSsoTempApi, logout as logoutApi, getInfo as getUserInfo } from '/@/api/login';
import { LoginData, LoginResult } from '/@/api/types';
import { ComponentInternalInstance, ref } from 'vue';
import { defineStore } from 'pinia';
import { postData } from '/@/api/common/baseApi';
import Cookies from 'js-cookie';
import { AxiosResponse } from 'axios';
// import modal from '/@/plugins/modal';

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken());
  const name = ref('');
  const nickName = ref('');
  const phoneNumber = ref('');
  const userId = ref<string | number>('');
  const tenantId = ref('');
  const packageId = ref(0);
  const sysFullName = ref('');
  const sysShortName = ref('');

  const email = ref('');
  const remark = ref('');
  const weChat = ref('');
  const passwordStrength = ref(0);
  const phoneVerified = ref<boolean>(false);
  const emailVerified = ref<boolean>(false);

  const deptName = ref('');
  const deptId = ref<string | number>('');
  const isLoadedMenu = ref<boolean>(false); // 菜单加载完毕
  const isLoadedTenantInfo = ref<boolean>(false); // tenantInfo加载完毕
  const passwordLastDate = ref('');

  const avatar = ref('');
  const roles = ref<Array<string>>([]); // 用户角色编码集合 → 判断路由权限
  const permissions = ref<Array<string>>([]); // 用户权限编码集合 → 判断按钮权限
  let tenantInfo = {
    tenantId: '',
    packageId: 0,
    logoLong: '',
    logoShort: '',
    address: '',
    sysFullName: '',
    companyName: '',
    sysShortName: '',
    isOpenReg: false, // 是否开启注册功能
    isOpenMer: false, // 是否商户注册功能
    expandFields: {
      bigPic: '',
      bgColor: '',
    }, // 扩展字段
  };

  onMounted(() => {
    let _tenantInfo = Cookies.get('tenantInfo');
    if (_tenantInfo) {
      tenantInfo = Object.assign(tenantInfo, JSON.parse(_tenantInfo));
    }
  });

  /**
   * 登录
   * @param loginData
   * @returns
   */
  const login = async (loginData: LoginData): Promise<AxiosResponse<LoginResult, any>> => {
    const [err, res] = await to(loginApi(loginData));
    if (res) {
      const data = res.data;
      setToken(data.access_token);
      token.value = data.access_token;
      return Promise.resolve(res);
    }
    return Promise.reject(err);
  };

  /**
   * profile登录
   * @param loginData
   * @returns
   */
  const loginProfile = async (loginData: LoginData): Promise<any> => {
    const [err, res] = await to(loginProfileApi(loginData));
    if (res) {
      const data = res.data;
      setToken(data.access_token);
      token.value = data.access_token;
      return Promise.resolve(res);
    }
    return Promise.reject(err);
  };

  /**
   * 单点登录
   * @param loginData
   * @returns
   */
  const loginSso = async (loginData: LoginData): Promise<AxiosResponse<LoginResult, any>> => {
    debugger;
    const [err, res] = await to(loginSsoApi(loginData));
    if (res) {
      const data = res.data;
      setToken(data.access_token);
      token.value = data.access_token;
      return Promise.resolve(res);
    }
    return Promise.reject(err);
  };

  /**
   * 单点临时登录
   * @param loginData
   * @returns
   */
  const loginSsoTemp = async (loginData: LoginData): Promise<AxiosResponse<LoginResult, any>> => {
    const [err, res] = await to(loginSsoTempApi(loginData));
    if (res) {
      openSessionToken(); // 开始临时登录
      const data = res.data;
      setToken(data.access_token);
      token.value = data.access_token;
      return Promise.resolve(res);
    }
    return Promise.reject(err);
  };

  // 获取用户信息
  const getInfo = async (): Promise<void> => {
    const [err, res] = await to(getUserInfo());
    if (res) {
      const data = res.data;
      const user = data.user;
      const profile = user.avatar == '' || user.avatar == null ? '' : user.avatar;
      if (data.roles && data.roles.length > 0) {
        // 验证返回的roles是否是一个非空数组
        roles.value = data.roles;
        permissions.value = data.permissions;
      } else {
        roles.value = ['ROLE_DEFAULT'];
      }
      userId.value = user.userId;
      tenantId.value = user.tenantId;
      packageId.value = user.packageId;
      name.value = user.userName;
      nickName.value = user.nickName;
      phoneNumber.value = user.phoneNumber;
      avatar.value = profile;
      email.value = user.email;
      remark.value = user.remark;
      weChat.value = user.weChat;
      passwordStrength.value = Number(user.passwordStrength || 0);
      phoneVerified.value = user.phoneVerified === 1;
      emailVerified.value = user.emailVerified === 1;
      passwordLastDate.value = user.passwordLastDate;

      deptName.value = user.deptName;
      deptId.value = user.deptId;

      if (!passwordLastDate.value) {
        // modal.alertWarning('首次登录请修改密码，点击右上角可以修改密码！');
      }
      return Promise.resolve();
    }
    return Promise.reject(err);
  };

  // 注销
  const logout = async (): Promise<void> => {
    await logoutApi();
    token.value = '';
    roles.value = [];
    permissions.value = [];
    removeToken();
  };

  /**
   * 获取账套信息
   */
  const getTenantInfo = async (mustLoad?: boolean) => {
    if (isLoadedTenantInfo.value && !mustLoad) return;
    isLoadedTenantInfo.value = true;

    let url = '/auth/tenant/getTenantInfo';
    const [err, res] = await to(postData(url, {}));
    if (err) {
      return;
    }

    if (res.result) {
      tenantInfo = Object.assign(tenantInfo, res.data);
      if (tenantInfo) {
        if (tenantInfo.logoLong) {
          let logoLong = JSON.parse(tenantInfo.logoLong)[0].url;
          tenantInfo.logoLong = logoLong;
        }
        if (tenantInfo.logoShort) {
          let logoShort = JSON.parse(tenantInfo.logoShort)[0].url;
          tenantInfo.logoShort = logoShort;
        }
        tenantId.value = tenantInfo.tenantId;
        sysFullName.value = tenantInfo.sysFullName;
        sysShortName.value = tenantInfo.sysShortName;
        Cookies.set('tenantInfo', JSON.stringify(tenantInfo), { expires: 30 });
      }
    }
  };

  return {
    token,
    tenantId,
    packageId,
    sysFullName,
    sysShortName,
    userId,
    nickName,
    phoneNumber,
    deptId,
    deptName,
    avatar,
    email,
    remark,
    weChat,
    passwordStrength,
    phoneVerified,
    emailVerified,

    roles,
    permissions,
    login,
    loginProfile,
    loginSso,
    loginSsoTemp,
    getInfo,
    logout,
    keys: 'dev',
    isLoadedMenu,
    tenantInfo,
    getTenantInfo,
  };
});

export default useUserStore;
// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
