// src/utils/csv2table.js

const cheerioWrapper = require("./cheerio-utils")

module.exports = (instance) => {
    console.log("[csv2table] Plugin init loaded. (1)") // init 階段

    // 這裡先對 instance 做簡單檢查
    if (!instance || typeof instance.use !== "function") {
        console.log("[csv2table] instance is invalid, cannot use plugin!")
        return // 直接離開
    }

    // 用 instance.use(...) 會在 Marp / Markdown-it Pipeline 中掛載
    // 但若是本專案用 "cheerioWrapper.createPlugin" 方式，則會在 "applyPlugins" 時被掛載
    // => 依作者架構而定，我們在此先回傳 cheerio plugin

    console.log("[csv2table] about to return createPlugin. (2)")

    return cheerioWrapper.createPlugin(($, result, markdown) => {
        // => 後置處理階段 (Cheerio)
        console.log("[csv2table] Executing plugin for a doc... (3)")

        if (typeof result.html !== "string") {
            console.log("[csv2table] result.html is not a string, skip. (4)")
            return
        }

        console.log(
            `[csv2table] result.html length = ${result.html.length} (5)`,
        )
        console.log(
            `[csv2table] first 100 chars => ${result.html.slice(0, 100)} (6)`,
        )

        // 找 <csv src="...">
        const csvEls = $("csv[src]")
        console.log(
            `[csv2table] Found <csv> elements count: ${csvEls.length} (7)`,
        )

        csvEls.each((i, el) => {
            const srcVal = $(el).attr("src")
            console.log(`[csv2table] #${i} => src="${srcVal}" (8)`)
            // 暫時不做 replaceWith(tableHTML)，先只是印log
        })

        // 結束
        console.log("[csv2table] Done for this doc. (9)\n")
    })
}
