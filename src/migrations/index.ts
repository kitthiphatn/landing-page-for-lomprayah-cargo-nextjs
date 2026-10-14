import * as migration_20261014_025617_initial from './20261014_025617_initial';
import * as migration_20261014_031048_popup from './20261014_031048_popup';

export const migrations = [
  {
    up: migration_20261014_025617_initial.up,
    down: migration_20261014_025617_initial.down,
    name: '20261014_025617_initial',
  },
  {
    up: migration_20261014_031048_popup.up,
    down: migration_20261014_031048_popup.down,
    name: '20261014_031048_popup'
  },
];
