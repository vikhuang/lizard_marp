const cheerio = require("cheerio");

// 建立一個共用的 cheerio 實例
class CheerioWrapper {
    constructor() {
        this.cheerio = cheerio;
    }

    // 載入 HTML
    load(html) {
        return cheerio.load(html);
    }

    // 建立 Marp 插件
    createPlugin(renderLogic) {
        return (instance) => {
            const originalRender = instance.render.bind(instance);
            instance.render = function(markdown, options = {}) {
                const result = originalRender(markdown, options);
                const $ = cheerio.load(result.html);
                
                // 執行傳入的渲染邏輯
                renderLogic($, result);
                
                result.html = $.html();
                return result;
            };
        };
    }
}

// 導出單例
module.exports = new CheerioWrapper();
