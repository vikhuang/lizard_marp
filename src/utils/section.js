const cheerio = require("cheerio")

module.exports = (instance) => {
    let sectionCount = 0

    // 自訂 markdown-it 插件以捕捉 <h1> 標籤的內容
    instance.use((md) => {
        md.core.ruler.push("capture_h1", (state) => {
            for (const token of state.tokens) {
                if (token.type === "heading_open" && token.tag === "h1") {
                    sectionCount++
                }
            }
        })
    })

    // 覆寫 render 方法，在每個 section 中設置 class
    const originalRender = instance.render.bind(instance)
    instance.render = function (markdown, options = {}) {
        const result = originalRender(markdown, options)
        const $ = cheerio.load(result.html)

        $("section").each(function (index) {
            // 從第二個 section 開始作用
            if (index > 0) {
                const h1 = $(this).find("h1")
                if (h1.length > 0) {
                    $(this).addClass("section")
                }
            }
        })

        result.html = $.html()
        return result
    }
}
