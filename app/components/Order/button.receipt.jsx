import { Button } from 'antd'
import Link from 'next/link'

import html2canvas from 'html2canvas'

export default function DownloadReceiptPNGButton({ orderId }) {

    const handleDownload = async () => {
        const res = await fetch(`/api/order/receipt/${orderId}`)
        const receiptText = await res.text()

        const container = document.createElement('div')
        container.style.position = 'fixed'
        container.style.top = '-9999px'
        container.style.fontFamily = 'monospace'
        container.style.fontSize = '12px'
        container.style.lineHeight = '1.4'
        container.style.background = 'white'
        container.style.color = 'black'
        container.style.padding = '10px 20px 40px 20px'
        container.innerHTML = `
    <pre style="margin:0;padding:0 0 40px 0;">${receiptText}</pre>
`
        document.body.appendChild(container)

        const canvas = await html2canvas(container)
        const dataUrl = canvas.toDataURL('image/png')

        const link = document.createElement('a')
        link.href = dataUrl
        link.download = `receipt-${orderId}.png`
        link.click()

        document.body.removeChild(container)
    }

    return (
        <Button size="small" onClick={handleDownload} style={{ width: '100%' }}>
            Download Receipt (PNG)
        </Button>
    )
}