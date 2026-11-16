import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`shipping_terms_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`shipping_terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`shipping_terms_items_order_idx\` ON \`shipping_terms_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`shipping_terms_items_parent_id_idx\` ON \`shipping_terms_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`shipping_terms_items_locale_idx\` ON \`shipping_terms_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`shipping_terms\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`form_code\` text DEFAULT 'FM-BPC-03 แก้ไขครั้งที่ 001',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`shipping_terms_locales\` (
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`shipping_terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`shipping_terms_locales_locale_parent_id_unique\` ON \`shipping_terms_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`shipping_terms_items\`;`)
  await db.run(sql`DROP TABLE \`shipping_terms\`;`)
  await db.run(sql`DROP TABLE \`shipping_terms_locales\`;`)
}
