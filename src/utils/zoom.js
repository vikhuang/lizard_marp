// zoom.js
const addZoomFeature = (instance) => {
    const zoomCSS = `
    .zoomable {
      position: relative;
      overflow: hidden;
      transition: transform 0.3s ease, transform-origin 0.3s ease;
      cursor: pointer;
    }
    .zoomed-in {
      transform: scale(2); /* 放大比例，可以根據需要調整 */
    }
  `

    const zoomJS = `
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('section').forEach(section => {
        section.classList.add('zoomable');
        section.addEventListener('click', (event) => {
          if (event.altKey || event.metaKey) { // Alt 或 Option 鍵
            const isZoomedIn = section.classList.toggle('zoomed-in');
            if (isZoomedIn) {
              const rect = section.getBoundingClientRect();
              const offsetX = event.clientX - rect.left;
              const offsetY = event.clientY - rect.top;
              section.style.transformOrigin = \`\${offsetX}px \${offsetY}px\`;
            } else {
              section.style.transformOrigin = 'center center';
            }
          }
        });
      });
    });
  `

    instance.on("markdown-it:config", (md) => {
        md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
            const content = tokens[idx].content
            if (content.includes("<style>")) {
                return `<style>${zoomCSS}</style>`
            } else if (content.includes("<script>")) {
                return `<script>${zoomJS}</script>`
            }
            return content
        }
    })
}

module.exports = addZoomFeature
