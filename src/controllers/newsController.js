const axios = require("axios");
const mongoose = require("mongoose");
const newsModel = require("../models/newsModel");

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_ENDPOINT = process.env.NEWS_API_ENDPOINT;

const cache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getAllNews = async (req, res) => {
  const preferences = req.user.preferences.filter((p) => p.length > 0);

  if (preferences.length === 0) {
    return res.status(400).json({ message: "Invalid preferences" });
  }

  const categoryQuery = preferences.join(" AND ");
  const cacheKey = categoryQuery.toLowerCase();

  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
    return res.status(200).json({ news: cache[cacheKey].data });
  }

  try {
    const url = `${NEWS_API_ENDPOINT}/top-headlines?category=${encodeURIComponent(
      categoryQuery
    )}&lang=en&country=in&max=10&apikey=${NEWS_API_KEY}`;

    const response = await axios.get(url);
    const articles = response.data.articles;

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: "No news found" });
    }

    const news = articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      author: article.source.name,
    }));

    // Filter out duplicates by checking if URL exists in DB
    const existingUrls = await newsModel
      .find({ url: { $in: news.map((n) => n.url) } })
      .select("url");
    const existingUrlSet = new Set(existingUrls.map((e) => e.url));
    const uniqueNews = news.filter((n) => !existingUrlSet.has(n.url));

    // Save only unique news
    const createdArticles = await newsModel.insertMany(uniqueNews);

    cache[cacheKey] = { data: articles, timestamp: Date.now() };

    res.status(200).json({ news: createdArticles });
  } catch (error) {
    console.error("Axios error:", error.response?.data || error.message);
    res.status(500).json({ message: "Invalid API Request" });
  }
};

const updateArticleAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await newsModel.findOneAndUpdate(
      { _id: id },
      { $set: { read: true } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article marked as read successfully" });
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    res.status(500).json({ message: "Invalid API Request" });
  }
};

const updateArticleAsFavorite = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await newsModel.findOneAndUpdate(
      { _id: id },
      { $set: { favorite: true } },
      { new: true }
    );
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res
      .status(200)
      .json({ message: "Article marked as favorite successfully" });
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    res.status(500).json({ message: "Invalid API Request" });
  }
};

const getReadArticles = async (req, res) => {
  try {
    const allReadArticles = await newsModel.find({ read: true });
    if (!allReadArticles) {
      return res.status(404).json({ message: "No read articles found" });
    }
    res.status(200).json({ news: allReadArticles });
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    res.status(500).json({ message: "Invalid API Request" });
  }
};

const getFavoriteArticles = async (req, res) => {
  try {
    const allFavoriteArticles = await newsModel.find({ favorite: true });
    if (!allFavoriteArticles) {
      return res.status(404).json({ message: "No favorite articles found" });
    }
    res.status(200).json({ news: allFavoriteArticles });
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    res.status(500).json({ message: "Invalid API Request" });
  }
};

const searchNews = async (req, res) => {
  const { keyword } = req.params;
  if (!keyword) {
    return res.status(400).json({ message: "Search keyword is required." });
  }

  try {
    const url = `${NEWS_API_ENDPOINT}/search?q=${encodeURIComponent(
      keyword
    )}&lang=en&country=in&apikey=${NEWS_API_KEY}`;

    const response = await axios.get(url);
    const articles = response.data.articles;

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: "No matching articles found" });
    }
    res.status(200).json({ news: articles });
  } catch (error) {
    console.error("Axios error:", error.response?.data || error.message);
    res.status(500).json({ message: "Invalid API Request" });
  }
};

module.exports = {
  getAllNews,
  updateArticleAsRead,
  updateArticleAsFavorite,
  getReadArticles,
  getFavoriteArticles,
  searchNews,
};
