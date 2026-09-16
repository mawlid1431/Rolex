"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"

/** Client-side QR code (the reference generates its QR codes in the browser with QRCodeStyling). */
export function QrCode({ value, label, className }: { value: string; label: string; className?: string }) {
  const [svg, setSvg] = useState("")

  useEffect(() => {
    let active = true
    QRCode.toString(value, { type: "svg", margin: 0, color: { dark: "#0b3e27", light: "#ffffff00" }, errorCorrectionLevel: "M" })
      .then((markup) => active && setSvg(markup))
      .catch(() => active && setSvg(""))
    return () => {
      active = false
    }
  }, [value])

  return <div role="img" aria-label={label} className={className} dangerouslySetInnerHTML={{ __html: svg }} />
}
