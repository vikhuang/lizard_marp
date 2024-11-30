const cheerio = require("cheerio")

module.exports = (instance) => {
    // 覆寫 render 方法，在 id="1" 的 section 中插入日期和時間
    const originalRender = instance.render.bind(instance)
    instance.render = function (markdown, options = {}) {
        const result = originalRender(markdown, options)
        const $ = cheerio.load(result.html)

        // 獲取今天的日期和時間，指定時區為台灣時區
        $("section#1").prepend(
            `<img src="https://i.imgur.com/Shai2kG.png" alt="Ⓒ" class="cc">`,
        )
        // ${time}
        result.html = $.html()
        return result
    }
}
