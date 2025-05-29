const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publishedAt: {
      type: Date,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);

module.exports = News;
