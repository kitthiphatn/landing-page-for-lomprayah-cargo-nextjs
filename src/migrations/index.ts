import * as migration_20261014_025617_initial from './20261014_025617_initial';
import * as migration_20261014_031048_popup from './20261014_031048_popup';
import * as migration_20261014_031554_popup_mobile_image from './20261014_031554_popup_mobile_image';
import * as migration_20261014_055140_admin_content from './20261014_055140_admin_content';

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
    name: '20261014_055140_admin_content'
  },
];
