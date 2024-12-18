const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
	// Find all sections with class "diagram-TD" or "diagram-LR"
	$("section.diagram-TD, section.diagram-LR").each(function () {
		const $section = $(this);
		const $ul = $section.find("> ul");

		if (!$ul.length) {
			console.warn("No UL element found in diagram section");
			return;
		}

		// 根據類別決定方向
		const isTopDown = $section.hasClass("diagram-TD");
		const diagramClass = isTopDown ? "diagram TD" : "diagram LR";

		// Create the base diagram structure
		const $diagram = $(`<div class="${diagramClass}"></div>`);
		const $level1 = $('<div class="level-1"></div>');
		$diagram.append($level1);

		// Track maximum depth for debugging
		let maxDepth = 0;

		// Process first level items
		$ul.children("li").each(function () {
			const $li = $(this);
			const branchResult = createBranch($, $li, 1);
			$level1.append(branchResult.element);
			maxDepth = Math.max(maxDepth, branchResult.depth);
		});

		// Replace the original ul with our new structure
		$ul.replaceWith($diagram);
	});
});

function createBranch($, $li, currentDepth) {
	const $branch = $('<div class="branch"></div>');
	const $nodeGroup = $('<div class="node-group"></div>');

	// 保留文本內容與指定標籤 (<br>, <hr>, <strong>)
	const nodeContent = $li
		.contents()
		.map(function () {
			if (this.type === "text") {
				return this.nodeValue.trim();
			} else if (this.tagName && /^(BR|HR|STRONG)$/i.test(this.tagName)) {
				return $(this).clone(); // 複製保留指定標籤
			}
		})
		.toArray();

	const $node = $('<div class="node"></div>').append(nodeContent);
	$nodeGroup.append($node);

	let maxChildDepth = currentDepth;

	// 處理子項目 (nested ul)
	const $subUl = $li.children("ul");
	if ($subUl.length) {
		const $children = $('<div class="children"></div>');

		$subUl.children("li").each(function () {
			const $childLi = $(this);
			if ($childLi.children("ul").length) {
				const childResult = createBranch($, $childLi, currentDepth + 1);
				$children.append(childResult.element.children());
				maxChildDepth = Math.max(maxChildDepth, childResult.depth);
			} else {
				const childContent = $childLi
					.contents()
					.map(function () {
						if (this.type === "text") {
							return this.nodeValue.trim();
						} else if (this.tagName && /^(BR|HR|STRONG)$/i.test(this.tagName)) {
							return $(this).clone();
						}
					})
					.toArray();

				const $childNode = $('<div class="node"></div>').append(childContent);
				$children.append($childNode);
			}
		});

		$nodeGroup.append($children);
	}

	$branch.append($nodeGroup);
	return {
		element: $branch,
		depth: maxChildDepth,
	};
}
