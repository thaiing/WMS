/* eslint-disable */
// 创建混入文件
export function generateMixinCode(data) {
  var json = JSON.stringify(data, null, 2);

  return json;
}

// 创建主文件
export function generateMainCode() {
  return `
<script>
import baseLayout from "@/components/common/base-layout.vue";

export default {
  components: {},
  mixins: [baseLayout],
  data() {
    return {};
  },
  methods: {}
};
</script>
`
}
