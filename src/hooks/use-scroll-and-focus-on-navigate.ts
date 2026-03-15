import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'

export function useScrollAndFocusOnNavigate() {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = router.subscribe('onResolved', (event) => {
      if (!event.pathChanged) return

      window.scrollTo(0, 0)

      const mainElement = document.querySelector('main')

      if (mainElement) {
        mainElement.focus()
      }
    })

    return unsubscribe
  }, [router])
}
