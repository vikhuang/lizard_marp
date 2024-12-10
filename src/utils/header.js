const cheerioWrapper = require("./cheerio-utils");

module.exports = (instance) => {
    let currentHeader = "Preface";
    let firstSection = true;

    // 自訂 markdown-it 插件以捕捉 <h1> 標籤的內容
    instance.use((md) => {
        md.core.ruler.push("capture_h1", (state) => {
            for (const token of state.tokens) {
                if (token.type === "heading_open" && token.tag === "h1") {
                    const nextToken = state.tokens[state.tokens.indexOf(token) + 1];
                    if (nextToken && nextToken.type === "inline") {
                        currentHeader = nextToken.content;
                    }
                }
            }
        });
    });

    // 使用 cheerioWrapper 處理 HTML 渲染
    return cheerioWrapper.createPlugin(($, result, markdown, options = {}) => {
        // 解析 Markdown 文件中的注釋來設置 header
        const headerMatch = markdown.match(/<!--\s*_header:\s*(['"])(.*?)\1\s*-->/);
        if (headerMatch) {
            options.header = headerMatch[2];
        }

        let headerForSection = options.header || currentHeader; // 支援覆寫 header

        $("section").each(function (index) {
            // 跳過第一個 section
            if (firstSection) {
                firstSection = false;
                headerForSection = "Preface";
                return;
            }

            let currentSectionHeader = headerForSection;

            // 如果有 data-header 屬性，使用其值作為 header
            const dataHeader = $(this).attr("data-header");
            if (dataHeader) {
                currentSectionHeader = dataHeader;
            } else {
                // 如果 section 中有 <h1>，更新 headerForSection
                const h1 = $(this).find("h1");
                if (h1.length > 0) {
                    headerForSection = h1.first().text();
                }
            }

            // 檢查 split 屬性
            const splitAttr = $(this).attr("data-marpit-advanced-background-split");
            if (!splitAttr || (splitAttr !== "left" && splitAttr !== "right")) {
                const anchor = currentSectionHeader
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                $(this).prepend(
                    `<header><a href="#${anchor}">${currentSectionHeader}</a></header>`
                );
            }
        });
    });
};
