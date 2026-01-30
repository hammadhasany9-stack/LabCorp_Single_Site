# Order History Screen - Quick Start Guide

## Access the Page

🌐 **URL:** `http://localhost:3000/programs/single-site/order-history`

📱 **Navigation:** Dashboard → Sidebar → Order History

## Features at a Glance

### 📊 KPI Metrics (Top Section)
- **Total Orders**: 25 sample orders
- **Orders Shipped**: Successfully dispatched orders
- **Orders Cancelled**: Terminated orders
- **Orders In Progress**: Pending/processing orders

### 🔖 Status Tabs
Click to filter by order status:
- **All** - View all orders
- **In Progress** - Active orders
- **Shipped** - Completed deliveries
- **Cancelled** - Terminated orders

### 🔍 Search Bar
Type to search across:
- Order Number & ID
- Plan Name
- Kit Name & ID
- Tracking ID
- Billing Account
- Location

### 🎯 Advanced Filters
Click "Filters" button to access:
- **Date Range** - Filter by order or shipped date
- **Order Number/ID** - Specific order lookup
- **Tracking ID** - Find by tracking number
- **Kit ID** - Search by kit identifier
- **Kit Name** - Filter by kit type

### 📋 Data Table
- **13 columns** with complete order information
- **Sortable** - Click column headers to sort
- **Pagination** - 25 orders per page
- **Actions** - View details for each order

### 💾 Export
- **Export CSV** - Download filtered data
- Includes all visible columns
- Formatted dates and status labels

## Sample Data

The page includes **25 realistic orders** for testing:
- Various healthcare organizations (BlueCross, UnitedHealth, Aetna, etc.)
- Multiple kit types (IFOBT, A1c Whatman, Albumin Urine, AdvanceDx Serum)
- Different statuses and locations
- Realistic tracking numbers and billing accounts

## Quick Actions

| Action | How To |
|--------|--------|
| Filter by status | Click status tabs at top |
| Search orders | Type in search bar |
| Advanced filters | Click "Filters" button |
| Sort table | Click column headers |
| Navigate pages | Use Previous/Next buttons |
| Export data | Click "Export CSV" button |
| Clear all filters | Open filters → "Clear All" |

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Type Safety**: TypeScript

## File Locations

```
📁 Components:     components/order-history/
📁 Page:           app/programs/single-site/order-history/page.tsx
📁 Types:          lib/types/order-history.ts
📁 Mock Data:      lib/data/mockOrderHistory.ts
📁 Utilities:      lib/utils/orderHelpers.ts
```

## Theme Support

✅ **Light Mode** - Default clean interface
🌙 **Dark Mode** - Full dark theme support
🎨 **Blue Theme** - Healthcare blue primary color

Toggle theme using the button in the sidebar.

## Keyboard Navigation

- **Tab** - Navigate between interactive elements
- **Enter/Space** - Activate buttons
- **Arrow Keys** - Navigate in date pickers

## Browser Compatibility

✅ Chrome/Edge (Latest)
✅ Firefox (Latest)
✅ Safari (Latest)

## Performance

- ⚡ **Fast filtering** - Client-side filtering for instant results
- 📱 **Responsive** - Works on mobile, tablet, and desktop
- 💾 **Efficient** - Memoized calculations for better performance

## Next Steps

When backend API is ready:
1. Replace mock data with API calls
2. Add loading states (skeleton loaders)
3. Implement real-time updates
4. Add authentication checks
5. Enable View Details functionality

## Need Help?

Check `IMPLEMENTATION_SUMMARY.md` for complete technical details.

---

**Status**: ✅ Fully Functional with Mock Data
**Version**: 1.0
**Last Updated**: January 28, 2026
