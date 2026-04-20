# 🚀 StellarFund: Next-Gen Crowdfunding on Soroban

StellarFund is a decentralized, high-performance crowdfunding platform built on the **Stellar Testnet**. By leveraging **Soroban Smart Contracts** for trustless escrow logic and **MongoDB** for high-speed metadata indexing, StellarFund provides a seamless, secure, and modern experience for both creators and backers.

---

## 📋 Submission Details

- **Public Repository**: [GitHub - stellarfund](https://github.com/Garvitk06/stellarfund)
- **Deployed Contract ID**: [`CDTEJC34YJDNOKHALUZ34AUSWT3LVZYXQ2AB4DZUK7CWGVYXMWOYKFXW`](https://stellar.expert/explorer/testnet/contract/CDTEJC34YJDNOKHALUZ34AUSWT3LVZYXQ2AB4DZUK7CWGVYXMWOYKFXW)
- **Transaction Hash (Contract Call)**: `https://stellar.expert/explorer/testnet/op/9183464712622081`  
  *(Search for your wallet address on [Stellar Expert](https://stellar.expert/explorer/testnet) to find your latest `donate` or `create_campaign` transaction)*

---

## ✨ Key Features

- **Decentralized Escrow**: Funds are handled entirely by smart contracts. No middleman.
- **Instant Payouts**: Creators receive funds automatically the moment the goal is met.
- **Donor Protection**: Built-in refund logic for campaigns that don't reach their target by the deadline.
- **Hybrid Data Architecture**: High-speed UI updates via MongoDB metadata with blockchain-backed single source of truth.
- **Rich User Interface**:
    - Real-time animated progress bars.
    - Live donor activity feed.
    - Multi-wallet integration (Freighter, Albedo, xBull, etc.).

---

## 📸 Platform Preview

### Wallet Integration & Connectivity
The platform supports all major Stellar wallets, providing a unified connection experience.

![Wallet Options](assets/screenshot-wallet.png)

### Campaign & Backer Interaction
| Campaign Creation | Backing a Project |
| :---: | :---: |
| ![Create Campaign](assets/screenshot-create.png) | ![Donation Modal](assets/screenshot-donate.png) |

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TailwindCSS, Framer Motion.
- **Blockchain**: Soroban (Rust) on Stellar Testnet.
- **Database**: MongoDB Atlas (Metadata Indexing).
- **Wallet**: Freighter / Stellar SDK.

---

## 📦 Setup & Installation

### 1. Prerequisites
- [Soroban CLI & Rust](https://soroban.stellar.org/docs/getting-started/setup)
- Node.js 18+
- [Freighter Wallet](https://www.freighter.app/)

### 2. Environment Configuration
Create a `frontend/.env.local` file:
```env
NEXT_PUBLIC_CONTRACT_ID=CDTEJC34YJDNOKHALUZ34AUSWT3LVZYXQ2AB4DZUK7CWGVYXMWOYKFXW
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_RPC_URL="https://soroban-testnet.stellar.org"
NEXT_PUBLIC_HORIZON_URL="https://horizon-testnet.stellar.org"
MONGODB_URI=your_mongodb_uri
```

### 3. Build & Run
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 📅 Project Milestones

- **Initial Release (v1.0.0)**: Core Soroban escrow contract and Next.js frontend integrated.
- **Hybrid Sync Implementation**: Real-time event indexing with MongoDB Atlas.
- **Production Hardening**: Integrated real XLM token transfers and instant payout logic.

---

*Made with ❤️ for the Stellar Ecosystem.*
