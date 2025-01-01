const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
    $('img').each(function(index) {
        const alt = $(this).attr('alt') || '';
        if (alt.includes('x:') && alt.includes('y:')) {
            const coordPattern = /x:(\d+)\s+y:(\d+)/;
            const match = alt.match(coordPattern);

            if (match) {
                const x = match[1];
                const y = match[2];
                
                try {
                    // Create wrapper div with absolute positioning
                    const wrapper = $('<div></div>').css({
                        'position': 'absolute',
                        'top': `${y}%`,
                        'left': `${x}%`,
                        'transform': 'translate(-50%, -50%)'
                    });
                    
                    // Add classes
                    wrapper.addClass('abs-wrapper');
                    $(this).addClass('abs');
                    
                    // Wrap the image
                    $(this).wrap(wrapper);
                    
                    // Clean alt text
                    const cleanAlt = alt.replace(coordPattern, '').trim();
                    $(this).attr('alt', cleanAlt);
                } catch (error) {
                    // Silently handle errors
                }
            }
        }
    });
    
    // Save changes back to result
    try {
        result.html = $.html();
    } catch (error) {
        // Silently handle errors
    }
});
