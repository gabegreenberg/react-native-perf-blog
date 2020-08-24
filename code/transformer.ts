import transformer from "hermes-profile-transformer";
import { writeFileSync, fstat } from "fs";
import path from "path";
const filename = "trace-hermes.log";

transformer(
	"/Users/zomato/Desktop/react-native-perf-blog/code/trace-hermes.log",
	undefined,
	undefined
).then((events) => {
	writeFileSync(
		"/Users/zomato/Desktop/react-native-perf-blog/code/hermes-converted.json",
		JSON.stringify(events, null, 2)
	);
});
