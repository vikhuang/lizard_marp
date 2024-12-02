const cheerio = require("cheerio");

module.exports = (instance) => {
	const originalRender = instance.render.bind(instance);
	instance.render = function (markdown, options = {}) {
		const result = originalRender(markdown, options);
		const $ = cheerio.load(result.html);

		$('section[class*="layout_"]').each(function () {
			const classes = $(this).attr("class").split(" ");
			const layoutClass = classes.find((c) => c.startsWith("layout_"));
			const example = layoutClass.replace("layout_", "");

			// Store headers
			const headers = [];
			$(this)
				.children("h1, h2, h3")
				.each(function () {
					headers.push($(this).clone());
					$(this).remove();
				});

			// Wrap remaining content
			$(this).wrapInner(`<div class="${example}"></div>`);

			// Prepend the headers back
			headers.reverse().forEach((header) => {
				$(this).prepend(header);
			});
		});

		result.html = $.html();
		return result;
	};
};
