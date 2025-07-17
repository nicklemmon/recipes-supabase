import { Tooltip } from '@base-ui-components/react/tooltip'
import { useNavigate } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { Drawer } from 'vaul'
import { Button } from './button'
import { Container } from './container'
import { FormControl } from './form-control'
import { FormInput } from './form-input'
import { FormLabel } from './form-label'
import { Inline } from './inline'
import { NavButton } from './nav-actions'
import { NAV_ICON_SIZE } from './nav-actions'
import { NavTooltipBody } from './nav-tooltip'
import { SrOnly } from './sr-only'
import { Stack } from './stack'

export function NavSearch() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const { s } = Object.fromEntries(formData)

    console.log('s')

    navigate({
      search: { s },
      to: '/recipes/list',
    })

    setOpen(false)
  }

  const handleAnimEnd = () => {
    inputRef.current?.focus()
  }

  return (
    <Drawer.Root onAnimationEnd={handleAnimEnd} onOpenChange={setOpen} open={open}>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <Drawer.Trigger asChild>
              <NavButton>
                <SearchIcon size={NAV_ICON_SIZE} />
                <SrOnly>Search</SrOnly>
              </NavButton>
            </Drawer.Trigger>
          }
        />
        <NavTooltipBody>Search</NavTooltipBody>
      </Tooltip.Root>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-lg" />

        <Drawer.Content className="bg-gray-100 fixed bottom-0 left-0 right-0 outline-none">
          <div className="h-[85vh] md:h-[50vh] py-8 bg-white">
            <Container>
              <form onSubmit={handleSubmit}>
                <Stack>
                  <Drawer.Title asChild>
                    <h3 className="font-bold text-slate-800 text-xl">Search for recipes</h3>
                  </Drawer.Title>

                  <FormControl className="max-w-140">
                    <FormLabel htmlFor="header-search-input">Search by title</FormLabel>

                    <FormInput
                      autoComplete="off"
                      id="header-search-input"
                      name="s"
                      ref={inputRef}
                      required
                      type="text"
                    />
                  </FormControl>

                  <Inline spacing="sm">
                    <Button type="submit">Search</Button>

                    <Drawer.Close asChild>
                      <Button variant="secondary">Cancel</Button>
                    </Drawer.Close>
                  </Inline>
                </Stack>
              </form>
            </Container>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
