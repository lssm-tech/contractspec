export function formatMoney(amount: number, currency: string): string {
	const rounded = Math.round(amount);
	const formatted = String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return `${formatted} ${currency}`;
}

export function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
