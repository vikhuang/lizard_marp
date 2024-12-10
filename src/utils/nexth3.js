const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
    try {
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
    } catch (error) {
        console.error("Marp heading plugin error:", error);
    }
});
