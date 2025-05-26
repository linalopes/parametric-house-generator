// src/routes/api/replicate/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { prompt } = await request.json();

		console.log('📤 Prompt received:', prompt);

		const replicateToken = process.env.REPLICATE_API_TOKEN;
		if (!replicateToken) {
			throw new Error('Missing token in .env');
		}

		const response = await fetch('https://api.replicate.com/v1/predictions', {
			method: 'POST',
			headers: {
				Authorization: `Token ${replicateToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				version: '8bd08a5e1b0eaa17d16122e86bffe9d63f0e8cf391fd47144489902975f3f333',
				input: {
					prompt,
					aspect_ratio: '1:1',
					num_outputs: 1,
					guidance_scale: 3,
					num_inference_steps: 28,
					model: 'dev'
				}
			})
		});

		const prediction = await response.json();

		console.log('📥 Initial Replicate response:', prediction);

		if (!prediction.id) {
			throw new Error('prediction.id ausente: ' + JSON.stringify(prediction));
		}

		// Polling
		let result = prediction;
		while (result.status !== 'succeeded' && result.status !== 'failed') {
			await new Promise((r) => setTimeout(r, 1500));
			const res = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
				headers: {
					Authorization: `Token ${replicateToken}`
				}
			});
			result = await res.json();
			console.log('🔄 Polling status:', result.status);
		}

		if (result.status === 'succeeded' && result.output?.length) {
			console.log('✅ Image generated:', result.output[0]);
			return new Response(JSON.stringify({ url: result.output[0] }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		} else {
			throw new Error('Image generation failed: ' + JSON.stringify(result));
		}
	} catch (err) {
		console.error('🔥 Internal error in /api/replicate:', err);
		return new Response(JSON.stringify({ message: 'Internal Error' }), {
			status: 500
		});
	}
};
