module.exports = (instance) => {
    instance.use(({ marpit }) => {
        const { highlighter } = marpit
        marpit.highlighter = function (...args) {
            const original = highlighter.apply(this, args)
            const listItems = original
                .split(/\n(?!$)/)
                .map(
                    (line) =>
                        `<li><span data-marp-line-number></span><span>${line}</span></li>`,
                )
            return `<ol>${listItems.join("")}</ol>`
        }
    })
}
