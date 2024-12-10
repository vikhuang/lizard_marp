const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
    $('section[class*="layout_"]').each(function () {
        const classes = $(this).attr("class").split(" ");
        const layoutClass = classes.find((c) => c.startsWith("layout_"));
        const example = layoutClass.replace("layout_", "");

        // Store headers
        const headers = [];
        $(this)
            .children("h1, h2, h3")
            .each(function () {
                headers.push($(this).clone());
                $(this).remove();
            });

        // Wrap remaining content
        $(this).wrapInner(`<div class="${example}"></div>`);

        // Prepend the headers back
        headers.reverse().forEach((header) => {
            $(this).prepend(header);
        });
    });
});
