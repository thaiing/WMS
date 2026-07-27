<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      // 当前正在扫描的数据
      currentRow: null,
      // 已经找到的数据
      existRows: [],
      // 配置参数
      config: {
        // 同商品同条码存在多条时默认选中第一条
        global_scanSameProductCodeAndModel: false
      }
    };
  },
  computed: {
    // 获取当前扫描的SN个数
    snCount: function() {
      let snList = this.formData.snList;
      snList = snList
        ? snList
          .replace(/,/gi, "\n")
          .replace(/\\r/gi, "")
          .split("\n")
        : [];
      snList = snList.filter(item => item); // 清除空值
      return snList.length;
    }
  },
  mounted() {
    // 获取配置参数
    this.getBaseConfig();
  },
  methods: {
    // 获得配置参数
    getBaseConfig() {
      var keys = Object.keys(this.config).join(",");
      var url = "/api/sys/param/getConfig";
      var params = {
        keys: keys
      };
      var callback = res => {
        this.common.showMsg(res);
        this.valueList = res.data;
        // 获得参数值列表，将数字转换为对象
        res.data.forEach(item => {
          var value02 = item.value02; // 字段名称
          var value03 = item.value03;

          if (this.common.isNumber(item.value03)) {
            value03 = parseInt(item.value03);
          }
          this.$set(this.config, value02, !!value03);
        });
      };
      var target = this.$refs["settings"];
      this.common.ajax(url, params, callback, target);
    },
    // 播放正确声音
    play() {
      this.$refs.sound_correct.currentTime = 0;
      this.$refs.sound_correct.play();
    },
    // 播放失败声音
    playError() {
      this.$refs.sound_error.currentTime = 0;
      this.$refs.sound_error.play();
    },
    // 获得焦点
    focus(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].focus();
        this.$refs[refName].select();
      } else {
        this.$message.error("焦点不存在：" + refName);
      }
    },
    /**
     * 判断扫描包装条码
     * @param {dataRows} 筛选数据
     * @param {successCallback} 扫描成功后，回调函数
     * @param {noExistCallback} 扫描不存在后，回调函数
     */
    checkPackingProductModel(dataRows, successCallback, noExistCallback) {
      if (!dataRows || !Array.isArray(dataRows)) {
        if (typeof dataRows === "function") {
          successCallback = dataRows;
        }
        dataRows = this.tableData;
      }
      this.selectRow(dataRows, noExistCallback);

      // 开启SN扫描，不自动增加数量
      if (!this.formData.isScanSn) {
        this.setRowQty(dataRows);
      } else {
        const sn = this.currentRow.singleSignCode;
        let snList = [];
        if (sn) {
          snList = sn.split(",");
        }
        let validSnList = snList.filter(item => item); // 有效SN
        validSnList = validSnList.map(item => item.trim());
        validSnList.push("");
        this.formData.snList = validSnList.join("\r\n");
        this.scanSn();
        this.focus("snList");
      }

      // 执行回调函数
      if (typeof successCallback === "function") {
        successCallback();
      }
    },
    selectRow(dataRows, noExistCallback) {
      var code = this.formData.productModel.trim();
      if (!code) return;
      if (this.currentRow) {
        const exists = this.checkProductModelExist(code, this.currentRow);
        if (!exists || !this.currentRow.unFinishedQuantity) {
          this.currentRow = null;
        } else {
          this.currentRow.sortIndex = 1;
        }
      }

      if (!this.currentRow) {
        // 判断是否存在一码多品
        this.existRows = dataRows.filter(item => {
          const exist = this.checkProductModelExist(code, item);
          // UnFinishedQuantity不存在或者大于0
          return exist && (item.unFinishedQuantity === undefined || item.unFinishedQuantity > 0);
        });
        this.focus("productModel");

        if (this.config.global_scanSameProductCodeAndModel) {
          // 获取分组，如果都相同，获取第一个
          const groupList = this.existRows.reduce(
            (all, next) =>
              all.some(item => item.productCode === next.productCode && item.productModel === next.productModel) ? all : [...all, next],
            []
          );
          if (groupList.length === 1) {
            this.existRows = groupList;
          }
        }

        if (this.existRows.length > 1) {
          this.$message.error(`【${code}】存在一码多品，需要手动选择需要扫描的明细，双击一下明细即可选择哦。`);
          this.existRows.forEach(item => {
            item.sortIndex = 1;
          });
          // 置顶排序
          dataRows.sort(function(a, b) {
            return b.sortIndex - a.sortIndex;
          });

          dataRows.forEach(element => {
            element.sortIndex = 0;
          });
          this.$refs.sound_error.currentTime = 0;
          this.playError();
          return;
        }
        if (!this.existRows.length) {
          // 执行回调函数
          if (typeof noExistCallback === "function") {
            noExistCallback(code);
          } else {
            this.$message.error(`【${code}】没有可扫描的数据`);
            this.playError();
          }
          return;
        }

        // 设置当前行
        this.currentRow = this.existRows[0];
        this.currentRow.sortIndex = 1;
      }
      this.currentRow.scanWeight = Math.Round(this.currentRow.weight * this.currentRow.finishedQuantity, 2);
    },
    // 扫描数量处理
    setRowQty(dataRows) {
      if (!dataRows || !Array.isArray(dataRows)) {
        dataRows = this.tableData;
      }
      var code = this.formData.productModel.trim();

      // 获得扫描数量
      let scanQty = 1; // 默认扫描数量为1

      // 如果未扫描数量大于0并且小于1 ，就直接把剩余的数量直接赋值
      if (this.currentRow.unFinishedQuantity > 0 && this.currentRow.unFinishedQuantity < 1) {
        scanQty = this.currentRow.unFinishedQuantity;
      }
      if (this.currentRow.middleBarcode === code) {
        // 中包装条码
        scanQty = this.currentRow.middleUnitConvert;
        if (!scanQty || scanQty < 0) {
          this.$message.error(`条码【${this.currentRow.middleBarcode}】没有设置中单位换算关系数据！`);
          this.$refs.sound_error.currentTime = 0;
          this.playError();
          return;
        }
      } else if (this.currentRow.bigBarcode === code) {
        // 中包装条码
        scanQty = this.currentRow.unitConvert;
        if (!scanQty || scanQty < 0) {
          this.$message.error(`条码【${this.currentRow.bigBarcode}】没有设置大单位换算关系数据！`);
          this.$refs.sound_error.currentTime = 0;
          this.playError();
          return;
        }
      }
      // 判断是否有足够扫描数量
      if (this.currentRow.unFinishedQuantity !== undefined && this.currentRow.unFinishedQuantity < scanQty) {
        this.$message.error(`商品扫描数量不足！`);
        this.focus("scanQty");
        this.$refs.sound_error.currentTime = 0;
        this.playError();
        return;
      }

      // 设置已扫描的数量
      this.currentRow.finishedQuantity += scanQty;
      if (this.currentRow.unFinishedQuantity !== undefined) {
        this.currentRow.unFinishedQuantity -= scanQty;
        this.currentRow.scanWeight = Math.Round(this.currentRow.finishedQuantity * this.currentRow.weight, 4);
      } else {
        this.currentRow.scanWeight = Math.Round(this.currentRow.finishedQuantity * this.currentRow.weight, 4);
      }
      this.formData.scanQty = this.currentRow.finishedQuantity;
      this.play();

      // 置顶排序
      dataRows.sort(function(a, b) {
        return b.sortIndex - a.sortIndex;
      });

      dataRows.forEach(element => {
        element.sortIndex = 0;
      });
      this.focus("productModel");
    },
    /**
     * 获得扫描数量，根据大中小进率
     */
    getScanQty() {
      var code = this.formData.productModel.trim();
      // 获得扫描数量
      let scanQty = 1; // 默认扫描数量为1
      if (this.currentRow.middleBarcode === code) {
        // 中包装条码
        scanQty = this.currentRow.middleUnitConvert;
        if (!scanQty || scanQty < 0) {
          this.$message.error(`条码【${this.currentRow.middleBarcode}】没有设置中单位换算关系数据！`);
          this.$refs.sound_error.currentTime = 0;
          this.playError();
          return;
        }
      } else if (this.currentRow.bigBarcode === code) {
        // 中包装条码
        scanQty = this.currentRow.unitConvert;
        if (!scanQty || scanQty < 0) {
          this.$message.error(`条码【${this.currentRow.bigBarcode}】没有设置大单位换算关系数据！`);
          this.$refs.sound_error.currentTime = 0;
          this.playError();
          return;
        }
      }

      return scanQty;
    },
    // 判断所有条码是否存在
    checkProductModelExist(productModel, rowData) {
      var isExists = false;
      if (!productModel || !rowData) {
        return false;
      }

      isExists =
        productModel === rowData.productModel ||
        productModel === rowData.relationCode ||
        productModel === rowData.relationCode2 ||
        productModel === rowData.relationCode3 ||
        productModel === rowData.relationCode4 ||
        productModel === rowData.relationCode5 ||
        productModel === rowData.middleBarcode ||
        productModel === rowData.singleSignCode ||
        productModel === rowData.bigBarcode;

      return isExists;
    },
    // 手动设置数量
    setScanQty(callback) {
      this.currentRow = null;

      if (!this.existRows.length) {
        this.$message.error("请扫描商品条码！");
        this.$refs.sound_error.currentTime = 0;
        this.playError();
        return false;
      }
      if (this.existRows.length > 1) {
        this.$message.error(`【${this.existRows[0].productModel}】存在一码多品，需要手动选择需要扫描的明细，双击一下明细即可选择哦。`);
        this.$refs.sound_error.currentTime = 0;
        this.playError();
        return;
      }

      // 设置当前行
      this.currentRow = this.existRows[0];
      const scanQty = this.formData.scanQty;
      if (this.currentRow.unFinishedQuantity !== undefined) {
        // 判断是否有足够扫描数量
        const totalQty = this.currentRow.unFinishedQuantity + this.currentRow.finishedQuantity;
        if (totalQty < scanQty) {
          this.$message.error("商品扫描数量不足！");
          this.playError();
          this.focus("scanQty");
          return false;
        }
        const total = totalQty - scanQty;
        // 设置未扫描的数量
        this.currentRow.unFinishedQuantity = Math.Round(total, 4);
      }
      // 设置已扫描的数量
      this.$set(this.currentRow, "finishedQuantity", scanQty);
      this.currentRow.scanWeight = this.currentRow.finishedQuantity * this.currentRow.weight;

      this.play();
      if (typeof callback === "function") {
        const re = callback();
        if (re === false) {
          this.play();
          return;
        }
      }
      this.play();

      return true;
    },
    // 行样式
    rowClass({ row, rowIndex }) {
      let className = "";
      if (this.existRows.find(f => f === row)) {
        if (this.existRows.length === 1) {
          className = "row-active";
        } else {
          className = "multi-row-active";
        }
      }

      if (row.unFinishedQuantity === 0) {
        className += " row-finished";
      }
      return className;
    },
    // 双击事件
    setCurrent(row, event, column) {
      if (this.checkProductModelExist(this.formData.productModel, row)) {
        this.currentRow = row;
        this.existRows = [row];
        this.tableData.forEach(element => {
          element.sortIndex = 0;
        });
        this.currentRow.sortIndex = 1;
        this.tableData = this.tableData.sort(function(a, b) {
          return b.sortIndex - a.sortIndex;
        });
        this.tableData.forEach(element => {
          element.sortIndex = 0;
        });
        this.focus("productModel");
        if (this.formData.isScanSn && this.currentRow.singleSignCode) {
          this.formData.snList = this.currentRow.singleSignCode.split(",").join("\r\n");
          this.scanSn();
        }
      }
    },
    // 是否已完成
    isFinished() {
      var isAllFinished = this.tableData.every(rowData => {
        return rowData.unFinishedQuantity <= 0;
      });

      return isAllFinished;
    },
    // 行数据改变
    rowChangeQty(prop, row, qtyFeild) {
      if (!qtyFeild) {
        qtyFeild = "quantityOrder";
      }
      if (prop === "finishedQuantity") {
        row.unFinishedQuantity = row[qtyFeild] - row.finishedQuantity;
      } else if (prop === "unFinishedQuantity") {
        row.finishedQuantity = row[qtyFeild] - row.unFinishedQuantity;
      }
      row.scanWeight = Math.Round(row.weight * row.finishedQuantity, 2);
    },
    // 扫描SN
    scanSn(e) {
      if (!this.currentRow || this.common.isEmptyObject(this.currentRow)) {
        this.$message.error("请先扫描商品条码！");
        this.formData.snList = "";
        return;
      }
      if (e && e.keyCode !== 13) {
        return;
      }
      let snList = this.formData.snList;
      snList = snList
        ? snList
          .replace(/,/gi, "\n")
          .replace(/\\r/gi, "")
          .split("\n")
        : [];
      let validSnList = snList.filter(item => item); // 有效SN
      // 判断是否重复
      const groupList = validSnList
        .map(item => {
          return { text: item, count: 1 };
        })
        .reduce((all, next) => {
          const existItem = all.find(item => item.text === next.text);
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
      const repeatList = groupList.filter(item => item.count > 1);
      const codes = repeatList.map(item => item.text).join(",");
      if (codes) {
        this.$message.error(codes + "重复，已去掉重复项");
        validSnList = groupList.map(item => item.text); // 已去掉重复项
      }
      validSnList = validSnList.map(item => item.trim());

      // 校验SN，如果存在需要核验的SN
      if (this.formData.checkSnList) {
        const chekSnList = this.formData.checkSnList.split("\n");
        const invalidSnList = validSnList.filter(item => !chekSnList.some(s => s === item));
        if (invalidSnList.length) {
          this.$message.error("扫描的SN在校验的列表中不存在");
          for (const item of invalidSnList) {
            const index = validSnList.indexOf(item);
            if (index >= 0) validSnList.splice(index, 1);
          }
        }
      }

      const scanQty = validSnList.length;
      if (this.currentRow.validQuantity < scanQty) {
        // validSnList.pop();

        if (scanQty - this.currentRow.validQuantity >= 1) {
          validSnList.splice(this.currentRow.validQuantity, scanQty);
        }

        this.currentRow.singleSignCode = validSnList.join(",");
        validSnList.push("");
        this.formData.snList = validSnList.join("\n");
        this.$message.error("没有可扫描数量了");
        this.playError();
        return;
      }
      this.currentRow.singleSignCode = validSnList.join(",");
      validSnList.push("");
      this.formData.snList = validSnList.join("\n");
      this.currentRow.finishedQuantity = scanQty;
      if (this.currentRow.unFinishedQuantity !== undefined) {
        this.currentRow.unFinishedQuantity = this.currentRow.validQuantity - scanQty;
        this.currentRow.scanWeight = Math.Round(this.currentRow.finishedQuantity * this.currentRow.weight, 4);
      } else {
        this.currentRow.scanWeight = Math.Round(this.currentRow.finishedQuantity * this.currentRow.weight, 4);
      }
      this.formData.scanQty = this.currentRow.finishedQuantity;
    },
    // 计算SN扫描结果
    scanSnResult() {}
  }
};
</script>
