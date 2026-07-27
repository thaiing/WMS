import request from '/@/utils/request';
import { AxiosPromise } from 'axios';
import { DeployVO, ProcessQuery } from '/@/api/workflow/deploy/types';
import { postData } from '../../common/baseApi';
import to from 'await-to-js';
import { data } from 'jquery';

// 查询流程部署列表
export function listDeploy(query: ProcessQuery): AxiosPromise<DeployVO[]> {
	return request({
		url: '/workflow/deploy/list',
		method: 'get',
		params: query,
	});
}

export function listPublish(query: ProcessQuery): AxiosPromise<DeployVO[]> {
	return request({
		url: '/workflow/deploy/publishList',
		method: 'get',
		params: query,
	});
}

// 获取流程模型流程图
export function getBpmnXml(definitionId?: string) {
	return request({
		url: '/workflow/deploy/bpmnXml/' + definitionId,
		method: 'get',
	});
}

// 修改流程状态
export function changeState(params?: any) {
	return request({
		url: '/workflow/deploy/changeState',
		method: 'put',
		params: params,
	});
}

// 删除流程部署
export function delDeploy(deployIds?: string | string[]) {
	return request({
		url: '/workflow/deploy/' + deployIds,
		method: 'delete',
	});
}

/**
 * 获取业务流程部署ID
 * @param menuId 模块ID
 * @param billId 业务单ID
 * @returns 部署ID
 */
export async function getRowDeployId(menuId: number, billId: number) {
	let url = '/system/task/workflow/getDeployId';
	let params = {
		menuId,
		billId,
	};
	let [err, res] = await to(postData(url, params));
	if (err) {
		return null;
	}
	return res?.data.deployId;
}
