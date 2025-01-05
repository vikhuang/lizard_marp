const markdownItContainer = require("markdown-it-container");

function createContainer(name) {
	return [
		markdownItContainer,
		name,
		{
			render: function (tokens, idx) {
				if (tokens[idx].nesting === 1) {
					return `<div class="${name}">\n`;
				} else {
					return "</div>\n";
				}
			},
		},
	];
}

// Generic container handler for any single word name
function createGenericContainer() {
    return [
        markdownItContainer,
        '',
        {
            validate: function(params) {
                // Check if it's a single word (no spaces) and not a special container
                const name = params.trim();
                return name && !name.includes(' ') && !specialContainers[name];
            },
            render: function(tokens, idx) {
                const name = tokens[idx].info.trim();
                if (tokens[idx].nesting === 1) {
                    return `<div class="${name}">\n`;
                } else {
                    return '</div>\n';
                }
            }
        }
    ];
}

const specialContainers = {
	half: {
		render: function (tokens, idx) {
			if (tokens[idx].nesting === 1) {
				return '<div class="half"><div>\n';
			} else {
				return "</div></div>\n";
			}
		},
	},
	free: {
		render: function (tokens, idx) {
			if (tokens[idx].nesting === 1) {
				return '<div class="free"><div>\n';
			} else {
				return "</div></div>\n";
			}
		},
	},
	even: {
		render: function (tokens, idx) {
			if (tokens[idx].nesting === 1) {
				return '<div class="even"><div>\n';
			} else {
				return "</div></div>\n";
			}
		},
	},
	third: {
		render: function (tokens, idx) {
			if (tokens[idx].nesting === 1) {
				return '<div class="third"><div>\n';
			} else {
				return "</div></div>\n";
			}
		},
	},
	twoone: {
		render: function (tokens, idx) {
			if (tokens[idx].nesting === 1) {
				return '<div class="twoone"><div>\n';
			} else {
				return "</div></div>\n";
			}
		},
	},

	frag: {
		render: function (tokens, idx) {
			if (tokens[idx].nesting === 1) {
				return '<div data-marpit-fragment="1">\n';
			} else {
				return "</div>\n";
			}
		},
	},
	onetwo: {
		render: function (tokens, idx) {
			if (tokens[idx].nesting === 1) {
				return '<div class="onetwo"><div>\n';
			} else {
				return "</div></div>\n";
			}
		},
	},
	split: {
		render: function (tokens, idx) {
			if (tokens[idx].nesting === 1) {
				return "</div><div>\n";
			} else {
				return "</div></div>\n";
			}
		},
	},
	github: {
		render: function (tokens, idx) {
			if (tokens[idx].nesting === 1) {
				const params = tokens[idx].info.trim().split(' ');
				
				// Parse line range and height
				function parseParams(params) {
					const result = {
						startLine: 1,
						endLine: 1,
						height: 550 // default height
					};

					// Get the line range
					const lineRange = params[1].split('-');
					if (lineRange.length === 2) {
						result.startLine = parseInt(lineRange[0], 10);
						result.endLine = parseInt(lineRange[1], 10);
					} else {
						return { error: 'Invalid line range format. Use: startLine-endLine' };
					}

					// Check for height parameter
					if (params[2] && params[2].startsWith('h:')) {
						const height = parseInt(params[2].substring(2), 10);
						if (!isNaN(height) && height > 0) {
							result.height = height;
						}
					}

					// Validate line numbers
					if (isNaN(result.startLine) || isNaN(result.endLine)) {
						return { error: 'Line numbers must be integers' };
					}

					if (result.startLine < 1) {
						return { error: 'Start line must be greater than 0' };
					}

					if (result.endLine < result.startLine) {
						return { error: 'End line must be greater than or equal to start line' };
					}

					if (result.endLine - result.startLine > 500) {
						return { error: 'Cannot display more than 500 lines at once' };
					}

					return result;
				}

				// Find the text token containing the URL
				let contentToken = null;
				for (let i = idx + 1; i < tokens.length; i++) {
					if (tokens[i].type === 'inline') {
						contentToken = tokens[i];
						break;
					}
				}

				if (!contentToken) {
					return `<div class="github error">No content provided</div>\n`;
				}

				let repoPath = contentToken.content
					.replace(/^\s+|\s+$/g, '') // Remove leading/trailing whitespace including newlines
					.replace(/\n/g, ''); // Remove any newlines in the middle

				const githubUrl = processGitHubUrl(repoPath);
				if (!githubUrl) {
					return `<div class="github error">Invalid GitHub URL format</div>\n`;
				}

				const encodedUrl = encodeURIComponent(githubUrl);
				const parsedParams = parseParams(params);
				
				if (parsedParams.error) {
					return `<div class="github error">${parsedParams.error}</div>\n`;
				}
				
				return `<div class="github" style="position: relative;"><style>.github > p { display: none; }</style>
					<br>
					<iframe 
						frameborder="0"
						scrolling="yes" 
						style="width:100%; height:${parsedParams.height}px;" 
						allow="clipboard-write" 
						src="https://htlin-emgithub.netlify.app/iframe.html?target=${encodedUrl}%23L${parsedParams.startLine}-L${parsedParams.endLine}&style=github&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on">
					</iframe>\n`;
			} else {
				return "</div>\n";
			}
		},
	},
	webcam: {
		render: function (tokens, idx) {
			if (tokens[idx].nesting === 1) {
				return `
            <div class="webcam-container">
                <video autoplay="true" class="webcam-video"></video>
                <script>
                    document.querySelectorAll(".webcam-container").forEach(function(container) {
                        var video = container.querySelector(".webcam-video");

                        // 動態調整 video 大小以配合 container
                        function resizeVideo() {
                            video.width = container.clientWidth;
                            video.height = container.clientHeight;
                        }

                        // 初始化並在視窗調整時更新 video 大小
                        window.addEventListener("resize", resizeVideo);
                        resizeVideo();

                        // 啟動 webcam 串流
                        if (navigator.mediaDevices.getUserMedia) {
                            navigator.mediaDevices.getUserMedia({ video: true })
                                .then(function (stream) {
                                    video.srcObject = stream;
                                })
                                .catch(function (error) {
                                    console.log("Something went wrong!", error);
                                });
                        }
                    });
                </script>
            </div>\n`;
			} else {
				return "</div>\n";
			}
		},
	},
};

// Function to validate and transform GitHub URLs
function processGitHubUrl(url) {
	// Remove any leading/trailing whitespace and newlines
	url = url.trim();

	// Handle full URLs
	if (url.startsWith('http')) {
		// Handle raw.githubusercontent.com URLs
		if (url.includes('raw.githubusercontent.com')) {
			url = url.replace('raw.githubusercontent.com', 'github.com')
				.replace('refs/heads/', 'blob/');
		}
		return url;
	}

	// Handle repository path format
	const pathParts = url.split('/');
	
	// Basic validation that the path looks like a GitHub repo path
	if (pathParts.length < 4) {
		return null;
	}
	
	if (!['blob', 'tree'].includes(pathParts[2])) {
		return null;
	}

	const githubUrl = `https://github.com/${url}`;
	return githubUrl;
}

module.exports = {
    createContainer,
    createGenericContainer,
    specialContainers
};
