import * as migration_20261014_025617_initial from './20261014_025617_initial';
import * as migration_20261014_031048_popup from './20261014_031048_popup';
import * as migration_20261014_031554_popup_mobile_image from './20261014_031554_popup_mobile_image';
import * as migration_20261014_055140_admin_content from './20261014_055140_admin_content';
import * as migration_20261014_061243_about_contact_sources from './20261014_061243_about_contact_sources';
import * as migration_20261014_161525_logo_favicon from './20261014_161525_logo_favicon';
import * as migration_20261016_025033_popup_autoplay_frame from './20261016_025033_popup_autoplay_frame';

export const migrations = [
  {
    up: migration_20261014_025617_initial.up,
    down: migration_20261014_025617_initial.down,
    name: '20261014_025617_initial',
  },
  {
    up: migration_20261014_031048_popup.up,
    down: migration_20261014_031048_popup.down,
    name: '20261014_031048_popup',
  },
  {
    up: migration_20261014_031554_popup_mobile_image.up,
    down: migration_20261014_031554_popup_mobile_image.down,
    name: '20261014_031554_popup_mobile_image',
  },
  {
    up: migration_20261014_055140_admin_content.up,
    down: migration_20261014_055140_admin_content.down,
    name: '20261014_055140_admin_content',
  },
  {
    up: migration_20261014_061243_about_contact_sources.up,
    down: migration_20261014_061243_about_contact_sources.down,
    name: '20261014_061243_about_contact_sources',
  },
  {
    up: migration_20261014_161525_logo_favicon.up,
    down: migration_20261014_161525_logo_favicon.down,
    name: '20261014_161525_logo_favicon',
  },
  {
    up: migration_20261016_025033_popup_autoplay_frame.up,
    down: migration_20261016_025033_popup_autoplay_frame.down,
    name: '20261016_025033_popup_autoplay_frame'
  },
];
