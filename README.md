# BossShopProEditor

Link to the running BossShopProEditor website: https://logende.github.io/BossShopProEditor/

## Store

The Vuex store is used as a single source of truth. Its state is defined as follows:
```javascript
{
    config: {} // Configuration object
    selectedPath: ["shop", "1", "MenuItem", 0] // Currently selected path
}
```

Additionally, the store provides getters, which are like computed properties:
- `pathString`: The currently selected path in a lodash-compatible string form (`"shop.1.MenuItem[0]"`)
- `selectedType`: The type for the currently selected path

To change the state, the following mutations have been implemented:
- `applyConfig({ path: Array<string|number>, newValue: any })`: Call this mutation to change the config object. If path is an empty array, the entire config object is replaced with `newValue`. Otherwise, only the value at `path` will be changed.
- `setSelectedPath(path: Array<string|number>)`: This mutation allows to set the selected path.
