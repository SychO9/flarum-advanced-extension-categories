import app from 'flarum/admin/app';
import getCategories from './getCategories';

export default function getCategoryLabels() {
  let labels: Record<string, string> = {};
  const categories = getCategories();

  Object.keys(categories).map((category) => {
    switch (app.data.settings['sycho-ace.selected-categorization']) {
      case 'default':
        labels[category] = app.translator.trans(`core.admin.nav.categories.${category}`, {}, true);
        break;

      case 'vendor':
        labels[category] = category;
        break;

      default:
        labels[category] = app.translator.trans(`sycho-ace.admin.categories.${category}`, {}, true);
    }
  });

  return labels;
}
