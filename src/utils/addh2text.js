const cheerio = require("cheerio");

module.exports = (instance) => {
	const originalRender = instance.render.bind(instance);
	instance.render = function (markdown, options = {}) {
		const result = originalRender(markdown, options);
		const $ = cheerio.load(result.html, {
			xmlMode: true, // 啟用 XML 模式以正確處理 SVG
		});

		// 在每個 section 內尋找 h3
		$("section").each(function () {
			const $section = $(this);
			let currentH2Text = "";

			// 先找到這個 section 之前最近的 h2
			let $prevSection = $section
				.closest("foreignObject")
				.parent()
				.prev()
				.find("foreignObject section");
			while ($prevSection.length) {
				const $h2 = $prevSection.find("h2");
				if ($h2.length) {
					currentH2Text = $h2.text();
					break;
				}
				$prevSection = $prevSection
					.closest("foreignObject")
					.parent()
					.prev()
					.find("foreignObject section");
			}

			// 處理當前 section 中的所有 h3
			$section.find("h3").each(function () {
				const $h3 = $(this);
				if (currentH2Text && !$h3.prev(".h2text").length) {
					$h3.before(
						`<div class="h2text">${currentH2Text}</div><div class="bread">\></div>`,
					);
				}
			});
		});

		result.html = $.html();
		return result;
	};
};
