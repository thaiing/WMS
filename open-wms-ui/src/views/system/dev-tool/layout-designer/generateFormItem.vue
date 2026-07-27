<template>
  <el-form-item :label="widget.label" :prop="widget.model">
    <template v-if="widget.type == 'input'">
      <el-input v-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'" v-model.number="dataModel" :type="widget.options.dataType" :placeholder="widget.options.placeholder" :style="{width: widget.options.width}"></el-input>
      <el-input v-else v-model="dataModel" :type="widget.options.dataType" :placeholder="widget.options.placeholder" :style="{width: widget.options.width}"></el-input>
    </template>

    <template v-if="widget.type == 'textarea'">
      <el-input v-model="dataModel" :rows="5" :placeholder="widget.options.placeholder" :style="{width: widget.options.width}" type="textarea"></el-input>
    </template>

    <template v-if="widget.type == 'number'">
      <el-input-number v-model="widget.options.defaultValue" :style="{width: widget.options.width}" :step="widget.options.step" controls-position="right"></el-input-number>
    </template>

    <template v-if="widget.type == 'radio'">
      <el-radio-group v-model="dataModel" :style="{width: widget.options.width}">
        <el-radio v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="index" :style="{display: widget.options.inline ? 'inline-block' : 'block'}" :label="item.value">
          <template v-if="widget.options.remote">{{ item.label }}</template>
          <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="widget.type == 'checkbox'">
      <el-checkbox-group v-model="dataModel" :style="{width: widget.options.width}">
        <el-checkbox v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="index" :style="{display: widget.options.inline ? 'inline-block' : 'block'}" :label="item.value">
          <template v-if="widget.options.remote">{{ item.label }}</template>
          <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="widget.type == 'cascader'">
      <el-cascader v-model="dataModel" :placeholder="widget.options.placeholder" :options="widget.options.options" :style="{width: widget.options.width}" filterable change-on-select></el-cascader>
    </template>

    <template v-if="widget.type == 'time'">
      <el-time-picker v-model="dataModel" :is-range="widget.options.isRange" :placeholder="widget.options.placeholder" :start-placeholder="widget.options.startPlaceholder" :end-placeholder="widget.options.endPlaceholder" :readonly="widget.options.readonly" :disabled="widget.options.disabled" :editable="widget.options.editable" :clearable="widget.options.clearable" :arrow-control="widget.options.arrowControl" :value-format="widget.options.format" :style="{width: widget.options.width}">
      </el-time-picker>
    </template>

    <template v-if="widget.type=='date'">
      <el-date-picker v-model="dataModel" :type="widget.options.type" :placeholder="widget.options.placeholder" :start-placeholder="widget.options.startPlaceholder" :end-placeholder="widget.options.endPlaceholder" :readonly="widget.options.readonly" :disabled="widget.options.disabled" :editable="widget.options.editable" :clearable="widget.options.clearable" :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format" :format="widget.options.format" :style="{width: widget.options.width}">
      </el-date-picker>
    </template>

    <template v-if="widget.type =='rate'">
      <el-rate v-model="dataModel" :max="widget.options.max" :disabled="widget.options.disabled" :allow-half="widget.options.allowHalf"></el-rate>
    </template>

    <template v-if="widget.type == 'color'">
      <el-color-picker v-model="dataModel" :disabled="widget.options.disabled" :show-alpha="widget.options.showAlpha"></el-color-picker>
    </template>

    <template v-if="widget.type == 'select'">
      <el-select v-model="dataModel" :disabled="widget.options.disabled" :multiple="widget.options.multiple" :clearable="widget.options.clearable" :placeholder="widget.options.placeholder" :style="{width: widget.options.width}">
        <el-option v-for="item in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value"></el-option>
      </el-select>
    </template>

    <template v-if="widget.type=='switch'">
      <el-switch v-model="dataModel" :disabled="widget.options.disabled">
      </el-switch>
    </template>

    <template v-if="widget.type=='slider'">
      <el-slider v-model="dataModel" :min="widget.options.min" :max="widget.options.max" :disabled="widget.options.disabled" :step="widget.options.step" :show-input="widget.options.showInput" :range="widget.options.range" :style="{width: widget.options.width}"></el-slider>
    </template>

    <template v-if="widget.type=='imgupload'">
      <fm-upload v-model="dataModel" :disabled="widget.options.disabled" :style="{'width': widget.options.width}" :width="widget.options.size.width" :height="widget.options.size.height" :token="widget.options.token" :domain="widget.options.domain">
      </fm-upload>
    </template>
  </el-form-item>
</template>

<script>
import FmUpload from "./Upload/index.vue";

export default {
  components: {
    FmUpload
  },
  props: {
    widget: {
      type: Object,
      default: () => {
        return {};
      }
    },
    models: {
      type: Object,
      default: () => {
        return {};
      }
    },
    rules: {
      type: Object,
      default: () => {
        return {};
      }
    },
    remote: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      dataModel: this.models[this.widget.model]
    };
  },
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val;
        this.$emit("update:models", {
          ...this.models,
          [this.widget.model]: val
        });
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.model];
      }
    }
  },
  created() {
    if (this.widget.options.remote && this.remote[this.widget.options.remoteFunc]) {
      this.remote[this.widget.options.remoteFunc](data => {
        this.widget.options.remoteOptions = data.map(item => {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label]
          };
        });
      });
    }

    if (this.widget.type === "imgupload") {
      this.remote[this.widget.options.tokenFunc](data => {
        this.widget.options.token = data;
      });
    }
  }
};
</script>
