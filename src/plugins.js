const markdownItAdmon = require("markdown-it-admon");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItCollapsible = require("markdown-it-collapsible");
const tableMergeCells = require("markdown-it-table-merge-cells");
const markdownItIns = require("markdown-it-ins");
const markdownItLabel = require("markdown-it-label");
const markdownItWiki = require("markdown-it-wikilinks");
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

// Custom wiki links rule
function customWikiLinks(md) {
    const defaultRender = md.renderer.rules.text || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.text = function(tokens, idx, options, env, self) {
        const token = tokens[idx];
        const content = token.content;
        
        // Match wiki link patterns
        const wikiPattern = /\[\[(.*?)\]\]/g;
        let match;
        let lastIndex = 0;
        let result = '';

        while ((match = wikiPattern.exec(content)) !== null) {
            // Add text before the match
            result += content.slice(lastIndex, match.index);
            
            // Process the wiki link
            const linkText = match[1];
            const [pageName, label] = linkText.split('|').reverse();
            const displayText = label || pageName;
            
            // Special handling for TOC
            if (pageName.toUpperCase() === 'TOC') {
                result += `<a href="#table-of-contents" class="wikilink">${displayText}</a>`;
            } else {
                // Regular wiki link
                const href = pageName.toLowerCase().replace(/\s+/g, '-');
                result += `<a href="#${href}" class="wikilink">${displayText}</a>`;
            }
            
            lastIndex = wikiPattern.lastIndex;
        }
        
        // Add remaining text
        result += content.slice(lastIndex);
        
        return result || defaultRender(tokens, idx, options, env, self);
    };
}

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
        .use(markdownItVideo, {
            youtube: { width: 960, height: 540 },
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
