const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
// ✅ Enable CORS
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.get("/video", async (req, res) => {
    try {
        const pageUrl = req.query.url;

        if (!pageUrl) {
            return res.status(400).json({ error: "URL is required" });
        }

        // Fetch page HTML
        const { data } = await axios.get(pageUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        // Load HTML
        const $ = cheerio.load(data);

        // Find video src
        const videoSrc = $("video#my-video").attr("src") || $("video").attr("src");

        if (!videoSrc) {
            return res.status(404).json({ error: "Video not found" });
        }

        res.json({
            success: true,
            video_url: videoSrc
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch video",
            message: error.message
        });
    }
});
app.get("/test", (req, res) => {
    res.send("Test route working");
});
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running...");
});