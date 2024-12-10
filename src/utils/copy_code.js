const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
    // 為所有 <code> 元素添加 onclick 事件以複製內容
    $("code, p, strong").each(function () {
        $(this).attr(
            "onclick",
            "navigator.clipboard.writeText(this.innerText);"
        );
        $(this).css("cursor", "pointer"); // 手型游標，提示可點擊
    });
});
