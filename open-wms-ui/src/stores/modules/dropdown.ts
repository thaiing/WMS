import store from '/@/stores';
import { defineStore } from 'pinia';
import { getDropDownApi } from '../../api/common/baseApi';
import { BaseObject } from '/@/types/common';

/**
 * 下拉框store管理
 */
export const useDropdownStore = defineStore('dropdown', () => {
  const state = reactive({
    dropdownLoaded: true, // 是否已经加载
    initLoading: false, // 开始加载
    dataList: [] as Array<{ key: string; value: Array<EmptyObjectType> }>,
    ddIDs: [] as Array<number>, // 下拉框ID
  });

  /**
   * 获取列表下拉框ID
   * @param array
   */
  let getListDropdowId = (array: Array<any>) => {
    array.forEach((item: any) => {
      if (Array.isArray(item)) {
        getListDropdowId(item);
      } else {
        if (item.options && item.options.dropdownId > 0) {
          if (!state.ddIDs.some((s) => s === item.options.dropdownId)) {
            state.ddIDs.push(item.options.dropdownId);
          }
        } else if (item.dropdownId) {
          if (!state.ddIDs.some((s) => s === item.dropdownId)) {
            state.ddIDs.push(item.dropdownId);
          }
        }
      }
    });
  };

  /**
   * 获取编辑页面下拉框ID
   * @param array
   */
  let getEditorDropdowId = (array: Array<any>) => {
    array.forEach((item: any) => {
      if (item.type === 'grid') {
        item.columns.forEach((colItem: any) => {
          getEditorDropdowId(colItem.fields);
        });
      } else if (item.type === 'inline-group') {
        getEditorDropdowId(item.fields);
      } else if (item.type === 'detail-grid') {
        getEditorDropdowId(item.fields);
      } else {
        if (item.options && item.options.dropdownId) {
          if (!state.ddIDs.some((s) => s === item.options.dropdownId)) {
            state.ddIDs.push(item.options.dropdownId);
          }
        } else if (item.dropdownId) {
          // 明细下拉框ID
          if (!state.ddIDs.some((s) => s === item.dropdownId)) {
            state.ddIDs.push(item.dropdownId);
          }
        }
      }
    });
  };

  /**
   * 加载列表页面下拉框数据
   * @param options
   * @param refresh
   * @returns
   */
  const loadDropDown = async (options: any, refresh?: boolean) => {
    if (refresh) {
      // 清空，重新加载
      state.ddIDs = [];
      state.dataList = [];
    }
    const { dataListOptions, editorOptions } = options;

    // 获取列表下拉框ID
    if (dataListOptions && Array.isArray(dataListOptions.fields)) {
      getListDropdowId(dataListOptions.fields);
    }
    if (editorOptions && Array.isArray(editorOptions.fields)) {
      getEditorDropdowId(editorOptions.fields);
    }
    if (!state.ddIDs.length) {
      state.dropdownLoaded = true;
      return;
    }

    state.initLoading = true;
    // 过滤掉已经加载的下拉框，不要重复加载了
    let ddIDs = state.ddIDs.filter((id) => {
      let key = 'dropdown' + id;
      return !state.dataList.some((item) => item.key === key);
    });
    if (!ddIDs.length) {
      return;
    }

    let dropdownResult = await getDropDownApi(ddIDs);
    if (dropdownResult.code !== 200) {
      return [];
    }

    Object.keys(dropdownResult.data).forEach((key) => {
      state.dataList.push({
        key: key,
        value: dropdownResult.data[key],
      });
    });
  };

  // 重新加载下拉框数据
  const reLoadDropDown = (options: any, refresh?: boolean) => {
    state.dropdownLoaded = false;
    loadDropDown(options, refresh);
  };

  /**
   * 根据ID获取下拉框值
   * @param ids 需要加载的下拉框数组
   * @returns
   */
  const loadDropDownById = async (ids: Array<number>) => {
    state.initLoading = true;
    // 过滤掉已经加载的下拉框，不要重复加载了
    let ddIDs = ids.filter((id) => {
      let key = 'dropdown' + id;
      return !state.dataList.some((item) => item.key === key);
    });
    if (!ddIDs.length) {
      return;
    }

    let dropdownResult = await getDropDownApi(ddIDs);
    if (dropdownResult.code !== 200) {
      return [];
    }

    Object.keys(dropdownResult.data).forEach((key) => {
      state.dataList.push({
        key: key,
        value: dropdownResult.data[key],
      });
    });
  };

  // 更新下拉框值
  const setDropDown = (dropdownId: number, value: Array<any>) => {
    let key = 'dropdown' + dropdownId;
    let drowdown = state.dataList.find((item) => item.key === key);
    if (drowdown) {
      drowdown.value = value;
    } else {
      drowdown = {
        key: key,
        value: value,
      };
      state.dataList.push(drowdown);
    }
  };

  /**
   * 获得下拉框值
   * @param dropdownId 下拉框ID
   * @returns 返回下拉框
   */
  const getDropdown = (dropdownId: number) => {
    let key = 'dropdown' + dropdownId;
    let drowdown = state.dataList.find((item) => item.key === key);
    return drowdown;
  };

  /**
   * 翻译下拉框值
   * @param val 需要翻译的值
   * @param dropdownId 下拉框ID
   * @returns 返回翻译值
   */
  const translateText = (val: any, dropdownId: number) => {
    let key = 'dropdown' + dropdownId;
    let drowdown = state.dataList.find((item) => item.key === key);
    if (!drowdown) return val;
    if (typeof val === 'string' && val.indexOf(',') >= 0) {
      val = val.split(',');
    }
    if (Array.isArray(val)) {
      let labels: any[] = [];
      val.forEach((itemVal: any) => {
        let item = drowdown.value.find((item: any) => {
          return String(item.value) === String(itemVal);
        });
        if (item) labels.push(item.label);
        else labels.push(itemVal);
      });
      return labels.join(',');
    } else {
      let item = drowdown.value.find((item: any) => {
        return String(item.value) === String(val);
      });
      if (!item) return val;
      return item.label;
    }
  };

  return {
    state,
    /**
     * 加载列表下拉框
     */
    loadDropDown,
    /**
     * 重新加载列表下拉框
     */
    reLoadDropDown,
    setDropDown,
    getDropdown,
    translateText,
    /**
     * 根据ID获取下拉框值
     * @param ids 需要加载的下拉框数组
     * @returns
     */
    loadDropDownById,
  };
});

export default useDropdownStore;
// 非setup
export function useDropdownStoreHook() {
  return useDropdownStore(store);
}
