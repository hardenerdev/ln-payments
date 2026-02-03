import { QRCodeSVG } from "qrcode.react";

type InvoiceQrProps = {
  invoice: string;
  size?: number;
};

export function QR({
  invoice,
  size = 200,
}: InvoiceQrProps) {
  return (
    <div>
      <QRCodeSVG
        value={invoice}
        size={size}
        level="M"
      />
    </div>
  );
}
