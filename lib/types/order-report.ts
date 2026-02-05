import { OrderHistoryItem } from './order-history'

export type MetricCardType = 'approved' | 'approved-today' | 'cancelled' | 'shipped'

export interface OrderReportMetrics {
  approvedTotal: number
  approvedToday: number
  cancelledTotal: number
  shippedTotal: number
}

export interface CancelRefundDialogData {
  orderId: string
  orderNo: string
  programName: string
  kitName: string
}

export type ActionType = 'cancel' | 'refund'
