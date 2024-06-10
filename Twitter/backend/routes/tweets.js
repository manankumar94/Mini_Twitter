// routes/tweets.js
const express = require('express');
const auth = require('../middleware/auth');
const Tweet = require('../models/Tweet');
const User = require('../models/User');

const router = express.Router();

// Create Tweet
router.post('/tw', auth, async (req, res) => {
  try {
    const newTweet = new Tweet({
      content: req.body.content,
      author: req.user.id,
    });

    const tweet = await newTweet.save();
    res.json(tweet);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Edit Tweet
router.put('/:id', auth, async (req, res) => {
  try {
    let tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ msg: 'Tweet not found' });
    }

    if (tweet.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    tweet = await Tweet.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    );

    res.json(tweet);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete Tweet
router.delete('/:id', auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ msg: 'Tweet not found' });
    }

    if (tweet.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await tweet.remove();
    res.json({ msg: 'Tweet removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get Timeline
router.get('/timeline', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('following');
    const tweets = await Tweet.find({ author: { $in: user.following } }).sort({ createdAt: -1 });

    res.json(tweets);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
