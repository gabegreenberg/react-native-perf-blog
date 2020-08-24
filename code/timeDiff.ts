// const { promises } = require("fs");
// const path = require("path");

// const logFetch = async (filename) => {
// 	return JSON.parse(
// 		await promises.readFile(path.join(__dirname, filename), "utf-8")
// 	);
// };

// const findTimeDiff = (events) => {
// 	const timeDiff = [];
// 	let lastTimestamp = events[0];
// 	events.forEach((event) => {
// 		timeDiff.push(event.ts - lastTimestamp);
// 		lastTimestamp = event.ts;
// 	});
// 	return timeDiff;
// };

// const main = async (filename, type) => {
// 	const logs = await logFetch(filename);
// 	let timeDiffs = [];
// 	if (type === "HERMES") {
// 		timeDiffs = findTimeDiff(logs.samples);
// 	} else {
// 		timeDiffs = findTimeDiff(logs.traceEvents);
// 	}
// };

// main("trace-hermes.log", "HERMES");
