import { nextTick } from 'vue';
import * as svg from '@element-plus/icons-vue';

// 获取阿里字体图标
const getAlicdnIconfont = () => {
  return new Promise((resolve, reject) => {
    nextTick(() => {
      const styles: any = document.styleSheets;
      let sheetsList = [];
      let sheetsIconList = [];
      for (let i = 0; i < styles.length; i++) {
        let href = styles[i].href;
        if (!href) continue;

        if (href.indexOf('at.alicdn.com') >= 0) {
          sheetsList.push(styles[i]);
        } else if (['font_557761_mzbsueqbpqr.css', 'font_2298093_rnp72ifj3ba.css'].some((item) => href.indexOf(item) >= 0)) {
          sheetsList.push(styles[i]);
        }
      }
      for (let i = 0; i < sheetsList.length; i++) {
        for (let j = 0; j < sheetsList[i].cssRules.length; j++) {
          let text = sheetsList[i].cssRules[j].selectorText;
          if (text && (text.indexOf('.yrt-') >= 0 || text.indexOf('.yrt2-') >= 0)) {
            sheetsIconList.push(`${text.substring(1, text.length).replace(/\:\:before/gi, '')}`);
          }
        }
      }
      if (sheetsIconList.length > 0) resolve(sheetsIconList);
      else reject('未获取到值，请刷新重试');
    });
  });
};

// 初始化获取 css 样式，获取 element plus 自带 svg 图标，增加了 ele- 前缀，使用时：ele-Aim
const getElementPlusIconfont = () => {
  return new Promise((resolve, reject) => {
    nextTick(() => {
      const icons = svg as any;
      const sheetsIconList = [];
      for (const i in icons) {
        sheetsIconList.push(`ele-${icons[i].name}`);
      }
      if (sheetsIconList.length > 0) resolve(sheetsIconList);
      else reject('未获取到值，请刷新重试');
    });
  });
};

// 初始化获取 css 样式，这里使用 fontawesome 的图标
const getAwesomeIconfont = () => {
  return new Promise((resolve, reject) => {
    nextTick(() => {
      const styles: any = document.styleSheets;
      let sheetsList = [];
      let sheetsIconList = [];
      for (let i = 0; i < styles.length; i++) {
        let href = styles[i].href;
        if (!href) continue;
        if (href.indexOf('cdnjs.cloudflare.com') > -1) {
          sheetsList.push(styles[i]);
        } else if (['font-awesome.min.css'].some((item) => href.indexOf(item) >= 0)) {
          sheetsList.push(styles[i]);
        }
      }
      for (let i = 0; i < sheetsList.length; i++) {
        for (let j = 0; j < sheetsList[i].cssRules.length; j++) {
          let text = sheetsList[i].cssRules[j].selectorText;
          if (text && text.indexOf('.fa-') === 0 && text.indexOf(',') === -1) {
            if (/::before/.test(text)) {
              sheetsIconList.push(`${text.substring(1, text.length).replace(/\:\:before/gi, '')}`);
            }
          }
        }
      }
      if (sheetsIconList.length > 0) resolve(sheetsIconList.reverse());
      else reject('未获取到值，请刷新重试');
    });
  });
};

// 获取svg图标
const getSvgIconfont = () => {
  return new Promise((resolve, reject) => {
    nextTick(() => {
      const svgList = import.meta.glob('../assets/icons/svg/*', { eager: true });
      let keys = Object.keys(svgList).map((m) => m.replace('../assets/icons/svg/', '').replace('.svg', ''));

      if (keys.length > 0) resolve(keys);
      else reject('未获取到值，请刷新重试');
    });
  });
};

/**
 * 获取字体图标 `document.styleSheets`
 * @method ali 获取阿里字体图标 `<i class="iconfont 图标类名"></i>`
 * @method ele 获取 element plus 自带图标 `<i class="图标类名"></i>`
 * @method ali 获取 fontawesome 的图标 `<i class="fa 图标类名"></i>`
 * @method svg 获取 svg 的图标 `<i class="图标类名"></i>`
 */
const initIconfont = {
  // iconfont
  ali: () => {
    return getAlicdnIconfont();
  },
  // element plus
  ele: () => {
    return getElementPlusIconfont();
  },
  // fontawesome
  awe: () => {
    return getAwesomeIconfont();
  },
  // svg
  svg: () => {
    return getSvgIconfont();
  },
};

// 导出方法
export default initIconfont;
