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
- Custom program ID: `9pxVnueG82fUQHBtvV8co5HDKQEjVrEEq2NABEs5ny1G`
- Deploy tx: `43hSCzCmK37anaM6wFLE1ZMTWdfCGKN3sHKJg8msdh1vcjjJLeEDBvDPAGJdG4qJkR2xzcHVYr5mkXgPs7wLNLRo`
- Proof format: wallet-signed custom program instructions carrying branch, vote, and canon payloads.

## Local Development

```bash
npm install
npm run dev
```

## Reference

Inspired by Coop Tales' public ETHGlobal showcase and source architecture. This is a new Solana/MagicBlock implementation with new product framing and assets.
