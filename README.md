# BossShopProEditor

## Store

The Vuex store is used as a single source of truth. Its state is defined as follows:
```javascript
{
    config: {} // Configuration object
    selectedPath: "shop.shop[0]" // Currently selected path
    selectedType: null // IElementType or name of the type of the currently selected path?
}
```

Changes to this store are only allowed by a special event handler in the `App` component.

## Events
To reduce tight coupling as much as possible, the components communicate via events.
The events are being handled by an eventHandler in the `App` component.

### change-request
This event is emitted, when a value in the config has been changed by the user.

Payload:
```javascript
{
    path: "" //describes the path in the configEdit object on which the change was made
    newValue: "" //this can be any data type
}
```
### selected-path-changed
This event is emitted, when the user selects a different path in the config,
either by moving the cursor in the `ConfigEdit` component or by navigating in the `QuickEdit` component.

Payload: `string`, specifying the new path.
