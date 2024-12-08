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
                // Regular wiki link - create link to .md file
                const href = pageName
                    .toLowerCase()
                    .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
                    .replace(/[^\w\s-]/g, '') // Remove special characters
                    .replace(/\s+/g, '-') // Replace spaces with hyphens
                    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
                    + '.md'; // Add .md extension
                
                result += `<a href="/${href}" class="wikilink">${displayText}</a>`;
            }
            
            lastIndex = wikiPattern.lastIndex;
        }
        
        // Add remaining text
        result += content.slice(lastIndex);
        
        return result || defaultRender(tokens, idx, options, env, self);
    };
}

module.exports = customWikiLinks;
