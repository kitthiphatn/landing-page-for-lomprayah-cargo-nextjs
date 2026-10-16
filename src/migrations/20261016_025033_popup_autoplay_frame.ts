import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`popup\` ADD \`framed\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`popup\` ADD \`autoplay\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`popup\` ADD \`autoplay_seconds\` numeric DEFAULT 5;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`popup\` DROP COLUMN \`framed\`;`)
  await db.run(sql`ALTER TABLE \`popup\` DROP COLUMN \`autoplay\`;`)
  await db.run(sql`ALTER TABLE \`popup\` DROP COLUMN \`autoplay_seconds\`;`)
}
