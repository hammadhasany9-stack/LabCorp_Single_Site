import { redirect } from 'next/navigation'

export default function DirectToPatientPage() {
  redirect('/programs/direct-to-patient/place-order')
}
