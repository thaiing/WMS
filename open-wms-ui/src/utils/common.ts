import { v4 as uuidv4 } from 'uuid';
import { ElLoading, ElNotification, ElMessage } from 'element-plus';
import dayjs from 'dayjs';
import format from 'number-format.js';
import useDropdownStore from '../stores/modules/dropdown';
let loadingOject: any;
let dataTypeList = ['byte', 'integer', 'long', 'double', 'bigDecimal'];
const dropdownStore = useDropdownStore();
import { useUserStore } from '/@/stores/modules/user';
import pinia from '/@/stores/index';
import { UserCacheEnum } from '../enums/UserCacheEnum';
import { postData } from '../api/common/baseApi';
import to from 'await-to-js';
const userStore = useUserStore(pinia);

export default {
  domain: process.env.NODE_ENV === 'production' ? 'http://dev-api.iwms.xin' : 'http://127.0.0.1:7001', // API接口地址
  templateDomain: '', // window.templateDomain, // 模板下载地址
  ureportDomain: '', // "http://39.99.242.248:8089", // 报表设计器
  ossDomain: '', // window.templateDomain, // 国内oss
  headers: {},
  /**
   * 将首字母小写
   * @param {String} str 需要转换的字符串
   * @param {String} type 转换类型，Upper或者Lower
   */
  caseStyle(str: string, type = 'lower') {
    if (!str || str.length < 2) return str;
    if (type === 'upper') {
      str = str.charAt(0).toUpperCase() + str.slice(1);
    } else {
      str = str.charAt(0).toLowerCase() + str.slice(1);
    }
    return str;
  },
  /**
   * 将对象属性首字母转为大小写，默认转换为小写
   * @param {Object} obj 需要转换的对象
   * @param {String} type 转换类型，Upper或者Lower
   */
  objectToCase(obj: any, type = 'lower') {
    if (!obj) return obj;

    let data: any = {};
    // 数据转换
    Object.keys(obj).forEach((key) => {
      let val = obj[key];
      let _key = this.caseStyle(key, type);
      if (Array.isArray(val)) {
        data[_key] = this.arrayToCase(val);
      } else if (Object.prototype.toString.call(val) === '[object Object]') {
        data[_key] = this.objectToCase(val);
      } else {
        data[_key] = val;
      }
    });
    return data;
  },
  /**
   * 下划线转驼峰
   * @param {Object} obj 需要转换的对象
   * @param {String} type 转换类型，Upper或者Lower
   */
  toCamelCase(obj: any) {
    if (!obj) return obj;

    let caseStr: any = obj.replace(/\_(\w)/g, (_: any, letter: any) => letter.toUpperCase());
    caseStr = this.caseStyle(caseStr);

    return caseStr;
  },
  /**
   * 驼峰转换下划线
   * @param humpStr 需要转换的字符串
   * @returns 返回转好的下划线字符串
   */
  toUnderline(humpStr: string) {
    return humpStr.replace(/([A-Z])/g, '_$1').toLowerCase();
  },
  /**
   * 将数组属性首字母转为大小写，默认转换为小写
   * @param {Array} obj 需要转换的数组
   * @param {String} type 转换类型，Upper或者Lower
   */
  arrayToCase(obj: any, type = 'lower') {
    if (!obj) return obj;

    if (!Array.isArray(obj)) {
      return obj;
    }

    let _arrList = [];
    for (let item of obj) {
      if (typeof item === 'object') {
        item = this.objectToCase(item, type);
        _arrList.push(item);
      } else {
        _arrList.push(item);
      }
    }
    return _arrList;
  },
  // 显示ajax返回消息
  showMsg(res: any) {
    if (res.message) {
      ElMessage.error({
        dangerouslyUseHTMLString: true,
        message: res.message,
      });
      return;
    }
    if (res.result && res.msg && res.msg.indexOf("color='red'") < 0) {
      if (res.msg)
        ElMessage.success({
          dangerouslyUseHTMLString: true,
          message: res.msg,
        });
    } else {
      if (res.msg) {
        ElMessage.error({
          dangerouslyUseHTMLString: true,
          message: res.msg,
        });
      }
    }
  },
  /**
   * 获取登录用户信息
   */
  getUserInfo() {
    return userStore;
  },
  /**
   * 获取登录用户信息token信息
   */
  getTokenInfo() {
    let tokenKey = '$tokenInfo'; //+ store.getters.userType;
    let tokenInfo = JSON.parse(localStorage.getItem(tokenKey) || '{}');

    return tokenInfo;
  },
  // 获得对话弹出顶部高度
  getDialogTop: function () {
    let screenHeight = document.documentElement.clientHeight || document.body.clientHeight;
    return screenHeight > 900 ? '10vh' : '3vh';
  },
  loadingOject,
  loading: function (target: any, bgColor = 'rgba(255, 255, 255, 0.5)') {
    if (target === false || !target) return;
    let opts = {
      target: undefined,
      text: '数据加载中',
      // spinner: "el-icon-loading",
      background: bgColor,
      lock: true,
      fullscreen: false,
    };
    if (typeof target === 'object') {
      opts.target = target.$el || target;
      if (!this.loadingOject) {
        this.loadingOject = ElLoading.service(opts);
        this.loadingOject.loadingCount = 1;
      } else {
        this.loadingOject.loadingCount += 1;
      }
    } else {
      if (this.loadingOject) {
        this.loadingOject.loadingCount += 1;
      } else {
        opts.fullscreen = true;
        this.loadingOject = ElLoading.service(opts);
        this.loadingOject.loadingCount = 1;
      }
    }
  },
  loaded: function (target: any) {
    if (target === false || !target) return;
    if (this.loadingOject) {
      this.loadingOject.loadingCount -= 1;
      this.loadingOject.close();
      this.loadingOject = null;
      // if (this.loadingOject.loadingCount === 0) {
      // 	this.loadingOject.close();
      // 	this.loadingOject = null;
      // }
    }
  },
  // 获得GUID值
  getGUID: function () {
    return uuidv4();
  },
  getUserGuid: function () {
    const userType = ''; // store.getters && store.getters.userType;
    const key = '$getGUID_login_' + userType;
    let guid = localStorage.getItem(key);
    if (!guid) {
      guid = userType + '-'; // + this.getGUID();
      localStorage.setItem(key, guid);
    }
    return guid;
  },
  getSignature: function (timeStamp: string, nonce: string, token: any, params: any) {
    let data = params && params.noDataSign ? '' : JSON.stringify(params);
    //  for (let key in params) {
    //    if (data) data += "&";
    //    data += key + '=' + params[key];
    //  }
    let guid = this.getUserGuid();

    let signStr = timeStamp + nonce + guid + (token ? token.signToken : '') + data;
    let signStrSpit = signStr.split('').sort(function (a, b) {
      let v = a > b ? 1 : -1;
      return v;
    });
    signStr = signStrSpit.join('');
    let signResult = ''; //md5(signStr).toUpperCase();

    return signResult;
  },
  /**
   * 日期时间格式化
   * @param date 日期
   * @param pattern 格式化日期模板
   * @returns
   */
  formatDate: function (date: string | Date, pattern?: string) {
    if (!date) return '';
    if (!pattern) pattern = 'YYYY-MM-DD';
    pattern = pattern.replace('YYYY-MM-DD', 'YYYY-MM-DD');
    if (typeof date === 'string' && date && date.indexOf('T') > 0) {
      date = new Date(date);
    } else if (typeof date === 'number') date = new Date(date);

    return dayjs(date).format(pattern);
  },
  /**
   * 数字格式化
   * @param number 需要格式化的数字
   * @param pattern 格式化模板
   */
  formatNumber: function (number: number, pattern: string) {
    if (pattern === '%') {
      return format('0.####', number * 100) + '%';
    } else {
      return format(pattern, number);
    }
  },
  /**
   * 判断字符串是否为数字
   * @param val 需要校验的字符串
   * @returns Boolean
   */
  isNumber(val: string) {
    let regPos = /^\d+(\.\d+)?$/; // 非负浮点数
    let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 判断当前值是否为对象
   * @param {*} obj 需要判断的对象
   */
  isObject: function (obj: any) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  },
  /**
   * 判断当前值是否为空对象
   * @param {*} obj 需要判断的对象
   */
  isEmptyObject: function (obj: any) {
    if (!this.isObject(obj)) return false;

    for (let key in obj) {
      return false;
    }
    return true;
  },
  /**
   * 判断是否为JSON
   * @param {*} str 需要判断的对象
   */
  isJSON: function (str: any) {
    try {
      if (!str) {
        return false;
      }

      if (typeof JSON.parse(str) == 'object') {
        return true;
      }
    } catch (e) {
      return false;
    }
  },
  /**
   * 深度复制
   * @param dataSource 需要被复制的对象
   * @returns 返回新复制对象
   */ deepCopy(dataSource: any) {
    if (!dataSource) return null;

    let data = JSON.stringify(dataSource);
    return JSON.parse(data);
  },
  // NaN显示处理
  isNaN(val: any) {
    if (val || val === 0) {
      return val;
    } else if (val === null) {
      return '';
    } else {
      return isNaN(val) ? '' : val;
    }
  },
  /**
   * 通用tag背景颜色处理
   * @param row 当前行数据
   * @param field 字段对象信息
   * @param value 当前值
   * @returns 返回标签背景颜色
   */
  getTagBgColor(row: any, field: any, value: any) {
    const tagColorList = field.tagColorList;
    const colorItem = tagColorList.find((item: any) => {
      let tagValue = item.value;
      // 取字段值
      if (('' + tagValue).indexOf('row.') === 0) {
        tagValue = eval(tagValue);
      }
      if (dataTypeList.indexOf(field.dataType) >= 0) {
        tagValue = Number(tagValue);
        value = Number(value);
      } else {
        tagValue = String(tagValue);
        value = String(value);
      }
      if (item.operator === '=' && tagValue === value) {
        return true;
      } else if (item.operator === '>=' && value >= tagValue) {
        return true;
      } else if (item.operator === '>' && value > tagValue) {
        return true;
      } else if (item.operator === '<=' && value <= tagValue) {
        return true;
      } else if (item.operator === '<' && value < tagValue) {
        return true;
      } else if (item.operator === 'like' && value.indexOf(tagValue) >= 0) {
        return true;
      } else {
        return false;
      }
    });
    let bgColor = '#fff';
    if (colorItem) bgColor = colorItem.backgroudColor;

    return bgColor;
  },
  /**
   * 通用tag字体颜色
   * @param row 当前行数据
   * @param field 字段对象信息
   * @param value 当前值
   * @returns 返回标签字体颜色
   */
  getTagColor(row: any, field: any, value: any) {
    const tagColorList = field.tagColorList;
    const colorItem = tagColorList.find((item: any) => {
      let tagValue = item.value;
      // 取字段值
      if (('' + tagValue).indexOf('row.') === 0) {
        tagValue = eval(tagValue);
      }
      if (dataTypeList.indexOf(field.dataType) >= 0) {
        tagValue = Number(tagValue);
        value = Number(value);
      }
      if (item.operator === '=' && tagValue === value) {
        return true;
      } else if (item.operator === '>=' && value >= tagValue) {
        return true;
      } else if (item.operator === '>' && value > tagValue) {
        return true;
      } else if (item.operator === '<=' && value <= tagValue) {
        return true;
      } else if (item.operator === '<' && value < tagValue) {
        return true;
      } else if (item.operator === 'like' && value.indexOf(tagValue) >= 0) {
        return true;
      } else {
        return false;
      }
    });
    let color = '#000';
    if (colorItem) color = colorItem.color;

    return {
      border: 0,
      color: color,
    };
  },
  /**
   * 格式化数据，可以格式化日期和数字
   * @param detailRow 当前行对象
   * @param col 当前列对象
   * @returns 返回格式化后的数据
   */
  formatData(row: any, col: any) {
    if (!row || !Object.keys(row).length) return '';
    let data = '';
    let prop = col.prop || col.options.prop;

    if (['select', 'static'].indexOf(col.type) >= 0) {
      // 下拉框转义
      let dropdownId = col.options && col.options.dropdownId ? col.options.dropdownId : col.dropdownId;
      let val = row[prop];
      val = val === null || val === undefined ? '' : val;
      if (this.isNumber(val) && dataTypeList.indexOf(col.dataType) >= 0) {
        val = Number(val);
      } else {
        val = String(val);
      }
      // 静态数据
      if (col.options && col.options.remote === false) {
        let item = col.options.options.find((option: any) => {
          let optValue = option.value;
          if (dataTypeList.indexOf(col.dataType) >= 0) {
            optValue = Number(optValue);
          } else {
            optValue = String(optValue);
          }
          return optValue === val;
        });
        if (item) {
          data = item.label;
        } else {
          data = val;
        }
      } else if (dropdownId > 0) {
        data = dropdownStore.translateText(val, dropdownId);
      } else {
        data = val;
      }
    } else if (['date', 'datetime'].indexOf(col.dataType) >= 0 && col.formatter) {
      data = this.formatDate(row[prop], col.formatter);
    } else if (dataTypeList.indexOf(col.dataType) >= 0 && col.formatter) {
      if (col.formatter === '大单位格式化' && Number(row.unitConvert)) {
        let quantity = 0;
        if (row.returnQuantity) {
          quantity = row.returnQuantity;
        } else if (row.enterQuantity) {
          quantity = row.enterQuantity;
        } else if (row.quantityOrder) {
          quantity = row.quantityOrder;
        } else if (row.packageQuantity) {
          quantity = row.packageQuantity;
        } else if (row.outerQuantity) {
          quantity = row.outerQuantity;
        } else if (row.transferQuantity) {
          quantity = row.transferQuantity;
        } else if (row.quantity) {
          quantity = row.quantity;
        } else if (row.productStorage) {
          quantity = row.productStorage;
        }
        if (!quantity) {
          return;
        }
        let bigNum = Math.floor(Math.floor(quantity * 100) / Math.floor(row.unitConvert * 100));
        let smallNum = Math.floor(quantity * 100) % Math.floor(row.unitConvert * 100);
        data = (bigNum > 0 ? bigNum + row.bigUnit : '') + (smallNum > 0 ? smallNum / 100 + row.smallUnit : '');
      } else {
        data = this.formatNumber(row[prop], col.formatter);
      }
    } else {
      data = row[prop];
    }
    try {
      if (col.script) {
        // eslint-disable-next-line
        eval(col.script);
      }
    } catch (error: any) {
      ElMessage.error(`${col.label}脚本执行错误：${error.messsage}`);
    }
    if (data === null) data = '';

    return data;
  },
  /**
   * 将扩展字段值合并到当前对象中
   * @param rowData 当前数据对象
   */
  mergeExpandFields(rowData: any) {
    // 将对象转为数组
    if (!Array.isArray(rowData)) {
      rowData = [rowData];
    }

    for (let row of rowData) {
      try {
        let v = row['expandFields'];
        if (v) {
          v = JSON.parse(v);
          Object.keys(v).forEach((key) => {
            row[key] = v[key];
          });
        }
      } catch (error) {
        error;
      }
    }
  },
  /**
   * 根据币种编号返回币种符号，例如：传入参数currencyCode：CNY，返回¥
   * @param currencyCode 当前币种编号
   * @returns 返回币种符号
   */
  getMoneyCode(currencyCode: string) {
    const codes: any = {
      CNY: '¥',
      USD: '$',
      EUR: '€',
      GBP: '£',
      CHF: '₣',
      SGD: 'S¢',
      SEK: 'Kr',
      DKK: 'DKK',
      AUD: 'A$',
      NOK: 'NOK',
      JPY: '￥',
      CAD: 'CAD$',
      PHP: 'php',
      THB: '¤',
      KRW: '₩',
      HKD: 'U.S.$',
      TWD: 'NT$',
      BRL: 'R$',
      RUB: '₽',
    };

    return codes[currencyCode];
  },
  /**
   * 四舍五入
   * @param num 需要四舍五入的数字
   * @param dec 保留小数位
   * @returns 返回处理完毕的数字
   */
  round(num: number, dec: number) {
    if (dec === undefined) dec = 2;
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
  },
  /**
   * 数组元素互换位置
   * @param arr 需要操作的数组
   * @param index1 需要互换数组索引1
   * @param index2 需要互换数组索引2
   * @returns 返回互换位置的数组
   */
  swapArray(arr: Array<any>, index1: number, index2: number) {
    if (index1 < 0) {
      ElMessage.error('已经在最前面了，无法移动');
      return;
    }
    if (index2 >= arr.length) {
      ElMessage.error('已经在最底部了，无法移动');
      return;
    }

    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  },
  /**
   * 设置用户级别缓存
   * @param userCacheEnum 用户缓存枚举
   * @param data 缓存数据
   * @returns
   */
  async setUserCache(userCacheEnum: UserCacheEnum, params: any): Promise<void> {
    let url = '/system/core/common/setUserCache/' + userCacheEnum;
    let [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    this.showMsg(res);
  },
  /**
   * 获取用户级别缓存
   * @param userCacheEnum 用户缓存枚举
   * @returns 返回JSON对象
   */
  async getUserCache(userCacheEnum: UserCacheEnum): Promise<any> {
    let url = '/system/core/common/getUserCache/' + userCacheEnum;
    let params = {};
    let [err, res] = await to(postData(url, params));
    if (err) {
      return null;
    }
    return res?.data;
  },
};
