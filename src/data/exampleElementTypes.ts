export default `# Existing ElementTypes:
# none, string, boolean, double, integer, list_string, item, material, potioneffect, enchantment, list_item, rewardtype, pricetype
shop:
  type: complex
  properties:
    ShopName:
      type: existing:string
    DisplayName:
      type: existing:string
    Command:
      type: existing:string
    'signs.text':
      type: existing:string
    'signs.NeedsPermissionToCreateSign':
      type: existing:boolean
    shopitemlist:
      configKey: shop
      type: complexlist
      elements:
        shopitem:
          type: complex
          deleteable: true
          renameable: true
          properties:
            MenuItem:
              type: existing:item
            RewardType: 
              type: existing:rewardtype
            Reward:
              type: dependent
              dependency: RewardType
              map:
                bungeecordcommand: list_string
                bungeecordserver: string
                close: none
                command: list_string
                custom: none
                enchantment: string
                exp: integer
                item: list_item
                itemall: item
                money: double
                nothing: none
                permission: list_string
                playercommand: list_string
                playercommandop: list_string
                points: double
                shop: string
                shoppage: string
            PriceType: 
              type: existing:pricetype
            Price:
              type: dependent
              dependency: PriceType
              map:
                money: double
                exp: integer
                item: list_item
                itemall: item
                money: double
                nothing: none
                points: double
            Message:
              type: existing:string
            InventoryLocation:
              type: existing:integer
            ExtraPermission:
              type: existing:string
              optional: true`