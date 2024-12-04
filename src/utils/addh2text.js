const cheerio = require("cheerio");

// 簡單的 slug 函數實現
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-')     // 將空格替換為連字符
    .replace(/-+/g, '-')      // 移除重複的連字符
    .trim();                  // 移除前後空白
}

module.exports = (instance) => {
  const originalRender = instance.render.bind(instance);

  instance.render = function (markdown, options = {}) {
    try {
      const result = originalRender(markdown, options);
      const $ = cheerio.load(result.html);
      let currentH2Text = "";

      $("h2, h3").each((i, elem) => {
        const tagName = elem.tagName.toLowerCase();

        if (tagName === "h2") {
          currentH2Text = $(elem).text().trim();
        }
        else if (tagName === "h3" && currentH2Text) {
          const transitionName = `h2-${createSlug(currentH2Text)}`;

          $(elem).before(
            $("<div>")
              .addClass("h2text")
              .text(currentH2Text)
              .attr("style", `view-transition-name: ${transitionName}`)
          );
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
