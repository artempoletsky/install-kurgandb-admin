import { Checkbox, Tooltip } from "@mantine/core"

type Props = {
  tooltip: string
  label: string
  value: boolean
  onChange: (newVal: boolean) => void
}

export default function CheckboxTooltip({ tooltip, label, value, onChange }: Props) {

  return <Tooltip label={tooltip}>
    <div className="pt-2 mr-2">
      <Checkbox
        checked={value}
        onChange={e => onChange(e.target.checked)}
        classNames={{
          label: "cursor-help",
          input: "cursor-help",
        }}
        label={label}
      />
    </div>
  </Tooltip>
}