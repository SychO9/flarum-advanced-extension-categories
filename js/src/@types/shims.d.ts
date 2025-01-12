import 'flarum/admin/AdminApplication';
import type ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import type { Extension } from 'flarum/admin/AdminApplication';

declare module 'flarum/admin/AdminApplication' {
  export default interface AdminApplication {
    categorizedExtensions: Record<string, Extension[]>;
    categoryLabels: Record<string, any>;
    extensionCategories: Record<string, number>;
  }
}

declare module 'flarum/admin/components/ExtensionsWidget' {
  export default interface ExtensionsWidget {
    controlItems(): ItemList<Mithril.Children>;
  }
}
