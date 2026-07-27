<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" label-width="120px">
      <el-form-item label="快递类型">
        <template v-for="(item, index) in valueList">
          <el-input v-if="modifyInputVisible == item" :key="index" :ref="'modifyTagInput' + index" v-model="modifyInputValue" class="input-new-tag" size="small" @keyup.enter="modifyInputConfirm(item)" @blur="modifyInputConfirm(item)"></el-input>
          <el-tag v-else :key="'tag-' + index" :disable-transitions="false" closable @close="handleClose(item)" @click="modifyShowInput(item, index)">
            {{ item.value02 }}
          </el-tag>
        </template>

        <el-input v-if="addInputVisible" ref="addTagInput" v-model="addInputValue" class="input-new-tag" size="small" @keyup.enter="addInputConfirm" @blur="addInputConfirm"></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="addShowInput">+ 添加项</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'settings-consignor',

  components: {},
  data() {
    return {
      typeId: 503, // 下拉框值类别ID
      valueList: [],
      addInputVisible: false,
      modifyInputVisible: false,
      addInputValue: '',
      modifyInputValue: '',
    };
  },
  mounted() {
    this.loadParam();
  },
  methods: {
    handleClose(tag) {
      this.valueList.splice(this.valueList.indexOf(tag), 1);
    },

    modifyShowInput(item, index) {
      this.modifyInputValue = item.value02;
      this.modifyInputVisible = item;
      this.$nextTick((_) => {
        this.$refs['modifyTagInput' + index][0].$refs.input.focus();
      });
    },

    modifyInputConfirm(item) {
      item.value02 = this.modifyInputValue;
      this.modifyInputVisible = false;
      this.modifyInputValue = '';
    },

    addShowInput() {
      this.addInputVisible = true;
      this.$nextTick((_) => {
        this.$refs.addTagInput.$refs.input.focus();
      });
    },

    addInputConfirm() {
      const addInputValue = this.addInputValue;
      if (addInputValue) {
        this.valueList.push({
          Params_Id: 0,
          UserProduct_Id: null,
          value02: addInputValue,
        });
      }
      this.addInputVisible = false;
      this.addInputValue = '';
    },
    // 加载数据
    loadParam() {
      const url = '/api/sys/param/getValueList';
      var params = {
        typeId: this.typeId,
      };
      var callback = (res) => {
        this.common.showMsg(res);
        // 获得参数值列表
        this.valueList = res.data || [];
      };
      this.common.ajax(url, params, callback, true);
    },
    // 保存数据
    onSave() {
      var url = '/api/sys/param/saveParams';
      var params = {
        typeId: this.typeId,
        valueList: this.valueList,
      };
      this.common.ajax(
        url,
        params,
        (res) => {
          this.common.showMsg(res);
        },
        true
      );
    },
  },
};
</script>

<style lang="scss">
.settings-sub-container {
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    margin-right: 10px;
    vertical-align: bottom;
  }

  .footer {
    width: 920px;
    padding: 40px 10px 20px;
    text-align: center;
    .msg {
      line-height: 1.5;
      margin-top: 30px;
      text-align: left;
      font-size: 14px;
    }
  }
  .demo.el-alert {
    display: inline-table;
    ::v-deep .el-alert__icon {
      position: relative;
      top: 20px;
    }
  }
}
</style>
