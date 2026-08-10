# Coop Tales ER

Independent Solana Blitz V7 submission for collaborative story canon creation with MagicBlock ER.

## Demo Flow

1. Connect a Solana devnet wallet.
2. Create a story world and narrator prompt.
3. Submit a branch through MagicBlock ER.
4. Vote the branch into canon through MagicBlock ER.
5. Settle the final chapter hash on Solana devnet.

## MagicBlock Use

- ER endpoint: `https://devnet.magicblock.app`
- Solana devnet endpoint: `https://api.devnet.solana.com`
- Proof format: signed memo transactions for branch, vote, and canon settlement.

## Local Development

```bash
npm install
npm run dev
```

## Reference

Inspired by Coop Tales' public ETHGlobal showcase and source architecture. This is a new Solana/MagicBlock implementation with new product framing and assets.
