import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import getCategorizationOptions from './utils/getCategorizationOptions';

export default [
  new Extend.Admin().setting(() => ({
    setting: 'sycho-ace.selected-categorization',
    label: app.translator.trans('sycho-ace.admin.category_selection.label'),
    type: 'select',
    options: getCategorizationOptions(),
    default: 'default',
    refreshAfterSaving: true,
  })),
];
