# Parametric House Generator

A web-based application that generates architectural designs using AI-powered parametric modeling. This project combines SvelteKit, TypeScript, and the Replicate API to create unique architectural visualizations.

## Features

- Interactive 3D house generation
- AI-powered architectural design using Replicate's Flux Fantasy Architecture model
- Real-time parameter adjustments
- Modern, responsive UI built with SvelteKit and TailwindCSS
- Interactive map integration using Leaflet

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- A Replicate API token

## Installation

1. Clone the repository:
```bash
git clone https://github.com/linalopes/parametric-house-generator.git
cd parametric-house-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

To get your Replicate API token:
1. Go to [Replicate](https://replicate.com)
2. Sign up or log in
3. Navigate to your account settings
4. Copy your API token

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript type checking
- `npm run format` - Format code using Prettier
- `npm run lint` - Check code formatting

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Leaflet](https://leafletjs.com/) - Interactive maps
- [Replicate API](https://replicate.com/) - AI model integration
- [Vite](https://vitejs.dev/) - Build tool

## Project Structure

```
parametric-house-generator/
├── src/              # Source files
├── static/           # Static assets
├── .env             # Environment variables (create this)
├── .env.example     # Example environment variables
├── package.json     # Project dependencies and scripts
└── vite.config.ts   # Vite configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Replicate](https://replicate.com/) for providing the AI model
- [SvelteKit](https://kit.svelte.dev/) for the amazing framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
