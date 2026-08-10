import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

const REVIEWS_FILE = path.join(process.cwd(), "reviews.json");

// Default passcode for Admin Space
const ADMIN_CODE = "2026";

function getReviews(): any[] {
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      const data = fs.readFileSync(REVIEWS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to read reviews.json:", e);
  }
  return [];
}

function saveReviews(reviews: any[]) {
  try {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write reviews.json:", e);
  }
}

// Submit a new review from any device
app.post("/api/reviews", (req, res) => {
  try {
    const { rating, text, date } = req.body;
    if (!rating) {
      return res.status(400).json({ error: "Note obligatoire" });
    }

    const reviews = getReviews();
    const newReview = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      rating: Number(rating),
      text: text || "",
      date: date || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    reviews.unshift(newReview);
    saveReviews(reviews);

    res.json({ success: true, review: newReview });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erreur serveur" });
  }
});

// Fetch reviews for admin
app.post("/api/admin/reviews", (req, res) => {
  try {
    const { code } = req.body;
    if (code !== ADMIN_CODE) {
      return res.status(401).json({ error: "Code secret administrateur incorrect" });
    }

    const reviews = getReviews();
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

    let reviews = getReviews();
    reviews = reviews.filter((r: any) => r.id !== id);
    saveReviews(reviews);

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
