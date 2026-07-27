/* eslint-disable */
export const fieldComponents = [
	//  {
	//    type: 'input',
	//    label: '商品ID',
	//    icon: 'el-icon-yrt-danhangshurukuang',
	//    options: {
	//      prop: 'Product_Id',
	//      width: '100%',
	//      showTitle: true,
	//      defaultValue: '',
	//      required: false,
	//      dataType: 'string',
	//      pattern: '',
	//      placeholder: ''
	//    }
	//  },
];

export const basicComponents = [
	{
		type: "field",
		label: {
			title: "字段绑定",
			showColon: true,
			styles: {
				width: "100px",
				"font-size": "14px",
				"text-align": "right",
				"line-height": "30px",
			},
		},
		icon: "el-icon-yrt--daima",
		text: {
			prop: "productName",
			styles: {
				width: "170px",
				"font-size": "14px",
				"text-align": "left",
				"line-height": "30px",
			},
			dataType: "string",
		},
		options: {
			x: 283,
			y: 62,
			z: 0,
			w: 280,
			h: 30,
			minw: 30,
			minh: 30,
			parent: true,
			snap: false,
			snapTolerance: 20,
		},
		styles: {
			"font-size": "14px",
			"font-weight": "normal",
			"font-style": "normal",
			"white-space": "nowrap",
			"text-decoration": "none",
		},
	},
	{
		type: "input",
		label: {
			title: "文本内容",
			showColon: true,
			styles: {
				width: "100%",
				"text-align": "left",
				"line-height": "30px",
			},
		},
		icon: "el-icon-yrt-danhangshurukuang",
		options: {
			x: 50,
			y: 5,
			z: 0,
			w: 280,
			h: 30,
			minw: 5,
			minh: 1,
			parent: true,
			snap: false,
			snapTolerance: 20,
		},
		styles: {
			"font-size": "16px",
			"font-weight": "normal",
			"font-style": "normal",
			"white-space": "nowrap",
			"text-decoration": "none",
		},
	},
	{
		type: "table",
		label: {
			title: "表格",
		},
		showHeader: true,
		tableView: null,
		width: "100%",
		pageSize: 10,
		icon: "el-icon-yrt-liebiao2",
		options: {
			x: 50,
			y: 5,
			z: 0,
			w: 560,
			h: 160,
			minw: 30,
			minh: 1,
			parent: true,
			snap: false,
			snapTolerance: 20,
		},
		fields: [
			{
				type: "detail-field",
				prop: "a",
				width: 150,
				label: "字段1",
				header: {
					fontSize: 4,
					textAlign: "center",
				},
				body: {
					fontSize: 4,
					textAlign: "left",
				},
			},
			{
				type: "detail-field",
				prop: "b",
				width: 140,
				label: "字段2",
				header: {
					fontSize: 4,
					textAlign: "center",
				},
				body: {
					fontSize: 4,
					textAlign: "left",
				},
			},
			{
				type: "detail-field",
				prop: "c",
				width: 140,
				label: "字段3",
				header: {
					fontSize: 4,
					textAlign: "center",
				},
				body: {
					fontSize: 4,
					textAlign: "left",
				},
			},
		],
		footFields: [],
		fontSize: 16,
	},
	{
		type: "line-horizontal",
		label: {
			title: "水平线",
		},
		icon: "el-icon-yrt-jianshao",
		options: {
			x: 50,
			y: 5,
			z: 0,
			w: 280,
			h: 1,
			minw: 30,
			minh: 1,
			parent: true,
			snap: false,
			snapTolerance: 20,
		},
		styles: {
			"border-bottom": "1px solid #000",
			height: "1px",
			width: "100%",
		},
	},
	{
		type: "line-vertical",
		label: {
			title: "竖线",
		},
		icon: "el-icon-yrt-vertical_line",
		options: {
			x: 50,
			y: 5,
			z: 0,
			w: 1,
			h: 280,
			minw: 1,
			minh: 30,
			parent: true,
			snap: false,
			snapTolerance: 20,
		},
		styles: {
			"border-right": "1px solid #000",
			width: "1px",
			height: "100%",
		},
	},
	{
		type: "barcode",
		icon: "el-icon-yrt-scan-copy",
		label: {
			title: "一维条码",
		},
		barcode: {
			value: "barcode",
			options: {
				format: "CODE128",
				width: 1, // 单数字条码宽度
				height: 60,
				displayValue: true,
				text: "",
				fontOptions: "",
				font: "monospace",
				textAlign: "center",
				textPosition: "bottom",
				textMargin: 2,
				fontSize: 14,
				background: "#ffffff",
				lineColor: "#000000",
				marginTop: null,
				marginBottom: null,
				marginLeft: null,
				marginRight: null,
				flat: null,
			},
		},
		options: {
			x: 50,
			y: 5,
			z: 0,
			w: 280,
			h: 120,
			minw: 1,
			minh: 30,
			parent: true,
			snap: false,
			snapTolerance: 20,
		},
		styles: {
			width: "100%",
			height: "100%",
		},
	},
	{
		type: "qrcode",
		icon: "el-icon-yrt-qrcode-2",
		label: {
			title: "二维条码",
		},
		qrOptions: {
			value: "qrcode",
			width: 150, // 条码宽度
			color: {
				dark: "#000", // Blue dots
				light: "#fff", // Transparent background
			},
			margin: 1,
		},
		options: {
			x: 50,
			y: 5,
			z: 0,
			w: 200,
			h: 200,
			minw: 1,
			minh: 30,
			parent: true,
			snap: false,
			snapTolerance: 20,
		},
		styles: {
			width: "100%",
			height: "100%",
		},
	},
	{
		type: "image",
		icon: "el-icon-yrt-tupian",
		label: {
			title: "图片",
		},
		image: {
			width: 180,
			height: 60,
			imageUrl: "",
			serverAction: "/api/sys/common/uploadSingleFile",
		},
		options: {
			x: 50,
			y: 5,
			z: 0,
			w: 280,
			h: 80,
			minw: 1,
			minh: 30,
			parent: true,
			snap: false,
			snapTolerance: 20,
		},
		styles: {
			width: "100%",
			height: "100%",
		},
	},
	{
		type: "pagination",
		label: {
			title: "分页码",
		},
		icon: "el-icon-yrt-bianhaozhuanyi",
		layout: "1/5",
		options: {
			x: 50,
			y: 5,
			z: 0,
			w: 80,
			h: 30,
			minw: 30,
			minh: 1,
			parent: true,
			snap: false,
			snapTolerance: 20,
		},
		styles: {
			width: "100%",
			height: "100%",
			"text-align": "center",
			"font-weight": "normal",
			"font-size": "14px",
			"line-height": "26px",
		},
	},
	{
		type: "container",
		label: {
			title: "容器",
		},
		icon: "el-icon-yrt-liebiao1",
		fields: [],
		options: {
			x: 50,
			y: 5,
			z: 0,
			w: 480,
			h: 280,
			minw: 30,
			minh: 1,
			parent: true,
			snap: false,
			snapTolerance: 20,
		},
		styles: {
			width: "100%",
			height: "100%",
		},
	},
	{
		type: "grid",
		label: {
			title: "栅格布局",
		},
		icon: "el-icon-yrt-saomiaoerweima",
		columns: [
			{
				span: 12,
				fields: [],
			},
			{
				span: 12,
				fields: [],
			},
		],
		options: {
			gutter: 0,
			justify: "start",
			align: "top",
		},
		colStyles: {
			"min-height": "30px",
			"line-height": "30px",
		},
	},
];
