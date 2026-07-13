const API_URL = import.meta.env.PUBLIC_SCORES_API_URL as string;

export interface ScorePayload {
	userId: string;
	email: string;
	name?: string;
	score: number;
	timeMs: number;
}

export interface SavedScore {
	userId: string;
	email: string;
	name: string;
	score: number;
	timeMs: number;
	playedAt: string;
}

/**
 * POST /  → saves the player's score to DynamoDB.
 * Returns the saved object so the UI can update without an extra fetch.
 */
export async function submitScore(payload: ScorePayload): Promise<SavedScore> {
	const res = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error((err as { error?: string }).error ?? `Error ${res.status}`);
	}

	const data = (await res.json()) as { score: SavedScore };
	return data.score;
}

/**
 * GET /  → returns the top-20 leaderboard entries.
 */
export async function fetchLeaderboard(): Promise<SavedScore[]> {
	const res = await fetch(API_URL);
	if (!res.ok) throw new Error(`Error ${res.status}`);
	const data = (await res.json()) as { scores: SavedScore[] };
	return data.scores;
}
