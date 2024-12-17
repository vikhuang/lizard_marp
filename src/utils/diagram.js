const cheerioWrapper = require("./cheerio-utils");

module.exports = cheerioWrapper.createPlugin(($, result) => {
	// Find all sections with class "diagram"
	$("section.diagram").each(function () {
		const $section = $(this);
		const $ul = $section.find("> ul");

		if (!$ul.length) {
			console.warn("No UL element found in diagram section");
			return;
		}

		// Create the base diagram structure
		const $diagram = $('<div class="diagram"></div>');
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

		// console.log(`Processed diagram with max depth: ${maxDepth}`);

		// Replace the original ul with our new structure
		$ul.replaceWith($diagram);
	});
});

// Helper function to create a branch from a li element
function createBranch($, $li, currentDepth) {
	const $branch = $('<div class="branch"></div>');
	const $nodeGroup = $('<div class="node-group"></div>');

	// Get text content, handling potential HTML entities and mixed content
	const nodeText = $li
		.contents()
		.filter(function () {
			return this.type === "text";
		})
		.first()
		.text()
		.trim();

	const $node = $('<div class="node"></div>').text(nodeText);
	$nodeGroup.append($node);

	let maxChildDepth = currentDepth;

	// If there are children (nested ul), process them
	const $subUl = $li.children("ul");
	if ($subUl.length) {
		const $children = $('<div class="children"></div>');

		$subUl.children("li").each(function () {
			const $childLi = $(this);
			// If this child has its own children, create a new branch
			if ($childLi.children("ul").length) {
				const childResult = createBranch($, $childLi, currentDepth + 1);
				$children.append(childResult.element.children()); // We want the node-group, not another branch
				maxChildDepth = Math.max(maxChildDepth, childResult.depth);
			} else {
				// Otherwise just create a node
				const childText = $childLi
					.contents()
					.filter(function () {
						return this.type === "text";
					})
					.first()
					.text()
					.trim();
				const $childNode = $('<div class="node"></div>').text(childText);
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
