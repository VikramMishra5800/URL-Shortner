const mongoose = require("mongoose");
const shortId = require("shortid");

const shortUrlSchema = new mongoose.Schema(
    {
        shortId: {
          type: String,
          required: true,
          unique: true,
        },
        redirectURL: {
          type: String,
          required: true,
        },
        visitHistory: [{ timestamp: { type: Number } }],
      },
      { timestamps: true }
)
//collection 
module.exports = mongoose.model("shortUrl",shortUrlSchema);
