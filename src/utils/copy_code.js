const cheerio = require("cheerio")

module.exports = (instance) => {
    const originalRender = instance.render.bind(instance)

    instance.render = function (markdown, options = {}) {
        const result = originalRender(markdown, options)
        const $ = cheerio.load(result.html)

        // 為所有 <code> 元素添加 onclick 事件以複製內容
        $("code, p, strong").each(function () {
            $(this).attr(
                "onclick",
                "navigator.clipboard.writeText(this.innerText);",
            )
            $(this).css("cursor", "pointer") // 手型游標，提示可點擊
        })

        result.html = $.html()
        return result
    }

    return instance
}
