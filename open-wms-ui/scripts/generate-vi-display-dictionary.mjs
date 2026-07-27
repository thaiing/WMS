import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const outputFile = path.join(projectRoot, 'src/i18n/generated.vi.json');
const sqlFile = path.join(projectRoot, '../open-wms/script/sql/open-wms.sql');
const displayKeys = new Set([
  'label',
  'title',
  'placeholder',
  'message',
  'tableTenantName',
  'dialogTitle',
  'buttonText',
  'text',
  'emptyText',
  'suffixText',
  'name',
  'subName',
  'subName1',
  'subName2',
  'value',
  'data',
]);

const glossary = [
  ['预到货', 'dự kiến nhận hàng'],
  ['货主', 'đơn vị sở hữu hàng'],
  ['复核', 'rà soát'],
  ['对账', 'đối chiếu số liệu'],
  ['上架', 'cất hàng'],
  ['下架', 'lấy hàng khỏi vị trí'],
  ['拣货', 'soạn hàng'],
  ['理货', 'kiểm đếm hàng'],
  ['收货', 'nhận hàng'],
  ['发货', 'giao hàng'],
  ['出库', 'xuất kho'],
  ['入库', 'nhập kho'],
  ['盘点', 'kiểm kê'],
  ['调拨', 'điều chuyển'],
  ['移库', 'chuyển vị trí'],
  ['退货', 'trả hàng'],
  ['质检', 'kiểm tra chất lượng'],
  ['波次', 'đợt soạn hàng'],
  ['库存', 'tồn kho'],
  ['可用库存', 'tồn kho khả dụng'],
  ['账面库存', 'tồn kho sổ sách'],
  ['货位', 'vị trí lưu kho'],
  ['库位', 'vị trí lưu kho'],
  ['库区', 'khu vực kho'],
  ['仓库', 'kho'],
  ['月台', 'sàn nâng hàng'],
  ['码头', 'cửa nhập/xuất hàng'],
  ['容器', 'dụng cụ chứa hàng'],
  ['托盘', 'pallet'],
  ['承运商', 'đơn vị vận chuyển'],
  ['配送', 'giao hàng'],
  ['装卸', 'bốc xếp'],
  ['装箱', 'đóng thùng'],
  ['打包', 'đóng gói'],
  ['商品', 'hàng hóa'],
  ['产品', 'hàng hóa'],
  ['物料', 'vật tư'],
  ['供应商', 'nhà cung cấp'],
  ['客户', 'khách hàng'],
  ['司机', 'tài xế'],
  ['运单', 'vận đơn'],
  ['面单', 'nhãn vận chuyển'],
  ['批次', 'lô hàng'],
  ['批号', 'số lô'],
  ['效期', 'hạn sử dụng'],
  ['保质期', 'hạn sử dụng'],
  ['单据', 'chứng từ'],
  ['订单', 'đơn hàng'],
  ['审核', 'duyệt'],
  ['反审', 'hủy duyệt'],
  ['作废', 'hủy hiệu lực'],
  ['冻结', 'khóa'],
  ['解冻', 'mở khóa'],
  ['预占', 'giữ chỗ'],
  ['占位', 'giữ chỗ'],
  ['条码', 'mã vạch'],
];

const strings = new Set();

function add(value) {
  if (typeof value !== 'string') return;
  const normalized = value.replace(/\\n/g, '\n').trim();
  if (
    normalized &&
    normalized.length <= 500 &&
    /[\u3400-\u9fff]/.test(normalized) &&
    !normalized.includes('<script')
  ) {
    strings.add(normalized);
    if (/[，,]/.test(normalized)) {
      normalized.split(/[，,]/).forEach((part) => {
        const item = part.trim();
        if (item && item.length <= 120 && /[\u3400-\u9fff]/.test(item)) strings.add(item);
      });
    }
  }
}

function walkJson(value) {
  if (Array.isArray(value)) {
    value.forEach(walkJson);
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (typeof child === 'string' && displayKeys.has(key)) add(child);
    else walkJson(child);
  }
}

function scanDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(file);
      continue;
    }
    if (entry.name.endsWith('.json')) {
      try {
        walkJson(JSON.parse(fs.readFileSync(file, 'utf8')));
      } catch {
        // Không phải mọi JSON trong mã nguồn đều là JSON thuần.
      }
      continue;
    }
    if (!/\.(vue|ts|tsx)$/.test(entry.name)) continue;
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g)) add(match[2]);
    for (const match of source.matchAll(/>([^<>{}]*[\u3400-\u9fff][^<>{}]*)</g)) add(match[1]);
  }
}

scanDirectory(path.join(projectRoot, 'src'));
scanDirectory(path.join(projectRoot, 'public/static'));

if (fs.existsSync(sqlFile)) {
  const sql = fs.readFileSync(sqlFile, 'utf8');
  for (const match of sql.matchAll(/'((?:''|\\'|[^']){1,500})'/g)) add(match[1]);
  // Bắt bổ sung các giá trị SQL đơn giản như tên menu. Biểu thức trên ưu tiên
  // chuỗi có escape nên có thể bỏ qua một số giá trị đứng giữa INSERT dài.
  for (const match of sql.matchAll(/'([^'\r\n]{1,500})'/g)) add(match[1]);
  // Các trang dashboard được lưu dưới dạng JSON escape trong một trường SQL rất
  // dài. Giải mã chúng để lấy tên chuỗi dữ liệu, trục và chú giải của biểu đồ.
  for (let start = sql.indexOf("'"); start >= 0; start = sql.indexOf("'", start + 1)) {
    let end = start + 1;
    for (; end < sql.length; end += 1) {
      if (sql[end] === '\\') {
        end += 1;
        continue;
      }
      if (sql[end] !== "'") continue;
      if (sql[end + 1] === "'") {
        end += 1;
        continue;
      }
      break;
    }
    const raw = sql.slice(start + 1, end);
    start = end;
    if (raw.length < 501 || raw.length > 2_000_000) continue;
    if (!raw.includes('\\"') || !/[\u3400-\u9fff]/.test(raw)) continue;
    const decoded = raw.replaceAll("''", "'").replaceAll('\\"', '"').replaceAll('\\\\', '\\');
    if (!/^\s*[{[]/.test(decoded)) continue;
    try {
      walkJson(JSON.parse(decoded));
    } catch {
      // Không phải mọi trường dài đều là JSON cấu hình giao diện.
    }
  }
}

const existing = fs.existsSync(outputFile) ? JSON.parse(fs.readFileSync(outputFile, 'utf8')) : {};
const pending = [...strings].filter((value) => !existing[value]).sort((a, b) => a.localeCompare(b, 'zh-CN'));

function protectTerms(source) {
  let protectedText = source;
  const replacements = [];
  for (const [zh, vi] of glossary.sort((a, b) => b[0].length - a[0].length)) {
    if (!protectedText.includes(zh)) continue;
    const token = `WMSPH${String(replacements.length).padStart(3, '0')}`;
    protectedText = protectedText.replaceAll(zh, ` ${token} `);
    replacements.push([token, vi]);
  }
  return { protectedText, replacements };
}

function restoreTerms(text, replacements) {
  let restored = text;
  for (const [token, vi] of replacements) restored = restored.replaceAll(token, vi);
  return restored
    .replace(/\s+([,.;:!?%)])/g, '$1')
    .replace(/([(])\s+/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function translateBatch(batch, attempt = 1) {
  const protectedItems = batch.map(protectTerms);
  const separator = (index) => `__WMS_SPLIT_${String(index).padStart(3, '0')}__`;
  const query = protectedItems.map((item, index) => `${separator(index)}\n${item.protectedText}`).join('\n');
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'zh-CN');
  url.searchParams.set('tl', 'vi');
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', query);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const translated = payload[0].map((part) => part[0]).join('');
    const result = [];
    for (let index = 0; index < batch.length; index += 1) {
      const start = separator(index);
      const end = index + 1 < batch.length ? separator(index + 1) : undefined;
      const afterStart = translated.split(start)[1];
      if (afterStart === undefined) throw new Error(`Thiếu mốc ${start}`);
      const item = (end ? afterStart.split(end)[0] : afterStart).trim();
      result.push(restoreTerms(item, protectedItems[index].replacements));
    }
    return result;
  } catch (error) {
    if (attempt >= 5) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    return translateBatch(batch, attempt + 1);
  }
}

console.log(`Tổng chuỗi: ${strings.size}; đã có: ${Object.keys(existing).length}; cần dịch: ${pending.length}`);
for (let offset = 0; offset < pending.length; offset += 30) {
  const batch = pending.slice(offset, offset + 30);
  const translations = await translateBatch(batch);
  batch.forEach((source, index) => {
    existing[source] = translations[index];
  });
  fs.writeFileSync(outputFile, `${JSON.stringify(existing, null, 2)}\n`);
  console.log(`${Math.min(offset + batch.length, pending.length)}/${pending.length}`);
  await new Promise((resolve) => setTimeout(resolve, 30));
}

console.log(`Đã ghi ${Object.keys(existing).length} bản dịch vào ${outputFile}`);
