const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
    $('video').each(function() {
        // Add necessary attributes for autoplay
        $(this).attr({
            'playsinline': '',
            'preload': 'auto',
            'muted': ''  // muted is required for autoplay in most browsers
        });

        // Add a unique ID if not present
        if (!$(this).attr('id')) {
            $(this).attr('id', 'video-' + Math.random().toString(36).substr(2, 9));
        }

        // Add intersection observer script after the video
        const videoId = $(this).attr('id');
        const script = `
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const video = document.getElementById('${videoId}');
                    if (!video) return;

                    let playTimeout;
                    const observer = new IntersectionObserver(
                        (entries) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    // Clear any existing timeout
                                    if (playTimeout) {
                                        clearTimeout(playTimeout);
                                    }
                                    // Set new timeout for x seconds
                                    playTimeout = setTimeout(() => {
                                        video.play().catch(e => console.log("Autoplay prevented"));
                                    }, 2000); // milliseconds delay
                                } else {
                                    // Clear timeout if video becomes hidden
                                    if (playTimeout) {
                                        clearTimeout(playTimeout);
                                    }
                                    video.pause();
                                }
                            });
                        },
                        { threshold: 0.5 }  // trigger when 50% of the video is visible
                    );

                    observer.observe(video);
                });
            </script>
        `;
        $(this).after(script);
    });
});
