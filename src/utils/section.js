const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
    $("section").each(function (index) {
        // 從第二個 section 開始作用
        if (index > 0) {
            const h1 = $(this).find("h1");
            if (h1.length > 0) {
                $(this).addClass("section");
            }
        }
    });
});
