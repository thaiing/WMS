function findRemoteFunc(fields, funcList, tokenFuncList, blankList) {
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].type === "grid") {
      fields[i].columns.forEach(item => {
        findRemoteFunc(item.fields, funcList, tokenFuncList, blankList);
      });
    } else {
      if (fields[i].type === "blank") {
        if (fields[i].model) {
          blankList.push({
            model: fields[i].model,
            label: fields[i].label
          });
        }
      } else {
        if (fields[i].options.remote && fields[i].options.remoteFunc) {
          funcList.push({
            func: fields[i].options.remoteFunc,
            label: fields[i].label,
            model: fields[i].model
          });
        }
      }
    }
  }
}

export default function(data) {
  const funcList = [];

  const tokenFuncList = [];

  const blankList = [];

  findRemoteFunc(
    JSON.parse(data).editorOptions.fields,
    funcList,
    tokenFuncList,
    blankList
  );

  let funcTemplate = "";

  let blankTemplate = "";

  for (let i = 0; i < funcList.length; i++) {
    funcTemplate += `
            ${funcList[i].func} (resolve) {
              //  ${funcList[i].label} ${funcList[i].model}
              //  获取到远端数据后执行回调函数
              //  resolve(data)
            },
    `;
  }

  for (let i = 0; i < tokenFuncList.length; i++) {
    funcTemplate += `
            ${tokenFuncList[i].func} (resolve) {
              //  ${tokenFuncList[i].label} ${tokenFuncList[i].model}
              //  获取到token数据后执行回调函数
              //  resolve(token)
            },
    `;
  }

  for (let i = 0; i < blankList.length; i++) {
    blankTemplate += `
        <template slot="${blankList[i].label}" slot-scope="scope">
          <!-- ${blankList[i].label} -->
          <!-- 通过 v-model="scope.model.${blankList[i].label}" 绑定数据 -->
        </template>
    `;
  }

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https:// unpkg.com/element-ui/lib/theme-chalk/index.css">
    <link rel="stylesheet" href="https:// unpkg.com/form-making/dist/FormMaking.css">
  </head>
  <body>
    <div id="app">
      <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm">
        ${blankTemplate}
      </fm-generate-form>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
    <script src="https:// unpkg.com/vue/dist/vue.js"></script>
    <script src="https:// unpkg.com/element-ui/lib/index.js"></script>
    <script src="https:// unpkg.com/form-making/dist/FormMaking.umd.js"></script>
    <script>
      new Vue({
        el: '#app',
        data: {
          jsonData: ${data},
          editData: {},
          remoteFuncs: {
            ${funcTemplate}
          }
        },
        methods: {
          handleSubmit () {
            this.$refs.generateForm.getData().then(data => {
              //  数据校验成功
              //  data 为获取的表单数据
            }).catch(e => {
              //  数据校验失败
            })
          }
        }
      })
    </script>
  </body>
  </html>`;
}
