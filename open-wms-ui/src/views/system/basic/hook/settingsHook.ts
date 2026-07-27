import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { BaseObject } from '/@/types/common';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';

export default function settingsHook(hookOptions?: any) {
  let ins = getCurrentInstance() as ComponentInternalInstance;
  let proxy = ins.proxy as BaseProperties;
  let { state } = hookOptions;

  // 加载数据
  const loadParam = async (callback?: Function) => {
    let keys = Object.keys(state.formData).join(',');
    let url = '/system/core/config/getConfigValues';
    let params = {
      keys: keys,
    };
    let [err, res] = await to(postData(url, params, false));
    if (err) {
      return;
    }
    if (res?.result) {
      state.valueList = res.data;
      // 获得参数值列表，将数字转换为对象
      res.data.forEach((item: any) => {
        let configKey = item.configKey; // 字段名称
        let configValue = item.configValue;

        if (proxy.common.isNumber(item.configValue)) {
          configValue = parseInt(item.configValue);
        }
        if (typeof callback === 'function') {
          callback(configKey, configValue);
        } else {
          state.formData[configKey] = configValue;
        }
      });
    }
  };

  // 保存数据
  const onSave = async (callback?: any) => {
    Object.keys(state.formData).forEach((configKey) => {
      let item: any = state.valueList.find((item: any) => {
        return item.configKey === configKey;
      });
      if (typeof callback === 'function') {
        callback(configKey, item);
      } else {
        if (item) {
          item.configValue = state.formData[configKey];
        } else {
          state.valueList.push({
            configKey: configKey,
            configType: 'N',
            configValue: state.formData[configKey],
          });
        }
      }
    });

    let url = '/system/core/config/saveParams';
    let params = {
      valueList: state.valueList,
    };
    let [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    proxy.common.showMsg(res);
    if (res?.result) {
      res.data.forEach((item: any) => {
        let existItem = state.valueList.find((f: any) => f.configKey === item.configKey);
        if (existItem) {
          existItem.configId = item.configId;
        }
      });
    }
  };

  return {
    loadParam,
    onSave,
  };
}
