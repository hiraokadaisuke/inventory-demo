'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Props = {
  col: {
    key: string
    label: string
  }
  isChecked: boolean
  onToggle: () => void
}

export default function SortableItem({ col, isChecked, onToggle }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: col.key })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <label
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex items-center gap-2 border px-2 py-1 rounded bg-white hover:bg-gray-100 cursor-move"
    >
      <input type="checkbox" checked={isChecked} onChange={onToggle} />
      <span className="text-sm">{col.label}</span>
    </label>
  )
}
