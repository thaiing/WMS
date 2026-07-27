export const predefineColors = ['rgba(5, 200, 5, 1)', 'rgba(0, 255, 0, 1)', '#90ee90', '#409EFF', 'rgb(102, 177, 255)', 'rgb(140, 197, 255);', '#95b7e4', 'rgb(217, 236, 255)', '#00ced1', '#c71585', 'rgb(255, 120, 0)', '#ff0000', '#ff4500', '#ff8c00', '#ffd700', 'rgba(255, 255, 0, 1)', 'rgba(201, 241, 3, 1)', 'hsva(120, 40, 94, 0.5)', 'hsl(181, 100%, 37%)', 'hsla(209, 100%, 56%, 0.73)', '#c7158577', '#303133', '#606266', '#909399', '#DCDFE6', '#E4E7ED', '#F2F6FC', '#ffffff', 'rgba(208, 3, 208, 1)', 'rgba(252, 68, 252, 1)', 'rgba(255, 0, 255, 1)'];

/**
 * 16进制颜色转为RGBA颜色
 * @param hex 16进制
 * @param alpha 颜色透明度
 * @returns rgba颜色
 */
export function hexToRgba(hex: string, alpha: number) {
  // 移除可能存在的井号
  let hexStr = hex.replace(/^#/, '');

  // 检查是否是简写的三位或四位hex颜色，并扩展为六位或八位
  if (hexStr.length === 3 || hexStr.length === 4) {
    hexStr = hexStr
      .split('')
      .map((char) => char + char)
      .join('');
  }

  // 如果长度不是6或者8，则返回默认值或抛出错误
  if (!/^[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hexStr)) {
    console.error('Invalid HEX color:', hex);
    return 'rgba(0, 0, 0, 1)';
  }

  // 提取RGB部分并转换为十进制
  let r = parseInt(hexStr.slice(0, 2), 16);
  let g = parseInt(hexStr.slice(2, 4), 16);
  let b = parseInt(hexStr.slice(4, 6), 16);

  // 如果有alpha通道，提取并转换alpha值到小数形式
  if (hexStr.length === 8) {
    alpha = parseInt(hexStr.slice(6, 8), 16) / 255;
  } else if (alpha === undefined) {
    alpha = 1; // 默认alpha值为1，即不透明
  }

  // 返回rgba字符串
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * rgba颜色转hex颜色值
 * @param rgba rgba颜色值
 * @returns hex颜色值
 */
export function rgbaToHex(rgba: string | Array<number>) {
  // 如果输入是字符串，先解析rgba字符串
  if (typeof rgba === 'string') {
    const rgbaMatch = rgba.match(/rgba?$(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?$/);
    if (!rgbaMatch) return '#000000'; // 如果匹配失败，返回黑色
    rgba = rgbaMatch.slice(1).map(Number);
  }

  // 确保rgba数组有4个元素，并且限制其范围
  rgba = rgba.map((val, i) => (i < 3 ? Math.min(Math.max(0, val), 255) : Math.min(Math.max(0, val), 1)));

  // 将rgb部分转换为hex，去掉alpha通道
  let hex =
    '#' +
    rgba
      .slice(0, 3)
      .map((val) => {
        let hexVal = val.toString(16);
        return hexVal.length === 1 ? '0' + hexVal : hexVal; // 确保两位数
      })
      .join('');

  return hex;
}

type RGB = [number, number, number];
type RGBA = [number, number, number, number];

function parseRgbString(rgbString: string): RGB | null {
  const match = rgbString.match(/rgb$(\d+),\s*(\d+),\s*(\d+)$/);
  if (!match) return null;
  return match.slice(1).map(Number) as RGB;
}

function parseRgbaString(rgbaString: string): RGBA | null {
  const match = rgbaString.match(/rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d+|0|1)\s*\)/);
  if (!match) return null;
  // 解析并映射匹配的值到RGBA数组，alpha默认为1
  return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10), match[4] !== undefined ? parseFloat(match[4]) : 1] as RGBA;
}

function updateAlpha(rgba: RGBA | string, newAlpha: number): string {
  // 如果输入是字符串，则尝试解析它
  let rgbaArray: RGBA | null;
  if (typeof rgba === 'string') {
    rgbaArray = parseRgbaString(rgba);
    if (!rgbaArray) {
      throw new Error('Invalid RGBA string');
    }
  } else {
    rgbaArray = rgba;
  }

  // 确保新的alpha值在有效范围内
  const validAlpha = Math.min(Math.max(0, newAlpha), 1);

  // 返回带有新alpha值的rgba字符串
  return `rgba(${rgbaArray[0]}, ${rgbaArray[1]}, ${rgbaArray[2]}, ${validAlpha})`;
}

/**
 * rgb颜色值 转 rgba颜色值
 * @param rgb rgb颜色值
 * @param alpha alpha通道值
 * @returns rgba颜色值
 */
export function rgbToRgba(rgb: RGB | string, alpha: number = 1): string {
  // 如果输入是字符串，则尝试解析它
  let rgbArray: RGB | null;
  if (typeof rgb === 'string') {
    rgbArray = parseRgbString(rgb);
    if (!rgbArray) {
      throw new Error('Invalid RGB string');
    }
  } else {
    rgbArray = rgb;
  }

  // 确保rgb值在有效范围内
  const [r, g, b] = rgbArray.map((val) => Math.min(Math.max(0, val), 255)) as RGB;

  // 确保alpha值在有效范围内
  const validAlpha = Math.min(Math.max(0, alpha), 1);

  // 返回rgba字符串
  return `rgba(${r}, ${g}, ${b}, ${validAlpha})`;
}

/**
 * 任意颜色转为RGBA颜色
 * @param hex 16进制
 * @param alpha 颜色透明度
 * @returns rgba颜色
 */
export function anyToRgba(anyColor: any, alpha: number) {
  if (!anyColor) return anyColor;

  if (typeof anyColor === 'string') {
    if (anyColor.indexOf('#') >= 0) {
      return hexToRgba(anyColor, alpha);
    } else if (anyColor.indexOf('rgba') >= 0) {
      return updateAlpha(anyColor, alpha);
    } else {
      return rgbToRgba(anyColor, alpha);
    }
  }

  return anyColor;
}
