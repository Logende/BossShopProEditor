export default `- name: Type
key: type
content:
- displayname: Material name
  type: material
  default: STONE
definition: type:<type>
infotext: This defines the material of the item. You can for example use 'type:1' or 'type:stone' in order to make your item stone.
- name: Amount
key: amount
content:
- displayname: Item amount
  type: integer
  default: '1'
definition: amount:<number>
infotext: The amount of items to receive
- name: Durability
key: durability
content:
- displayname: Durability/Damage
  type: integer
  default: '5'
definition: durability:<number>
infotext: Durability does different things. For example it defines the damage of Armor/Weapons/Tools and it defines the color of wool.
- name: Name
key: name
content:
- displayname: Displayname
  type: string
  default: EpicPotato
definition: name:<name>
infotext: The displayed name of the item.
- name: Lore
key: lore
content:
- displayname: Lore
  type: list_string
  default: Line1#Line2 blabla#Line3
definition: lore:<line1#line2#line3>
infotext: This is the lore of the item. You can use color codes like &4 (=DARK_RED) or &l (= BOLD). You can 'switch' to the next line using '#'.
- name: Enchantment
key: enchantment
content:
- displayname: Enchantment Name
  type: enchantment
  default: DAMAGE_ALL
- displayname: Level
  type: integer
  default: '3'
definition: enchantment:<enchantment name>#<level>
infotext: 'Use this attribute to enchant your item. Example: ''enchantment:damage_all#5'' <- This would add Sharpness V to your item.'
- name: Color
key: color
content:
- displayname: R
  type: integer
  default: '64'
- displayname: G
  type: integer
  default: '128'
- displayname: B
  type: integer
  default: '255'
definition: color:<red number>#<green number>#<blue number>
infotext: Use this attribute to dye your item (works with leather armor).
- name: Potion
key: potion
content:
- displayname: Potion name
  type: potion
  default: MUNDANE
- displayname: Extended
  type: boolean
  default: 'true'
- displayname: Upgraded
  type: boolean
  default: 'false'
definition: potion:<potion name>#<extended? true/false>#<upgraded? <true/false>
infotext: This allows you to add vanilla potion effects to items. Can only be used on items which support potioneffects!
- name: Potioneffect
key: potioneffect
content:
- displayname: Potioneffect name
  type: potioneffect
  default: STRENGTH
- displayname: Level
  type: integer
  default: '1'
- displayname: Duration in seconds
  type: integer
  default: '600'
definition: potioneffect:<potion name>#<level>#<time in seconds>
infotext: This allows you to add custom potion effects to items. Can only be used on items which support potioneffects!
- name: Playerhead
key: playerhead
content:
- displayname: Player name
  type: string
  default: Herobrine
definition: playerhead:<name>
infotext: 'This allows you to set the name of skulls. IMPORTANT: You can only use this attribute on skulls (''type:PLAYER_HEAD'').'
- name: Custom Skull
key: customskull
content:
- displayname: Texture/mojang skin url
  type: string
  default: URL
definition: customskull:<texture/mojang skin url>
infotext: This allows you to give skulls custom and fix textures which do not change when a player changes his skin.
- name: Mob Spawner
key: mobspawner
content:
- displayname: Mob name
  type: string
  default: BLAZE
definition: mobspawner:<mob name>
infotext: Allows you to make your item a working mobpawner with a pre-set mobtype. Requires the plugin SilkSpawners or EpicSpawners. If you use EpicSpawners use the spawner identifier (defined in your EpicSpawners/spawners.yml file) instead of the Spigot mob name.
- name: Monster Egg
key: monsteregg
content:
- displayname: Mob name
  type: string
  default: BLAZE
definition: monsteregg:<mob name>
infotext: Allows making items a working monsteregg with a pre-set mobtype. Requires the plugin SilkSpawners.
- name: Hide Flags
key: hideflags
content:
- displayname: Flags
  type: string
  default: HIDE_ATTRIBUTES#HIDE_ENCHANTS
definition: hideflags:<flag1#flag2#flag3>
infotext: Fast way to hide flags.
- name: Book
key: book
content:
- displayname: Title
  type: string
  default: My awesome Book
- displayname: Author
  type: string
  default: Unknown Player
definition: book:<title>#<author>
infotext: Adds title and author name to a written book. Supports color codes and symbols.
- name: Book Page
key: bookpage
content:
- displayname: Page
  type: integer
  default: '1'
- displayname: Text
  type: string
  default: This is some text.
definition: bookpage:<page>#<text>
infotext: Adds text to the given book page. Can be used multiple times per page in order to force a new line.`;
