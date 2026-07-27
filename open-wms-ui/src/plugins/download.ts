import axios from 'axios';
import FileSaver from 'file-saver';
import { getToken } from '/@/utils/auth';
import errorCode from '/@/utils/errorCode';
import { blobValidate } from '/@/utils/ruoyi';
import { LoadingInstance } from 'element-plus/es/components/loading/src/loading';

const baseURL = import.meta.env.VITE_APP_BASE_API;
let downloadLoadingInstance: LoadingInstance;
export default {
  async oss(ossId: string | number) {
    const url = baseURL + '/system/oss/download/' + ossId;
    downloadLoadingInstance = ElLoading.service({ text: '正在下载数据，请稍候', background: 'rgba(0, 0, 0, 0.7)' });
    try {
      const res = await axios({
        method: 'get',
        url: url,
        responseType: 'blob',
        headers: { Authorization: 'Bearer ' + getToken() },
      });
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, decodeURIComponent(res.headers['download-filename'] as string));
      } else {
        this.printErrMsg(res.data);
      }
      downloadLoadingInstance.close();
    } catch (r) {
      console.error(r);
      ElMessage.error('下载文件出现错误，请联系管理员！');
      downloadLoadingInstance.close();
    }
  },
  async zip(url: string, name: string) {
    url = baseURL + url;
    const res = await axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: {
        Authorization: 'Bearer ' + getToken(),
        datasource: localStorage.getItem('dataName'),
      },
    });
    const isBlob = blobValidate(res.data);
    if (isBlob) {
      const blob = new Blob([res.data], { type: 'application/zip' });
      FileSaver.saveAs(blob, name);
    } else {
      this.printErrMsg(res.data);
    }
  },
  async printErrMsg(data: any) {
    const resText = await data.text();
    const rspObj = JSON.parse(resText);
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
    ElMessage.error(errMsg);
  },
};

/**
 * 下载文件并重命名
 * @param url
 * @param filename
 */
export function downloadFileRename(url: string, filename: string) {
  function getBlob(url: string) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        }
      };
      xhr.send();
    });
  }
  function saveAs(blob: any, filename: string) {
    const link = document.createElement('a');
    const body: any = document.querySelector('body');

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    // fix Firefox
    link.style.display = 'none';
    body.appendChild(link);

    link.click();
    body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  }
  getBlob(url).then((blob) => {
    saveAs(blob, filename);
  });
}
