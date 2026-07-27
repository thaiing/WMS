import request from '/@/utils/request';
import { AxiosPromise } from 'axios';
import { LoginData, LoginResult, VerifyCodeResult, TenantInfo } from './types';
import { UserInfo } from '/@/api/system/user/types';

// pc端固定客户端授权id
const clientId = import.meta.env.VITE_APP_CLIENT_ID;

/**
 * @param data {LoginData}
 * @returns
 */
export function login(data: LoginData): AxiosPromise<LoginResult> {
  const params = {
    tenantId: data.tenantId,
    username: data.username.trim(),
    password: data.password,
    redirect: data.redirect,
    code: data.code,
    uuid: data.uuid,
    clientId: data.clientId || clientId,
    grantType: data.grantType || 'password',
  };
  return request({
    url: '/auth/login',
    headers: {
      isToken: false,
      isEncrypt: true,
    },
    method: 'post',
    data: params,
  });
}

/**
 * @param data {LoginData}
 * @returns
 */
export function loginProfile(data: LoginData): AxiosPromise<LoginResult> {
  const params = {
    tenantId: data.tenantId,
    username: data.username.trim(),
    password: data.password,
    code: data.code,
    uuid: data.uuid,
    clientId: data.clientId || clientId,
    grantType: data.grantType || 'password',
  };
  return request({
    url: '/auth/loginProfile',
    headers: {
      isToken: false,
      isEncrypt: true,
    },
    method: 'post',
    data: params,
  });
}

/**
 * @param data {LoginData}
 * @returns
 */
export function loginSso(data: LoginData): AxiosPromise<LoginResult> {
  const params = {
    tenantId: data.tenantId,
    username: data.username.trim(),
    phoneNumber: data.phoneNumber?.trim(),
    password: data.password,
    redirect: data.redirect,
    code: data.code,
    uuid: data.uuid,
    clientId: data.clientId || clientId,
    grantType: data.grantType || 'password',
  };
  return request({
    url: '/auth/loginSso',
    headers: {
      isToken: false,
      isEncrypt: false,
    },
    method: 'post',
    data: params,
  });
}

/**
 * @param data {LoginData}
 * @returns
 */
export function loginSsoTemp(data: LoginData): AxiosPromise<LoginResult> {
  const params = {};
  return request({
    url: `/auth/tempLogin/${data.tenantId}/${data.token}`,
    headers: {
      isToken: false,
      isEncrypt: false,
    },
    method: 'post',
    data: params,
  });
}

// 注册方法
export function register(data: any) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: data,
  });
}

/**
 * 注销
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  });
}

/**
 * 获取验证码
 */
export function getCodeImg(): AxiosPromise<VerifyCodeResult> {
  return request({
    url: '/auth/code',
    headers: {
      isToken: false,
    },
    method: 'get',
    timeout: 20000,
  });
}

// 获取用户详细信息
export function getInfo(): AxiosPromise<UserInfo> {
  return request({
    url: '/system/permission/user/getInfo',
    method: 'get',
  });
}

// 获取租户列表
export function getTenantList(): AxiosPromise<TenantInfo> {
  return request({
    url: '/auth/tenant/list',
    headers: {
      isToken: false,
    },
    method: 'get',
  });
}
