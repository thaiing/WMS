import { toRefs, reactive, onMounted, computed, getCurrentInstance, ComponentInternalInstance, onActivated, watch, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BaseHookParams, BaseProperties, EditorType, DetailField, DataOptions } from '../../types/base-type';
import { getPageConfig } from '../../api/common/baseApi';
import useDropdownStore from '/@/stores/modules/dropdown';
const dropdownStore = useDropdownStore();
interface CustomProperties extends BaseProperties {
	initCallBack(): any;
}

export default function listActionHook(baseParams?: BaseHookParams) {
	let ins = getCurrentInstance() as ComponentInternalInstance;
	let proxy: CustomProperties;
	proxy = ins.proxy as CustomProperties;
	const route = useRoute();
	const router = useRouter();

	//#region 变量
	const state = reactive({
		dataOptions: {
			idField: '',
			tableId: 0,
			vueDataId: 0,
			tableView: '',
			idValue: 0,
			menuId: 0,
			pageSize: 15,
			total: 0,
			pageIndex: 1,
			isLoaded: false,
			editorType: EditorType.UNKNOWN, // 编辑类型，弹出还是内嵌
			global_editorProhibitCloseOnClickModal: false, //编辑页面禁止通过点击空白处关闭对话框
			tableName: '',
			webRouter: '', // 当前路由
			prefixRouter: '', // 后端路由
			editorCheckCode: '', // editor当前实例校验码
			where: {},
			footerRows: [],
		} as DataOptions,

		dataListOptions: {
			fields: <any>[],
			buttons: [],
		},
		editorOptions: {
			config: {},
			fields: <any>[],
			buttons: <any>[],
		},
		// 列表选中项
		dataListSelections: [],
		// 权限点
		authNodes: {
			save: true,
		} as any,
		// 按钮是否只读
		btnReadOnly: {
			save: false,
			auditing: false,
			add: false,
			delete: false,
			stop: false,
			open: false,
		},
		isLoaded: false,

		dropdownLoaded: false, // 下拉框是否加载完毕
		selectorLoading: false, // 查询loading
		initLoading: false, // 加载数据初始化loading
		// 表单数据集合
		searchData: {} as any,
		// 数据集合
		dataList: [],
		// 显示字段属性对话框
		showAttrDialog: false,
		singleSignCodeVisible: false,
		snConfig: {
			productPosition_Id: 0,
			singleSignCode: '',
		},
		selectRuleRow: {} as any,
	});
	//#endregion

	// 初始化数据
	let init = async (callback?: Function) => {
		let router = proxy.$route.path;
		if (baseParams?.custoJsonmRoute) {
			router = baseParams.custoJsonmRoute;
		}

		// 加载页面布局数据
		let jsonUrl = '/static' + router + '.json';
		let pageConfig = await getPageConfig(jsonUrl);
		if (pageConfig.status !== 200) {
			proxy.$message.error('加载json配置文件错误：' + pageConfig.statusText);
			return;
		}

		const uiParams = pageConfig.data;
		// 系统自动计算列宽
		uiParams.dataListOptions.fields.forEach((field: any) => {
			field.minWidth = field.minWidth || 80;
		});

		// 获得表格自定义设置，存储在本地localStorage
		let key = 'tableConfig_' + router;
		let fields = localStorage.getItem(key);
		if (fields) {
			fields = JSON.parse(fields);
			uiParams.dataListOptions.fields = fields;
		}

		// 加载权限
		await loadAuth(uiParams, callback);
	};

	// 加载权限
	let loadAuth = async (uiParams: any, callback?: Function) => {
		// 获得明细表
		let subTableViews = uiParams.editorOptions.fields.filter((item: any) => item.type === 'detail-grid').map((item: any) => item.subTableName);

		// 加载页面权限
		let params = {
			id: uiParams.dataOptions.menuId,
			tableId: uiParams.dataOptions.tableId,
			// 根据原始名称找到用户自定义UIID，名称优先于fromVueData_Id
			vueDataName: uiParams.dataOptions.vueDataName,
			// 根据原始ID找到用户自定义UIID
			fromVueData_Id: uiParams.dataOptions.vueDataId,
			tableView: uiParams.dataOptions.tableView,
			subTableViews: subTableViews,
		};
		let res: any = {
			result: true,
			data: 'confirm=1,modify=1,delete=1,search=1,export=1,print=1,open=1,stop=1,sorting=1,detailAdd=1,detailDelete=1,copy=1',
			subUserJsons: [],
			userUIJson: {},
			global_openSortable: true,
			global_closeUserUIJson: false,
			global_editorProhibitCloseOnClickModal: true,
		}; // await getAuthNode(params);

		proxy.common.showMsg(res);
		if (res.result && res.data) {
			const auths = res.data.split(',');
			auths.forEach((item: any) => {
				const nodes = item.split('=');
				if (nodes.length >= 2) {
					state.authNodes[nodes[0]] = nodes[1] === '1';
				}
			});
		}

		// 自定义UI
		if (res.result && !res.global_closeUserUIJson && res.userUIJson && res.userUIJson.dataOptions) {
			state.dataOptions = res.userUIJson.dataOptions;
			state.dataListOptions = res.userUIJson.dataListOptions;
			state.editorOptions = res.userUIJson.editorOptions;
		} else {
			// 加载默认页面UI参数
			state.dataOptions = uiParams.dataOptions;
			state.dataListOptions = uiParams.dataListOptions;
			state.editorOptions = uiParams.editorOptions;
		}

		// 自定义全局开关参数参数
		state.dataOptions.global_editorProhibitCloseOnClickModal = !!res.global_editorProhibitCloseOnClickModal;
		// 自定义表名
		let tableName = proxy.$options.tableName;
		if (tableName) {
			state.dataOptions.tableName = tableName;
		}
		//

		// 获得表格自定义设置
		let router = proxy.$route.fullPath;
		let key = 'tableConfig_' + router;
		let fields = localStorage.getItem(key);
		let _fields: Array<any> = [];
		if (fields) {
			_fields = JSON.parse(fields);
			state.dataListOptions.fields = _fields;
		}
		// 开启全局数据排序
		if (res.global_openSortable) {
			state.dataListOptions.fields.forEach((item: any) => {
				const f = _fields.find((r) => r.prop === item.prop);
				if (item.prop === '_action') {
					item.sortable = false;
				} else {
					if (f) {
						item.sortable = f.sortable;
					} else {
						item.sortable = true;
					}
				}
			});
		}

		// 合并自定义设置
		setUserJson(res);

		// 自定义函数，用于处理数据
		let _init = baseParams?.init;
		if (typeof _init === 'function') {
			_init();
		}
		// 自定义函数，用于权限
		let doAuth = baseParams?.doAuth;
		if (typeof doAuth === 'function') {
			doAuth();
		}
		// 优先加载下拉框，然后在加载数据
		await dropdownStore.loadDropDown({
			dataListOptions: state.dataListOptions,
			dataOptions: state.dataOptions,
			editorOptions: state.editorOptions,
		});

		if (typeof callback === 'function') {
			callback();
		}
	};

	// 合并自定义设置
	let setUserJson = (res: any) => {
		const userJson = res.userJson;
		// 查找明细字段
		let _findEditorField = function (array: Array<any>, prop: string) {
			for (const item of array) {
				if (item.type === 'grid') {
					for (const colItem of item.columns) {
						const _field: any = _findEditorField(colItem.fields, prop);
						if (_field) return _field;
					}
				} else if (item.type === 'inline-group') {
					const _field: any = _findEditorField(item.fields, prop);
					if (_field) return _field;
				} else if (item.type === 'detail-grid') {
					const _field: any = _findEditorField(item.fields, prop);
					if (_field) return _field;
				} else {
					if (item.options && item.options.prop === prop) {
						return item;
					}
				}
			}
		};
		if (userJson && userJson.fields) {
			// 存在自定义排序
			let hasSortNo = false;
			userJson.fields.forEach((field: any) => {
				// 列表页面
				const _field = state.dataListOptions.fields.find((f: any) => f.prop === field.prop);
				if (_field) {
					if (field.sortNo) {
						_field.sortNo = field.sortNo;
						hasSortNo = true;
					}
					if (field.label) {
						_field.label = field.label;
					}
					if (field.width) {
						_field.width = field.width;
					}
				}
				// 编辑页面
				const _fieldEditor = _findEditorField(state.editorOptions.fields, field.prop);
				if (_fieldEditor) {
					if (field.label) {
						_fieldEditor.label = field.label;
					}
					if (field.blank !== undefined) {
						_fieldEditor.options.required = !field.blank;
						if (_fieldEditor.rules) {
							const rule = _fieldEditor.rules.find((item: any) => item.required);
							if (rule) {
								rule.required = !field.blank;
							}
						}
					}
				}
			});
			// 列表进行排序
			if (hasSortNo) {
				state.dataListOptions.fields.sort((a: any, b: any) => {
					return (a.sortNo || 0) > (b.sortNo || 0) ? -1 : 1;
				});
			}
		}

		// 系统自动计算列宽
		state.dataListOptions.fields.forEach((field: any) => {
			let width = 80;
			if (field.label) {
				const _width = 16 * field.label.length;
				if (_width > width) {
					width = _width;
				}
			}
			// 开启全局数据排序
			if (res.global_openSortable) {
				width += 25;
			}
			if (field.remark) {
				width += 20;
			} else if (field.prop === 'batchNumber') {
				// 批次号
				if (width < 200) width = 200;
			}
			if (width > field.width || !field.width) {
				field.minWidth = width;
				delete field.width;
			}
		});

		// 获得明细表
		let subTableViews = state.editorOptions.fields.filter((item: any) => item.type === 'detail-grid');

		// 明细字段处理
		const subUserJsons = res.subUserJsons;
		subUserJsons.forEach((item: any) => {
			const userJson = item.userJson;
			const subFields = subTableViews.find((row: any) => row.subTableName === item.subTableName).fields;
			if (userJson && userJson.fields) {
				// 存在自定义排序
				let hasSortNo = false;
				userJson.fields.forEach((field: any) => {
					// 明细列表
					const _field = subFields.find((f: any) => f.prop === field.prop);
					if (_field) {
						if (field.sortNo) {
							_field.sortNo = field.sortNo;
							hasSortNo = true;
						}
						if (field.label) {
							_field.label = field.label;
						}
						if (field.width) {
							_field.width = field.width;
						}
					}
				});
				// 列表进行排序
				if (hasSortNo) {
					subFields.sort((a: any, b: any) => {
						return (a.sortNo || 0) > (b.sortNo || 0) ? -1 : 1;
					});
				}
			}
		});
	};

	/**
	 * 翻译下拉框值
	 */
	const translateText = (prop: any, val: any, dropdownId: any, col: any) => {
		if (col && col.options) {
			if (col.options.remote === 'bindDropdown') {
				const _dropdown_Id = col.options.dropdownId;
				if (_dropdown_Id > 0) {
					dropdownId = _dropdown_Id;
				}
				const ddList = dropdownStore.getDropdown(dropdownId);
				if (!ddList) return val;
				const item = ddList.value.find((item: any) => {
					return item.value === val;
				});
				if (!item) return val;
				return item.label;
			} else if (col.options.remote === false) {
				const ddList = col.options.options;
				if (!ddList) return val;
				const item = ddList.find((item: any) => {
					return item.value === val;
				});
				if (!item) return val;
				return item.label;
			} else {
				return val;
			}
		} else {
			const ddList = dropdownStore.getDropdown(dropdownId);
			if (!ddList) return val;
			const item = ddList.value.find((item: any) => {
				return item.value === val;
			});
			if (!item) return val;
			return item.label;
		}
	};

	onMounted(async () => {
		if (!state.isLoaded) {
			state.isLoaded = true;
			await init();
		}
	});

	return {
		baseState: state,
		translateText,
	};
}
