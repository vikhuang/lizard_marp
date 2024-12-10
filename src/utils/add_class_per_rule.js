const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
	$("section").each(function (index) {
		const section = $(this); // 儲存當前 section
		if (index === 0) {
			section.addClass("firstH1Page"); // 第一個 section
		} else {
			const h1 = section.find("h1"); // 查找 h1
			if (h1.length > 0) {
				section.addClass("blue"); // 含 h1 的 section
			}
		}
	});
});
