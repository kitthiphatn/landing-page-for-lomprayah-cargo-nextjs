import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_settings_seasonal_themes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`starts_at\` text NOT NULL,
  	\`ends_at\` text NOT NULL,
  	\`primary\` text NOT NULL,
  	\`secondary\` text NOT NULL,
  	\`accent\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_seasonal_themes_order_idx\` ON \`site_settings_seasonal_themes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_seasonal_themes_parent_id_idx\` ON \`site_settings_seasonal_themes\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`custom_colors_primary\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`custom_colors_secondary\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`custom_colors_accent\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_settings_seasonal_themes\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`custom_colors_primary\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`custom_colors_secondary\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`custom_colors_accent\`;`)
}
