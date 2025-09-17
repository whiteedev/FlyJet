import { motion } from "framer-motion";
import { Gift } from "lucide-react";

export default function Prizes() {
  const prizes = [
    { name: "NFT Rocket #1", color: "#ff6f61" },
    { name: "NFT Star #2", color: "#6fc3ff" },
    { name: "NFT Planet #3", color: "#ffdf6f" },
  ];

  return (
    <motion.div
      key="prizes"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 50,
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: 20, fontSize: 28 }}>🎁 Мои подарки</h2>
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {prizes.map((prize, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${prize.color}` }}
            style={{
              width: 120,
              height: 160,
              background: "rgba(20,20,20,0.5)",
              backdropFilter: "blur(10px)",
              borderRadius: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 10px ${prize.color}50`,
              padding: 10,
              cursor: "pointer",
            }}
          >
            <Gift color={prize.color} size={48} />
            <p style={{ marginTop: 10, fontSize: 14, textAlign: "center" }}>{prize.name}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
