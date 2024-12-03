// 引入 cheerio 庫用於解析和操作 HTML
const cheerio = require("cheerio");

// 導出一個函數，接受 Marp 實例作為參數
module.exports = (instance) => {
	// 保存原始的 render 方法的引用，並綁定正確的 this 上下文
	const originalRender = instance.render.bind(instance);

	// 覆寫原始的 render 方法
	instance.render = function (markdown, options = {}) {
		try {
			// 先調用原始的 render 方法處理 markdown
			const result = originalRender(markdown, options);

			// 使用 cheerio 載入生成的 HTML
			const $ = cheerio.load(result.html);

			// 用於儲存標題資訊
			let currentH2 = null;
			let currentH3 = null;

			// 獲取所有標題元素
			const headings = $("h2, h3").toArray();

			// 遍歷所有標題
			headings.forEach((elem, index) => {
				const tagName = elem.tagName.toLowerCase();
				const $elem = $(elem);

				if (tagName === "h2") {
					currentH2 = {
						element: $elem,
						text: $elem.text().trim(),
					};

					// 查看下一個標題
					if (index + 1 < headings.length) {
						const nextHeading = headings[index + 1];
						if (nextHeading.tagName.toLowerCase() === "h3") {
							// 如果下一個標題是 h3，添加 followh3 class
							$elem.addClass("nexth3");
						}
					}
				} else if (tagName === "h3") {
					currentH3 = {
						element: $elem,
						text: $elem.text().trim(),
					};
				}
			});

			// 返回處理後的結果
			return {
				...result,
				html: $.html(),
			};
		} catch (error) {
			// 如果處理過程中發生錯誤，記錄錯誤並返回原始結果
			console.error("Marp heading plugin error:", error);
			return result;
		}
	};
};
