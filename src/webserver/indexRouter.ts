import { Router } from 'express';
import LeaderboardManager from '../leaderboard/leaderboardManager.js';
import { createHash } from 'crypto';
import CryptoUtils from '../utils/crypto.js';

const indexRouter = Router();

indexRouter.get('/leaderboard', (req, res) => {
    res.json(LeaderboardManager.getLeaderboard());
});

indexRouter.post('/leaderboard', async (req, res) => {
    if (!req.body.username || !req.body.score) {
        return res.status(400).json({ error: 'Missing username or score' });
    }

    await LeaderboardManager.addEntry({
        username: req.body.username,
        score: req.body.score,
        hashedIp: CryptoUtils.hashString((req.headers['x-forwarded-for'] as string) || (req.headers['x-real-ip'] as string) || req.ip || 'unknown')
    });

    res.json({ success: true });
});

export default indexRouter;
