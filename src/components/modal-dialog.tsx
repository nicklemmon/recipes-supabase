import React, { useEffect, useRef, useState } from 'react'

type ModalDialogProps = {
  /** Controls visibility */
  isOpen: boolean
  /** Called when the modal should close (backdrop click or ESC) */
  onClose: () => void
  /** Modal content */
  children: React.ReactNode
}

/**
 * A modal dialog using the native <dialog> element and Tailwind CSS.
 * Disables background scrolling, applies a blurred backdrop, and
 * features a light bouncy animation without extra deps.
 */
export function ModalDialog({ isOpen, onClose, children }: ModalDialogProps) {
  const [visible, setVisible] = useState(isOpen)
  const [exiting, setExiting] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Sync prop to internal visible/exiting states
  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      document.body.classList.add('overflow-hidden')
    } else if (visible) {
      setExiting(true)
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  // Open the dialog once it's visible
  useEffect(() => {
    const dialog = dialogRef.current
    if (visible && dialog && !dialog.open) {
      dialog.showModal()
    }
  }, [visible])

  // Handle Escape key via <dialog>'s cancel event
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault()
    onClose()
  }

  // After exit transition, close and cleanup
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDialogElement>) => {
    if (exiting && e.propertyName === 'opacity') {
      const dialog = dialogRef.current
      dialog?.close()
      setExiting(false)
      setVisible(false)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred, dimmed backdrop */}
      <div
        className={`fixed inset-0 bg-black/25 backdrop-blur-sm
           transition-opacity duration-300
           ${isOpen && !exiting ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Native dialog with CSS-driven bouncy animation */}
      <dialog
        ref={dialogRef}
        className={`relative z-10 max-w-lg w-full rounded-2xl bg-white p-6 shadow-lg
           transform transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
           ${isOpen && !exiting ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        onCancel={handleCancel}
        onTransitionEnd={handleTransitionEnd}
      >
        {children}
      </dialog>
    </div>
  )
}
