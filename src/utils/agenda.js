const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
	const titleContent = $("title").text();
	const firstH1Content = $("h1").first().text() || "Default Title";

	$("h1").each(function (index) {
		const ol = $("<ol class='agenda'></ol>");

		$("h1").each(function (i) {
			const title = $(this).text();
			const id = $(this).attr("id"); // 獲取 h1 的 id，如果沒有可以自己生成
			if (!id) {
				$(this).attr("id", `heading-${i}`); // 如果沒有 id，給每個 h1 加一個
			}
			const href = `#${id}`; // 生成 href 鏈接
			if (i > 0) {
				if (i < index) {
					ol.append(`<li class="before"><a href="${href}">${title}</a></li>`);
				} else if (i === index) {
					ol.append(`<li class="current"><a href="${href}">${title}</a></li>`);
				} else {
					ol.append(`<li class="after"><a href="${href}">${title}</a></li>`);
				}
			}
		});

		// 在當前的 <h1> 之後插入這個 <ol>
		if (index > 0) {
			$(this).after(ol);
		}

		const footer = $(
			`<footer class="title_as_footer">${firstH1Content}</footer>`,
		);

		// 確保 <header> 放在 <ol> 後
		if (index > 0) {
			ol.after(footer);
		}
	});
});
