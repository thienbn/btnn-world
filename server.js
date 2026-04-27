import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* -------------------------
   ENV
-------------------------- */

const ARENA_TOKEN = process.env.ARENA_ACCESS_TOKEN;
const ARENA_CHANNEL = process.env.ARENA_CHANNEL;

/* -------------------------
   MIDDLEWARE
-------------------------- */

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

/* -------------------------
   HEALTH CHECK
-------------------------- */

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

/* -------------------------
   ARE.NA GUESTBOOK FEED
-------------------------- */

app.get("/api/guestbook", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.are.na/v2/channels/${ARENA_CHANNEL}`
    );

    const raw = await response.json();

    console.log("ARENA RAW RESPONSE:", raw);

    // 🔥 Normalize all possible Are.na response shapes
    const blocks =
      raw.contents ||
      raw.blocks ||
      raw.items ||
      [];

    if (!Array.isArray(blocks)) {
      console.warn("ARENA: blocks is not an array", blocks);
      return res.json([]);
    }

    // 🧠 Extract images safely across API versions
    const images = blocks
      .filter((b) => {
        return (
          b?.class === "Image" ||
          b?.type === "Image" ||
          b?.image ||
          b?.source?.includes?.("http")
        );
      })
      .map((b) => {
        // Normalize image URL across formats
        const url =
          b?.image?.display?.url ||
          b?.image?.original?.url ||
          b?.image?.url ||
          b?.source ||
          null;

        return url ? { url } : null;
      })
      .filter(Boolean)
      .reverse(); // newest first

    res.json(images);
  } catch (err) {
    console.error("guestbook ERROR:", err);
    res.status(500).json({ error: "Failed to fetch guestbook" });
  }
});

/* -------------------------
   UPLOAD TO ARE.NA
-------------------------- */

app.post("/api/upload", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const response = await fetch(
      `https://api.are.na/v3/channels/${ARENA_CHANNEL}/blocks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ARENA_TOKEN}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          source: image,
          class: "Image"
        })
      }
    );

    const data = await response.json();

    console.log("UPLOAD RESPONSE:", data);

    res.json({ success: true, block: data });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.get("/debug-arena", async (req, res) => {
  const response = await fetch("https://api.are.na/v3/me", {
    headers: {
      Authorization: `Bearer ${ARENA_TOKEN}`
    }
  });

  const data = await response.json();
  res.json(data);
});

/* -------------------------
   START
-------------------------- */

app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
});
