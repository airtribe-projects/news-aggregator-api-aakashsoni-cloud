const express = require("express");
const router = express.Router();
const {
  getAllNews,
  updateArticleAsRead,
  updateArticleAsFavorite,
  getReadArticles,
  getFavoriteArticles,
  searchNews,
} = require("../controllers/newsController");
const { verifyToken } = require("../middlewares/auth");

// GET /news
router.get("/", verifyToken, getAllNews);

// PUT /news/:id/read
router.put("/:id/read", verifyToken, updateArticleAsRead);

// PUT /news/:id/favorite
router.put("/:id/favorite", verifyToken, updateArticleAsFavorite);

// GET /news/read
router.get("/read", verifyToken, getReadArticles);

// GET /news/favorite
router.get("/favorite", verifyToken, getFavoriteArticles);

// GET /news/search/keyword
router.get("/search/:keyword", verifyToken, searchNews);

module.exports = router;
