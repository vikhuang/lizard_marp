const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
    $("section#1").prepend(
        `<img src="https://i.imgur.com/Shai2kG.png" alt="Ⓒ" class="cc">`
    );
});
