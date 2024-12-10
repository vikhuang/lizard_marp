const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
	const titleContent = $("title").text();
	const firstH1Content = $("h1").first().text() || "Default Title";

	$("h1").each(function (index) {
		const ol = $("<ol class='agenda'></ol>");

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

		const footer = $(
			`<footer class="title_as_footer">${firstH1Content}</footer>`,
		);

		// 確保 <header> 放在 <ol> 後
		if (index > 0) {
			ol.after(footer);
		}
	});
});
