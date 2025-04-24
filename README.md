# PawTrails - Pet Activity Tracking App

A modern web application for tracking your pet's activities, exploring trails, and connecting with the pet community.

## Features

- **Activity Tracking**: Record hikes, walks, runs, and play activities with your pet
- **Pet Profiles**: Manage profiles for your pets with health information
- **Trail Discovery**: Find pet-friendly trails and view details
- **Activity Analysis**: Get insights into your pet's activities and exercise needs
- **Community**: Share activities with other pet owners

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Build Tool**: Vite
- **Storage**: localStorage (client-side data persistence)

## Project Structure

The project follows a well-organized structure for easy navigation:

```
src/
├── components/       # UI components organized by feature
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── pages/            # Application pages organized by feature
├── services/         # Data handling services
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── config/           # Application configuration
```

See the [src/README.md](src/README.md) file for more detailed information about the codebase structure.

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/pawtrails.git
cd pawtrails
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser to http://localhost:5173

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The build output will be placed in the `dist` directory.

## License

[MIT](LICENSE)

## Acknowledgements

- Icons provided by [Lucide](https://lucide.dev/)
- Demo images from [Pexels](https://www.pexels.com/) 