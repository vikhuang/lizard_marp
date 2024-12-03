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

			// 用於儲存當前找到的 h2 標題文字
			let currentH2Text = "";

			// 選擇所有的 h2 和 h3 元素，並依序處理
			$("h2, h3").each((i, elem) => {
				// 獲取當前元素的標籤名稱（小寫）
				const tagName = elem.tagName.toLowerCase();

				// 如果是 h2 標題，更新當前的 h2 文字
				if (tagName === "h2") {
					currentH2Text = $(elem).text().trim();
				}
				// 如果是 h3 標題且有對應的 h2 文字，在 h3 前插入 h2 文字
				else if (tagName === "h3" && currentH2Text) {
					$(elem).before(
						// 創建新的 div 元素
						$("<div>")
							// 添加 h2text class
							.addClass("h2text")
							// 設置 div 的文字內容為當前的 h2 文字
							.text(currentH2Text),
					);
				}
			});

			// 返回處理後的結果
			return {
				...result, // 保留原始結果的其他屬性
				html: $.html(), // 更新處理後的 HTML
			};
		} catch (error) {
			// 如果處理過程中發生錯誤，記錄錯誤並返回原始結果
			console.error("Marp heading plugin error:", error);
			return result;
		}
	};
};
