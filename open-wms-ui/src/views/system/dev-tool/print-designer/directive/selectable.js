/* eslint-disable */
var selectable = {
  beforeMount: function (el, binding, vnode) {
    var rect = {
      el: null,
      isMove: false,
      from: {
        x: 0,
        y: 0,
      },
      to: {
        x: 0,
        y: 0,
      },
      init() {
        this.el = document.createElement('div');
        el.append(this.el);
        this.el.style.left = this.from.x + 'px';
        this.el.style.top = this.from.y + 'px';
        this.el.setAttribute('class', 'selectable');
      },
      move() {
        var width = this.to.x - this.from.x;
        var height = this.to.y - this.from.y;

        if (width >= 0) {
          this.el.style.left = this.from.x + 'px';
        } else {
          this.el.style.left = this.to.x + 'px';
        }

        if (height >= 0) {
          this.el.style.top = this.from.y + 'px';
        } else {
          this.el.style.top = this.to.y + 'px';
        }

        this.el.style.width = Math.abs(width) + 'px';
        this.el.style.height = Math.abs(height) + 'px';

        this.selectItems();
      },
      remove() {
        if (this.el) {
          this.el.remove();
        }
      },
      selectItems() {
        document.querySelectorAll('.resable-item').forEach((item) => {
          if (this.isIntersection(this.el, item)) {
            item.classList.add('selected');
          } else {
            item.classList.remove('selected');
          }
        });
      },
      // 判断两个矩形是否存在交集
      isIntersection(rect1, rect2) {
        let maxX, maxY, minX, minY;

        rect1.width = parseInt(rect1.style.width);
        rect1.height = parseInt(rect1.style.height);
        rect2.width = parseInt(rect2.style.width);
        rect2.height = parseInt(rect2.style.height);

        maxX = rect1.offsetLeft + rect1.width >= rect2.offsetLeft + rect2.width ? rect1.offsetLeft + rect1.width : rect2.offsetLeft + rect2.width;
        maxY = rect1.offsetTop + rect1.height >= rect2.offsetTop + rect2.height ? rect1.offsetTop + rect1.height : rect2.offsetTop + rect2.height;
        minX = rect1.offsetLeft <= rect2.offsetLeft ? rect1.offsetLeft : rect2.offsetLeft;
        minY = rect1.offsetTop <= rect2.offsetTop ? rect1.offsetTop : rect2.offsetTop;
        // console.log('rect1.offsetLeft=' + rect1.offsetLeft + ", rect1.offsetTop=" + rect1.offsetTop + ', rect2.offsetLeft=' + rect2.offsetLeft + ", rect2.offsetTop = " + rect2.offsetTop);
        // console.log('rect1.width=' + rect1.width + ", rect1.height=" + rect1.height + ', rect2.width=' + rect2.width + ", rect2.height = " + rect2.height);

        if (maxX - minX <= rect1.width + rect2.width && maxY - minY <= rect1.height + rect2.height) {
          return true;
        } else {
          return false;
        }
      },
    };
    // document.oncontextmenu = new Function("event.returnValue=false;");
    // document.onselectstart = new Function("event.returnValue=false;");
    el.onmousedown = function (e) {
      rect.from.x = e.offsetX;
      rect.from.y = e.offsetY;
      rect.to.x = e.offsetX;
      rect.to.y = e.offsetY;
      rect.isMove = true;
      rect.init();
      document.onmouseup = function (e) {
        rect.isMove = false;
        rect.remove();
      };
    };
    el.onmousemove = function (e) {
      if (rect.isMove) {
        rect.to.x += e.movementX;
        rect.to.y += e.movementY;
        // console.log("movementX=" + e.movementX + ", movementY=" + e.movementY)
        rect.move();
      }
    };
    document.onmousedown = function () {
      document.querySelectorAll('.resable-item').forEach((item) => {
        item.classList.remove('selected');
      });
    };
  },
  beforeUpdate: function (el, binding, vnode) {
    var fields = binding.value;
    //  键盘操作
    document.onkeyup = function (e) {
      let dX = 0;
      let dY = 0;
      if (e.keyCode == 39) {
        dX = 1;
      } // 右键
      else if (e.keyCode == 37) {
        dX = -1;
      } // 左键
      else if (e.keyCode == 38) {
        dY = -1;
      } // 上键
      else if (e.keyCode == 40) {
        dY = 1;
      } // 下键

      document.querySelectorAll('.resable-item.selected').forEach((item) => {
        let key = item.attributes['data-key'].value;
        let field = fields.find((item) => {
          return item.key == key;
        });
        if (!field) return;

        field.options.x += dX;
        field.options.y += dY;
      });
    };
  },
};

export { selectable };
