import store from '/@/stores';
import { defineStore } from 'pinia';
import { getAuthNodeApi } from '../../api/common/baseApi';
import { BaseObject } from '/@/types/common';
import { DataOptions } from '/@/types/base-type';
import to from 'await-to-js';

/**
 * 权限点store管理
 */
export const useAuthNodeStore = defineStore('AuthNode', () => {
	const state = reactive({
		initLoading: false, // 开始加载
		dataList: [] as Array<{ key: string; value: BaseObject }>,
	});

	/**
	 * 加载列表页面下拉框数据
	 * @param options
	 * @param refresh
	 * @returns
	 */
	const loadAuthNode = async (dataOptions: DataOptions, refresh?: boolean) => {
		if (refresh) {
			// 清空，重新加载
			state.dataList = [];
		}
		let key = 'authNode' + dataOptions.menuId;
		let authNode = state.dataList.find((item) => item.key === key);
		if (authNode) {
			return authNode.value;
		}

		state.initLoading = true;
		let params = {
			...dataOptions,
		};
		let [err, res] = await to(getAuthNodeApi(params));
		if (err) {
			state.initLoading = false;
			return {} as BaseObject;
		}

		state.dataList.push({
			key: key,
			value: res!.data,
		});
		state.initLoading = false;

		authNode = state.dataList.find((item) => item.key === key);
		if (authNode) {
			return authNode.value;
		}
		return {} as BaseObject;
	};

	// 重新加载下拉框数据
	const reLoadAuthNode = async (options: DataOptions, refresh?: boolean) => {
		await loadAuthNode(options, refresh);
	};

	// 更新下拉框值
	const setAuthNode = (menuId: number, value: any) => {
		let key = 'authNode' + menuId;
		let authNodes = state.dataList.find((item) => item.key === key);
		if (authNodes) {
			authNodes.value = value;
		} else {
			authNodes = {
				key: key,
				value: value,
			};
			state.dataList.push(authNodes);
		}
	};

	/**
	 * 获得权限点值
	 * @param menuId 模块ID
	 * @returns 返回下拉框
	 */
	const getAuthNode = async (menuId: number) => {
		let key = 'authNode' + menuId;
		let authNodes = state.dataList.find((item) => item.key === key);
		return authNodes;
	};

	return {
		state,
		loadAuthNode,
		reLoadAuthNode,
		setAuthNode,
		getAuthNode,
	};
});

export default useAuthNodeStore;
// 非setup
export function useAuthNodeStoreHook() {
	return useAuthNodeStore(store);
}
