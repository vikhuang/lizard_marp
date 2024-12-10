const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
    // 獲取今天的日期和時間，指定時區為台灣時區
    const now = new Date();
    const today = now.toLocaleDateString("en-CA", {
        timeZone: "Asia/Taipei",
    }); // 格式為 YYYY-MM-DD
    const time = now.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Taipei",
        hour: "2-digit",
        minute: "2-digit",
    }); // 格式為 HH:MM

    $("section#1").prepend(`<h4 class="datetime">${today}</h4>`);
    // $("section#1").prepend(`<h4>科會</h4>`);
    // ${time}
});
