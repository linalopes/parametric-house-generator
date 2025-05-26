// src/lib/replicate.ts
export async function generateImage(prompt: string): Promise<string | null> {
	const response = await fetch('/api/replicate', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ prompt })
	});

	if (!response.ok) {
		console.error('Erro no proxy:', await response.text());
		return null;
	}

	const { url } = await response.json();
	return url ?? null;
}
