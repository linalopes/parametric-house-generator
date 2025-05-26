// svelte.config.js
import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');
const base = dev ? '' : '/parametric-house-generator';

export default {
  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),
    paths: {
      base
    },
    prerender: {
      entries: ['*']
    }
  }
};
