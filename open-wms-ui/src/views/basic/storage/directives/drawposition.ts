import $ from 'jquery';
import { DirectiveBinding } from 'vue';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { ElMessage } from 'element-plus';
// import { BaseProperties } from '/@/types/base-type';
// import { ComponentInternalInstance } from 'vue';
// let ins = getCurrentInstance() as ComponentInternalInstance;
// let proxy = ins.proxy as BaseProperties;
// 引用下拉框状态管理组件
import useDropdownStore from '/@/stores/modules/dropdown';
const dropdownStore = useDropdownStore();

const draw = {
  // common: {},
  // 是否已经加载货位状态数据
  isLoadedPosition: false,
  vnode: {} as VNode,
  binding: {} as DirectiveBinding,
  isViewer: false, // 是否只读
  // 仓库数据
  storageData: {
    positionRegular: null,
    channelRegular: null,
    shelvesRegular: null,
    rowRegular: null,
    columnRegular: null,
    action: 'add',
  } as any,
  // 库区数据
  areaData: {
    storageId: 1,
    storageName: '北京仓库',
    positionType: 1,
    areaCode: 'A',
    pickMode: 'U型',
    shelveMode: '立体货架',
    maxCapacity: 100,
    channelNum: 3,
    rowNum: 4,
    columnNum: 5,
    shelveNumA1: 1,
    shelveNumA2: 5,
    shelveNumB1: 6,
    shelveNumB2: 10,
    positionRegular: null,
    channelRegular: null,
    shelvesRegular: null,
    rowRegular: null,
    columnRegular: null,
    action: 'add',
    colTitle: '层数',
  } as any,
  // 货架信息
  shelveDataList: [
    {
      storageId: 1,
      areaCode: 'A',
      channelCode: '01',
      shelveCode: '01',
      rowNum: 2,
      columnNum: 3,
    },
    {
      storageId: 1,
      areaCode: 'A',
      channelCode: '01',
      shelveCode: '02',
      rowNum: 3,
      columnNum: 5,
    } as any,
  ],
  // 通道货架数
  channelDataList: [] as any,

  // 创建货架
  createShelve(channelCode: any, shelveCode: any, line: any, odd_Even: any) {
    let rowHtml = '';
    const findShelveInfo = draw.shelveDataList.find((item) => {
      return item.storageId === draw.areaData.storageId && item.areaCode === draw.areaData.areaCode && item.channelCode === channelCode && item.shelveCode === shelveCode;
    });

    let rowNum = draw.areaData.rowNum;
    let columnNum = draw.areaData.columnNum;
    if (findShelveInfo) {
      rowNum = findShelveInfo.rowNum;
      columnNum = findShelveInfo.columnNum;
    }

    for (let i = rowNum; i > 0; i--) {
      let cellHtml = '';
      for (let j = 0; j < columnNum; j++) {
        let xTip = '';
        let yTip = '';
        const rowNo = this.rowCodeCreator(i);

        let colIndex = j + 1;
        if (odd_Even === 'odd') colIndex = j * 2 + 1;
        if (odd_Even === 'even') colIndex = (j + 1) * 2;
        const colNo = this.columnCodeCreator(colIndex);
        if (line === 'A') {
          if (i === rowNum) {
            xTip = '<span class="t-n" channelCode="' + channelCode + '" shelveCode="' + shelveCode + '" colNo="' + colNo + '">' + colNo + '</span>';
          }
        } else if (line === 'B') {
          if (i === 1) {
            xTip = '<span class="b-n" channelCode="' + channelCode + '" shelveCode="' + shelveCode + '" colNo="' + colNo + '">' + colNo + '</span>';
          }
        }

        let positionTmpl: string | null = draw.areaData.positionRegular || draw.storageData.positionRegular;
        if (findShelveInfo) {
          let _positionRegular = '';
          const _rowNo = (i < 10 ? '0' : '') + i;
          const _colNo = (j < 10 ? '0' : '') + (j + 1);
          if (findShelveInfo.columnConfigs) {
            // 列级别配置
            const columnCofing = findShelveInfo.columnConfigs.find((cItem: any) => {
              return cItem.colNo === _colNo;
            });
            if (columnCofing) {
              _positionRegular = columnCofing.positionRegular;
            }
          }
          if (!_positionRegular && findShelveInfo.rowConfigs) {
            // 层级别配置
            const rowCofing = findShelveInfo.rowConfigs.find((cItem: any) => {
              return cItem.rowNo === _rowNo;
            });
            if (rowCofing) {
              _positionRegular = rowCofing.positionRegular;
            }
          }

          if (!_positionRegular && findShelveInfo.positionRegular) {
            // 通道级别配置
            positionTmpl = findShelveInfo.positionRegular;
            // } else {
            //   positionTmpl = _positionRegular;
          }
        }
        if (positionTmpl) {
          positionTmpl = positionTmpl.replace('{库区}', draw.areaData.areaCode);
          positionTmpl = positionTmpl.replace('{通道}', channelCode);
          positionTmpl = positionTmpl.replace('{货架}', shelveCode);
          positionTmpl = positionTmpl.replace('{层}', rowNo);
          positionTmpl = positionTmpl.replace('{列}', colNo);
        }
        if (j === 0) {
          yTip = '<span class="l-n" channelCode="' + channelCode + '" shelveCode="' + shelveCode + '" rowNo="' + rowNo + '">' + rowNo + '</span>';
        }
        cellHtml += '<li id="' + positionTmpl + '" ' + (i === 1 ? 'class="border-bottom"' : '') + ' channelCode="' + channelCode + '" shelveCode="' + shelveCode + '" rowNo="' + rowNo + '" colNo="' + colNo + '">' + xTip + yTip + positionTmpl + '</li>';
      }
      rowHtml += '<ul class="table-list-ul">' + cellHtml + '</ul>';
    }
    if (line === 'A') {
      const tableHtml = '<div class="table-reset" channelCode="' + channelCode + '" shelveCode="' + shelveCode + '">' + '<h3 class="table-num ' + (draw.areaData.shelveMode === '地堆' ? 'didui' : '') + '" channelCode="' + channelCode + '" shelveCode="' + shelveCode + '">' + (draw.areaData.shelveMode !== '地堆' ? '货架' : '') + '<strong channelCode="' + channelCode + '" shelveCode="' + shelveCode + '">' + shelveCode + '</strong></h3>' + rowHtml + '</div>';
      return tableHtml;
    } else {
      const tableHtml = '<div class="table-reset" channelCode="' + channelCode + '" shelveCode="' + shelveCode + '">' + rowHtml + '<h3 class="table-num" channelCode="' + channelCode + '" shelveCode="' + shelveCode + '">货架<strong channelCode="' + channelCode + '" shelveCode="' + shelveCode + '">' + shelveCode + '</strong></h3>' + '</div>';
      return tableHtml;
    }
  },

  // 创建货架 - U型B面，倒序排列
  createShelve_U_B(channelCode: any, shelveCode: any) {
    let rowHtml = '';
    const findShelveInfo = draw.shelveDataList.find((item) => {
      return item.storageId === draw.areaData.storageId && item.areaCode === draw.areaData.areaCode && item.channelCode === channelCode && item.shelveCode === shelveCode;
    });

    let rowNum = draw.areaData.rowNum;
    let columnNum = draw.areaData.columnNum;
    if (findShelveInfo) {
      rowNum = findShelveInfo.rowNum;
      columnNum = findShelveInfo.columnNum;
    }

    for (let i = rowNum; i > 0; i--) {
      let cellHtml = '';
      for (let j = columnNum; j > 0; j--) {
        let xTip = '';
        let yTip = '';
        const rowNo = this.rowCodeCreator(i); // (i < 10 ? '0' : '') + (i);
        const colNo = this.columnCodeCreator(j); // (j < 10 ? '0' : '') + (j + 1);
        if (i === 1) {
          xTip = '<span class="b-n" channelCode="' + channelCode + '" shelveCode="' + shelveCode + '" colNo="' + colNo + '">' + colNo + '</span>';
        }

        // let positionTmpl = draw.storageData.action === "add" ? draw.storageData.positionRegular : draw.areaData.positionRegular;
        let positionTmpl: string | null = draw.areaData.positionRegular || draw.storageData.positionRegular;
        if (positionTmpl) {
          positionTmpl = positionTmpl.replace('{库区}', draw.areaData.areaCode);
          positionTmpl = positionTmpl.replace('{通道}', channelCode);
          positionTmpl = positionTmpl.replace('{货架}', shelveCode);
          positionTmpl = positionTmpl.replace('{层}', rowNo);
          positionTmpl = positionTmpl.replace('{列}', colNo);
        }
        if (j === columnNum) {
          yTip = '<span class="l-n" channelCode="' + channelCode + '" shelveCode="' + shelveCode + '" rowNo="' + rowNo + '">' + rowNo + '</span>';
        }
        cellHtml += '<li id="' + positionTmpl + '" ' + (i === 1 ? 'class="border-bottom"' : '') + ' channelCode="' + channelCode + '" shelveCode="' + shelveCode + '" rowNo="' + rowNo + '" colNo="' + colNo + '">' + xTip + yTip + positionTmpl + '</li>';
      }
      rowHtml += '<ul class="table-list-ul">' + cellHtml + '</ul>';
    }

    const tableHtml = `<div class="table-reset" channelCode="${channelCode}" shelveCode="${shelveCode}">
      ${rowHtml}
        <h3 class="table-num" channelCode="${channelCode}" shelveCode="${shelveCode}">货架
          <strong channelCode="${channelCode}" shelveCode="${shelveCode}">
          ${shelveCode}
          </strong>
        </h3>
      </div>`;
    return tableHtml;
  },

  // 创建通道
  createChannel(channelCode: any) {
    let shelveNumA1 = draw.areaData.shelveNumA1;
    let shelveNumA2 = draw.areaData.shelveNumA2;
    const channelInfo = draw.channelDataList.find((item: any) => {
      return item.storageId === draw.areaData.storageId && item.areaCode === draw.areaData.areaCode && item.channelCode === channelCode;
    }); // 自定义货架数
    if (channelInfo) {
      shelveNumA1 = channelInfo.shelveNumA1;
      shelveNumA2 = channelInfo.shelveNumA2;
    }
    if (draw.areaData.pickMode === 'U型') {
      // A面
      let tableHtml = '';
      for (let i = shelveNumA1; i <= shelveNumA2; i++) {
        const shelveCode = this.shelveCodeCreator(i); // (i < 10 ? '0' : '') + i;
        tableHtml += this.createShelve(channelCode, shelveCode, 'A', '');
      }
      const columnLineA = '<div class="column-line">' + '<div class="nood-a clearfix">' + '  <span class="nood-text">A面</span>' + tableHtml + '</div>' + '</div>';

      let shelveNumB2 = draw.areaData.shelveNumB2;
      let shelveNumB1 = draw.areaData.shelveNumB1;
      if (channelInfo) {
        shelveNumB2 = channelInfo.shelveNumB2;
        shelveNumB1 = channelInfo.shelveNumB1;
      }
      // B面
      tableHtml = '';
      for (let i = shelveNumB2; i >= shelveNumB1; i--) {
        const shelveCode = this.shelveCodeCreator(i); // (i < 10 ? '0' : '') + i;
        tableHtml += this.createShelve_U_B(channelCode, shelveCode);
      }
      const columnLineB = '<div class="column-line">' + '<div class="nood-b clearfix">' + '  <span class="nood-text">B面</span>' + tableHtml + '</div>' + '</div>';
      const channelHtml = '<div id="channel-' + channelCode + '" class="table-row clearfix">' + '<div class="column-num" channelCode="' + channelCode + '">通道 <p>' + channelCode + '</p></div>' + '<div class="t-box clearfix">' + '<span class="guanlian-line"></span>' + columnLineA + columnLineB + '</div>' + '</div>';
      return channelHtml;
    } else if (draw.areaData.pickMode === 'Z型') {
      // A面
      let tableHtml = '';
      for (let i = shelveNumA1; i <= shelveNumA2; i = i + 2) {
        const shelveCode = this.shelveCodeCreator(i); // (i < 10 ? '0' : '') + i;
        tableHtml += this.createShelve(channelCode, shelveCode, 'A', '');
      }
      const columnLineA = '<div class="column-line">' + '<div class="nood-a clearfix">' + '  <span class="nood-text">A面</span>' + tableHtml + '</div>' + '</div>';
      // B面
      tableHtml = '';
      for (let i = shelveNumA1 + 1; i <= shelveNumA2; i = i + 2) {
        const shelveCode = this.shelveCodeCreator(i); // (i < 10 ? '0' : '') + i;
        tableHtml += this.createShelve(channelCode, shelveCode, 'B', '');
      }
      const columnLineB = '<div class="column-line">' + '<div class="nood-b clearfix">' + '  <span class="nood-text">B面</span>' + tableHtml + '</div>' + '</div>';
      const channelHtml = '<div id="channel-' + channelCode + '" class="table-row clearfix">' + '<div class="column-num" channelCode="' + channelCode + '">通道 <p>' + channelCode + '</p></div>' + '<div class="t-box clearfix">' + '<span class="guanlian-line"></span>' + columnLineA + columnLineB + '</div>' + '</div>';
      return channelHtml;
    } else if (draw.areaData.pickMode === 'AB面奇偶型') {
      // A面
      let tableHtml = '';
      let shelveCode = this.shelveCodeCreator(1);
      tableHtml += this.createShelve(channelCode, shelveCode, 'A', 'odd');
      const columnLineA = '<div class="column-line">' + '<div class="nood-a clearfix">' + '  <span class="nood-text">A面</span>' + tableHtml + '</div>' + '</div>';
      // B面
      tableHtml = '';
      shelveCode = this.shelveCodeCreator(2);
      tableHtml += this.createShelve(channelCode, shelveCode, 'B', 'even');
      const columnLineB = '<div class="column-line">' + '<div class="nood-b clearfix">' + '  <span class="nood-text">B面</span>' + tableHtml + '</div>' + '</div>';
      const channelHtml = '<div id="channel-' + channelCode + '" class="table-row clearfix">' + '<div class="column-num" channelCode="' + channelCode + '">通道 <p>' + channelCode + '</p></div>' + '<div class="t-box clearfix">' + '<span class="guanlian-line"></span>' + columnLineA + columnLineB + '</div>' + '</div>';
      return channelHtml;
    }
  },

  // 创建通道 - 地堆
  createChannel_didui(channelCode: any) {
    // A面
    const shelveCode = this.shelveCodeCreator(1);
    const tableHtml = this.createShelve(channelCode, shelveCode, 'A', '');
    const columnLineA = '<div class="column-line didui">' + '<div class="nood-a clearfix">' + '  <span class="nood-text hidden">A面</span>' + tableHtml + '</div>' + '</div>';
    const channelHtml = '<div id="channel-' + channelCode + '" class="table-row didui clearfix">' + '<div class="column-num" channelCode="' + channelCode + '">通道 <p>' + channelCode + '</p></div>' + '<div class="t-box clearfix">' + '<span class="guanlian-line hidden"></span>' + columnLineA + '</div>' + '</div>';
    return channelHtml;
  },

  // 创建库区
  createArea() {
    if (this.isLoadedPosition) {
      // 计算横向滚动条
      const w: any = $('.table-wrap').width();
      $('.position-layout').width(w + 200);
      const screenHeight: any = $(document).height();
      $('.position-layout').height(screenHeight - 335);
      return;
    }
    this.isLoadedPosition = true;

    $('.table-wrap').empty();
    const positionTmpl = draw.areaData.positionRegular || draw.storageData.positionRegular;
    if (!positionTmpl) {
      return;
    }

    let areaHtml = '';
    for (let i = 1; i <= draw.areaData.channelNum; i++) {
      this.channelCodeCreator(i);
      const channelCode = this.channelCodeCreator(i); // (i < 10 ? '0' : '') + i;
      if (draw.areaData.shelveMode === '地堆') {
        areaHtml += this.createChannel_didui(channelCode);
      } else {
        areaHtml += this.createChannel(channelCode);
      }
    }
    $('.table-wrap').append(areaHtml);
    if (draw.areaData.shelveMode !== '地堆') {
      this.adjustLine();
    }
    // 计算横向滚动条
    const w: any = $('.table-wrap').width();
    $('.position-layout').width(w + 200);

    this.createTip(); // 创建tip
    this.loadPositionStatus();
  },

  // js连线的位置
  adjustLine() {
    $('.guanlian-line')
      .not('.hidden')
      .each(function (i) {
        const tbox: any = $(this).parent();
        const boxTop = tbox.offset().top;
        const nodeAToffset = $('.nood-a .nood-text', tbox).offset()?.top || 0;
        const nodeBToffset = $('.nood-b .nood-text', tbox).offset()?.top || 0;
        $(this).css({
          height: nodeBToffset - nodeAToffset,
          top: nodeAToffset - boxTop + 20,
        });
      });
  },

  // 通道编码规则
  channelCodeCreator(numIndex: any) {
    let channelRegular: string | null = draw.storageData.action === 'add' ? draw.storageData.channelRegular : draw.areaData.channelRegular;
    if (!channelRegular) {
      channelRegular = '{数字}{数字}';
      draw.areaData.channelRegular = channelRegular;
      draw.storageData.channelRegular = channelRegular;
    }

    return this.codeCreator(numIndex, channelRegular);
  },

  // 货架编码规则
  shelveCodeCreator(numIndex: any) {
    let shelvesRegular: string | null = draw.storageData.action === 'add' ? draw.storageData.shelvesRegular : draw.areaData.shelvesRegular;
    if (!shelvesRegular) {
      shelvesRegular = '{数字}{数字}';
      draw.areaData.shelvesRegular = shelvesRegular;
      draw.storageData.shelvesRegular = shelvesRegular;
    }
    return this.codeCreator(numIndex, shelvesRegular);
  },

  // 行编码规则
  rowCodeCreator(numIndex: any) {
    let rowRegular = draw.storageData.action === 'add' ? draw.storageData.rowRegular : draw.areaData.rowRegular;
    if (!rowRegular) {
      rowRegular = '{数字}{数字}';
      draw.areaData.rowRegular = rowRegular;
      draw.storageData.rowRegular = rowRegular;
    }
    return this.codeCreator(numIndex, rowRegular);
  },

  // 列编码规则
  columnCodeCreator(numIndex: any) {
    let columnRegular = draw.storageData.action === 'add' ? draw.storageData.columnRegular : draw.areaData.columnRegular;
    if (!columnRegular) {
      columnRegular = '{数字}{数字}';
      draw.areaData.columnRegular = columnRegular;
      draw.storageData.columnRegular = columnRegular;
    }
    return this.codeCreator(numIndex, columnRegular);
  },

  // 通用编码规则
  codeCreator(numIndex: any, regular: any) {
    const letterList = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',');
    if (!regular || !regular.split().some((item: string) => item.indexOf('数字') >= 0 || item.indexOf('字母') >= 0)) {
      regular = '{数字}{数字}';
    }
    const codeList = regular.match(/数字|字母/g);
    if (!codeList) {
      return '';
    }

    const codeValue = [];
    let index = 0;
    for (let i = codeList.length - 1; i >= 0; i--) {
      const item = codeList[codeList.length - 1];
      if (item === '数字') {
        if (numIndex < 10) {
          codeValue.push(numIndex);
          numIndex = 0;
        } else {
          const lastNum = numIndex % 10;
          codeValue.push(lastNum);
          numIndex = Math.floor(numIndex / 10);
        }
      } else if (item === '字母') {
        if (numIndex < 27) {
          codeValue.push(letterList[numIndex - 1]);
          numIndex = 0;
        } else {
          const lastNum = numIndex % 27;
          codeValue.push(lastNum);
          numIndex = Math.floor(numIndex / 27);
        }
      }
      index = index + 1;
    }

    for (let i = 0; i < codeList.length; i++) {
      regular = regular.replace('{' + codeList[i] + '}', codeValue[codeList.length - 1 - i]);
    }
    return regular;
  },

  // 加载货位状态
  async loadPositionStatus() {
    const loadPositionData = async () => {
      // 加载货位数据
      const url = '/basic/storage/position/loadPositionData';
      const params = {
        storageId: draw.areaData.storageId,
        areaCode: draw.areaData.areaCode,
      };
      const [err, res] = await to(postData(url, params));
      if (res?.result) {
        await this.binding.value.getPositionList(res.data);
        // 显示状态
        $.each(res.data, (i, row) => {
          row.productStorage = Number(row.productStorage || 0);
          row.maxCapacity = Number(row.maxCapacity || 0);
          row.validStorage = Number(row.validStorage || 0);
          row.holderStorage = Number(row.holderStorage || 0);
          row.originStorage = Number(row.originStorage || 0);

          $('.nostorage', '#' + row.positionName).remove(); // 移除无货位标识
          if ($('#' + row.positionName).hasClass('disabled')) return true;

          // 库存比例
          var rate = (row.productStorage ? row.productStorage : 1) / row.maxCapacity;
          rate = rate * 100;
          var rateHtml = `<div class="StorageRate" title="货位使用率为${rate}%">
              <div style="height:100%;background-color:red;width:${rate > 100 ? 100 : rate}%;"></div>
            </div>`;
          $('#' + row.positionName).append(rateHtml);

          // 库存数据
          var rateHtml = `<div style="height:16px;">
              <div class="productStorage" title="总库存量为${row.productStorage}">${row.productStorage}
              </div>
              <div class="validStorage" title="有效库存量为${row.validStorage}">${row.validStorage}</div>
              <div class="holderStorage" title="占位库存量为${row.holderStorage}">${row.holderStorage}</div>
						</div>`;
          $('#' + row.positionName).append(rateHtml);
        });
        this.adjustLine();
      }
    };
    const url = '/basic/storage/position/getList';
    const params = {
      storageId: draw.areaData.storageId,
      areaCode: draw.areaData.areaCode,
      searchFields: 'positionName,positionType,enable,isLocked,isMixProduct',
      take: 10000,
    };
    const [err, res] = await to(postData(url, params));
    if (res?.result) {
      if (!res.result) return;

      if (this.isViewer) {
        loadPositionData();
      }
      // 显示状态
      $.each(res.data, (i, row) => {
        if (row.enable !== 1) {
          $('#' + row.positionName)
            .css({ 'border-color': 'white', color: 'white' })
            .addClass('disabled');

          // 如果存在多层时，下面一层不可用，上面可用，将上面一层底部加上颜色边框
          var index = $('#' + row.positionName).index();
          if ($('#' + row.positionName).hasClass('disabled')) {
            var prevLi = $('#' + row.positionName)
              .parent()
              .prev()
              .children(':eq(' + index + ')');
            if (!prevLi.hasClass('disabled')) {
              prevLi.addClass('border-bottom');
            }
          }
        } else {
          if (row.isMixProduct === 1) {
            // 混物料
            $('#' + row.positionName).append('<span title="混物料" class="isMixProduct"></span>');
          }

          if (row.isLocked === 1) {
            $('#' + row.positionName).append('<span title="货位已锁定" class="locked"></span>');
          }
          var typeRow = dropdownStore.translateText(row.positionType, 501);
          $('#' + row.positionName).append(`<span title="${typeRow}" class="postype-${row.positionType}" /></span>`);
        }
      });
    }
  },
  // 创建工具栏和显示库存详情对话框
  createTip() {
    var the = this;

    if (this.isViewer) {
      // 点击货位事件
      $('.table-list-ul li')
        .off('click')
        .on('click', function (e) {
          var id = $(this).attr('id');
          if (!$(this).hasClass('disabled')) {
            the.binding.value.displayDetail(this, id);
          }
        });
    } else {
      $('.position-layout .column-num, .table-list-ul li span.t-n, span.b-n, .table-list-ul li span.l-n, .table-num')
        .off('click')
        .on('click', function (e) {
          let action = null;
          var channelCode = this.getAttribute('channelcode');
          var shelveCode = this.getAttribute('shelveCode');
          var colNo = this.getAttribute('colNo');
          var rowNo = this.getAttribute('rowNo');

          var attr = '';
          if (channelCode) {
            attr += '[channelCode="' + channelCode + '"]';
            action = '通道';
          }
          if (shelveCode) {
            attr += '[shelveCode="' + shelveCode + '"]';
            action = '货架';
          }
          if (colNo) {
            attr += '[colNo="' + colNo + '"]';
            action = '列';
          }
          if (rowNo) {
            attr += '[rowNo="' + rowNo + '"]';
            action = '层';
          }
          var shelveList = [] as Array<any>;
          // 当点击通道时候获取通道下所有货架编号
          if (!shelveCode) {
            $(this)
              .closest('.table-row')
              .find('.table-reset')
              .each(function (v, val) {
                shelveList.push({
                  shelveCode: $(this).attr('shelvecode'),
                  channelCode: $(this).attr('channelcode'),
                });
              });
          }
          var positionList = [] as any;
          $('.table-list-ul li' + attr).each(function (i, item) {
            positionList.push({
              positionName: $(this).attr('id'),
              quantity: 1,
              rowno: $(this).attr('rowno'),
              colno: $(this).attr('colno'),
            });
          });
          the.binding.value.displayTool(this, positionList, shelveList, action);
        });
    }
  },
};

let vDrawposition = {
  mounted: function (el: HTMLElement, binding: DirectiveBinding, vnode: VNode, prevVnode: VNode) {
    $('.position-layout').width(50000);
    if (binding.value.isRefresh) {
      draw.isLoadedPosition = false;
      binding.value.updateRefresh(false);
    }

    draw.vnode = vnode;
    draw.binding = binding;
    // draw.common = vnode.appContext?.common;
    // isViewer=true预览数据，false=设计
    draw.isViewer = binding.value.isViewer;
    draw.storageData = binding.value.storageData;
    draw.areaData = binding.value.areaData;
    draw.shelveDataList = binding.value.shelveDataList;
    draw.channelDataList = binding.value.channelDataList;
    draw.createArea();
  },
  updated: function (el: HTMLElement, binding: DirectiveBinding, vnode: VNode, prevVnode: VNode) {
    $('.position-layout').width(50000);
    if (binding.value.isRefresh) {
      draw.isLoadedPosition = false;
      binding.value.updateRefresh(false);
    }

    draw.isViewer = binding.value.isViewer;
    draw.storageData = binding.value.storageData;
    draw.areaData = binding.value.areaData;
    draw.shelveDataList = binding.value.shelveDataList;
    draw.channelDataList = binding.value.channelDataList;
    draw.createArea();
  },
};

export { vDrawposition };
