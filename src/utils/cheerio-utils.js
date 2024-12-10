const cheerio = require("cheerio");

class CheerioWrapper {
    constructor() {
        this.cheerio = cheerio;
    }

    // 載入 HTML
    load(html) {
        return cheerio.load(html);
    }

    // 建立基本的 Marp 插件
    createPlugin(renderLogic) {
        return (instance) => {
            const originalRender = instance.render.bind(instance);
            instance.render = function(markdown, options = {}) {
                const result = originalRender(markdown, options);
                const $ = cheerio.load(result.html);
                
                // 執行傳入的渲染邏輯
                renderLogic($, result, markdown, options);
                
                result.html = $.html();
                return result;
            };
        };
    }

    // 建立複合插件（支持 markdown-it 和 cheerio）
    createComplexPlugin(mdPlugin, renderLogic) {
        return (instance) => {
            // 先應用 markdown-it 插件
            if (mdPlugin) {
                instance.use(mdPlugin);
            }

            // 再應用 cheerio 渲染邏輯
            const originalRender = instance.render.bind(instance);
            instance.render = function(markdown, options = {}) {
                const result = originalRender(markdown, options);
                const $ = cheerio.load(result.html);
                
                // 執行傳入的渲染邏輯
                renderLogic($, result, markdown, options);
                
                result.html = $.html();
                return result;
            };
        };
    }
}

// 導出單例
module.exports = new CheerioWrapper();
