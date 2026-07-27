import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { UserCacheEnum } from '/@/enums/UserCacheEnum';
import common from '/@/utils/common';

/**
 * 基础数据对象
 */
export interface BaseFormData {
  snList: string; // 扫描SN集合
  isScanSn: boolean; // 开启SN扫描
  isCheckSn: boolean; // 开启SN实时校验SN
  isValidateProductCode: boolean; // 是否校验商品
  productId: number | undefined;
  productName: '';
  productModel: string;
  scanQty: number;
  isOnShelve: boolean; // 自动生成上架单
  checkSnList: string; // 核验SN集合
  storageId: number | undefined; // 仓库ID
  storageName: string; // 仓库名称
  consignorId: number | undefined;
  consignorCode: string;
  consignorName: string;
  plateCode: string;
  positionName: string | undefined;
}

export default function scanHook(hookOptions?: any) {
  if (!hookOptions) hookOptions = {};

  let ins = getCurrentInstance() as ComponentInternalInstance;
  let proxy = ins.proxy as BaseProperties;

  //#region 变量
  const state = reactive({
    /**
     * 选中行号
     */
    multipleSelection: [] as any[],
    /**
     * 明细数据
     */
    tableData: [] as any[],
    tableDataPage: [] as any[], // 分页明细
    // 当前正在扫描的数据
    currentRow: null as EmptyObjectType | null,
    // 已经找到的数据
    existRows: [] as Array<any>,
    // 配置参数
    config: {} as EmptyObjectType,
    isPlay: true, // 播放声音
    formData: {
      snList: '', // 扫描SN集合
      checkSnList: '', // 核验SN集合
      isScanSn: false, // 开启SN扫描
      isCheckSn: false, // 开启实时校验SN
      isValidateProductCode: true, // 是否校验商品
      productId: 0,
      productModel: '',
      productName: '',
      scanQty: 0,
      isOnShelve: false, // 直接上架
      storageId: undefined, // 仓库ID
      storageName: '', // 仓库名称
      consignorId: undefined,
      consignorCode: '',
      consignorName: '',
      plateCode: '',
      positionName: undefined,
    } as BaseFormData,
    setting: {
      fields: [],
    },
    saving: false, // 正在保存
    isPositionLoading: false,
    positionNameList: [] as Array<string>,
    // 货位选择器配置
    positionSelector: {
      title: '货位选择器',
      width: '1000px',
      visible: false,
      // 配置路由
      router: '/selector/position',
    },
  });
  //#endregion

  //#region 计算属性
  // 获取当前扫描的SN个数
  const snCount = computed(() => {
    let snList = state.formData.snList;
    let _snList = snList ? snList.replace(/,/gi, '\n').replace(/\\r/gi, '').split('\n') : [];
    _snList = _snList.filter((item: string) => item); // 清除空值
    return _snList.length;
  });
  //#endregion

  onMounted(async () => {
    // 获取配置参数
    methods.getBaseConfig();
    // 获取扫描数据列表
    // await methods.getScanColumnData(1502, 'app扫描UI');
  });

  const methods = {
    /**
     * 获得配置参数
     */
    async getBaseConfig() {
      if (!hookOptions.config) return;

      let keys = Object.keys(hookOptions.config.value).join(',');
      let url = '/system/core/config/getConfigValues';
      let params = {
        keys: keys,
      };
      let [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      if (res?.result) {
        // 获得参数值列表，将数字转换为对象
        res.data.forEach((item: any) => {
          let configKey = item.configKey; // 字段名称
          let configValue = item.configValue;

          if (typeof hookOptions.doData === 'function') {
            hookOptions.doData(item, hookOptions);
          } else {
            if (proxy.common.isNumber(item.configValue)) {
              configValue = parseInt(item.configValue);
            }
            hookOptions.config.value[configKey] = !!configValue;
          }
        });
        state.config = hookOptions.config.value;
      }
    },
    /**
     *  播放正确声音
     */
    play() {
      if (state.isPlay) {
        proxy.$refs.sound_correct.currentTime = 0;
        proxy.$refs.sound_correct.play();
      }
    },
    /**
     *  播放失败声音
     */
    showError(msg: string) {
      proxy.$message.error(msg);
    },
    /**
     *  播放失败声音
     */
    playError() {
      proxy.$refs.sound_error.currentTime = 0;
      proxy.$refs.sound_error.play();
    },
    // 获得焦点
    focus(refName: string) {
      if (proxy.$refs[refName]) {
        if (proxy.$refs[refName].focus) proxy.$refs[refName].focus();
        if (proxy.$refs[refName].select) proxy.$refs[refName].select();
      } else {
        proxy.$message.error('焦点不存在：' + refName);
      }
    },
    /**
     * 判断扫描包装条码
     * @param {dataRows} 筛选数据
     * @param {successCallback} 扫描成功后，回调函数
     * @param {noExistCallback} 扫描不存在后，回调函数
     */
    async checkPackingProductModel(dataRows?: any, successCallback?: any, noExistCallback?: any) {
      if (!dataRows || !Array.isArray(dataRows)) {
        if (typeof dataRows === 'function') {
          successCallback = dataRows;
        }
        dataRows = state.tableData;
      }
      let result = await methods.selectRow(dataRows, noExistCallback);
      if (result) return;

      if (!state.formData.isScanSn) {
        // 常规扫描
        methods.setRowQty();
      } else {
        // 开启SN扫描，不自动增加数量
        const sn = state.currentRow ? state.currentRow.singleSignCode : '';
        let snList: any[] = [];
        if (typeof sn === 'string') {
          snList = sn.split(',');
        }
        let validSnList = snList.filter((item) => item); // 有效SN
        validSnList = validSnList.map((item) => item.trim());
        validSnList.push('');
        state.formData.snList = validSnList.join('\n');
        // methods.scanSn();
        proxy.$nextTick(() => {
          methods.focus('snList');
        });
      }

      // 执行回调函数
      if (typeof successCallback === 'function') {
        successCallback(state.currentRow);
      }
    },
    // 根据条码选中
    async selectRow(dataRows: any, noExistCallback?: any) {
      let code = state.formData.productModel.trim();
      if (!code) return;
      if (state.currentRow) {
        const exists = methods.checkProductModelExist(code, state.currentRow);
        if (!exists || !state.currentRow.unFinishedQuantity) {
          state.currentRow = null;
        } else {
          state.currentRow.sortIndex = 1;
        }
      }
      if (!state.currentRow) {
        // 判断是否存在一码多品
        if (typeof hookOptions.customFindFilter === 'function') {
          state.existRows = hookOptions.customFindFilter(dataRows, code);
        } else {
          state.existRows = dataRows.filter((item: any) => {
            const exist = methods.checkProductModelExist(code, item);
            const overcharges = Number(item.overcharges || 0); // 超收比例
            const overchargesQty = Math.round((item.quantity || 0) * overcharges);
            const unFinishedQuantity = (item.unFinishedQuantity || 0) + overchargesQty;
            // UnFinishedQuantity不存在或者大于0
            return exist && (item.unFinishedQuantity === undefined || unFinishedQuantity > 0);
          });
        }
        // methods.focus('productModel');
        if (!state.formData.isValidateProductCode) {
          methods.focus('productModel');
        }

        if (state.config.global_scanSameProductCodeAndModel) {
          // 获取分组，如果都相同，获取第一个
          const groupList = state.existRows.reduce((all, next) => (all.some((item: any) => item.productCode === next.productCode && item.productModel === next.productModel) ? all : [...all, next]), []);
          if (groupList.length === 1) {
            state.existRows = groupList;
          }
        }

        if (state.existRows.length > 1) {
          proxy.$message.error(`【${code}】存在一码多品，需要手动选择需要扫描的明细，双击一下明细即可选择哦。`);
          state.existRows.forEach((item) => {
            item.sortIndex = 1;
          });
          // 置顶排序
          dataRows.sort(function (a: any, b: any) {
            return b.sortIndex - a.sortIndex;
          });

          dataRows.forEach((element: any) => {
            element.sortIndex = 0;
          });
          proxy.$refs.sound_error.currentTime = 0;
          methods.playError();
          return;
        }
        if (!state.existRows.length) {
          // 执行回调函数
          if (typeof noExistCallback === 'function') {
            return await noExistCallback(code);
          } else {
            proxy.$message.error(`【${code}】没有可扫描的数据`);
            methods.playError();
          }
          return;
        }

        // 设置当前行
        state.currentRow = state.existRows[0];
        if (state.currentRow) state.currentRow.sortIndex = 1;
      }
      if (state.currentRow) {
        state.currentRow.scanWeight = Math.Round(state.currentRow.weight * state.currentRow.finishedQuantity, 2);

        // 判断是否开启SN扫描
        state.formData.isScanSn = !!Number(state.currentRow.isManageSn);
      }
    },
    // 根据货位选中
    async selectRowByPositionName(positionName: any, noExistCallback: any) {
      const dataRows = state.tableData;
      if (!positionName) return;
      if (state.currentRow) {
        const exists = methods.checkPositionNameExist(positionName, state.currentRow);
        if (!exists || !state.currentRow.unFinishedQuantity) {
          state.currentRow = null;
        } else {
          state.currentRow.sortIndex = 1;
        }
      }
      if (!state.currentRow) {
        // 判断是否存在一码多品
        if (typeof hookOptions.customFindFilter === 'function') {
          state.existRows = hookOptions.customFindFilter(dataRows);
        } else {
          state.existRows = dataRows.filter((item: any) => {
            const exist = methods.checkPositionNameExist(positionName, item);
            const overcharges = Number(item.overcharges || 0); // 超收比例
            const overchargesQty = Math.round((item.quantity || 0) * overcharges);
            const unFinishedQuantity = (item.unFinishedQuantity || 0) + overchargesQty;
            // UnFinishedQuantity不存在或者大于0
            return exist && (item.unFinishedQuantity === undefined || unFinishedQuantity > 0);
          });
        }
        methods.focus('productModel');
        if (state.config.global_scanSameProductCodeAndModel) {
          // 获取分组，如果都相同，获取第一个
          const groupList = state.existRows.reduce((all, next) => (all.some((item: any) => item.productCode === next.productCode && item.productModel === next.productModel) ? all : [...all, next]), []);
          if (groupList.length === 1) {
            state.existRows = groupList;
          }
        }

        if (state.existRows.length > 1) {
          proxy.$message.error(`【${positionName}】存在一码多品，需要手动选择需要扫描的明细，双击一下明细即可选择哦。`);
          state.existRows.forEach((item) => {
            item.sortIndex = 1;
          });
          // 置顶排序
          dataRows.sort(function (a: any, b: any) {
            return b.sortIndex - a.sortIndex;
          });

          dataRows.forEach((element: any) => {
            element.sortIndex = 0;
          });
          proxy.$refs.sound_error.currentTime = 0;
          methods.playError();
          return;
        }
        if (!state.existRows.length) {
          // 执行回调函数
          if (typeof noExistCallback === 'function') {
            await noExistCallback(positionName);
          } else {
            proxy.$message.error(`【${positionName}】没有可扫描的数据`);
            methods.playError();
          }
          return;
        }

        // 设置当前行
        state.currentRow = state.existRows[0];
        if (state.currentRow) state.currentRow.sortIndex = 1;
        // 置顶排序
        dataRows.sort(function (a: any, b: any) {
          return b.sortIndex - a.sortIndex;
        });
      }
      if (state.currentRow) {
        state.currentRow.scanWeight = Math.Round(state.currentRow.weight * state.currentRow.finishedQuantity, 2);
        // 判断是否开启SN扫描
        state.formData.isScanSn = !!Number(state.currentRow.isManageSn);
      }
      methods.focus('productModel');
    },
    // 扫描数量处理
    setRowQty(_scanQty?: number) {
      let dataRows = state.tableData;
      let code = state.formData.productModel.trim();
      if (!state.currentRow) return;

      // 获得扫描数量
      let scanQty = _scanQty !== undefined ? _scanQty : 1; // 默认扫描数量为1
      // 如果未扫描数量大于0并且小于1 ，就直接把剩余的数量直接赋值
      if (state.currentRow.unFinishedQuantity > 0 && state.currentRow.unFinishedQuantity < 1) {
        scanQty = state.currentRow.unFinishedQuantity;
      }
      if (state.currentRow.middleBarcode === code) {
        // 中包装条码
        scanQty = Number(state.currentRow.middleUnitConvert);
        if (!scanQty || scanQty < 0) {
          proxy.$message.error(`条码【${state.currentRow.middleBarcode}】没有设置中单位换算关系数据！`);
          proxy.$refs.sound_error.currentTime = 0;
          methods.playError();
          return;
        }
      } else if (state.currentRow.bigBarcode === code) {
        // 大包装条码
        scanQty = Number(state.currentRow.unitConvert);
        if (!scanQty || scanQty < 0) {
          proxy.$message.error(`条码【${state.currentRow.bigBarcode}】没有设置大单位换算关系数据！`);
          proxy.$refs.sound_error.currentTime = 0;
          methods.playError();
          return;
        }
      }

      // 判断是否有足够扫描数量
      const overcharges = state.currentRow.overcharges || 0; // 超收比例
      const overchargesQty = Math.round(((state.currentRow.quantity || 0) * overcharges) / 100);
      let unFinishedQuantity = state.currentRow.unFinishedQuantity;
      if (overchargesQty > 0) {
        unFinishedQuantity = state.currentRow.quantity - state.currentRow.finishedQuantity + overchargesQty;
      }

      if (state.currentRow.unFinishedQuantity !== undefined && unFinishedQuantity < scanQty) {
        proxy.$message.error(`商品扫描数量不足！`);
        methods.focus('scanQty');
        proxy.$refs.sound_error.currentTime = 0;
        methods.playError();
        return;
      }

      // 设置已扫描的数量
      state.currentRow.finishedQuantity += scanQty;
      if (state.currentRow.unFinishedQuantity !== undefined) {
        state.currentRow.unFinishedQuantity -= scanQty;
        state.currentRow.scanWeight = Math.Round(state.currentRow.finishedQuantity * state.currentRow.weight, 4);
      } else {
        state.currentRow.scanWeight = Math.Round(state.currentRow.finishedQuantity * state.currentRow.weight, 4);
      }
      state.formData.scanQty = state.currentRow.finishedQuantity;
      if (state.currentRow.unFinishedQuantity < 0) state.currentRow.unFinishedQuantity = 0;
      methods.rowTotal(); // 小计计算

      methods.play();
      // 置顶排序
      dataRows.sort(function (a: any, b: any) {
        return b.sortIndex - a.sortIndex;
      });

      dataRows.forEach((element: any) => {
        element.sortIndex = 0;
      });

      if (state.formData.isValidateProductCode) {
        methods.focus('productModel');
      }
    },
    /**
     * 获得扫描数量，根据大中小进率
     */
    getScanQty() {
      let code = state.formData.productModel.trim();
      // 获得扫描数量
      let scanQty = 1; // 默认扫描数量为1
      if (state.currentRow && state.currentRow.middleBarcode === code) {
        // 中包装条码
        scanQty = state.currentRow.middleUnitConvert;
        if (!scanQty || scanQty < 0) {
          proxy.$message.error(`条码【${state.currentRow.middleBarcode}】没有设置中单位换算关系数据！`);
          proxy.$refs.sound_error.currentTime = 0;
          methods.playError();
          return 0;
        }
      } else if (state.currentRow && state.currentRow.bigBarcode === code) {
        // 中包装条码
        scanQty = state.currentRow.unitConvert;
        if (!scanQty || scanQty < 0) {
          proxy.$message.error(`条码【${state.currentRow.bigBarcode}】没有设置大单位换算关系数据！`);
          proxy.$refs.sound_error.currentTime = 0;
          methods.playError();
          return 0;
        }
      }

      return scanQty;
    },
    // 判断所有条码是否存在
    checkProductModelExist(productModel: any, rowData: any) {
      // 执行自定义的判断方法
      if (typeof hookOptions.checkProductModelExist === 'function') {
        return hookOptions.checkProductModelExist(productModel, rowData);
      }

      let isExists = false;
      if (!productModel || !rowData) {
        return false;
      }

      if (state.config.sku_productToMultiBarcode) {
        // 支持一品多码
        isExists = productModel === rowData.productModel || productModel === rowData.relationCode || productModel === rowData.relationCode2 || productModel === rowData.relationCode3 || productModel === rowData.relationCode4 || productModel === rowData.relationCode5 || productModel === rowData.middleBarcode || productModel === rowData.singleSignCode || productModel === rowData.bigBarcode;
      } else {
        // 不支持一品多码
        isExists = productModel === rowData.productModel || productModel === rowData.middleBarcode || productModel === rowData.singleSignCode || productModel === rowData.bigBarcode;
      }
      return isExists;
    },
    // 判断所有货位是否存在
    checkPositionNameExist(positionName: any, rowData: any) {
      let isExists = false;
      if (!positionName || !rowData) {
        return false;
      }

      isExists = positionName === rowData.positionName;

      return isExists;
    },
    // 手动设置数量
    setScanQty(callback?: any) {
      state.currentRow = null;
      if (!state.existRows.length) {
        proxy.$message.error('请扫描商品条码！');
        proxy.$refs.sound_error.currentTime = 0;
        methods.playError();
        return false;
      }
      if (state.existRows.length > 1) {
        proxy.$message.error(`【${state.existRows[0].productModel}】存在一码多品，需要手动选择需要扫描的明细，双击一下明细即可选择哦。`);
        proxy.$refs.sound_error.currentTime = 0;
        methods.playError();
        return;
      }

      // 设置当前行
      state.currentRow = state.existRows[0];
      if (!state.currentRow) return;

      const scanQty = state.formData.scanQty;
      if (state.currentRow.unFinishedQuantity !== undefined) {
        const overcharges = state.currentRow.overcharges || 0; // 超收比例
        const overchargesQty = Math.round((state.currentRow.quantity || 0) * overcharges);
        // 判断是否有足够扫描数量
        let totalQty = state.currentRow.unFinishedQuantity + state.currentRow.finishedQuantity;
        if (overchargesQty > 0) {
          totalQty = state.currentRow.validQuantity - (state.currentRow.enterQuantity || 0);
        }
        if (totalQty + overchargesQty < scanQty) {
          // state.formData.scanQty = totalQty;
          proxy.$message.error('商品扫描数量不足！');
          methods.playError();
          methods.focus('scanQty');
          return false;
        }
        // 设置未扫描的数量
        const total = totalQty - scanQty;
        state.currentRow.unFinishedQuantity = Math.Round(total, 4);
        if (state.currentRow.unFinishedQuantity < 0) state.currentRow.unFinishedQuantity = 0;
      }
      // 设置已扫描的数量
      state.currentRow.finishedQuantity = scanQty;
      methods.rowTotal(); // 小计计算

      methods.play();
      if (typeof callback === 'function') {
        const re = callback();
        if (re === false) {
          methods.play();
          return;
        }
      }
      methods.play();

      return true;
    },
    // 行样式
    rowClass(params: any) {
      let { row, rowIndex } = params;
      let className = '';
      if (state.existRows.find((f) => f === row)) {
        if (state.existRows.length === 1) {
          className = 'row-active';
        } else {
          className = 'multi-row-active';
        }
      }
      // 扫描一半剩余一半的数量,用其他背景色(这样的话会覆盖扫描当前行的样式)
      if (row.unFinishedQuantity > 0 && row.finishedQuantity > 0) {
        className += ' row-scanning';
      }
      if (row.unFinishedQuantity === 0) {
        className += ' row-finished';
      }

      return className;
    },
    // 双击事件
    setCurrent(row: any, event?: any, column?: any) {
      if (methods.checkProductModelExist(state.formData.productModel, row)) {
        state.currentRow = row;
        state.existRows = [row];
        state.tableData.forEach((element) => {
          element.sortIndex = 0;
        });
        if (!state.currentRow) return;

        state.currentRow.sortIndex = 1;
        // 判断是否开启SN扫描
        state.formData.isScanSn = !!Number(state.currentRow.isManageSn);

        state.tableData = state.tableData.sort(function (a, b) {
          return b.sortIndex - a.sortIndex;
        });

        state.formData.productModel = state.currentRow.productModel; // 自动将条码给扫描框

        if (state.formData.isValidateProductCode) {
          methods.focus('productModel');
        }

        if (state.formData.isScanSn && state.currentRow.singleSignCode) {
          state.formData.snList = state.currentRow.singleSignCode.split(',').join('\r\n');
          methods.scanSn();
        }
      } else {
        state.formData.productModel = row.productModel; // 自动将条码给扫描框
        proxy.$nextTick(() => {
          if (state.formData.isValidateProductCode) {
            methods.focus('productModel');
          }
        });
      }
    },
    /**
     * 选中当前行同时置顶
     * @param row 当前行
     */
    setTop(row: EmptyObjectType<any>) {
      state.currentRow = row;
      state.existRows = [row];
      state.tableData.forEach((element) => {
        element.sortIndex = 0;
      });
      state.currentRow.sortIndex = 1;
      // 判断是否开启SN扫描
      state.formData.isScanSn = !!Number(state.currentRow.isManageSn);

      state.tableData = state.tableData.sort(function (a, b) {
        return b.sortIndex - a.sortIndex;
      });
    },

    // 是否已完成
    isFinished() {
      let isAllFinished = state.tableData.every((rowData) => {
        return rowData.unFinishedQuantity <= 0;
      });

      return isAllFinished;
    },
    // 行数据改变
    rowChangeQty(prop: any, row: any, qtyFeild?: any) {
      if (!qtyFeild) {
        qtyFeild = 'quantityOrder';
      }
      if (prop === 'finishedQuantity') {
        row.unFinishedQuantity = row[qtyFeild] - row.finishedQuantity;
      } else if (prop === 'unFinishedQuantity') {
        row.finishedQuantity = row[qtyFeild] - row.unFinishedQuantity;
      }
      row.scanWeight = Math.Round(row.weight * row.finishedQuantity, 2);
    },
    // 扫描SN
    scanSn(e?: any) {
      if (!state.currentRow || proxy.common.isEmptyObject(state.currentRow)) {
        proxy.$message.error('请先扫描商品条码！');
        state.formData.snList = '';
        return true;
      }
      if (e && e.keyCode !== 13) {
        return true;
      }
      let snList = state.formData.snList;
      let _snList = snList ? snList.replace(/,/gi, '\n').replace(/\\r/gi, '').split('\n') : [];
      let validSnList = _snList.filter((item: any) => item); // 有效SN
      // 判断是否重复
      const groupList = validSnList
        .map((item: any) => {
          return { text: item, count: 1 };
        })
        .reduce((all: any, next: any) => {
          const existItem = all.find((item: any) => item.text === next.text);
          if (existItem) {
            // 存在+1
            existItem.count++;
            return all;
          } else {
            // 不存在，合并
            next.count = 1;
            return [...all, next];
          }
        }, []);
      // 判断是否存在重复的数据
      const repeatList = groupList.filter((item: any) => item.count > 1);
      const codes = repeatList.map((item: any) => item.text).join(',');
      if (codes) {
        proxy.$message.error(codes + '重复，已去掉重复项');
        validSnList = groupList.map((item: any) => item.text); // 已去掉重复项
      }
      validSnList = validSnList.map((item: any) => item.trim());

      // 校验在其他明细里面是否已经存在相同SN
      for (const snItem of validSnList) {
        for (const rowItem of state.tableData) {
          if (rowItem === state.currentRow) {
            continue;
          }

          const singleSignCode = rowItem.singleSignCode;
          const rowSnList = singleSignCode ? singleSignCode.replace(/,/gi, '\n').replace(/\\r/gi, '').split('\n') : [];
          if (rowSnList.some((item: any) => item === snItem)) {
            proxy.$message.error(`${snItem}条码在其他行已重复`);
            const index = validSnList.indexOf(snItem);
            validSnList.splice(index, 1); // 移除
          }
        }
      }

      // 校验SN，如果存在需要核验的SN ------ 不在校验候选SN了
      // if (state.formData.checkSnList) {
      //   const chekSnList = state.formData.checkSnList.split('\n');
      //   const invalidSnList = validSnList.filter((item: any) => !chekSnList.some((s) => s === item));
      //   if (invalidSnList.length) {
      //     proxy.$message.error('扫描的SN在校验的列表中不存在');
      //     for (const item of invalidSnList) {
      //       const index = validSnList.indexOf(item);
      //       if (index >= 0) validSnList.splice(index, 1);
      //     }
      //   }
      // }

      const scanQty = validSnList.length;
      if (state.currentRow.validQuantity < scanQty) {
        // validSnList.pop();

        if (scanQty - state.currentRow.validQuantity >= 1) {
          validSnList.splice(state.currentRow.validQuantity, scanQty);
        }

        state.currentRow.singleSignCode = validSnList.join(',');
        validSnList.push('');
        state.formData.snList = validSnList.join('\n');
        proxy.$message.error('没有可扫描数量了');
        methods.playError();
        return;
      }
      state.currentRow.singleSignCode = validSnList.join(',');
      validSnList.push('');
      state.formData.snList = validSnList.join('\n');
      state.currentRow.finishedQuantity = scanQty;
      if (state.currentRow.unFinishedQuantity !== undefined) {
        state.currentRow.unFinishedQuantity = state.currentRow.validQuantity - scanQty;
        state.currentRow.scanWeight = Math.Round(state.currentRow.finishedQuantity * state.currentRow.weight, 4);
      } else {
        state.currentRow.scanWeight = Math.Round(state.currentRow.finishedQuantity * state.currentRow.weight, 4);
      }
      state.formData.scanQty = state.currentRow.finishedQuantity;
    },
    // 计算SN扫描结果
    scanSnResult() {},
    /**
     * 获取字段配置信息
     * @param menuId 模块ID
     * @param vueType 操作类型
     * @returns
     */
    async getScanColumnData(menuId: any, vueType: any) {
      let url = '/api/auth/getPdaUI';
      let params = {
        menuId: menuId,
        vueType: vueType,
      };
      let [err, res] = await to(postData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }

      if (res && res.result) {
        state.setting.fields = res.data.dataListOptions.fields.map((m: any) => {
          let label = m.label;
          if (m.prop === 'positionName') {
            label = state.formData.isOnShelve ? '上架货位' : '收货位';
          }
          let col = {
            prop: m.prop,
            label: label,
            type: m.type,
            dataType: m.dataType,
            visible: true,
            width: m.width,
            minWidth: m.minWidth || 90,
            isExpandField: m.isExpandField,
            order: 1,
            options: [],
          };
          if (m.type === 'select') {
            col = {
              prop: m.prop,
              label: m.label,
              type: m.type,
              dataType: m.dataType,
              visible: true,
              width: m.width,
              minWidth: m.minWidth || 90,
              order: 1,
              isExpandField: m.isExpandField,
              options: m.options.options || [],
            };
          }
          return col;
        });
      }
    },
    // 通用文字转声音播放
    playText(txt: any) {
      const ssu = new SpeechSynthesisUtterance();
      ssu.text = txt;
      ssu.lang = 'zh';
      ssu.rate = 0.8;
      speechSynthesis.speak(ssu);
    },
    rowTotal() {
      if (state.currentRow) {
        // 计算更新小计
        state.currentRow.bigQty = Number(state.currentRow.unitConvert) === 0 ? 0 : state.currentRow.finishedQuantity / Number(state.currentRow.unitConvert); // 大单位数量
        state.currentRow.rowWeight = state.currentRow.finishedQuantity * Number(state.currentRow.weight); //小计重量
        state.currentRow.rowCube = state.currentRow.finishedQuantity * Number(state.currentRow.unitCube); // 小计体积
      }
    },
    // 加载货位
    loadPositionList() {},
    /**
     * 货位选择器选中
     * @param rows 选中行
     * @param focusProp 获得焦点输入框
     */
    onPositionSelected(rows: Array<any>, focusProp: string) {
      if (rows.length) state.formData.positionName = rows[0].positionName;
      else proxy.$message.error('请选择货位');
      state.positionSelector.visible = false;
      if (focusProp) methods.focus(focusProp);
    },
    /**
     * 显示货位选择器
     */
    showPositionSelector() {
      const selector = proxy.$refs['selector-dialog'];
      selector.setSearchValue('storageId', state.formData.storageId);
      selector.setSearchValue('storageName', state.formData.storageName);
      selector.setSearchValue('positionType', [1, 8, 12, 13]);

      selector.setReadOnly('storageName', true); // 设为只读
      selector.setReadOnly('positionType', true); // 设为只读
      selector.search();
      state.positionSelector.visible = true;
    },

    // 计算均重
    calculateAverageWeight(prop: any, row: any, qtyFeild?: any) {
      if (!qtyFeild) {
        qtyFeild = 'quantityOrder';
      }
      if (prop === 'parcelQuantity') {
        let weight = row.productSpec == '大包装' ? row.bigTareWeight : row.smallTareWeight;
        row.parcelAverageWeight = Math.Round(Number(weight) / Number(row.parcelQuantity), 4);
      }
    },
  };

  return {
    state,
    snCount,
    ...methods,
  };
}
