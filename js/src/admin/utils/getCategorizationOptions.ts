import app from 'flarum/admin/app';

export default function getCategorizationOptions(): Record<string, any> {
  return {
    default: app.translator.trans('sycho-ace.admin.category_selection.options.default', {}, true),
    vendor: app.translator.trans('sycho-ace.admin.category_selection.options.vendor', {}, true),
    availability: app.translator.trans('sycho-ace.admin.category_selection.options.availability', {}, true),
    none: app.translator.trans('sycho-ace.admin.category_selection.options.none', {}, true),
  };
}
