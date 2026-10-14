import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`popup_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`popup\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`popup_slides_order_idx\` ON \`popup_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`popup_slides_parent_id_idx\` ON \`popup_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`popup_slides_locales\` (
  	\`image_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`popup_slides\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`popup_slides_image_idx\` ON \`popup_slides_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`popup_slides_locales_locale_parent_id_unique\` ON \`popup_slides_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`popup\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`enabled\` integer DEFAULT false,
  	\`frequency\` text DEFAULT 'day',
  	\`starts_at\` text,
  	\`ends_at\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`popup_slides\`;`)
  await db.run(sql`DROP TABLE \`popup_slides_locales\`;`)
  await db.run(sql`DROP TABLE \`popup\`;`)
}
