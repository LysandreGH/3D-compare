import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Enable CORS for mobile browsers and cross-origin access
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const REVIEWS_FILE = path.join(process.cwd(), "reviews.json");
const TMP_REVIEWS_FILE = "/tmp/reviews.json";

// Default passcode for Admin Space
const ADMIN_CODE = "2026";

// Global in-memory cache so reviews persist even if filesystem reloads
let memoryReviews: any[] = [];

function loadReviewsFromDisk(): any[] {
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      const data = fs.readFileSync(REVIEWS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to read primary reviews.json:", e);
  }

  try {
    if (fs.existsSync(TMP_REVIEWS_FILE)) {
      const data = fs.readFileSync(TMP_REVIEWS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to read tmp reviews.json:", e);
  }

  return memoryReviews;
}

function saveReviewsToDisk(reviews: any[]) {
  memoryReviews = [...reviews];

  try {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write primary reviews.json:", e);
  }

  try {
    fs.writeFileSync(TMP_REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write tmp reviews.json:", e);
  }
}

// Initial load into memory
memoryReviews = loadReviewsFromDisk();

// Public endpoint to GET reviews or post a new review from any device
app.get("/api/reviews", (req, res) => {
  res.json({ success: true, reviews: memoryReviews });
});

app.post("/api/reviews", (req, res) => {
  try {
    const { rating, text, date } = req.body;
    if (!rating) {
      return res.status(400).json({ error: "Note obligatoire" });
    }

    const current = loadReviewsFromDisk();
    const newReview = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      rating: Number(rating),
      text: text || "",
      date: date || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    current.unshift(newReview);
    saveReviewsToDisk(current);

    console.log("New review saved! Total reviews count:", current.length);
    res.json({ success: true, review: newReview, totalReviews: current.length, reviews: current });
  } catch (error: any) {
    console.error("Error saving review:", error);
    res.status(500).json({ error: error.message || "Erreur serveur" });
  }
});

// Admin endpoint to fetch or clear reviews
app.get("/api/admin/reviews", (req, res) => {
  const code = req.query.code;
  if (code !== ADMIN_CODE) {
    return res.status(401).json({ error: "Code secret administrateur incorrect" });
  }
  const reviews = loadReviewsFromDisk();
  res.json({ success: true, reviews });
});

app.post("/api/admin/reviews", (req, res) => {
  try {
    const { code, syncReviews } = req.body;
    if (code !== ADMIN_CODE) {
      return res.status(401).json({ error: "Code secret administrateur incorrect" });
    }

    let reviews = loadReviewsFromDisk();

    // If client provided local reviews to sync
    if (Array.isArray(syncReviews) && syncReviews.length > 0) {
      const existingIds = new Set(reviews.map((r: any) => r.id));
      for (const sr of syncReviews) {
        if (sr && sr.id && !existingIds.has(sr.id)) {
          reviews.unshift(sr);
          existingIds.add(sr.id);
        }
      }
      saveReviewsToDisk(reviews);
    }

    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erreur serveur" });
  }
});

// Delete a review
app.post("/api/admin/reviews/delete", (req, res) => {
  try {
    const { code, id } = req.body;
    if (code !== ADMIN_CODE) {
      return res.status(401).json({ error: "Code secret administrateur incorrect" });
    }

    let reviews = loadReviewsFromDisk();
    reviews = reviews.filter((r: any) => r.id !== id);
    saveReviewsToDisk(reviews);

    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erreur serveur" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
