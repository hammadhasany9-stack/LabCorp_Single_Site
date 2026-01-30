import { format } from 'date-fns'
import { OrderDetail } from '@/lib/types/order-detail'
import { formatOrderDate } from './orderHelpers'

export const exportOrderDetailToCSV = (order: OrderDetail): void => {
  // Prepare CSV data sections
  const sections = [
    // Order Information
    ['ORDER INFORMATION', ''],
    ['Order ID', order.orderId],
    ['Order Number', order.orderNo],
    ['Status', order.status],
    ['Order Date', formatOrderDate(order.orderDate)],
    ['Date Approved', order.dateApproved ? formatOrderDate(order.dateApproved) : 'N/A'],
    ['Shipped Date', order.shippedDate ? formatOrderDate(order.shippedDate) : 'N/A'],
    ['Location', order.location],
    [''],
    
    // Client Details
    ['CLIENT DETAILS', ''],
    ['Plan Name', order.planName],
    ['Plan Address', order.planAddress],
    ['Plan City', order.planCity],
    ['Plan State', order.planState],
    ['Plan ZIP', order.planZip],
    ['Billing Account Number', order.billingAccountNo],
    [''],
    
    // Contact Information
    ['CONTACT INFORMATION (ATTN)', ''],
    ['Contact Name', order.contactName],
    ['Contact Phone', order.contactPhone],
    ['Contact Address', order.contactAddress || 'N/A'],
    ['Special Instructions', order.specialInstructions || 'N/A'],
    [''],
    
    // Kit Details
    ['KIT DETAILS', ''],
    ['Kit ID', order.kitId],
    ['Kit Name', order.kitName],
    ['Kit SKU', order.kitSku],
    ['Kit Packaging', order.kitPackaging],
    ['Quantity', order.quantity.toString()],
    ['Kit Instructions', order.kitInstructions || 'N/A'],
    ['TRF Template', order.trfTemplate || 'N/A'],
    ['Letter Print', order.letterPrint ? 'Yes' : 'No'],
    [''],
    
    // Order Details
    ['ORDER DETAILS', ''],
    ['Kit Number', order.kitNumber],
    ['Lab Ticket', order.labTicket],
    ['Order Notes', order.orderNotes || 'N/A'],
    [''],
    
    // Lab Address
    ['LAB ADDRESS', ''],
    ['Lab Address', order.labAddress],
    ['Lab City', order.labCity],
    ['Lab State', order.labState],
    ['Lab ZIP', order.labZip],
    [''],
    
    // Return Address
    ['RETURN ADDRESS', ''],
    ['ATTN', order.returnAttn],
    ['Return Address', order.returnAddress],
    ['Return City', order.returnCity],
    ['Return State', order.returnState],
    ['Return ZIP', order.returnZip],
    [''],
    
    // Fulfillment & Tracking
    ['FULFILLMENT & TRACKING', ''],
    ['Outbound Carrier', order.outboundCarrier],
    ['Outbound Tracking ID', order.outboundTrackingId || 'N/A'],
    ['Inbound Carrier', order.inboundCarrier],
    [''],
    
    // Custom Requisitions
    ['CUSTOM REQUISITIONS', ''],
    ['Total Records', order.customRequisitions.length.toString()],
    [''],
    ['Control ID', 'Inbound Tracking ID'],
    ...order.customRequisitions.map(req => [req.controlId, req.inboundTrackingId])
  ]

  // Convert to CSV format
  const csvContent = sections
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `order-detail-${order.orderId}-${format(new Date(), 'yyyy-MM-dd')}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportOrderDetailToXLS = (order: OrderDetail): void => {
  // For XLS export, we'll use a simple approach by creating an HTML table
  // and downloading it as an .xls file (which Excel can open)
  
  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta charset="utf-8">
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .section-header { background-color: #4a90e2; color: white; font-weight: bold; }
      </style>
    </head>
    <body>
      <table>
        <tr><th colspan="2" class="section-header">ORDER INFORMATION</th></tr>
        <tr><td>Order ID</td><td>${order.orderId}</td></tr>
        <tr><td>Order Number</td><td>${order.orderNo}</td></tr>
        <tr><td>Status</td><td>${order.status}</td></tr>
        <tr><td>Order Date</td><td>${formatOrderDate(order.orderDate)}</td></tr>
        <tr><td>Date Approved</td><td>${order.dateApproved ? formatOrderDate(order.dateApproved) : 'N/A'}</td></tr>
        <tr><td>Shipped Date</td><td>${order.shippedDate ? formatOrderDate(order.shippedDate) : 'N/A'}</td></tr>
        <tr><td>Location</td><td>${order.location}</td></tr>
        <tr><td colspan="2"></td></tr>
        
        <tr><th colspan="2" class="section-header">CLIENT DETAILS</th></tr>
        <tr><td>Plan Name</td><td>${order.planName}</td></tr>
        <tr><td>Plan Address</td><td>${order.planAddress}</td></tr>
        <tr><td>Plan City</td><td>${order.planCity}</td></tr>
        <tr><td>Plan State</td><td>${order.planState}</td></tr>
        <tr><td>Plan ZIP</td><td>${order.planZip}</td></tr>
        <tr><td>Billing Account Number</td><td>${order.billingAccountNo}</td></tr>
        <tr><td colspan="2"></td></tr>
        
        <tr><th colspan="2" class="section-header">CONTACT INFORMATION (ATTN)</th></tr>
        <tr><td>Contact Name</td><td>${order.contactName}</td></tr>
        <tr><td>Contact Phone</td><td>${order.contactPhone}</td></tr>
        <tr><td>Contact Address</td><td>${order.contactAddress || 'N/A'}</td></tr>
        <tr><td>Special Instructions</td><td>${order.specialInstructions || 'N/A'}</td></tr>
        <tr><td colspan="2"></td></tr>
        
        <tr><th colspan="2" class="section-header">KIT DETAILS</th></tr>
        <tr><td>Kit ID</td><td>${order.kitId}</td></tr>
        <tr><td>Kit Name</td><td>${order.kitName}</td></tr>
        <tr><td>Kit SKU</td><td>${order.kitSku}</td></tr>
        <tr><td>Kit Packaging</td><td>${order.kitPackaging}</td></tr>
        <tr><td>Quantity</td><td>${order.quantity}</td></tr>
        <tr><td>Kit Instructions</td><td>${order.kitInstructions || 'N/A'}</td></tr>
        <tr><td>TRF Template</td><td>${order.trfTemplate || 'N/A'}</td></tr>
        <tr><td>Letter Print</td><td>${order.letterPrint ? 'Yes' : 'No'}</td></tr>
        <tr><td colspan="2"></td></tr>
        
        <tr><th colspan="2" class="section-header">ORDER DETAILS</th></tr>
        <tr><td>Kit Number</td><td>${order.kitNumber}</td></tr>
        <tr><td>Lab Ticket</td><td>${order.labTicket}</td></tr>
        <tr><td>Order Notes</td><td>${order.orderNotes || 'N/A'}</td></tr>
        <tr><td colspan="2"></td></tr>
        
        <tr><th colspan="2" class="section-header">LAB ADDRESS</th></tr>
        <tr><td>Lab Address</td><td>${order.labAddress}</td></tr>
        <tr><td>Lab City</td><td>${order.labCity}</td></tr>
        <tr><td>Lab State</td><td>${order.labState}</td></tr>
        <tr><td>Lab ZIP</td><td>${order.labZip}</td></tr>
        <tr><td colspan="2"></td></tr>
        
        <tr><th colspan="2" class="section-header">RETURN ADDRESS</th></tr>
        <tr><td>ATTN</td><td>${order.returnAttn}</td></tr>
        <tr><td>Return Address</td><td>${order.returnAddress}</td></tr>
        <tr><td>Return City</td><td>${order.returnCity}</td></tr>
        <tr><td>Return State</td><td>${order.returnState}</td></tr>
        <tr><td>Return ZIP</td><td>${order.returnZip}</td></tr>
        <tr><td colspan="2"></td></tr>
        
        <tr><th colspan="2" class="section-header">FULFILLMENT & TRACKING</th></tr>
        <tr><td>Outbound Carrier</td><td>${order.outboundCarrier}</td></tr>
        <tr><td>Outbound Tracking ID</td><td>${order.outboundTrackingId || 'N/A'}</td></tr>
        <tr><td>Inbound Carrier</td><td>${order.inboundCarrier}</td></tr>
        <tr><td colspan="2"></td></tr>
        
        <tr><th colspan="2" class="section-header">CUSTOM REQUISITIONS</th></tr>
        <tr><td>Total Records</td><td>${order.customRequisitions.length}</td></tr>
        <tr><td colspan="2"></td></tr>
        <tr><th>Control ID</th><th>Inbound Tracking ID</th></tr>
        ${order.customRequisitions.map(req => 
          `<tr><td>${req.controlId}</td><td>${req.inboundTrackingId}</td></tr>`
        ).join('')}
      </table>
    </body>
    </html>
  `

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `order-detail-${order.orderId}-${format(new Date(), 'yyyy-MM-dd')}.xls`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
