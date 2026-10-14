import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`popup_slides_locales\` ADD \`mobile_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`popup_slides_mobile_image_idx\` ON \`popup_slides_locales\` (\`mobile_image_id\`,\`_locale\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_popup_slides_locales\` (
  	\`image_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`popup_slides\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_popup_slides_locales\`("image_id", "id", "_locale", "_parent_id") SELECT "image_id", "id", "_locale", "_parent_id" FROM \`popup_slides_locales\`;`)
  await db.run(sql`DROP TABLE \`popup_slides_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_popup_slides_locales\` RENAME TO \`popup_slides_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`popup_slides_image_idx\` ON \`popup_slides_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`popup_slides_locales_locale_parent_id_unique\` ON \`popup_slides_locales\` (\`_locale\`,\`_parent_id\`);`)
}
