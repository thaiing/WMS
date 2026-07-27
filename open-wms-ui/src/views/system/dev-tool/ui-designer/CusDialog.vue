<template>
  <el-dialog ref="elDialog" draggable :width="width" :title="title" v-model="dialogVisible" :append-to-body="true"
    class="cus-dialog-container" center top="5vh">
    <span v-if="show">
      <slot></slot>
    </span>

    <template #footer>
      <span v-if="action" v-loading="loading" :element-loading-text="loadingText" class="dialog-footer">
        <slot name="action">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </slot>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "600px",
    },
    form: {
      type: Boolean,
      default: true,
    },
    action: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["on-close", "on-submit"],
  data() {
    return {
      loading: false,
      dialogVisible: this.visible,
      showForm: false,
    };
  },
  computed: {
    show() {
      if (this.form) {
        return this.showForm;
      } else {
        return true;
      }
    },
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.loading = false;
        this.$emit("on-close");
        setTimeout(() => {
          this.showForm = false;
        }, 300);
      } else {
        this.showForm = true;
      }
    },
    visible(val) {
      this.dialogVisible = val;
    },
  },
  methods: {
    close() {
      this.dialogVisible = false;
    },
    submit() {
      this.loading = true;

      this.$emit("on-submit");
    },
    end() {
      this.loading = false;
    },
  },
};
</script>

<style lang="scss">
.cus-dialog-container {
  .el-dialog__footer {
    margin: 0 20px;
    //  border-top: 1px dashed #ccc;
    padding: 15px 0 16px;
    text-align: center;
    position: relative;

    .dialog-footer {
      display: block;

      .circular {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        width: 24px;
        height: 24px;
      }

      .el-loading-text {
        display: inline-block;
        vertical-align: middle;
      }

      .el-loading-spinner {
        margin-top: -12px;
      }
    }
  }

  .el-dialog--center .el-dialog__body {
    padding: 10px 5px 20px;
  }
}
</style>
