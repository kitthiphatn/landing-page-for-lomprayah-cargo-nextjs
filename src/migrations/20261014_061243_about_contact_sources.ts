import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`about_page_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_stats_order_idx\` ON \`about_page_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_stats_parent_id_idx\` ON \`about_page_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_stats_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`about_page_stats_locales_locale_parent_id_unique\` ON \`about_page_stats_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`seo_image_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_image_idx\` ON \`about_page\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`about_page_seo_seo_image_idx\` ON \`about_page\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_locales\` (
  	\`title\` text,
  	\`intro\` text,
  	\`content\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`about_page_locales_locale_parent_id_unique\` ON \`about_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`posts_locales\` ADD \`source_url\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v_locales\` ADD \`version_source_url\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`contact_whatsapp_url\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`contact_instagram_url\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`contact_tiktok_url\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`contact_youtube_url\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` ADD \`contact_hours\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` ADD \`contact_address\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`about_page_stats\`;`)
  await db.run(sql`DROP TABLE \`about_page_stats_locales\`;`)
  await db.run(sql`DROP TABLE \`about_page\`;`)
  await db.run(sql`DROP TABLE \`about_page_locales\`;`)
  await db.run(sql`ALTER TABLE \`posts_locales\` DROP COLUMN \`source_url\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v_locales\` DROP COLUMN \`version_source_url\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`contact_whatsapp_url\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`contact_instagram_url\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`contact_tiktok_url\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`contact_youtube_url\`;`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` DROP COLUMN \`contact_hours\`;`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` DROP COLUMN \`contact_address\`;`)
}
