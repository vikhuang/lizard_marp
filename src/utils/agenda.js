const cheerio = require("cheerio");

module.exports = (instance) => {
	const originalRender = instance.render.bind(instance);
	instance.render = function (markdown, options = {}) {
		const result = originalRender(markdown, options);
		const $ = cheerio.load(result.html);
		const titleContent = $("title").text();
		// 從 <meta property="og:title"> 中獲取 content 的值
		const firstH1Content = $("h1").first().text() || "Default Title";

		$("h1").each(function (index) {
			const ol = $("<ol></ol>");

			// 在 <ol> 中添加除了第一個以外的所有標題
			$("h1").each(function (i) {
				const title = $(this).text();
				if (i > 0) {
					if (i < index) {
						ol.append(`<li class="before">${title}</li>`);
					} else if (i === index) {
						ol.append(`<li class="current">${title}</li>`);
					} else {
						ol.append(`<li class="after">${title}</li>`);
					}
				}
			});

			// 在當前的 <h1> 之後插入這個 <ol>
			if (index > 0) {
				$(this).after(ol);
			}
			// 在每個 <h1> 後插入 <header class="title_as_header">

			const footer = $(
				`<footer class="title_as_footer">${firstH1Content}</footer>`,
			);

			// 確保 <header> 放在 <ol> 後
			if (index > 0) {
				ol.after(footer);
			}
		});

		result.html = $.html();
		return result;
	};
};
