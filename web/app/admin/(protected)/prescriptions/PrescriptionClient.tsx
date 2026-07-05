"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Search, Printer, Send, Activity, BookOpen, Calendar, HelpCircle, FileText, CheckCircle2, ChevronLeft, ArrowRight, Copy, Edit3 } from "lucide-react"

interface MedicineRow {
  medicine_name: string
  dosage: string
  timing: string
  duration: string
  remarks: string
}

interface PrescriptionHistory {
  id: string
  prescription_no: string
  consultation_date: string
  diagnosis: string
  doctor_notes: string
  patient: {
    name: string
    phone: string
    age: number | null
    gender: string | null
    allergies: string | null
    address: string | null
    blood_group: string | null
  }
  medicines: {
    medicine_name: string
    dosage: string
    timing: string
    duration: string
    remarks: string | null
  }[]
}

export default function PrescriptionClient() {
  const searchParams = useSearchParams()
  const paramLeadId = searchParams.get("leadId")
  const paramPatientId = searchParams.get("patientId")

  // View state: 'list' | 'create'
  const [view, setView] = useState<"list" | "create">("list")
  const [allPrescriptions, setAllPrescriptions] = useState<any[]>([])
  const [listLoading, setListLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Form State
  const [editingPrescriptionId, setEditingPrescriptionId] = useState<string | null>(null)
  const [patientName, setPatientName] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [patientAge, setPatientAge] = useState("")
  const [patientGender, setPatientGender] = useState("Female")
  const [patientAllergies, setPatientAllergies] = useState("None")
  const [patientAddress, setPatientAddress] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")

  const [visitType, setVisitType] = useState("online")
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [bloodPressure, setBloodPressure] = useState("")
  const [pulse, setPulse] = useState("")
  const [weight, setWeight] = useState("")
  const [temperature, setTemperature] = useState("")
  const [doctorNotes, setDoctorNotes] = useState("")
  const [testsAdvised, setTestsAdvised] = useState("")
  const [nextFollowupDate, setNextFollowupDate] = useState("")

  const [medicines, setMedicines] = useState<MedicineRow[]>([
    { medicine_name: "", dosage: "1-0-1", timing: "After Food", duration: "15 days", remarks: "" }
  ])

  // Search & Templates State
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchMessage, setSearchMessage] = useState("")
  const [patientHistory, setPatientHistory] = useState<any[]>([])
  const [templates, setTemplates] = useState<{ name: string; description: string; medicines: MedicineRow[] }[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [lastSavedPrescription, setLastSavedPrescription] = useState<any>(null)

  // Fetch all prescriptions on mount or when switching to 'list' view
  const fetchPrescriptionsList = async () => {
    setListLoading(true)
    try {
      const res = await fetch("/api/prescriptions/list")
      const data = await res.json()
      if (data.success) {
        setAllPrescriptions(data.prescriptions)
      }
    } catch (err) {
      console.error("Error loading prescriptions list:", err)
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    fetchPrescriptionsList()
  }, [])

  // Load Templates on Mount
  useEffect(() => {
    fetch("/api/prescriptions/templates")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTemplates(data.templates)
        }
      })
      .catch((err) => console.error("Error loading templates:", err))
  }, [])

  // Auto-fill from leadId/patientId URL params
  useEffect(() => {
    if (!paramLeadId) return;

    const fetchLeadInfo = async () => {
      try {
        const res = await fetch(`/api/leads/${paramLeadId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.lead) {
            const lead = data.lead;
            setPatientName(lead.full_name || "");
            
            // Clean phone format
            const cleanPhone = lead.phone_number.replace(/\D/g, "").slice(-10);
            setPatientPhone(cleanPhone);
            setView("create")
            triggerAutoSearch(cleanPhone);
          }
        }
      } catch (err) {
        console.error("Failed to load lead:", err);
      }
    };

    fetchLeadInfo();
  }, [paramLeadId]);

  const triggerAutoSearch = async (phoneToSearch: string) => {
    if (!phoneToSearch || phoneToSearch.length < 10) return;
    setSearchLoading(true);
    setSearchMessage("");
    setPatientHistory([]);
    try {
      const res = await fetch(`/api/patients/search?phone=${phoneToSearch}`);
      const data = await res.json();
      if (data.success && data.found) {
        const p = data.patient;
        setPatientName(p.name || "");
        setPatientAge(p.age ? p.age.toString() : "");
        setPatientGender(p.gender || "Female");
        setPatientAllergies(p.allergies || "None");
        setPatientAddress(p.address || "");
        setBloodGroup(p.blood_group || "");
        setSearchMessage("Patient profile loaded successfully!");
        if (p.prescriptions && p.prescriptions.length > 0) {
          setPatientHistory(p.prescriptions);
        }
      } else {
        setSearchMessage("Linked lead. Ready to register patient.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Lookup Patient by Phone
  const handlePatientSearch = async () => {
    if (!patientPhone || patientPhone.length < 10) {
      setSearchMessage("Enter a valid 10-digit phone number")
      return
    }

    setSearchLoading(true)
    setSearchMessage("")
    setPatientHistory([])

    try {
      const res = await fetch(`/api/patients/search?phone=${patientPhone}`)
      const data = await res.json()

      if (data.success && data.found) {
        const p = data.patient
        setPatientName(p.name || "")
        setPatientAge(p.age ? p.age.toString() : "")
        setPatientGender(p.gender || "Female")
        setPatientAllergies(p.allergies || "None")
        setPatientAddress(p.address || "")
        setBloodGroup(p.blood_group || "")
        setSearchMessage("Patient profile loaded successfully!")

        if (p.prescriptions && p.prescriptions.length > 0) {
          setPatientHistory(p.prescriptions)
        }
      } else {
        setSearchMessage("New patient. Enter details to register.")
      }
    } catch (error) {
      console.error("Patient search failed:", error)
      setSearchMessage("Search unavailable. Enter details manually.")
    } finally {
      setSearchLoading(false)
    }
  }

  // Load Medicine Template
  const handleLoadTemplate = (templateName: string) => {
    const template = templates.find((t) => t.name === templateName)
    if (template) {
      setMedicines(template.medicines.map((m) => ({ ...m })))
    }
  }

  // Medicine Rows Management
  const handleAddMedicine = () => {
    setMedicines([...medicines, { medicine_name: "", dosage: "1-0-1", timing: "After Food", duration: "15 days", remarks: "" }])
  }

  const handleRemoveMedicine = (index: number) => {
    const newMedicines = medicines.filter((_, i) => i !== index)
    setMedicines(newMedicines.length > 0 ? newMedicines : [{ medicine_name: "", dosage: "1-0-1", timing: "After Food", duration: "15 days", remarks: "" }])
  }

  const handleMedicineChange = (index: number, field: keyof MedicineRow, value: string) => {
    const newMedicines = [...medicines]
    newMedicines[index] = { ...newMedicines[index], [field]: value }
    setMedicines(newMedicines)
  }

  // Reset form states
  const resetForm = () => {
    setEditingPrescriptionId(null)
    setPatientName("")
    setPatientPhone("")
    setPatientAge("")
    setPatientGender("Female")
    setPatientAllergies("None")
    setPatientAddress("")
    setBloodGroup("")
    setVisitType("online")
    setChiefComplaint("")
    setDiagnosis("")
    setBloodPressure("")
    setPulse("")
    setWeight("")
    setTemperature("")
    setDoctorNotes("")
    setTestsAdvised("")
    setNextFollowupDate("")
    setMedicines([
      { medicine_name: "", dosage: "1-0-1", timing: "After Food", duration: "15 days", remarks: "" }
    ])
    setPatientHistory([])
    setSearchMessage("")
    setLastSavedPrescription(null)
  }

  // Handle Edit Action
  const handleEdit = (p: any) => {
    setEditingPrescriptionId(p.id)
    setPatientName(p.patient?.name || "")
    setPatientPhone(p.patient?.phone || "")
    setPatientAge(p.patient?.age ? p.patient.age.toString() : "")
    setPatientGender(p.patient?.gender || "Female")
    setPatientAllergies(p.patient?.allergies || "None")
    setPatientAddress(p.patient?.address || "")
    setBloodGroup(p.patient?.blood_group || "")
    setVisitType(p.visit_type || "online")
    setChiefComplaint(p.chief_complaint || "")
    setDiagnosis(p.diagnosis || "")
    setBloodPressure(p.blood_pressure || "")
    setPulse(p.pulse || "")
    setWeight(p.weight || "")
    setTemperature(p.temperature || "")
    setDoctorNotes(p.doctor_notes || "")
    setTestsAdvised(p.tests_advised || "")
    setNextFollowupDate(p.next_followup_date ? new Date(p.next_followup_date).toISOString().substring(0, 10) : "")
    setMedicines(p.medicines && p.medicines.length > 0 ? p.medicines.map((m: any) => ({
      medicine_name: m.medicine_name,
      dosage: m.dosage,
      timing: m.timing,
      duration: m.duration,
      remarks: m.remarks || ""
    })) : [
      { medicine_name: "", dosage: "1-0-1", timing: "After Food", duration: "15 days", remarks: "" }
    ])
    setView("create")
  }

  // Trigger Print View
  const handlePrint = () => {
    window.print()
  }

  // Submit & Share via WhatsApp
  const handleGenerateAndSend = async () => {
    if (!patientName) {
      alert("Please enter patient name")
      return
    }
    if (!patientPhone || patientPhone.length < 10) {
      alert("Please enter a valid patient phone number")
      return
    }

    setSubmitLoading(true)

    const payload = {
      id: editingPrescriptionId,
      name: patientName,
      phone: patientPhone,
      age: patientAge,
      gender: patientGender,
      allergies: patientAllergies,
      address: patientAddress,
      blood_group: bloodGroup,
      visit_type: visitType,
      chief_complaint: chiefComplaint,
      diagnosis,
      blood_pressure: bloodPressure,
      pulse,
      weight,
      temperature,
      doctor_notes: doctorNotes,
      tests_advised: testsAdvised,
      next_followup_date: nextFollowupDate,
      medicines,
    }

    try {
      const isEditing = !!editingPrescriptionId
      const endpoint = isEditing ? "/api/prescriptions/update" : "/api/prescriptions/create"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.success) {
        const prescription = data.prescription
        setLastSavedPrescription(prescription)

        // Refresh Lists
        fetchPrescriptionsList()
        resetForm()
        setView("list")

        // Create Verification URL
        const verifyUrl = `https://www.ayureva.in/prescription/${prescription.id}`

        // Construct pre-filled WhatsApp message
        const message = `Hello ${prescription.patient.name}, this is your official digital prescription from Dr. Arti Kumari (Ayureva). \n\nPrescription No: ${prescription.prescription_no}\nDate: ${new Date(prescription.consultation_date).toLocaleDateString("en-IN")}\n\nYou can verify your prescription and download the verified copy here: ${verifyUrl}\n\nThank you for choosing Ayureva.`
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://api.whatsapp.com/send?phone=91${prescription.patient.phone}&text=${encodedMessage}`

        // Open WhatsApp
        window.open(whatsappUrl, "_blank")
      } else {
        alert(data.error || "Failed to save prescription")
      }
    } catch (err) {
      console.error(err)
      alert("Unexpected error occurred while generating prescription.")
    } finally {
      setSubmitLoading(false)
    }
  }

  // Filtered prescriptions list for searching
  const filteredPrescriptions = allPrescriptions.filter((p) => {
    const term = searchTerm.toLowerCase()
    return (
      p.prescription_no.toLowerCase().includes(term) ||
      (p.patient?.name || "").toLowerCase().includes(term) ||
      (p.patient?.phone || "").toLowerCase().includes(term) ||
      (p.diagnosis || "").toLowerCase().includes(term)
    )
  })

  // ================= VIEW: LIST OF PRESCRIPTIONS =================
  if (view === "list") {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Prescriptions Dashboard</h2>
            <p className="text-gray-500 mt-1">Manage, search, and resend digital prescriptions for online and offline consultations.</p>
          </div>
          <Button 
            size="lg" 
            className="bg-green-700 hover:bg-green-800 text-white font-bold h-12 px-6 rounded-xl"
            onClick={() => {
              resetForm()
              setView("create")
            }}
          >
            <Plus className="w-5 h-5 mr-2" /> Write Prescription
          </Button>
        </div>

        {/* Search controls */}
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-150 dark:border-zinc-800">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by patient name, phone, or Rx number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 border-gray-200"
            />
          </div>
        </div>

        {/* Prescriptions Table */}
        <Card className="rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <CardHeader className="bg-gray-50/50 dark:bg-zinc-800/20 pb-4">
            <CardTitle className="text-lg font-bold">Consultation Log ({filteredPrescriptions.length} records)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {listLoading ? (
              <div className="p-12 text-center text-gray-400 italic">Loading prescriptions...</div>
            ) : filteredPrescriptions.length === 0 ? (
              <div className="p-12 text-center text-gray-400 italic">No prescriptions found. Click "+ Write Prescription" to generate one.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-zinc-800/40 text-gray-700 dark:text-zinc-300 font-bold border-b border-gray-150 dark:border-zinc-850">
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5">Rx Number</th>
                      <th className="px-6 py-3.5">Patient Details</th>
                      <th className="px-6 py-3.5">Diagnosis</th>
                      <th className="px-6 py-3.5">Medicines</th>
                      <th className="px-6 py-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {filteredPrescriptions.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/10 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-500">
                          {new Date(p.consultation_date).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-6 py-4 font-bold text-green-800 dark:text-green-450">{p.prescription_no}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 dark:text-white">{p.patient?.name || "—"}</p>
                          <p className="text-xs text-gray-400 font-semibold">{p.patient?.phone || "—"}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-650 dark:text-zinc-400 font-medium">
                          {p.diagnosis || <span className="text-gray-300 italic">No Diagnosis</span>}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-300 border border-green-200">
                            {p.medicines?.length || 0} items
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-3 h-8 rounded-lg"
                              onClick={() => {
                                const verifyUrl = `https://www.ayureva.in/prescription/${p.id}`;
                                const text = encodeURIComponent(
                                  `Hello ${p.patient?.name || "Patient"}, this is your official digital prescription from Dr. Arti Kumari (Ayureva). \n\nPrescription No: ${p.prescription_no}\nDate: ${new Date(p.consultation_date).toLocaleDateString("en-IN")}\n\nYou can verify your prescription and download the verified copy here: ${verifyUrl}\n\nThank you for choosing Ayureva.`
                                );
                                window.open(`https://api.whatsapp.com/send?phone=91${p.patient?.phone}&text=${text}`, "_blank");
                              }}
                            >
                              <Send className="w-3.5 h-3.5 mr-1" /> WhatsApp
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-200 text-green-700 bg-green-50/50 hover:bg-green-100 font-semibold text-xs px-3 h-8 rounded-lg"
                              onClick={() => handleEdit(p)}
                            >
                              <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-200 text-gray-705 font-semibold text-xs px-3 h-8 rounded-lg"
                              onClick={() => window.open(`/prescription/${p.id}`, "_blank")}
                            >
                              <Printer className="w-3.5 h-3.5 mr-1" /> View/Print
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-500 font-semibold text-xs px-2 h-8 rounded-lg"
                              onClick={() => {
                                const verifyUrl = `${window.location.origin}/prescription/${p.id}`;
                                navigator.clipboard.writeText(verifyUrl);
                                alert("Prescription verification link copied!");
                              }}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ================= VIEW: PRESCRIPTION CREATOR =================
  return (
    <div className="space-y-8 max-w-7xl mx-auto print:p-0 print:m-0">
      {/* Header bar - Hidden in Print */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-9 px-3 text-gray-500" onClick={() => setView("list")}>
              <ChevronLeft className="w-5 h-5 mr-1" /> Back to Dashboard
            </Button>
            <span className="text-gray-300">|</span>
            <Badge className={editingPrescriptionId ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}>
              {editingPrescriptionId ? "Editing Prescription" : "New Record"}
            </Badge>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-2">
            {editingPrescriptionId ? "Edit Prescription" : "Write Prescription"}
          </h2>
          <p className="text-gray-500 mt-1">Generate bilingual clinic prescriptions with database tracking and WhatsApp share.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" className="h-12" onClick={handlePrint}>
            <Printer className="w-5 h-5 mr-2" /> Print Preview
          </Button>
          <Button size="lg" className="h-12 bg-green-700 hover:bg-green-800 text-white" onClick={handleGenerateAndSend} disabled={submitLoading}>
            <Send className="w-5 h-5 mr-2" /> {submitLoading ? "Saving..." : editingPrescriptionId ? "Save & WhatsApp" : "Generate & WhatsApp"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 print:block">
        {/* Left Entry Form Column - Hidden in Print */}
        <div className="lg:col-span-7 space-y-6 print:hidden">
          {/* Patient Finder */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Search className="w-5 h-5 text-green-700" /> Patient Search / Add
              </CardTitle>
              <CardDescription>Search by mobile number to load records or create a new profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-3 text-sm text-gray-400 font-semibold">+91</span>
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit Mobile Number"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-12 h-11"
                    disabled={!!editingPrescriptionId}
                  />
                </div>
                <Button onClick={handlePatientSearch} variant="secondary" className="h-11 px-6 font-bold" disabled={searchLoading || !!editingPrescriptionId}>
                  {searchLoading ? "Searching..." : "Search / Load"}
                </Button>
              </div>
              {searchMessage && (
                <p className={`mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg ${searchMessage.includes("loaded") ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}>
                  {searchMessage}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Patient Profile Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-700" /> Patient Demographics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-650 block mb-1">Full Name *</label>
                  <Input
                    placeholder="e.g. Arti Singh"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-650 block mb-1">Age (Years)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 28"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-650 block mb-1">Gender</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-650 block mb-1">Blood Group</label>
                  <Input
                    placeholder="e.g. O+ve"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-650 block mb-1">Consultation Type</label>
                  <select
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2"
                  >
                    <option value="online">Online Video</option>
                    <option value="offline">Offline Clinic Visit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-650 block mb-1">Known Allergies</label>
                <Input
                  placeholder="e.g. Sulfa drugs, Dust (default: None)"
                  value={patientAllergies}
                  onChange={(e) => setPatientAllergies(e.target.value)}
                  className="h-10 border-red-150 focus:border-red-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-650 block mb-1">Address</label>
                <Input
                  placeholder="e.g. Patna, Bihar"
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  className="h-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Vitals & Clinical Notes */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-700" /> Clinical Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-650 block mb-1">BP (mmHg)</label>
                  <Input placeholder="120/80" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} className="h-10" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-650 block mb-1">Pulse (bpm)</label>
                  <Input placeholder="72" value={pulse} onChange={(e) => setPulse(e.target.value)} className="h-10" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-650 block mb-1">Weight (kg)</label>
                  <Input placeholder="58" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-10" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-650 block mb-1">Temp (°F)</label>
                  <Input placeholder="98.6" value={temperature} onChange={(e) => setTemperature(e.target.value)} className="h-10" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-650 block mb-1">Chief Complaints</label>
                  <Textarea
                    placeholder="e.g. Irregular periods, hair thinning"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-650 block mb-1">Diagnosis</label>
                  <Textarea
                    placeholder="e.g. PCOS (Polycystic Ovary Syndrome)"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rx / Medicines Prescribed */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-700" /> Medicines Prescription (Rx)
                </span>
                {templates.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">Use Template:</span>
                    <select
                      onChange={(e) => handleLoadTemplate(e.target.value)}
                      defaultValue=""
                      className="text-xs bg-gray-50 border border-gray-200 rounded-md p-1 h-8 focus:outline-none"
                    >
                      <option value="" disabled>Select template...</option>
                      {templates.map((t) => (
                        <option key={t.name} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicines.map((med, index) => (
                <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-150 relative">
                  <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-green-700 text-white font-bold text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  
                  <div className="flex-1 w-full">
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Medicine Name</label>
                    <Input
                      placeholder="e.g. Kanchanar Guggulu"
                      value={med.medicine_name}
                      onChange={(e) => handleMedicineChange(index, "medicine_name", e.target.value)}
                      className="h-9"
                    />
                  </div>
                  
                  <div className="w-full md:w-28">
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Dosage</label>
                    <Input
                      placeholder="e.g. 1-0-1"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                      className="h-9 text-center font-semibold"
                    />
                  </div>

                  <div className="w-full md:w-36">
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Timing</label>
                    <select
                      value={med.timing}
                      onChange={(e) => handleMedicineChange(index, "timing", e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none"
                    >
                      <option value="Before Food">Before Food</option>
                      <option value="After Food">After Food</option>
                      <option value="Empty Stomach">Empty Stomach</option>
                      <option value="At Bedtime">At Bedtime</option>
                      <option value="As directed">As directed</option>
                    </select>
                  </div>

                  <div className="w-full md:w-28">
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Duration</label>
                    <Input
                      placeholder="e.g. 15 days"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                      className="h-9 text-center"
                    />
                  </div>

                  <div className="flex-1 w-full">
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Special Remarks</label>
                    <Input
                      placeholder="e.g. with lukewarm water"
                      value={med.remarks}
                      onChange={(e) => handleMedicineChange(index, "remarks", e.target.value)}
                      className="h-9"
                    />
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => handleRemoveMedicine(index)} className="text-red-500 hover:text-red-700 h-10 w-10 p-0 self-end md:self-auto">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
              <Button onClick={handleAddMedicine} variant="outline" className="w-full border-dashed border-2 hover:bg-gray-50 h-11">
                <Plus className="w-4 h-4 mr-2" /> Add Medicine Row
              </Button>
            </CardContent>
          </Card>

          {/* Advice & Diagnostics */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-green-700" /> Instructions & Advice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-650 block mb-1">Investigations / Tests Advised</label>
                <Input
                  placeholder="e.g. USG Pelvis, Thyroid Profile"
                  value={testsAdvised}
                  onChange={(e) => setTestsAdvised(e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-650 block mb-1">Lifestyle & Diet Instructions (Pathyapathya)</label>
                <Textarea
                  placeholder="e.g. Avoid dairy, start 30 min morning walk, take tablets with warm water."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-650 block mb-1">Next Follow-up Date</label>
                  <Input
                    type="date"
                    value={nextFollowupDate}
                    onChange={(e) => setNextFollowupDate(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline / History */}
          {patientHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-700" /> Patient History Timeline
                </CardTitle>
                <CardDescription>Previous consultations and prescriptions saved for this number.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
                {patientHistory.map((hist) => (
                  <div key={hist.id} className="border-l-2 border-green-200 pl-4 py-2 relative">
                    <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-[14px]"></div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-gray-800">{hist.prescription_no}</span>
                      <span className="text-xs text-gray-400 font-semibold">
                        {new Date(hist.consultation_date).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-600 mt-1">Diagnosis: {hist.diagnosis || "N/A"}</p>
                    
                    {/* Medicines tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hist.medicines.map((m: any, idx: number) => (
                        <span key={idx} className="bg-gray-100 text-[10px] px-2 py-0.5 rounded-full font-medium text-gray-700">
                          {m.medicine_name} ({m.dosage})
                        </span>
                      ))}
                    </div>

                    {/* Resend and View Actions */}
                    <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          const verifyUrl = `${window.location.origin}/prescription/${hist.id}`;
                          const text = encodeURIComponent(
                            `Hello ${patientName || "Patient"}, this is your official digital prescription from Dr. Arti Kumari (Ayureva). \n\nPrescription No: ${hist.prescription_no}\nDate: ${new Date(hist.consultation_date).toLocaleDateString("en-IN")}\n\nYou can verify your prescription and download the verified copy here: ${verifyUrl}\n\nThank you for choosing Ayureva.`
                          );
                          window.open(`https://api.whatsapp.com/send?phone=91${patientPhone}&text=${text}`, "_blank");
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer border-none"
                      >
                        Send WhatsApp
                      </button>
                      <button
                        onClick={() => window.open(`/prescription/${hist.id}`, "_blank")}
                        className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-[10px] px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer"
                      >
                        View / Print
                      </button>
                      <button
                        onClick={() => {
                          const verifyUrl = `${window.location.origin}/prescription/${hist.id}`;
                          navigator.clipboard.writeText(verifyUrl);
                          alert("Prescription link copied to clipboard!");
                        }}
                        className="bg-gray-50 hover:bg-gray-100 text-gray-650 border border-gray-200 text-[10px] px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer"
                      >
                        Copy Link
                      </button>
                    </div>

                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Live Letterhead Preview Column */}
        <div className="lg:col-span-5 relative print:block print:p-0">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-3xl p-8 shadow-md print:shadow-none print:border-none print:p-0 max-w-[800px] mx-auto min-h-[1100px] flex flex-col justify-between">
            <div>
              {/* Top Branding Bar */}
              <div className="flex flex-col items-center justify-center border-b-2 border-green-800 pb-3 mb-4 text-center">
                <div className="flex items-center gap-2">
                  <svg className="w-8 h-8" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 25C30 8 10 18 6 30C12 40 38 38 50 34Z" fill="#C87A82" stroke="#1A2A3A" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M50 25C38 15 22 22 20 29C22 36 38 34 50 34Z" fill="#D3ECEF" stroke="#1A2A3A" strokeWidth="1" strokeLinejoin="round"/>
                    <path d="M50 25C70 8 90 18 94 30C88 40 62 38 50 34Z" fill="#C87A82" stroke="#1A2A3A" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M50 25C62 15 78 22 80 29C78 36 62 34 50 34Z" fill="#D3ECEF" stroke="#1A2A3A" strokeWidth="1" strokeLinejoin="round"/>
                    <rect x="48" y="22" width="4" height="88" rx="2" fill="#D4AF37" stroke="#1A2A3A" strokeWidth="1.2"/>
                    <circle cx="50" cy="18" r="6" fill="#E5C158" stroke="#1A2A3A" strokeWidth="1.2"/>
                    <path d="M50 32C55 32 62 38 62 44C62 50 48 52 38 56C28 60 28 66 38 72C48 78 62 80 62 86C62 92 48 94 38 98C28 102 28 108 38 114" stroke="#10633B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M50 32C45 32 38 38 38 44C38 50 52 52 62 56C72 60 72 66 62 72C52 78 38 80 38 86C38 92 52 94 62 98C72 102 72 108 62 114" stroke="#10633B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="36" cy="42" r="2.5" fill="#10633B"/>
                    <circle cx="64" cy="42" r="2.5" fill="#10633B"/>
                  </svg>
                  <span className="font-serif text-3xl font-black text-green-955 tracking-widest">AYUREVA</span>
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Authentic Ayurvedic Treatment & Consultation Center</p>
                <span className="mt-1 text-[11px] text-green-700 font-bold tracking-wide border border-green-200 bg-green-50 px-2.5 py-0.5 rounded-full">www.ayureva.in</span>
              </div>

              <div className="grid grid-cols-12 pb-3">
                {/* Left Side: English */}
                <div className="col-span-6 text-left text-[11px] leading-tight text-gray-700 font-medium font-sans">
                  <p className="font-bold text-sm text-green-955 uppercase tracking-wide">DR. ARTI KUMARI</p>
                  <p className="font-semibold italic text-gray-500 text-[10px]">(Medical officer)</p>
                  <p className="mt-1">B.A.M.S (G.A.C.H Patna)</p>
                  <p>C.R.I.T (N.M.C.H Patna)</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Reg. No.- 42</p>
                </div>

                {/* Right Side: Hindi */}
                <div className="col-span-6 text-right text-[11px] leading-tight text-gray-700 font-medium font-sans">
                  <p className="font-bold text-sm text-green-955 uppercase tracking-wide">डॉ. आरती कुमारी</p>
                  <p className="font-semibold italic text-gray-500 text-[10px]">(चिकित्सा पदाधिकारी)</p>
                  <p className="mt-1">बी.ए.एम.एस (जी.ए.सी.एच पटना)</p>
                  <p>सी.आर.आई.टी (एन.एम.सी.एच पटना)</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Mob. No.- 9608855210</p>
                </div>
              </div>

              {/* Specializations Red Sub-Note */}
              <div className="bg-red-50 text-red-700 border-b border-red-200 py-1.5 px-4 text-center text-[10px] font-bold tracking-wide">
                नोट: पेट, लीवर, फेफड़ा, किडनी, चर्म रोग, हड्डी रोग एवं स्त्री रोग संबंधित परामर्श
              </div>

              {/* Patient Details Section */}
              <div className="grid grid-cols-12 gap-y-2 border-b border-green-800 py-3.5 text-[11px] text-gray-800 font-semibold bg-gray-50/50 px-2 mt-2">
                <div className="col-span-6">Patient Name: <span className="text-gray-900 font-bold border-b border-gray-300 pb-0.5">{patientName || "____________________"}</span></div>
                <div className="col-span-3">Age: <span className="text-gray-900 font-bold border-b border-gray-300 pb-0.5">{patientAge || "____"}</span></div>
                <div className="col-span-3">Gender: <span className="text-gray-900 font-bold border-b border-gray-300 pb-0.5">{patientGender || "____"}</span></div>
                
                <div className="col-span-6">Phone Number: <span className="text-gray-900 font-bold border-b border-gray-300 pb-0.5">{patientPhone || "__________"}</span></div>
                <div className="col-span-3">Date: <span className="text-gray-900 font-bold border-b border-gray-300 pb-0.5">{new Date().toLocaleDateString("en-IN")}</span></div>
                <div className="col-span-3">Allergies: <span className="text-red-650 font-bold border-b border-gray-300 pb-0.5">{patientAllergies}</span></div>

                <div className="col-span-12 grid grid-cols-4 gap-2 border-t border-gray-100 pt-2 text-[10px] text-gray-600 font-medium">
                  <div>BP: <span className="text-gray-900 font-bold">{bloodPressure || "—"}</span></div>
                  <div>Pulse: <span className="text-gray-900 font-bold">{pulse || "—"}</span></div>
                  <div>Weight: <span className="text-gray-900 font-bold">{weight ? `${weight} kg` : "—"}</span></div>
                  <div>Temp: <span className="text-gray-900 font-bold">{temperature ? `${temperature} °F` : "—"}</span></div>
                </div>
              </div>

              {/* Rx Title */}
              <div className="text-xl font-serif font-black text-green-905 my-3">Rx</div>

              {/* Medicines List Preview */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-green-50/50 text-green-950 font-bold border-b border-gray-200">
                      <th className="px-3 py-1.5 w-8 text-center">S.No</th>
                      <th className="px-3 py-1.5">Medicine Name</th>
                      <th className="px-3 py-1.5">Dosage</th>
                      <th className="px-3 py-1.5">Timing</th>
                      <th className="px-3 py-1.5 w-16">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {medicines.map((med, index) => (
                      <tr key={index}>
                        <td className="px-3 py-1.5 text-center text-gray-400 font-semibold">{index + 1}</td>
                        <td className="px-3 py-1.5 font-bold text-gray-800">{med.medicine_name || <span className="text-gray-300 italic font-normal">Enter name</span>}</td>
                        <td className="px-3 py-1.5 font-medium">{med.dosage}</td>
                        <td className="px-3 py-1.5 font-medium">{med.timing}</td>
                        <td className="px-3 py-1.5 font-semibold">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes & Advised Tests Preview */}
              {(testsAdvised || doctorNotes) && (
                <div className="mt-4 border-t border-gray-100 pt-3 text-[11px] space-y-2">
                  {testsAdvised && (
                    <p className="text-gray-700">
                      <span className="font-bold text-green-955">Advised Investigation/Tests:</span> {testsAdvised}
                    </p>
                  )}
                  {doctorNotes && (
                    <div>
                      <span className="font-bold text-green-955">Dietary & Lifestyle Advice:</span>
                      <p className="text-gray-600 whitespace-pre-line mt-0.5">{doctorNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Print Footer */}
            <div className="mt-8 pt-4 border-t border-green-800 flex flex-col justify-end gap-4">
              <div className="flex justify-between items-end">
                {/* Dynamic Authenticity Verification QR Code */}
                <div className="text-[10px] text-gray-505 flex items-center gap-2">
                  {lastSavedPrescription ? (
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : 'https://www.ayureva.in'}/prescription/${lastSavedPrescription.id}`)}`}
                      alt="Verification QR Code" 
                      className="w-12 h-12 border border-gray-200 rounded p-0.5 object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded p-1 flex items-center justify-center font-bold text-[8px] uppercase text-gray-400 text-center">
                      QR Verify
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-800 text-[9px]">PRESCRIPTION VERIFICATION</p>
                    <p className="text-gray-405 text-[8px]">Scan to verify authenticity</p>
                    <p className="font-semibold text-green-700 text-[8px]">
                      No: {lastSavedPrescription?.prescription_no || "AY-2026-XXXXXX"}
                    </p>
                  </div>
                </div>

                {/* Follow-up Note */}
                {nextFollowupDate && (
                  <div className="text-[10px] font-bold text-green-950 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-green-700" />
                    <span>Next Follow-up: {new Date(nextFollowupDate).toLocaleDateString("en-IN")}</span>
                  </div>
                )}

                {/* Signature Placeholders */}
                <div className="text-center text-[10px] text-gray-500 pr-2">
                  <div className="w-24 h-8 bg-gray-55/50 rounded mb-1 flex items-center justify-center italic text-gray-405 text-[9px]">
                    Signature (Stored)
                  </div>
                  <p className="font-bold text-gray-700">Dr. Arti Kumari</p>
                  <p className="text-[8px]">Ayurvedic Consultant</p>
                </div>
              </div>

              {/* Legal Consent Disclaimer */}
              <p className="text-[8px] text-center text-gray-400 leading-normal border-t border-gray-100 pt-2 font-medium">
                Consent Note: This digital prescription is generated by Ayureva based on clinical video/offline consultation. In case of any drug allergy or worsening symptoms, stop the medicines and seek medical emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Printing Print Media Stylesheet - ONLY Active in Print Mode */}
      <style jsx global>{`
        @media print {
          /* Hide all page content except the letterhead preview */
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            background: white !important;
          }
          /* Hide buttons, forms, sidebar, headers in print */
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
