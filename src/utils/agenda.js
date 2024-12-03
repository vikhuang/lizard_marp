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
			const ul = $("<ul></ul>");

			// 在 <ul> 中添加除了第一個以外的所有標題
			$("h1").each(function (i) {
				const title = $(this).text();
				if (i > 0) {
					if (i < index) {
						ul.append(`<li class="before">${title}</li>`);
					} else if (i === index) {
						ul.append(`<li class="current">${title}</li>`);
					} else {
						ul.append(`<li class="after">${title}</li>`);
					}
				}
			});

			// 在當前的 <h1> 之後插入這個 <ul>
			if (index > 0) {
				$(this).after(ul);
			}
			// 在每個 <h1> 後插入 <header class="title_as_header">

			const footer = $(
				`<footer class="title_as_footer">${firstH1Content}</footer>`,
			);

			// 確保 <header> 放在 <ul> 後
			if (index > 0) {
				ul.after(footer);
			}
		});

		result.html = $.html();
		return result;
	};
};
