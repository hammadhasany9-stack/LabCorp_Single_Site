'use client'

import { useState, useRef, useCallback } from 'react'
import { Patient, Gender, createEmptyPatient } from '@/lib/types/patient'
import { parsePatientCSV } from '@/lib/utils/csvParser'
import { formatPhoneNumber } from '@/lib/utils/formatters'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calendar as CalendarIcon, Upload, Trash2, Plus, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

// US States list
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
]

interface PatientDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patients: Patient[]
  onSave: (patients: Patient[], adHocShipping: boolean) => void
}

// Cell components defined outside to prevent recreation on each render
const EditableCell = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) => (
  <Input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    type={type}
    className="h-8 text-sm border-none bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
  />
)

const PhoneCell = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => (
  <Input
    value={value}
    onChange={(e) => {
      const formatted = formatPhoneNumber(e.target.value)
      onChange(formatted)
    }}
    placeholder="(555) 123-4567"
    className="h-8 text-sm border-none bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
  />
)

const DateCell = ({
  value,
  onChange,
}: {
  value: Date | null
  onChange: (value: Date | null) => void
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="ghost"
        className={cn(
          "h-8 w-full justify-start text-left font-normal px-2 text-sm hover:bg-accent",
          !value && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="mr-2 h-3 w-3" />
        {value ? format(value, "MM/dd/yyyy") : "Select date"}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={value || undefined}
        onSelect={(date) => onChange(date || null)}
        disabled={(date) => date > new Date()}
        initialFocus
      />
    </PopoverContent>
  </Popover>
)

const GenderCell = ({
  value,
  onChange,
}: {
  value: Gender | null
  onChange: (value: Gender | null) => void
}) => (
  <Select value={value || undefined} onValueChange={(val) => onChange(val as Gender)}>
    <SelectTrigger className="h-8 text-sm border-none bg-transparent focus:ring-1 focus:ring-ring">
      <SelectValue placeholder="Select gender" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={Gender.Male}>Male</SelectItem>
      <SelectItem value={Gender.Female}>Female</SelectItem>
      <SelectItem value={Gender.Other}>Other</SelectItem>
      <SelectItem value={Gender.PreferNotToSay}>Prefer not to say</SelectItem>
    </SelectContent>
  </Select>
)

const StateCell = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => (
  <Select value={value || undefined} onValueChange={onChange}>
    <SelectTrigger className="h-8 text-sm border-none bg-transparent focus:ring-1 focus:ring-ring">
      <SelectValue placeholder="State" />
    </SelectTrigger>
    <SelectContent>
      {US_STATES.map((state) => (
        <SelectItem key={state.value} value={state.value}>
          {state.value}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

export function PatientDetailsDialog({
  open,
  onOpenChange,
  patients: initialPatients,
  onSave,
}: PatientDetailsDialogProps) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [adHocShipping, setAdHocShipping] = useState(false)
  const [uploadErrors, setUploadErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update patients when dialog opens with new data
  useState(() => {
    setPatients(initialPatients)
  })

  const handleAddRow = () => {
    setPatients([...patients, createEmptyPatient()])
  }

  const handleDeleteRow = (id: string) => {
    setPatients(patients.filter(p => p.id !== id))
  }

  const handleUpdatePatient = (id: string, field: keyof Patient, value: any) => {
    setPatients(patients.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadErrors([])

    try {
      const result = await parsePatientCSV(file)
      
      if (result.success) {
        setPatients([...patients, ...result.patients])
        if (result.errors.length > 0) {
          setUploadErrors(result.errors)
        }
      } else {
        setUploadErrors(result.errors)
      }
    } catch (error) {
      setUploadErrors([`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`])
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = () => {
    onSave(patients, adHocShipping)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between mb-2 mt-6 gap-2 border border-gray-200 dark:border-zinc-800 p-4 rounded-lg">
            <div className="flex items-center gap-6">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Patient Details
            </DialogTitle>
            <div className="flex items-center gap-2">
                <Checkbox
                  id="adhoc-shipping"
                  checked={adHocShipping}
                  onCheckedChange={(checked) => setAdHocShipping(checked as boolean)}
                />
                <label
                  htmlFor="adhoc-shipping"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Ad-hoc Direct to Patient
                </label>
                </div>
              </div>
            <div className="flex items-center gap-4">
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleCSVUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
              >
                Save Details
              </Button>
            </div>
          </div>

          {/* Ad-hoc Disclaimer */}
          {adHocShipping && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                These kits will be shipped to each patient
              </p>
            </div>
          )}

          {/* Upload Errors */}
          {uploadErrors.length > 0 && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  CSV Upload Errors:
                </p>
              </div>
              <ul className="list-disc list-inside text-xs text-red-700 dark:text-red-300 space-y-1">
                {uploadErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-auto border border-gray-200 dark:border-zinc-800 rounded-lg">
          <div className="rounded-lg">
            <Table>
              <TableHeader className="bg-gray-100 dark:bg-zinc-900">
                <TableRow>
                  <TableHead className="w-[120px]">First Name</TableHead>
                  <TableHead className="w-[120px]">Middle Name</TableHead>
                  <TableHead className="w-[120px]">Last Name</TableHead>
                  <TableHead className="w-[130px]">Date of Birth</TableHead>
                  <TableHead className="w-[150px]">Gender</TableHead>
                  <TableHead className="w-[180px]">Address Line 1</TableHead>
                  <TableHead className="w-[180px]">Address Line 2</TableHead>
                  <TableHead className="w-[120px]">City</TableHead>
                  <TableHead className="w-[80px]">State</TableHead>
                  <TableHead className="w-[100px]">ZIP Code</TableHead>
                  <TableHead className="w-[140px]">Phone Number</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center text-muted-foreground py-8">
                      No patients added. Click "Add Patient" to add a row or upload a CSV file.
                    </TableCell>
                  </TableRow>
                ) : (
                  patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <EditableCell
                          value={patient.firstName}
                          onChange={(val) => handleUpdatePatient(patient.id, 'firstName', val)}
                          placeholder="First Name"
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          value={patient.middleName || ''}
                          onChange={(val) => handleUpdatePatient(patient.id, 'middleName', val)}
                          placeholder="Middle Name"
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          value={patient.lastName}
                          onChange={(val) => handleUpdatePatient(patient.id, 'lastName', val)}
                          placeholder="Last Name"
                        />
                      </TableCell>
                      <TableCell>
                        <DateCell
                          value={patient.dateOfBirth}
                          onChange={(val) => handleUpdatePatient(patient.id, 'dateOfBirth', val)}
                        />
                      </TableCell>
                      <TableCell>
                        <GenderCell
                          value={patient.gender}
                          onChange={(val) => handleUpdatePatient(patient.id, 'gender', val)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          value={patient.addressLine1}
                          onChange={(val) => handleUpdatePatient(patient.id, 'addressLine1', val)}
                          placeholder="Address Line 1"
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          value={patient.addressLine2 || ''}
                          onChange={(val) => handleUpdatePatient(patient.id, 'addressLine2', val)}
                          placeholder="Address Line 2"
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          value={patient.city}
                          onChange={(val) => handleUpdatePatient(patient.id, 'city', val)}
                          placeholder="City"
                        />
                      </TableCell>
                      <TableCell>
                        <StateCell
                          value={patient.state}
                          onChange={(val) => handleUpdatePatient(patient.id, 'state', val)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          value={patient.zipCode}
                          onChange={(val) => handleUpdatePatient(patient.id, 'zipCode', val)}
                          placeholder="12345"
                        />
                      </TableCell>
                      <TableCell>
                        <PhoneCell
                          value={patient.phoneNumber}
                          onChange={(val) => handleUpdatePatient(patient.id, 'phoneNumber', val)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRow(patient.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex-shrink-0 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleAddRow}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
