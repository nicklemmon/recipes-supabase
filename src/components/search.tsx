import { Drawer } from 'vaul'
import { Button } from './button'
import { Stack } from './stack'
import { FormLabel } from './form-label'
import { FormControl } from './form-control'
import { FormInput } from './form-input'
import { Container } from './container'
import { Inline } from './inline'
import { useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'

export function Search({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const { s } = Object.fromEntries(formData)

    console.log('s')

    navigate({
      to: '/recipes/list',
      search: { s },
    })

    setOpen(false)
  }

  const handleAnimEnd = () => {
    inputRef.current?.focus()
  }

  return (
    <Drawer.Root onAnimationEnd={handleAnimEnd} open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>

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
                      type="text"
                      id="header-search-input"
                      name="s"
                      autoComplete="off"
                      required
                      ref={inputRef}
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
