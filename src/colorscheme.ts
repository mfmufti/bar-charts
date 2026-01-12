export type ColorScheme = { name: string; low: number; high: number };

export const colorSchemes: ColorScheme[] = [
	{ name: "rainbow", low: 0, high: 360 },
	{ name: "hot", low: 0, high: 50 },
	{ name: "cool", low: 200, high: 250 },
	{ name: "earthy", low: 70, high: 120 },
];

export function getColor(
	colorScheme: ColorScheme,
	size: number,
	index: number
): string {
	const { low, high } = colorScheme;
	return `hsl(${(index / size) * (high - low) + low},100%,42%)`;
}
