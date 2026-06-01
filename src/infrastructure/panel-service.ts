import { InputController } from '@/base/input/input-controller';
import { InventoryPanel } from '@/components/ui/panel/inventory-panel';
import { SpellPanel } from '@/components/ui/panel/spell-panel';
import { ControlPanel } from '@/components/ui/panel/control-panel';
import { UI } from '@/constants/asset-keys';
import { ServiceKeys, ServiceLocator } from './service-locator';

type Panels = {
  spell: SpellPanel;
  inventory: InventoryPanel;
  control: ControlPanel;
};

const PANEL_LAYOUT = [
  { type: 'spell', key: UI.INVENTORY_SLOT, size: 4 },
  { type: 'inventory', key: UI.INVENTORY_SLOT, size: 4 },
  { type: 'control', key: UI.INVENTORY_SLOT, size: 3 },
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
    'slot-9',
    'slot-10',
    'slot-11',
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

        case 'control':
          createdPanels.control = new ControlPanel(config);
          break;
      }

      offset += panelDef.size;
    }

    if (!createdPanels.spell || !createdPanels.inventory || !createdPanels.control) {
      throw new Error('PanelService: failed to initialize all panels');
    }

    this.panels = {
      spell: createdPanels.spell,
      inventory: createdPanels.inventory,
      control: createdPanels.control,
    };
  }

  public get spellBar(): SpellPanel {
    return this.panels.spell;
  }

  public get inventoryBar(): InventoryPanel {
    return this.panels.inventory;
  }

  public get controlBar(): ControlPanel {
    return this.panels.control;
  }

  public update(input: InputController): void {
    if (ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer().getDead()) return;

    this.panels.spell.update(input);
    this.panels.inventory.update(input);
  }
}
