import app from 'flarum/admin/app';
import { override, extend } from 'flarum/common/extend';
import AdminNav from 'flarum/admin/components/AdminNav';
import ExtensionLinkButton from 'flarum/admin/components/ExtensionLinkButton';
import ExtensionsWidget from 'flarum/admin/components/ExtensionsWidget';
import LoadingModal from 'flarum/admin/components/LoadingModal';
import ItemList from 'flarum/common/utils/ItemList';
import Dropdown from 'flarum/common/components/Dropdown';
import Button from 'flarum/common/components/Button';
import Icon from 'flarum/common/components/Icon';
import saveSettings from 'flarum/admin/utils/saveSettings';
import getCategorizedExtensions from './utils/getCategorizedExtensions';
import getCategories from './utils/getCategories';
import getCategoryLabels from './utils/getCategoryLabels';
import getCategorizationOptions from './utils/getCategorizationOptions';
import type Mithril from 'mithril';

export { default as extend } from './extend';

app.initializers.add(
  'sycho-advanced-extension-categories',
  (app) => {
    const categorizationOptions = getCategorizationOptions();

    app.extensionCategories = getCategories();
    app.categorizedExtensions = getCategorizedExtensions();
    app.categoryLabels = getCategoryLabels();

    ExtensionsWidget.prototype.controlItems = function () {
      const items = new ItemList<Mithril.Children>();

      const selectedCategorization = app.data.settings['sycho-ace.selected-categorization'] ?? 'default';

      items.add(
        'categorization',
        <div className="ExtensionsWidget-control-item">
          <Dropdown buttonClassName="Button" label={app.translator.trans('sycho-ace.admin.category_selection.label')}>
            {Object.keys(categorizationOptions).map((key) => (
              <Button
                icon={selectedCategorization === key ? 'fas fa-check' : true}
                active={selectedCategorization === key}
                onclick={() => {
                  saveSettings({
                    'sycho-ace.selected-categorization': key,
                  }).then(() => window.location.reload());

                  app.modal.show(LoadingModal);
                }}
              >
                {categorizationOptions[key]}
              </Button>
            ))}
          </Dropdown>
        </div>
      );

      return items;
    };

    override(ExtensionsWidget.prototype, 'oninit', function () {
      this.categorizedExtensions = app.categorizedExtensions;
    });

    override(ExtensionsWidget.prototype, 'content', function (original) {
      return [
        <div className="ExtensionsWidget-list-heading">
          <h2 className="ExtensionsWidget-list-name">
            <span className="ExtensionsWidget-list-icon">
              <Icon name="fas fa-puzzle-piece" />
            </span>
            <span className="ExtensionsWidget-list-title">{app.translator.trans('sycho-ace.admin.extensions')}</span>
          </h2>
          <div className="ExtensionsWidget-list-controls">{this.controlItems().toArray()}</div>
        </div>,
        original(),
      ];
    });

    extend(ExtensionsWidget.prototype, 'extensionCategory', function (vnode, category) {
      if (
        vnode.children instanceof Array &&
        vnode.children[0] instanceof Object &&
        'children' in vnode.children[0] &&
        vnode.children[0].children instanceof Array &&
        vnode.children[0].children[0] instanceof Object &&
        'children' in vnode.children[0].children[0]
      ) {
        vnode.children[0].children[0].children = [app.categoryLabels[category]];
      }
    });

    override(AdminNav.prototype, 'extensionItems', function () {
      const items = new ItemList();

      Object.keys(app.categorizedExtensions).map((category) => {
        if (!this.query()) {
          items.add(
            `category-${category}`,
            <h4 className="ExtensionListTitle">{app.categoryLabels[category]}</h4>,
            app.extensionCategories[category]
          );
        }

        app.categorizedExtensions[category].map((extension) => {
          const query = this.query().toUpperCase();
          const title = extension.extra['flarum-extension'].title;

          if (!query || title.toUpperCase().includes(query) || extension.description?.toUpperCase().includes(query)) {
            items.add(
              `extension-${extension.id}`,
              <ExtensionLinkButton
                href={app.route('extension', { id: extension.id })}
                extensionId={extension.id}
                className="ExtensionNavButton"
                title={extension.description}
              >
                {title}
              </ExtensionLinkButton>,
              app.extensionCategories[category]
            );
          }
        });
      });

      return items;
    });
  },
  -999
);
