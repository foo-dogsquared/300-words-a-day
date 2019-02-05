const APP_NAME = `_300wads`

// database instance names
const APP_DB_NAME = `${APP_NAME}_db`
const APP_SETTINGS_INSTANCE_NAME = `${APP_NAME}_settings`;
const APP_NOTES_LOCATION_STRING = `${APP_NAME}_notes`;

// autosave settings
const APP_AUTOSAVE_SETTING = `${APP_NAME}_autosync_interval`;
const APP_AUTOSAVE_INTERVAL_DEFAULT_VALUE = 60000; // 60 seconds
const APP_NOTE_DAY_STREAK = `${APP_NAME}_day_streak`;

// markdown flavor settings
const APP_MARKDOWN_FLAVOR_SETTING = `${APP_NAME}_markdown_flavor`;

// unified notes object name (not editable since it will be stored on IndexedDB)
const APP_NOTES_INDEX = 0;

// general error messages
const GET_SELECTION_NOT_SUPPORTED = `Document selection is not supported (for some reason).`;
const LOCALFORAGE_ERROR = `The library 'localforage' has encountered an error. Please try again.`;
