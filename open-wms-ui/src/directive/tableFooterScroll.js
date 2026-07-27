var tableFooterScroll = {
  bind: function(el, binding, vnode) {
    var body = el.children[2];
    body.onscroll = function(e) {
      var footer = el.children[3];
      if (footer && footer.classList.contains("el-table__footer-wrapper")) {
        // 滚动footer，保存滚动条一致
        footer.scrollLeft = e.target.scrollLeft;
      }
    };
  },
  update: function(el, binding, vnode) {}
};

export { tableFooterScroll };
