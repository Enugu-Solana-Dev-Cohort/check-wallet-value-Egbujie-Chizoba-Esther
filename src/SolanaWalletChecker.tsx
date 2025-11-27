

// import "./App.css";
// import { useState } from "react";
// import { Connection, PublicKey } from "@solana/web3.js";
// import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";

// const RPC_URL = "https://api.mainnet-beta.solana.com";
// const connection = new Connection(RPC_URL, "confirmed");

// const SolanaWalletChecker: React.FC = () => {
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<React.ReactNode>(null);
//   const [showResult, setShowResult] = useState(false); // 🔥 HIDE RESULT AT FIRST

//   const validateSolAddress = (address: string) => {
//     try {
//       new PublicKey(address);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   const accountExists = async (address: string) => {
//     try {
//       return await connection.getAccountInfo(new PublicKey(address));
//     } catch {
//       return null;
//     }
//   };

//   const isPDA = (pubkey: PublicKey) => !PublicKey.isOnCurve(pubkey);

//   const resolveDomain = async (domain: string) => {
//     try {
//       const { pubkey: domainKey } = getDomainKeySync(domain);
//       const registry = await NameRegistryState.retrieve(connection, domainKey);
//       if (registry) {
//         const owner = (registry as any).owner;
//         return new PublicKey(owner).toBase58();
//       }
//     } catch {}

//     try {
//       const encoder = new TextEncoder();
//       const DOMAIN_PROGRAM_ID_V1 = new PublicKey(
//         "namesLPF5Y8XccmF4WJJFq4NQeeSK2p1ms7pTjKQvEw"
//       );
//       const [pda] = await PublicKey.findProgramAddress(
//         [encoder.encode(domain)],
//         DOMAIN_PROGRAM_ID_V1
//       );

//       const accInfo = await connection.getAccountInfo(pda);
//       if (accInfo) {
//         const ownerBytes = accInfo.data.slice(32, 64);
//         return new PublicKey(ownerBytes).toBase58();
//       }
//     } catch {}

//     return null;
//   };

//   const handleCheck = async () => {
//     if (!input.trim()) {
//       setResult(
//         <span className="error-text">❌ Please enter a wallet address or .sol domain</span>
//       );
//       setShowResult(true);
//       return;
//     }

//     setLoading(true);
//     setShowResult(true);
//     setResult(<span>Checking…</span>);

//     let address = input.trim();

//     if (address.endsWith(".sol")) {
//       const resolved = await resolveDomain(address);
//       if (!resolved) {
//         setResult(<span className="error-text">❌ Domain not found</span>);
//         setLoading(false);
//         return;
//       }
//       address = resolved;
//     }

//     const valid = validateSolAddress(address);
//     const items: React.ReactNode[] = [];

//     if (!valid) {
//       setResult(<span className="error-text">❌ Invalid Solana public key</span>);
//       setLoading(false);
//       return;
//     }

//     items.push(<span className="success-text">✅ Valid Solana public key</span>);

//     const info = await accountExists(address);

//     if (info) {
//       items.push(<span className="success-text">✅ Address exists on-chain</span>);
//     } else {
//       items.push(
//         <span className="warning-text">⚠️ Address does NOT exist on-chain</span>
//       );
//     }

//     const pubkey = new PublicKey(address);
//     if (isPDA(pubkey)) {
//       items.push(
//         <span className="pda-text">
//           ⚠️ This is a PDA (Program Derived Address). It cannot sign transactions.
//         </span>
//       );
//     }

//     items.push(<p className="public-key">{address}</p>);

//     setResult(<div>{items.map((e, i) => <div key={i}>{e}</div>)}</div>);
//     setLoading(false);
//   };

//   return (
//     <div className="page-container">
//       <div className="wallet-card">
//         <h2>Solana Wallet Checker</h2>

//         <input
//           className="wallet-input"
//           placeholder="Enter wallet address or .sol domain"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           disabled={loading}
//         />

//         <button className="check-btn" onClick={handleCheck} disabled={loading}>
//           {loading ? "Checking…" : "Check Wallet"}
//         </button>

//         {/* 🔥 ONLY SHOW RESULT AFTER CHECK BUTTON IS CLICKED */}
//         {showResult && <div className="result-box">{result}</div>}
//       </div>
//     </div>
//   );
// };

// export default SolanaWalletChecker;


import "./App.css";
import { useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";

const RPC_URL = "https://api.mainnet-beta.solana.com";
const connection = new Connection(RPC_URL, "confirmed");

const SolanaWalletChecker: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<React.ReactNode>(null);
  const [showResult, setShowResult] = useState(false);

  // 🔥 Auto-clear after 6 seconds
  const autoClear = () => {
    setTimeout(() => {
      setInput("");
      setShowResult(false);
      setResult(null);
    }, 12000);
  };

  const validateSolAddress = (address: string) => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  const accountExists = async (address: string) => {
    try {
      return await connection.getAccountInfo(new PublicKey(address));
    } catch {
      return null;
    }
  };

  const isPDA = (pubkey: PublicKey) => !PublicKey.isOnCurve(pubkey);

  const resolveDomain = async (domain: string) => {
    try {
      const { pubkey: domainKey } = getDomainKeySync(domain);
      const registry = await NameRegistryState.retrieve(connection, domainKey);
      if (registry) {
        const owner = (registry as any).owner;
        return new PublicKey(owner).toBase58();
      }
    } catch {}

    try {
      const encoder = new TextEncoder();
      const DOMAIN_PROGRAM_ID_V1 = new PublicKey(
        "namesLPF5Y8XccmF4WJJFq4NQeeSK2p1ms7pTjKQvEw"
      );
      const [pda] = await PublicKey.findProgramAddress(
        [encoder.encode(domain)],
        DOMAIN_PROGRAM_ID_V1
      );

      const accInfo = await connection.getAccountInfo(pda);
      if (accInfo) {
        const ownerBytes = accInfo.data.slice(32, 64);
        return new PublicKey(ownerBytes).toBase58();
      }
    } catch {}

    return null;
  };

  const handleCheck = async () => {
    if (!input.trim()) {
      setShowResult(true);
      setResult(
        <span className="error-text fade-in">
          ❌ Please enter a wallet address or .sol domain
        </span>
      );
      autoClear();
      return;
    }

    setLoading(true);
    setShowResult(true);
    setResult(<span className="fade-in">Checking…</span>);

    let address = input.trim();

    if (address.endsWith(".sol")) {
      const resolved = await resolveDomain(address);
      if (!resolved) {
        setResult(
          <span className="error-text fade-in">❌ Domain not found</span>
        );
        setLoading(false);
        autoClear();
        return;
      }
      address = resolved;
    }

    const valid = validateSolAddress(address);

    const items: React.ReactNode[] = [];

    if (!valid) {
      setResult(<span className="error-text fade-in">❌ Invalid public key</span>);
      setLoading(false);
      autoClear();
      return;
    }

    items.push(
      <span className="success-text fade-in">✅ Valid Solana public key</span>
    );

    const info = await accountExists(address);
      
      if (info) {
  items.push(
    <span className="success-text fade-in">
      ✅ Address exists on-chain
    </span>
  );
} else {
  items.push(
    <span className="warning-text fade-in">
      ⚠️ Address does NOT exist on-chain
    </span>
  );

  items.push(
    <small className="explain-text fade-in">
      Possible reasons:
      <br />- No account has ever been created at this address.
      <br />- It may exist on another network (Devnet/Testnet).
    </small>
  );
}

    const pubkey = new PublicKey(address);
    if (isPDA(pubkey)) {
      items.push(
        <span className="pda-text fade-in">
          ⚠️ This is a PDA (Program Derived Address). PDAs cannot sign.
        </span>
      );
    }

    items.push(
      <p className="public-key fade-in slide-in">{address}</p>
    );

    setResult(<div>{items.map((e, i) => <div key={i}>{e}</div>)}</div>);
    setLoading(false);

    autoClear();
  };

  return (
    <div className="page-container">
      <div className="wallet-card slide-in">
        <h2 className="title">Solana Wallet Checker</h2>

        <input
          className="wallet-input"
          placeholder="Enter address or .sol domain"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />

        <button className="check-btn" onClick={handleCheck} disabled={loading}>
          {loading ? "Checking…" : "Check Wallet"}
        </button>

        {showResult && <div className="result-box fade-in">{result}</div>}
      </div>
    </div>
  );
};

export default SolanaWalletChecker;
