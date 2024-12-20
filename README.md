# Olivia Starter

A starter kit for building AI agents with blockchain capabilities using Eliza, GOAT, and Shogun plugins.

## Quick Start

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Configure your `.env` file with the following required variables:
```env
# Required for base functionality
OPENAI_API_KEY=your_key_here

# LIT SDK
WALLET_PRIVATE_KEY=your_wallet_private_key
```

3. Install and run:
```bash
pnpm i
pnpm start
```

## Features

- Base agent functionality with Eliza
- GOAT plugin for blockchain interactions (Base chain)
- Shogun plugin for cross-chain operations

## Optional Features

Additional features can be enabled by adding their respective environment variables:
- Anthropic Claude: `ANTHROPIC_API_KEY`
- Telegram bot: `TELEGRAM_BOT_TOKEN`
- Discord bot: `DISCORD_APPLICATION_ID`, `DISCORD_API_TOKEN`
- Twitter integration: `TWITTER_USERNAME`, `TWITTER_PASSWORD`, `TWITTER_EMAIL`

## Development

Edit `src/character.ts` to modify the agent's behavior and add or remove plugins in the character configuration.