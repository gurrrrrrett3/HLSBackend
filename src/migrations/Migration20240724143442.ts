import { Migration } from '@mikro-orm/migrations';

export class Migration20240724143442 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "leaderboard_entry" ("username" varchar(255) not null, "score" int not null, "hashed_ip" varchar(255) not null, constraint "leaderboard_entry_pkey" primary key ("username"));');
  }

}
