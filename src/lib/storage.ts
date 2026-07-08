const STORAGE_KEY = 'cacao-coffee-sessions';

export interface GameSession {
	id: string;
	timestamp: string;
	name: string;
	email: string;
	answers: Record<number, string>;
	visitedPoints: number[];
	score: number;
}

export function getSessions(): GameSession[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as GameSession[]) : [];
	} catch {
		return [];
	}
}

export function saveSession(session: GameSession): void {
	const sessions = getSessions();
	sessions.push(session);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function exportSessionsAsJson(): void {
	const sessions = getSessions();
	const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `cacao-coffee-datos-${new Date().toISOString().slice(0, 10)}.json`;
	link.click();
	URL.revokeObjectURL(url);
}

export function exportSessionsAsCsv(): void {
	const sessions = getSessions();
	if (sessions.length === 0) return;

	const headers = ['id', 'timestamp', 'name', 'email', 'score', 'visitedPoints', 'answers'];
	const rows = sessions.map((s) => [
		s.id,
		s.timestamp,
		s.name,
		s.email,
		String(s.score),
		s.visitedPoints.join('|'),
		JSON.stringify(s.answers),
	]);

	const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join(
		'\n',
	);

	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `cacao-coffee-datos-${new Date().toISOString().slice(0, 10)}.csv`;
	link.click();
	URL.revokeObjectURL(url);
}
