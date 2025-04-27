# PolkaScore - Polkadot Credit Score Calculator

PolkaScore is a web application that calculates a credit score for Polkadot wallet addresses based on on-chain activity such as staking, transfers, governance participation, and NFT badges.

![PolkaScore Screenshot](https://github.com/yourusername/polkascore/raw/main/public/screenshot.png)

## Features

- 📊 Dashboard with credit score visualization
- 💳 Score breakdown with detailed component analysis
- 📈 Interactive charts for activity history
- 🥇 NFT minting for your credit score
- 🔄 Staking interface with reward estimations
- 🌙 Dark/Light mode support
- 📱 Fully responsive design

## Demo Accounts

Use these demo addresses to see different score tiers:

- **Diamond Tier**: `15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5`
- **Platinum Tier**: `14Ztd3KJDaB9xyJtRkREtSZDdhLSbm7UUKr8YGXLUfQB3Ko3`
- **Gold Tier**: `12Y8b4C9ar863uZFNuuQwP4BsCZEKKcHQxbP9MdcNXwBKUa9`
- **Silver Tier**: `16LavPxjMCbJmwKgLxzwQG6SiT7voMFT8EErNnmSvXDFGnJP`
- **Bronze Tier**: `1F9VkLCkGWwtk7nPWjDhQDEUxBTw7HHy8xkfdqtAqbUXbCc`

## Deployment Options

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher) or [yarn](https://yarnpkg.com/) (v1.22 or higher)
- [Git](https://git-scm.com/)

### Local Development

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/polkascore.git
cd polkascore
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build

1. Build the application:

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

2. Start the production server:

\`\`\`bash
npm run start
# or
yarn start
\`\`\`

### Deploying to Vercel

1. Install the Vercel CLI:

\`\`\`bash
npm install -g vercel
# or
yarn global add vercel
\`\`\`

2. Deploy to Vercel:

\`\`\`bash
vercel
\`\`\`

3. For production deployment:

\`\`\`bash
vercel --prod
\`\`\`

### Deploying to Netlify

1. Install the Netlify CLI:

\`\`\`bash
npm install -g netlify-cli
# or
yarn global add netlify-cli
\`\`\`

2. Deploy to Netlify:

\`\`\`bash
netlify deploy
\`\`\`

3. For production deployment:

\`\`\`bash
netlify deploy --prod
\`\`\`

### Docker Deployment

1. Build the Docker image:

\`\`\`bash
docker build -t polkascore .
\`\`\`

2. Run the Docker container:

\`\`\`bash
docker run -p 3000:3000 polkascore
\`\`\`

## Environment Variables

No environment variables are required for basic functionality. If you integrate with blockchain APIs, add them to a `.env.local` file.

## Troubleshooting

### Common Issues

**Issue**: "npm run dev" fails with Node.js version error.
**Solution**: Ensure you're using Node.js v18 or higher. Update with `nvm install 18` if you use NVM.

**Issue**: Application fails to build due to dependency conflicts.
**Solution**: Try clearing your cache and reinstalling dependencies:
\`\`\`bash
rm -rf node_modules .next
npm install
\`\`\`

**Issue**: Dark mode toggle not working.
**Solution**: Check that `next-themes` is properly installed and your `ThemeProvider` is properly set up in `layout.tsx`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Push to GitHub

To push this code to GitHub, you'll need to:

1. Create a new repository on GitHub
2. Initialize Git in your local directory (if not already done):

\`\`\`bash
git init
\`\`\`

3. Add all files to Git:

\`\`\`bash
git add .
\`\`\`

4. Commit the files:

\`\`\`bash
git commit -m "Initial commit"
\`\`\`

5. Add your GitHub repository as remote:

\`\`\`bash
git remote add origin https://github.com/yourusername/polkascore.git
\`\`\`

6. Push to GitHub:

\`\`\`bash
git push -u origin main
\`\`\`

Note: Replace `yourusername` with your actual GitHub username and adjust the repository name as needed.
\`\`\`

Now, let's update the score calculator to support the different demo accounts:

```typescriptreact file="lib/score-calculator.ts"
[v0-no-op-code-block-prefix]import type { UserData } from "@/types/user-data"

// Calculate the overall score based on the formula:
// (5 × staking) + (2 × transfers) + (3 × governance_votes) + (10 × NFT_badges)
export function calculateScore(userData: UserData): number {
  const stakingScore = calculateComponentScore(userData.staking, 5, 100)
  const transfersScore = calculateComponentScore(userData.transfers, 2, 100)
  const governanceScore = calculateComponentScore(userData.governance, 3, 100)
  const nftScore = calculateComponentScore(userData.nftBadges, 10, 100)

  const totalScore = stakingScore * 5 + transfersScore * 2 + governanceScore * 3 + nftScore * 10

  // Cap the score at 850
  return Math.min(Math.round(totalScore), 850)
}

// Calculate a component score (0-100) based on the component data
export function calculateComponentScore(componentData: any, weight: number, maxScore: number): number {
  // This is a simplified scoring algorithm
  // In a real application, this would be more sophisticated

  if (componentData.hasOwnProperty("amountStaked")) {
    // Staking component
    const amountScore = Math.min(componentData.amountStaked / 1000, 0.5) * 100
    const durationScore = Math.min(componentData.stakingDuration / 365, 0.3) * 100
    const validatorsScore = Math.min(componentData.validatorsNominated / 16, 0.2) * 100

    return Math.round(amountScore + durationScore + validatorsScore)
  }

  if (componentData.hasOwnProperty("frequency")) {
    // Transfers component
    const frequencyScore = Math.min(componentData.frequency / 50, 0.4) * 100
    const volumeScore = Math.min(componentData.volume / 1000, 0.4) * 100
    const recipientsScore = Math.min(componentData.uniqueRecipients / 20, 0.2) * 100

    return Math.round(frequencyScore + volumeScore + recipientsScore)
  }

  if (componentData.hasOwnProperty("votesCast")) {
    // Governance component
    const votesScore = Math.min(componentData.votesCast / 10, 0.6) * 100
    const proposalsScore = Math.min(componentData.proposalsCreated, 0.3) * 100
    const delegationScore = componentData.delegationActivity ? 10 : 0

    return Math.round(votesScore + proposalsScore + delegationScore)
  }

  if (componentData.hasOwnProperty("badgesOwned")) {
    // NFT badges component
    const badgesScore = Math.min(componentData.badgesOwned / 5, 0.5) * 100
    const rareScore = Math.min(componentData.rareBadges / 2, 0.4) * 100
    const ageScore = Math.min(componentData.badgeAge / 180, 0.1) * 100

    return Math.round(badgesScore + rareScore + ageScore)
  }

  return 0
}

// Update the fetchUserData function to include more demo addresses for different score tiers
export async function fetchUserData(address: string): Promise<UserData> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Diamond tier (700+ score)
  if (address === "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5") {
    return {
      staking: {
        amountStaked: 450,
        stakingDuration: 180,
        validatorsNominated: 8,
      },
      transfers: {
        frequency: 32,
        volume: 750,
        uniqueRecipients: 15,
      },
      governance: {
        votesCast: 7,
        proposalsCreated: 1,
        delegationActivity: true,
      },
      nftBadges: {
        badgesOwned: 3,
        rareBadges: 1,
        badgeAge: 90,
      },
    }
  }

  // Platinum tier (600-699 score)
  if (address === "14Ztd3KJDaB9xyJtRkREtSZDdhLSbm7UUKr8YGXLUfQB3Ko3") {
    return {
      staking: {
        amountStaked: 350,
        stakingDuration: 120,
        validatorsNominated: 6,
      },
      transfers: {
        frequency: 25,
        volume: 500,
        uniqueRecipients: 10,
      },
      governance: {
        votesCast: 5,
        proposalsCreated: 0,
        delegationActivity: true,
      },
      nftBadges: {
        badgesOwned: 2,
        rareBadges: 1,
        badgeAge: 60,
      },
    }
  }

  // Gold tier (500-599 score)
  if (address === "12Y8b4C9ar863uZFNuuQwP4BsCZEKKcHQxbP9MdcNXwBKUa9") {
    return {
      staking: {
        amountStaked: 250,
        stakingDuration: 90,
        validatorsNominated: 4,
      },
      transfers: {
        frequency: 18,
        volume: 350,
        uniqueRecipients: 7,
      },
      governance: {
        votesCast: 3,
        proposalsCreated: 0,
        delegationActivity: false,
      },
      nftBadges: {
        badgesOwned: 1,
        rareBadges: 0,
        badgeAge: 30,
      },
    }
  }

  // Silver tier (400-499 score)
  if (address === "16LavPxjMCbJmwKgLxzwQG6SiT7voMFT8EErNnmSvXDFGnJP") {
    return {
      staking: {
        amountStaked: 120,
        stakingDuration: 45,
        validatorsNominated: 2,
      },
      transfers: {
        frequency: 10,
        volume: 200,
        uniqueRecipients: 5,
      },
      governance: {
        votesCast: 1,
        proposalsCreated: 0,
        delegationActivity: false,
      },
      nftBadges: {
        badgesOwned: 1,
        rareBadges: 0,
        badgeAge: 15,
      },
    }
  }

  // Bronze tier (<400 score)
  if (address === "1F9VkLCkGWwtk7nPWjDhQDEUxBTw7HHy8xkfdqtAqbUXbCc") {
    return {
      staking: {
        amountStaked: 50,
        stakingDuration: 15,
        validatorsNominated: 1,
      },
      transfers: {
        frequency: 5,
        volume: 100,
        uniqueRecipients: 3,
      },
      governance: {
        votesCast: 0,
        proposalsCreated: 0,
        delegationActivity: false,
      },
      nftBadges: {
        badgesOwned: 0,
        rareBadges: 0,
        badgeAge: 0,
      },
    }
  }

  // Return default mock data for any other address
  return {
    staking: {
      amountStaked: 250,
      stakingDuration: 120,
      validatorsNominated: 5,
    },
    transfers: {
      frequency: 15,
      volume: 350,
      uniqueRecipients: 8,
    },
    governance: {
      votesCast: 4,
      proposalsCreated: 0,
      delegationActivity: false,
    },
    nftBadges: {
      badgesOwned: 2,
      rareBadges: 1,
      badgeAge: 60,
    },
  }
}
