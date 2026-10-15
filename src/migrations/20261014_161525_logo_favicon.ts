import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`logo_dark_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`favicon_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`site_settings_logo_dark_idx\` ON \`site_settings\` (\`logo_dark_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_favicon_idx\` ON \`site_settings\` (\`favicon_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`logo_id\` integer,
  	\`primary_color\` text DEFAULT 'navy',
  	\`contact_phone\` text,
  	\`contact_line_id\` text,
  	\`contact_line_url\` text,
  	\`contact_email\` text,
  	\`contact_whatsapp_url\` text,
  	\`contact_facebook_url\` text,
  	\`contact_instagram_url\` text,
  	\`contact_tiktok_url\` text,
  	\`contact_youtube_url\` text,
  	\`hero_background_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_background_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings\`("id", "logo_id", "primary_color", "contact_phone", "contact_line_id", "contact_line_url", "contact_email", "contact_whatsapp_url", "contact_facebook_url", "contact_instagram_url", "contact_tiktok_url", "contact_youtube_url", "hero_background_id", "updated_at", "created_at") SELECT "id", "logo_id", "primary_color", "contact_phone", "contact_line_id", "contact_line_url", "contact_email", "contact_whatsapp_url", "contact_facebook_url", "contact_instagram_url", "contact_tiktok_url", "contact_youtube_url", "hero_background_id", "updated_at", "created_at" FROM \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings\` RENAME TO \`site_settings\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`site_settings_logo_idx\` ON \`site_settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_hero_hero_background_idx\` ON \`site_settings\` (\`hero_background_id\`);`)
}
