import { DirectiveBinding, VNode } from "vue";
let dragmove = {
	beforeUpdate: function (el: Element, binding: DirectiveBinding, vnode: VNode) {
		// body当前宽度
		const screenWidth = document.body.clientWidth;
		// body高度
		const screenHeight = document.documentElement.clientHeight;
		// 拖拽按钮
		const dragButton = el.querySelector(binding.value.dragButton);
		dragButton.style.cssText += ";cursor:move;";
		// 拖拽窗口 dragVindow
		const dragVindow = el.querySelector(binding.value.dragVindow);
		// 如果是自定义组件 设置窗口默认居中
		if (binding.value.custom) {
			let top = binding.value.top;
			let left = binding.value.left;
			let right = binding.value.right;
			if (top === undefined) {
				top = (screenWidth - dragVindow.offsetWidth) / 2;
			}
			dragVindow.style.cssText += `;top:${top}px;`;
			if (right !== undefined) {
				dragVindow.style.cssText += `;right:${right}px;`;
			} else {
				if (left === undefined) {
					left = (screenHeight - dragVindow.offsetHeight) / 2;
				}
				dragVindow.style.cssText += `;left:${left}px;`;
			}
		}
		const sty = (function () {
			if (window.document["currentStyle"]) {
				return (dom: any, attr: any) => dom.currentStyle[attr];
			} else {
				return (dom: any, attr: any) => getComputedStyle(dom)[attr];
			}
		})();

		// 按下鼠标处理事件
		dragButton.onmousedown = (e: any) => {
			// 鼠标按下，计算当前元素距离可视区的距离
			const disX = e.clientX - dragButton.offsetLeft;
			const disY = e.clientY - dragButton.offsetTop;

			const dragDomWidth = dragVindow.offsetWidth; // 对话框宽度
			const dragDomheight = dragVindow.offsetHeight; // 对话框高度

			const minDragDomLeft = dragVindow.offsetLeft;
			const maxDragDomLeft = screenWidth - dragVindow.offsetLeft - dragDomWidth;

			const minDragDomTop = dragVindow.offsetTop;
			const maxDragDomTop = screenHeight - dragVindow.offsetTop - dragDomheight;

			let styL = sty(dragVindow, "left");
			let styT = sty(dragVindow, "top");
			if (styL.includes("%")) {
				styL = +document.body.clientWidth * (+styL.replace(/%/g, "") / 100);
				styT = +document.body.clientHeight * (+styT.replace(/%/g, "") / 100);
			} else {
				styL = +styL.replace(/px/g, "");
				styT = +styT.replace(/px/g, "");
			}
			document.onmousemove = (e) => {
				// 通过事件委托，计算移动的距离
				let left = e.clientX - disX;
				let top = e.clientY - disY;

				// 边界处理
				if (-left > minDragDomLeft) {
					left = -minDragDomLeft;
				} else if (left > maxDragDomLeft) {
					left = maxDragDomLeft;
				}

				if (-top > minDragDomTop) {
					top = -minDragDomTop;
				} else if (top > maxDragDomTop) {
					top = maxDragDomTop;
				}
				// 设置当前元素
				dragVindow.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
			};
			document.onmouseup = () => {
				document.onmousemove = null;
				document.onmouseup = null;
			};
		};
	},
};

export { dragmove };
