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
const markdownItSub = require("markdown-it-sub");
const markdownItSup = require("markdown-it-sup");
const markdownItTOC = require("markdown-it-table-of-contents");
const markdownItContainer = require("markdown-it-container");
const markdownItHashtag = require("markdown-it-hashtag");
const markdownItVideo = require("markdown-it-video");
const markdownItRuby = require("markdown-it-ruby");
const markdownItFontawesome = require("@kazumatu981/markdown-it-fontawesome");
const taskLists = require("markdown-it-task-lists");
const { alertPlugin } = require("markdown-it-github-alert");
const {
	createContainer,
	containerNames,
	specialContainers,
} = require("./containers");
// const mdBiblatex = require("@arothuis/markdown-it-biblatex")

// 插件設定
const markdownItAttrsOptions = {
	leftDelimiter: "{",
	rightDelimiter: "}",
	allowedAttributes: [],
};

const markdownItKrokiOptions = {
	entrypoint: "https://kroki.io",
};

const markdownItVideoOptions = {
	youtube: { width: 960, height: 540 },
};

const markdownItIncludeOptions = {
	root: "/Users/htlin/Dropbox/slides/",
	includeRe: /\{\{(.+?)\}\}/im,
	// processIncludePath: (path) => `${path}.md`,
	bracesAreOptional: true,
};

const markdownItTOCOptions = {};

module.exports = (instance) => {
	instance
		.use(alertPlugin)
		.use(markdownItAdmon)
		.use(markdownItPlantuml)
		.use(markdownItFontawesome)
		.use(markdownItAnchor)
		.use(markdownItAttrs, markdownItAttrsOptions)
		.use(markdownItCollapsible)
		.use(markdownItIns)
		.use(markdownItHashtag)
		.use(markdownItKroki, markdownItKrokiOptions)
		.use(markdownItMark)
		.use(markdownItSub)
		.use(markdownItLabel)
		.use(markdownItRuby)
		.use(markdownItSup)
		.use(markdownItTOC, markdownItTOCOptions)
		.use(markdownItInclude, markdownItIncludeOptions)
		.use(markdownItVideo, markdownItVideoOptions)
		.use(taskLists)
		.use(tableMergeCells);

	containerNames.forEach((name) => {
		instance.use(...createContainer(name));
	});
	// 加入特別容器
	Object.keys(specialContainers).forEach((name) => {
		instance.use(markdownItContainer, name, specialContainers[name]);
	});

	return instance;
};
