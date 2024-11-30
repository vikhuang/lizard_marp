const cheerio = require("cheerio")

module.exports = (instance) => {
    // 覆寫 render 方法，在 id="1" 的 section 中插入日期和時間
    const originalRender = instance.render.bind(instance)
    instance.render = function (markdown, options = {}) {
        const result = originalRender(markdown, options)
        const $ = cheerio.load(result.html)

        // 獲取今天的日期和時間，指定時區為台灣時區
        const now = new Date()
        const today = now.toLocaleDateString("en-CA", {
            timeZone: "Asia/Taipei",
        }) // 格式為 YYYY-MM-DD
        const time = now.toLocaleTimeString("en-GB", {
            timeZone: "Asia/Taipei",
            hour: "2-digit",
            minute: "2-digit",
        }) // 格式為 HH:MM

        $("section#1").prepend(`<h4 class="datetime">${today}</h4>`)
        // $("section#1").prepend(`<h4>科會</h4>`)
        // ${time}
        result.html = $.html()
        return result
    }
}
