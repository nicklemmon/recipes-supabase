import * as React from 'react'
import { Tooltip } from '@base-ui-components/react/tooltip'
import { Drawer } from 'vaul'
import { NavTooltipBody } from './nav-tooltip'

export function DrawerWithTooltip() {
  return (
    <Tooltip.Provider>
      <Drawer.Root>
        <Tooltip.Root>
          <Tooltip.Trigger render={<Drawer.Trigger>Open me</Drawer.Trigger>} />
          <NavTooltipBody>Hello, world</NavTooltipBody>
        </Tooltip.Root>

        {/* the drawer’s panel */}
        <Drawer.Portal>
          <Drawer.Content className="bg-gray-100 fixed bottom-0 left-0 right-0 outline-none">
            <Drawer.Title>Settings</Drawer.Title>
            {/* … */}
          </Drawer.Content>

          <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-lg" />
        </Drawer.Portal>
      </Drawer.Root>
    </Tooltip.Provider>
  )
}
