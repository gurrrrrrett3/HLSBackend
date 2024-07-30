import { db } from "../index.js"
import { LeaderboardEntry } from "../database/entities/leaderboardEntry.entity.js"

export default class LeaderboardManager {

    private static cache: Omit<LeaderboardEntry, 'hashedIp'>[] = []

    public static getLeaderboard(): Omit<LeaderboardEntry, 'hashedIp'>[] {
        return this.cache
    }

    public static async addEntry(entry: LeaderboardEntry): Promise<void> {
        this.cache.push(entry)
        this.cache.sort((a, b) => b.score - a.score)

        const leaderboardRepo = db.em.getRepository(LeaderboardEntry)
        const currentEntry = await leaderboardRepo.findOne({ username: entry.username })

        if (currentEntry && currentEntry.score < entry.score) {
            currentEntry.score = entry.score
            await db.em.persistAndFlush(currentEntry)
        } else {
            await db.em.persistAndFlush(entry)
        }

        await this.updateCache()
    }

    private static async updateCache(): Promise<void> {
        const leaderboardRepo = db.em.getRepository(LeaderboardEntry)
        this.cache = await leaderboardRepo.find({}, {
            orderBy: { score: "DESC" },
            limit: 100,
            fields: ['username', 'score']
        })
        this.cache.sort((a, b) => b.score - a.score)
    }

    public static async init(): Promise<void> {
        await this.updateCache()
    }
}