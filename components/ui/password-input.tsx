"use client"

import * as React from "react"
import { LuEye, LuEyeOff } from "react-icons/lu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface PasswordVisibilityProps {
  defaultVisible?: boolean
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  visibilityIcon?: { on: React.ReactNode; off: React.ReactNode }
}

export interface PasswordInputProps
  extends React.ComponentProps<"input">,
    PasswordVisibilityProps {}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const {
      defaultVisible = false,
      visible: visibleProp,
      onVisibleChange,
      visibilityIcon = { on: <LuEye />, off: <LuEyeOff /> },
      className,
      ...rest
    } = props

    const [visibleState, setVisibleState] = React.useState(defaultVisible)
    const visible = visibleProp !== undefined ? visibleProp : visibleState

    const toggle = () => {
      const next = !visible
      setVisibleState(next)
      onVisibleChange?.(next)
    }

    return (
      <div className="relative w-full">
        <Input
          {...rest}
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("pr-10", className)}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Toggle password visibility"
          onPointerDown={(e) => {
            if (rest.disabled) return
            if (e.button !== 0) return
            e.preventDefault()
            toggle()
          }}
          disabled={rest.disabled}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:pointer-events-none"
        >
          {visible ? visibilityIcon.off : visibilityIcon.on}
        </button>
      </div>
    )
  },
)
