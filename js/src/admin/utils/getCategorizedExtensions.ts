import app from 'flarum/admin/app';
import baseGetCategorizedExtensions from 'flarum/admin/utils/getCategorizedExtensions';
import isExtensionEnabled from 'flarum/admin/utils/isExtensionEnabled';
import type { Extension } from 'flarum/admin/AdminApplication';

export default function getCategorizedExtensions() {
  switch (app.data.settings['sycho-ace.selected-categorization']) {
    case 'none':
      return getAlphabeticallyOrderedExtensions();

    case 'vendor':
      return getVendorCategorizedExtensions();

    case 'availability':
      return getAvailabilityCategorizedExtensions();

    default:
      return baseGetCategorizedExtensions();
  }
}

export function getVendorCategorizedExtensions() {
  let extensions: Record<string, Extension[]> = {};

  Object.keys(app.data.extensions).map((id) => {
    const vendor = id.split('-')[0];

    extensions[vendor] = extensions[vendor] || [];
    extensions[vendor].push(app.data.extensions[id]);
  });

  return extensions;
}

export function getAlphabeticallyOrderedExtensions() {
  let extensions: Record<string, Extension[]> = {};

  extensions.none = Object.values(app.data.extensions);

  return extensions;
}

export function getAvailabilityCategorizedExtensions() {
  let extensions: Record<string, Extension[]> = { enabled: [], disabled: [] };

  Object.keys(app.data.extensions).map((id) => {
    const category = isExtensionEnabled(id) ? 'enabled' : 'disabled';

    extensions[category].push(app.data.extensions[id]);
  });

  return extensions;
}
