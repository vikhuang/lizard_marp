const cheerio = require("cheerio");

module.exports = (instance) => {
  const originalRender = instance.render.bind(instance);

  instance.render = function (markdown, options = {}) {
    try {
      const result = originalRender(markdown, options);
      const $ = cheerio.load(result.html);
      let currentH2Text = "";
      let isFirstH3AfterH2 = false;

      // 處理所有的 h2 和 h3
      $("h2, h3").each((i, elem) => {
        const $elem = $(elem);
        const tagName = elem.tagName.toLowerCase();
        const elemText = $elem.text().trim();

        if (tagName === "h2") {
          // 儲存當前 h2 文字供後續使用
          currentH2Text = elemText;
          // 重設 isFirstH3AfterH2 旗標
          isFirstH3AfterH2 = true;
        }
        else if (tagName === "h3") {
          // 如果有對應的 h2，添加 h2text div
          if (currentH2Text) {
            const $h2textDiv = $("<div>")
              .addClass("h2text")
              .text(currentH2Text);

            // 如果是 h2 後的第一個 h3，添加 afterh2 class
            if (isFirstH3AfterH2) {
              $h2textDiv.addClass("firsth3afterh2");
              isFirstH3AfterH2 = false;  // 重設旗標
            }

            $elem.before($h2textDiv);
          }
        }
      });

      return {
        ...result,
        html: $.html(),
      };
    } catch (error) {
      console.error("Marp heading plugin error:", error);
      return result;
    }
  };
};
