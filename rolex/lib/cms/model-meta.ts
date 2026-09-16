import model from "@/lib/data/model-m126688-0001.json"

type SpecBlock = {
  specs?: Record<string, string>
  labels?: Record<string, string>
}

function clean(value?: string | null) {
  return (value ?? "").replace(/\n+/g, " ").replace(/\s+/g, " ").trim()
}

function asSpec(value: unknown): SpecBlock | undefined {
  if (!value || typeof value !== "object") return undefined
  return value as SpecBlock
}

/** Fill Rolex CMS meta placeholders (`%name%`, `%rmc%`, …) from catalogue model data. */
export function interpolateModelMeta(template?: string | null): string | undefined {
  if (!template) return undefined
  const caseSpec = asSpec(model.case)
  const dialSpec = asSpec(model.dial)
  const braceletSpec = asSpec(model.bracelet)
  const map: Record<string, string> = {
    name: clean(model.name) || "Yacht-Master II",
    rmc: clean(model.rmc) || "m126688-0001",
    material: clean(model.label_material_title) || clean(caseSpec?.specs?.material) || "18 ct yellow gold",
    diameter: clean(caseSpec?.specs?.diameter) || "44",
    case: clean(caseSpec?.labels?.title) || "Oyster",
    bezel: clean(caseSpec?.labels?.bezel) || clean(caseSpec?.specs?.bezel_type) || "bidirectional",
    dial: clean(dialSpec?.labels?.title) || clean(dialSpec?.specs?.color) || "White",
    bracelet: clean(braceletSpec?.labels?.title) || "Oyster",
    bracelet_material: clean(braceletSpec?.specs?.material) || clean(model.label_material_title) || "18 ct yellow gold",
  }
  return template.replace(/%([a-z_]+)%/gi, (_, key: string) => map[key.toLowerCase()] ?? "")
}
