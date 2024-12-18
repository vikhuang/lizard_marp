const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
	// 遍歷所有的 <tr>
	$("tr").each(function () {
		const $this = $(this); // 獲取當前 <tr> 的上下文
		// 檢查是否有 <strong> 子節點或孫節點
		if ($this.find("strong").length > 0) {
			// 添加 class="emphasize"
			$this.addClass("emphasize");
		}
	});
});
