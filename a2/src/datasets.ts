/**
 * Dataset type definition:
 * - short 1-word title (string).
 * - an array of labels (strings, 1-3 characters each).
 * - an array of values (numbers, 0-100).
 * - The labels and values arrays are of equal length (1 to 8 elements).
 */
export type Dataset = {
	/** Short dataset title (assume 1-word) */
	title: string;
	/**
	 * Array of labels (1-3 chars)
	 */
	labels: string[];
	/**
	 * Array of values (0-100)
	 */
	values: number[];
};

/**
 * Get a dataset by index or a random dataset if no index is provided
 * @param i Optional index to get a specific dataset; if not provided, return a random dataset
 * @returns A Dataset object
 */
export function getDataset(i?: number): Dataset {
	if (i === undefined) {
		// make a random dataset
		const title = titles[Math.floor(Math.random() * titles.length)];
		const n = Math.floor(Math.random() * 8) + 1; // 1 to 8
		// choose n random values between 0 and 100 (inclusive)
		const values = Array.from({ length: n }, () =>
			Math.floor(Math.random() * 101)
		);
		// pick n random labels from barLabels (without duplicates)
		const shuffledLabels = barLabels
			.slice()
			.sort(() => Math.random() - 0.5);
		// use first n shuffled labels
		const labels = shuffledLabels.slice(0, n);
		return {
			title,
			labels,
			values,
		} as Dataset;
	} else {
		return datasets[i % datasets.length];
	}
}

/**
 * Sample datasets
 */
const datasets: Dataset[] = [
	{
		title: "Simple",
		labels: ["A", "B", "C", "D", "E"],
		values: [90, 70, 50, 30, 10],
	},
	{
		title: "Single",
		labels: ["FOO"],
		values: [50],
	},
	{
		title: "Same",
		labels: ["X", "Y", "Z", "AA", "BB", "CC"],
		values: [50, 50, 50, 50, 50, 50],
	},
	{
		title: "Octet",
		labels: ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP"],
		values: [12, 34, 56, 78, 90, 21, 43, 65],
	},
	{
		title: "Pair",
		labels: ["Q", "RS"],
		values: [7, 88],
	},
	{
		title: "Trio",
		labels: ["X", "YZ", "QRS"],
		values: [23, 67, 45],
	},
	{
		title: "Quad",
		labels: ["A", "BC", "DEF", "G"],
		values: [10, 99, 54, 32],
	},
	{
		title: "Five",
		labels: ["HIJ", "K", "LM", "N", "OPQ"],
		values: [11, 22, 33, 44, 55],
	},
	{
		title: "Hex",
		labels: ["R", "ST", "UVW", "X", "YZ", "ZA"],
		values: [66, 77, 88, 99, 12, 23],
	},
	{
		title: "Sept",
		labels: ["B", "CD", "EFG", "H", "IJ", "KLM", "N"],
		values: [34, 45, 56, 67, 78, 89, 90],
	},
];

const titles = [
	"Growth",
	"Revenue",
	"Profit",
	"Loss",
	"Sales",
	"Market",
	"Trend",
	"Demand",
	"Supply",
	"Income",
	"Expense",
	"Budget",
	"Forecast",
	"Metric",
	"Output",
	"Input",
	"Volume",
	"Traffic",
	"Visits",
	"Leads",
	"Clicks",
	"Views",
	"Orders",
	"Rating",
	"Score",
	"Rank",
	"Index",
	"Value",
	"Cost",
	"Price",
	"Margin",
	"Share",
	"Capital",
	"Assets",
	"Liability",
	"Equity",
	"Debt",
	"Cash",
	"Flow",
	"Balance",
	"Return",
	"Yield",
	"Spread",
	"Ratio",
	"Rate",
	"Speed",
	"Power",
	"Energy",
	"Heat",
	"Light",
	"Sound",
	"Time",
	"Date",
	"Year",
	"Month",
	"Week",
	"Day",
	"Hour",
	"Users",
	"Members",
	"Clients",
	"Customers",
	"Audience",
	"Reach",
	"Impact",
	"Effect",
	"Change",
	"Shift",
	"Motion",
	"Drift",
	"Swing",
	"Spike",
	"Drop",
	"Peak",
	"Base",
	"Level",
	"Stage",
	"Phase",
	"Cycle",
	"Round",
	"Batch",
	"Group",
	"Class",
	"Zone",
	"Region",
	"Area",
	"Sector",
	"Field",
	"Space",
	"Layer",
	"Line",
	"Path",
	"Track",
	"Route",
	"Point",
	"Node",
	"Edge",
	"Axis",
	"Scale",
	"Range",
	"Scope",
	"Limit",
	"Goal",
	"Target",
	"Scorecard",
];

const barLabels = [
	"ace",
	"act",
	"add",
	"age",
	"aim",
	"air",
	"and",
	"ant",
	"ape",
	"arc",
	"arm",
	"art",
	"ash",
	"ask",
	"bag",
	"bar",
	"bat",
	"bay",
	"bed",
	"bee",
	"beg",
	"bet",
	"big",
	"bin",
	"bit",
	"bow",
	"box",
	"boy",
	"bug",
	"bus",
	"but",
	"buy",
	"cab",
	"can",
	"cap",
	"car",
	"cat",
	"cow",
	"cup",
	"cut",
	"dad",
	"day",
	"den",
	"dew",
	"dig",
	"dim",
	"dog",
	"dot",
	"dry",
	"ear",
	"eat",
	"egg",
	"end",
	"fan",
	"far",
	"fat",
	"fax",
	"fed",
	"fee",
	"few",
	"fig",
	"fit",
	"fix",
	"fog",
	"fun",
	"fur",
	"gap",
	"gas",
	"gem",
	"get",
	"gig",
	"gin",
	"god",
	"gum",
	"gun",
	"gut",
	"had",
	"ham",
	"hat",
	"hen",
	"her",
	"him",
	"hip",
	"hit",
	"hop",
	"hot",
	"how",
	"hug",
	"hut",
	"ice",
	"ill",
	"ink",
	"jam",
	"jar",
	"jaw",
	"jet",
	"job",
	"jog",
	"joy",
	"jug",
];
