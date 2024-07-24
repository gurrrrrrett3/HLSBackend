import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class LeaderboardEntry {

    @PrimaryKey()
    username: string

    @Property()
    score: number

    @Property()
    hashedIp: string

    constructor(username: string, score: number, hashedIp: string) {
        this.username = username
        this.score = score
        this.hashedIp = hashedIp
    }
}
