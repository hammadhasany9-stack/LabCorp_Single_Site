export interface OrderItem {
  itemId: string
  controlId: string
  trfPath: string | null
  shippingLabelPath: string | null
  shippingLabelPdf: string | null
  returnLabelPath: string | null
  returnLabelPdf: string | null
  stickerPath: string | null
  outboundTrackingNo: string
  inboundTrackingNo: string
  status: 'approved' | 'inprocess'
  createdAt: Date
  updatedAt: Date
}
