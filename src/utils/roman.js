const cheerio = require("cheerio")

module.exports = (markdown) => {
    const md = require("markdown-it")()
    const html = md.render(markdown)
    const $ = cheerio.load(html)
    const headers = $("h1")
    let sectionCount = 1
    const romanNumerals = [
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
        "X",
    ]

    headers.each((index, element) => {
        if (index > 0) {
            $(element).before(
                `<p class="section">Section ${romanNumerals[sectionCount - 1]}.</p>`,
            )
            sectionCount++
        }
    })

    return $.html()
}
