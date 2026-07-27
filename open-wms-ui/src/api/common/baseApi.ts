import to from 'await-to-js';
import { DeleteBo, DeleteVo, EditorVo, PageEditorBo, SaveEditorBo } from '../types';
import { BaseObject, DataType, QueryType, QueryBo, PageListBo } from '/@/types/common';
import request from '/@/utils/request';
import axios, { RawAxiosRequestHeaders } from 'axios';

/**
 * 通用POST方法
 */
export function postData(url: string, params?: EmptyObjectType | Array<any>, headers?: RawAxiosRequestHeaders | boolean) {
  let _headers: any = {};
  if (typeof headers === 'boolean' && headers === false) {
    _headers.noLoading = true; // 不显示加载信息
  } else {
    _headers = headers;
  }

  return request({
    url: url,
    method: 'post',
    data: params,
    headers: _headers,
  });
}

/**
 * 通用GET方法
 */
export function getData(url: string, params?: BaseObject | Array<any>) {
  return request({
    url: url,
    method: 'get',
    data: params,
  });
}

/**
 * 通用DELETE方法
 */
export function deleteData(url: string, params?: BaseObject | Array<any>, headers?: RawAxiosRequestHeaders) {
  return request({
    url: url,
    method: 'delete',
    data: params,
    headers,
  });
}
/**
 * 通用PUT方法
 */
export function putData(url: string, params: EmptyObjectType | Array<any>, headers?: RawAxiosRequestHeaders) {
  return request({
    url: url,
    method: 'put',
    data: params,
    headers,
  });
}

/**
 * 解密
 */
export function decryptApi(params: any) {
  return request({
    url: '/auth/decrypt',
    method: 'post',
    data: params,
  });
}

/**
 * 获取静态页面参数配置
 */
export function getPageConfig(url: string) {
  return axios.get(url);
}

/**
 * 获取页面权限配置
 */
export function getAuthNodeApi(params: any) {
  return request({
    url: '/system/core/common/getAuthNode',
    method: 'post',
    data: params,
  });
}

/**
 * 加载下拉框数据
 * @param ddIDs 下拉框ID集合，数组或者逗号分隔的字符串
 * @param dataOptions 下拉框加载参数
 * @param callback 回调函数
 * @returns 无返回值
 */
export function getDropDownApi(dropdownIds: string | Array<any>) {
  if (Array.isArray(dropdownIds)) {
    dropdownIds = dropdownIds.join(',');
  }

  let params = {
    dropdownIds,
  };
  let queryBoList: Array<QueryBo> = [
    {
      column: 'dropdownId',
      values: dropdownIds,
      queryType: QueryType.IN,
      dataType: DataType.LONG,
    },
  ];

  return request({
    url: '/system/core/common/loadDropDown',
    method: 'post',
    data: queryBoList,
    headers: {
      repeatSubmit: false, // 不需要校验重复提交
    },
  });
}

/**
 * 获取列表页面数据
 */
export function getPageList(params: PageListBo) {
  return request({
    url: `${params.prefixRouter}/${params.listMethod || 'pageList'}`,
    method: 'post',
    data: params,
  });
}

/**
 * 获取编辑页面数据
 */
export function getEditor(params: PageEditorBo) {
  return request<EditorVo>({
    url: `${params.prefixRouter}/editor`,
    method: 'post',
    data: params,
  });
}

/**
 * 保存编辑页面数据
 */
export function saveEditor(params: SaveEditorBo) {
  return request<EditorVo>({
    url: `${params.prefixRouter}/saveEditor`,
    method: 'post',
    data: params,
  });
}

/**
 * 复制编辑页面数据
 */
export function copyEditor(params: SaveEditorBo) {
  return request<EditorVo>({
    url: `${params.prefixRouter}/copyEditor`,
    method: 'post',
    data: params,
  });
}

/**
 * 终止编辑页面数据
 */
export function stopEditor(params: any) {
  return request<EditorVo>({
    url: `${params.prefixRouter}/stop`,
    method: 'post',
    data: {
      ids: params.idValue,
      menuId: params.menuId,
      tableName: params.tableName,
    },
  });
}

/**
 * 开启编辑页面数据
 */
export function openEditor(params: any) {
  return request<EditorVo>({
    url: `${params.prefixRouter}/open`,
    method: 'post',
    data: {
      ids: params.idValue,
      menuId: params.menuId,
      tableName: params.tableName,
    },
  });
}

/**
 * 删除数据
 */
export function removeData(params: DeleteBo, headers?: RawAxiosRequestHeaders | boolean) {
  let _headers: any = {};
  if (typeof headers === 'boolean' && headers === false) {
    _headers.noLoading = true; // 不显示加载信息
  } else {
    _headers = headers;
  }

  let url = `${params.prefixRouter}/remove/${params.idValue.join(',')}`;
  if (params.deleteUrl) {
    url = `${params.deleteUrl}/${params.idValue.join(',')}`; // 走自定义接口
  }
  return request<DeleteVo>({
    url: url,
    method: 'delete',
    data: params,
    headers: _headers,
  });
}

/**
 * 审核编辑页面数据
 */
export function auditingEditor(params: any) {
  return request<EditorVo>({
    url: `${params.prefixRouter}/multiAuditing`,
    method: 'post',
    data: Array.isArray(params.idValue) ? params.idValue : [params.idValue],
  });
}

/**
 * 反审核编辑页面数据
 */
export function reAuditingEditor(params: any) {
  return request<EditorVo>({
    url: `${params.prefixRouter}/reMultiAuditing`,
    method: 'post',
    data: {
      ids: Array.isArray(params.idValue) ? params.idValue : [params.idValue],
    },
  });
}

/**
 * 获得仓库和货位信息
 */
export const getPositionList = async (state: any, base: any) => {
  var url = '/basic/storage/position/getPositionList';
  var params = {
    storageId: state.formData.storageId,
    positionType: 4, // 4=收货位
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    state.positionList = res.data;
    if (state.positionList.length) {
      state.formData.positionName = state.positionList[0].positionName;
      // 明细设置默认货位
      base.state.tableData.forEach((row: any) => {
        row.positionName = state.formData.positionName;
      });
    }
  } else {
    state.positionList = [];
  }
  // 条码框获得焦点
  base.focus('productModel');
};
