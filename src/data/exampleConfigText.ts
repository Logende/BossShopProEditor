export default `ShopName: shop
signs:
  text: '[shop]'
  NeedPermissionToCreateSign: true
DisplayName: '&9&l&nExample Shop'
shop:
  1:
    RewardType: item
    PriceType: money
    Price: 15
    Reward:
    - type:STONE
    - amount:1
    MenuItem:
    - '%rewarditem_1%'
    - lore:#&eClick to buy for &e$%price%
    Message: '&aYou''ve purchased &e%reward%&a for &e$%price%'
    InventoryLocation: 1
    ExtraPermission: ''
  2:
    RewardType: item
    PriceType: money
    Price: 15
    Reward:
    - type:STONE:1
    - amount:1
    MenuItem:
    - '%rewarditem_1%'
    - lore:#&eClick to buy for &e$%price%
    Message: '&aYou''ve purchased &e%reward%&a for &e$%price%'
    InventoryLocation: 2
    ExtraPermission: ''`;