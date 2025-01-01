const markdownItAdmon = require("markdown-it-admon");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItCollapsible = require("markdown-it-collapsible");
const tableMergeCells = require("markdown-it-table-merge-cells");
const markdownItIns = require("markdown-it-ins");
const markdownItLabel = require("markdown-it-label");
const markdownItInclude = require("markdown-it-include");
const markdownItKroki = require("@kazumatu981/markdown-it-kroki");
const markdownItMark = require("markdown-it-mark");
const markdownItPlantuml = require("markdown-it-plantuml");
const markdownItDeflist = require("markdown-it-deflist");
const markdownItSub = require("markdown-it-sub");
const markdownItSup = require("markdown-it-sup");
const markdownItTOC = require("markdown-it-table-of-contents");
const markdownItContainer = require("markdown-it-container");
const markdownItHashtag = require("markdown-it-hashtag");
const markdownItRuby = require("markdown-it-ruby");
const markdownItFontawesome = require("@kazumatu981/markdown-it-fontawesome");
const taskLists = require("markdown-it-task-lists");
const { alertPlugin } = require("markdown-it-github-alert");
const {
	createContainer,
	containerNames,
	specialContainers,
} = require("./containers");
const customWikiLinks = require("./utils/wikilinks");

module.exports = (instance) => {
	// Apply custom wiki links handler
	instance.use(customWikiLinks);

	// Then apply other plugins
	instance
		.use(alertPlugin)
		.use(markdownItAdmon)
		.use(markdownItPlantuml)
		.use(markdownItFontawesome)
		.use(markdownItAnchor)
		.use(markdownItAttrs, {
			leftDelimiter: "{",
			rightDelimiter: "}",
			allowedAttributes: [],
		})
		.use(markdownItCollapsible)
		.use(markdownItIns)
		.use(markdownItHashtag)
		.use(markdownItKroki, {
			entrypoint: "https://kroki.io",
		})
		.use(markdownItMark)
		.use(markdownItDeflist)
		.use(markdownItSub)
		.use(markdownItLabel)
		.use(markdownItRuby)
		.use(markdownItSup)
		.use(markdownItTOC)
		.use(markdownItInclude, {
			root: "/Users/htlin/Dropbox/slides/contents/",
			includeRe: /\{\{(.+?)\}\}/im,
			bracesAreOptional: true,
		})
		.use(taskLists)
		.use(tableMergeCells);

	containerNames.forEach((name) => {
		instance.use(...createContainer(name));
	});

	Object.keys(specialContainers).forEach((name) => {
		instance.use(markdownItContainer, name, specialContainers[name]);
	});

	return instance;
};
