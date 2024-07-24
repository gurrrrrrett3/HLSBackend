import { Router } from 'express';
import LeaderboardManager from '../leaderboard/leaderboardManager.js';
import CryptoUtils from '../utils/crypto.js';
import { Logger } from '../utils/logger.js';
import { LeaderboardEntry } from '../database/entities/leaderboardEntry.entity.js';

const indexRouter = Router();
const logger = new Logger('Webserver');

indexRouter.get('/leaderboard', (req, res) => {
    logger.info('GET /leaderboard');
    res.json(LeaderboardManager.getLeaderboard());
});

indexRouter.post('/leaderboard', async (req, res) => {
    if (!req.body.username || !req.body.score) {
        logger.error('POST /leaderboard', 'Missing username or score');
        return res.status(400).json({ error: 'Missing username or score' });
    }

    logger.info('POST /leaderboard', `Adding entry for ${req.body.username}`);

    await LeaderboardManager.addEntry(new LeaderboardEntry(
        req.body.username,
        req.body.score,
        CryptoUtils.hashString((req.headers['x-forwarded-for'] as string) || (req.headers['x-real-ip'] as string) || req.ip || 'unknown')
    ));

    logger.info('POST /leaderboard', `Added entry for ${req.body.username}`);
    res.json({ success: true });
});

export default indexRouter;
