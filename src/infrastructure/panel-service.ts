import { InputController } from '@/base/input/input-controller';
import { InventoryPanel } from '@/components/ui/panel/inventory-panel';
import { SpellPanel } from '@/components/ui/panel/spell-panel';
import { UI } from '@/constants/asset-keys';
import { ServiceKeys, ServiceLocator } from './service-locator';

type Panels = {
  spell: SpellPanel;
  inventory: InventoryPanel;
};

const PANEL_LAYOUT = [
  { type: 'spell', key: UI.INVENTORY_SLOT, size: 4 },
  { type: 'inventory', key: UI.INVENTORY_SLOT, size: 4 },
];

export class PanelService {
  private readonly slots = [
    'slot-1',
    'slot-2',
    'slot-3',
    'slot-4',
    'slot-5',
    'slot-6',
    'slot-7',
    'slot-8',
  ];

  private panels: Panels;

  constructor(scene: Phaser.Scene) {
    let offset = 0;

    const createdPanels: Partial<Panels> = {};

    for (const panelDef of PANEL_LAYOUT) {
      const slotKeys = this.slots.slice(offset, offset + panelDef.size);

      const config = {
        scene: scene,
        slotOffSet: offset,
        cell: {
          slotKeys: slotKeys,
          imageKey: panelDef.key,
        },
      };

      switch (panelDef.type) {
        case 'spell':
          createdPanels.spell = new SpellPanel(config);
          break;

        case 'inventory':
          createdPanels.inventory = new InventoryPanel(config);
          break;
      }

      offset += panelDef.size;
    }

    if (!createdPanels.spell || !createdPanels.inventory) {
      throw new Error('PanelService: failed to initialize all panels');
    }

    this.panels = {
      spell: createdPanels.spell,
      inventory: createdPanels.inventory,
    };
  }

  public get spellBar(): SpellPanel {
    return this.panels.spell;
  }

  public get inventoryBar(): InventoryPanel {
    return this.panels.inventory;
  }

  public update(input: InputController): void {
    if (ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer().getDead()) return;

    this.panels.spell.update(input);
    this.panels.inventory.update(input);
  }
}
