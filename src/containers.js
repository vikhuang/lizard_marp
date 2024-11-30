const markdownItContainer = require("markdown-it-container")

function createContainer(name) {
    return [
        markdownItContainer,
        name,
        {
            render: function (tokens, idx) {
                if (tokens[idx].nesting === 1) {
                    return `<div class="${name}">\n`
                } else {
                    return "</div>\n"
                }
            },
        },
    ]
}

const containerNames = [
    "bigtable",
    "tetra",
    "tri",
    "boxlist",
    "top",
    "center",
    "columns",
    "split",
    "map",
    "material",
    "markmap",
    "high",
    "scroll",
    "outline",
    "date",
    "typewriter",
    "webcam",
]

const specialContainers = {
    half: {
        render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
                return '<div class="half"><div>\n'
            } else {
                return "</div></div>\n"
            }
        },
    },
    free: {
        render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
                return '<div class="free"><div>\n'
            } else {
                return "</div></div>\n"
            }
        },
    },
    even: {
        render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
                return '<div class="even"><div>\n'
            } else {
                return "</div></div>\n"
            }
        },
    },
    third: {
        render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
                return '<div class="third"><div>\n'
            } else {
                return "</div></div>\n"
            }
        },
    },
    twoone: {
        render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
                return '<div class="twoone"><div>\n'
            } else {
                return "</div></div>\n"
            }
        },
    },
    onetwo: {
        render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
                return '<div class="onetwo"><div>\n'
            } else {
                return "</div></div>\n"
            }
        },
    },
    split: {
        render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
                return "</div><div>\n"
            } else {
                return "</div></div>\n"
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
            </div>\n`
            } else {
                return "</div>\n"
            }
        },
    },
}

module.exports = {
    createContainer,
    containerNames,
    specialContainers,
}
