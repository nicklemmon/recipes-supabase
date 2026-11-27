import { Drawer } from 'vaul'
import { Tooltip } from '@base-ui/react/tooltip'
import { SearchIcon } from 'lucide-react'
import { Button } from './button'
import { Stack } from './stack'
import { FormLabel } from './form-label'
import { FormControl } from './form-control'
import { FormInput } from './form-input'
import { Container } from './container'
import { SrOnly } from './sr-only'
import { Inline } from './inline'
import { NavButton } from './nav-actions'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useRef, useState } from 'react'
import { NavTooltipBody } from './nav-tooltip'
import { NAV_ICON_SIZE } from './nav-actions'
import { z } from 'zod'

const FormSchema = z.object({
  s: z.string(),
})

function trackVisualViewport(drawer: HTMLDivElement) {
  const viewport = window.visualViewport
  if (!viewport) return

  // Safari can pan the visible area as well as shrink it when the keyboard opens.
  const update = () => {
    drawer.style.setProperty('--search-viewport-height', `${viewport.height}px`)
    drawer.style.setProperty(
      '--search-viewport-bottom',
      `${viewport.offsetTop + viewport.height}px`,
    )
  }

  update()
  viewport.addEventListener('resize', update)
  viewport.addEventListener('scroll', update)
  return () => {
    viewport.removeEventListener('resize', update)
    viewport.removeEventListener('scroll', update)
  }
}

/** Nav bar button that opens a drawer for searching recipes */
export function NavSearch() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const stopTrackingViewport = useRef<(() => void) | undefined>(undefined)
  const navigate = useNavigate()

  const setDrawerRef = useCallback((drawer: HTMLDivElement | null) => {
    // Vaul calls this ref with null on detach and discards returned cleanup functions.
    stopTrackingViewport.current?.()
    stopTrackingViewport.current = drawer ? trackVisualViewport(drawer) : undefined
  }, [])

  const observeScrollArea = useCallback((scrollArea: HTMLDivElement | null) => {
    if (!scrollArea) return

    // A keyboard resize can clip the focused field inside the drawer.
    const observer = new ResizeObserver(() => {
      const input = inputRef.current
      if (!input || document.activeElement !== input) return

      const overflow =
        input.getBoundingClientRect().bottom - scrollArea.getBoundingClientRect().bottom
      if (overflow > 0) scrollArea.scrollTop += Math.ceil(overflow)
    })
    observer.observe(scrollArea)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const formJson = FormSchema.parse(Object.fromEntries(formData))

    const { s } = formJson

    navigate({
      to: '/recipes/list',
      search: { s },
    })

    setOpen(false)
  }

  return (
    <Drawer.Root autoFocus repositionInputs={false} noBodyStyles open={open} onOpenChange={setOpen}>
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
        <Drawer.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-lg max-md:animate-none! motion-reduce:animate-none!" />

        <Drawer.Content
          ref={setDrawerRef}
          className="search-drawer fixed inset-x-0 bg-gray-100 dark:bg-zinc-950 outline-none md:[--search-drawer-height:50dvh] max-md:animate-none! motion-reduce:animate-none!"
        >
          <div
            ref={observeScrollArea}
            className="h-full overflow-y-auto overscroll-contain py-8 bg-white dark:bg-zinc-900"
          >
            <Container>
              <form onSubmit={handleSubmit}>
                <Stack>
                  <Drawer.Title asChild>
                    <h3 className="font-bold text-slate-800 dark:text-zinc-50 text-xl">
                      Search for recipes
                    </h3>
                  </Drawer.Title>

                  <FormControl className="max-w-140">
                    <FormLabel htmlFor="header-search-input">Search by title</FormLabel>

                    <FormInput
                      ref={inputRef}
                      type="text"
                      id="header-search-input"
                      name="s"
                      autoComplete="off"
                      required
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
