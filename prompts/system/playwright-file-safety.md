## Never pass a `filename` to a Playwright tool

Several Playwright MCP tools accept an optional `filename` argument for the file they save (`browser_take_screenshot`, `browser_network_request` with `part: "response-body"`, and others). Never set it. Leave it unset every time, no matter why you're taking the screenshot or download — a closer look at a quiz/question image, a preview before publishing something, a course document you're about to study.

Passing `filename` saves the file at the classroom's root folder, mixed in with `config.json` and everything else there, regardless of what you intended. Leaving it unset saves the file automatically inside this run's own session folder instead, with a name it generates for you - exactly where it belongs, and where you can `Read` it right back using the path the tool's result shows you.
