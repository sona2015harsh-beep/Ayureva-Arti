"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Search, Printer, Send, Activity, BookOpen, Calendar, HelpCircle, FileText, CheckCircle2 } from "lucide-react"

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
  medicines: {
    medicine_name: string
    dosage: string
    timing: string
    duration: string
  }[]
}

export default function PrescriptionClient() {
  const searchParams = useSearchParams()
  const paramLeadId = searchParams.get("leadId")
  const paramPatientId = searchParams.get("patientId")

  // Form State
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
  const [patientHistory, setPatientHistory] = useState<PrescriptionHistory[]>([])
  const [templates, setTemplates] = useState<{ name: string; description: string; medicines: MedicineRow[] }[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [lastSavedPrescription, setLastSavedPrescription] = useState<any>(null)

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
            
            // Fetch patient history directly
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
      const res = await fetch("/api/prescriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.success) {
        const prescription = data.prescription
        setLastSavedPrescription(prescription)

        // Refresh History
        handlePatientSearch()

        // Update CRM Lead status and timeline if linked
        if (paramLeadId) {
          try {
            await fetch('/api/leads', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: paramLeadId,
                status: 'rx_sent',
                timelineEvent: `Prescription generated & shared. Serial No: ${prescription.prescription_no}`
              })
            });
          } catch (leadUpdateErr) {
            console.error("Failed to update lead status:", leadUpdateErr);
          }
        }

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

  return (
    <div className="space-y-8 max-w-7xl mx-auto print:p-0 print:m-0">
      {/* Header bar - Hidden in Print */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 print:hidden">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Prescription Creator</h2>
          <p className="text-gray-500 mt-1">Generate bilingual clinic prescriptions with database tracking and WhatsApp share.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" className="h-12" onClick={handlePrint}>
            <Printer className="w-5 h-5 mr-2" /> Print Prescription
          </Button>
          <Button size="lg" className="h-12 bg-green-600 hover:bg-green-700 text-white" onClick={handleGenerateAndSend} disabled={submitLoading}>
            <Send className="w-5 h-5 mr-2" /> {submitLoading ? "Saving..." : "Generate & WhatsApp"}
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
                  <Input
                    placeholder="Patient Mobile (10 Digits)"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-4 h-11"
                  />
                </div>
                <Button className="h-11 bg-green-700 hover:bg-green-800 text-white px-5" onClick={handlePatientSearch} disabled={searchLoading}>
                  {searchLoading ? "Loading..." : "Search"}
                </Button>
              </div>
              {searchMessage && (
                <p className={`text-sm mt-2 font-medium ${searchMessage.includes("loaded") ? "text-green-700" : "text-gray-500"}`}>
                  {searchMessage}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Vitals & Clinical entries */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-700" /> Patient Vitals & Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vitals row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Blood Pressure</label>
                  <Input placeholder="e.g. 120/80" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Pulse (bpm)</label>
                  <Input placeholder="e.g. 72" value={pulse} onChange={(e) => setPulse(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Weight (kg)</label>
                  <Input placeholder="e.g. 64" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Temperature (°F)</label>
                  <Input placeholder="e.g. 98.6" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
                </div>
              </div>

              {/* Patient Profile row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Patient Name *</label>
                  <Input placeholder="Full Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Age *</label>
                  <Input placeholder="Age" type="number" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Gender *</label>
                  <select
                    className="w-full h-10 px-3 border rounded-md text-sm text-gray-700 bg-white"
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Allergies</label>
                  <Input placeholder="e.g. Pollen, Penicillin" value={patientAllergies} onChange={(e) => setPatientAllergies(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Blood Group</label>
                  <Input placeholder="e.g. O+ve" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Consultation Mode</label>
                  <select
                    className="w-full h-10 px-3 border rounded-md text-sm text-gray-700 bg-white"
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                  >
                    <option value="online">Online Consultation</option>
                    <option value="offline">Offline / Clinic Visit</option>
                  </select>
                </div>
              </div>

              {/* Complaints & Diagnosis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Chief Complaints</label>
                  <Textarea
                    placeholder="Describe patient complaints (e.g. Irregular periods, acne, weight gain)"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Diagnosis</label>
                  <Textarea
                    placeholder="Clinical Diagnosis (e.g. PCOS/PCOD, Hypothyroidism)"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Advices */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Lifestyle / Diet Advice</label>
                  <Textarea
                    placeholder="Diet notes, exercise, yoga, guidelines"
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Investigations Advised</label>
                  <Textarea
                    placeholder="Lab tests, scans (e.g. CBC, TSH, USG)"
                    value={testsAdvised}
                    onChange={(e) => setTestsAdvised(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Next Follow-up Date</label>
                  <Input type="date" value={nextFollowupDate} onChange={(e) => setNextFollowupDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Patient Home Address</label>
                  <Input placeholder="City, State" value={patientAddress} onChange={(e) => setPatientAddress(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medicines Entry */}
          <Card>
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-700" /> Prescribed Medicines
                </CardTitle>
                <CardDescription>Add medicines or load standard protocols.</CardDescription>
              </div>
              <div>
                <select
                  className="px-2 py-1.5 border rounded-md text-xs bg-white font-medium"
                  onChange={(e) => handleLoadTemplate(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Load Protocol Template</option>
                  {templates.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicines.map((med, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-2 border-b pb-4 md:border-0 md:pb-0 items-start md:items-center">
                  <div className="flex-1 w-full">
                    <Input
                      placeholder="Medicine Name"
                      value={med.medicine_name}
                      onChange={(e) => handleMedicineChange(index, "medicine_name", e.target.value)}
                      className="font-medium"
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <Input
                      placeholder="Dosage (e.g. 1-0-1)"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-36">
                    <Input
                      placeholder="Timing (e.g. After Food)"
                      value={med.timing}
                      onChange={(e) => handleMedicineChange(index, "timing", e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-28">
                    <Input
                      placeholder="Duration"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-40">
                    <Input
                      placeholder="Remarks"
                      value={med.remarks}
                      onChange={(e) => handleMedicineChange(index, "remarks", e.target.value)}
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
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hist.medicines.map((m, idx) => (
                        <span key={idx} className="bg-gray-100 text-[10px] px-2 py-0.5 rounded-full font-medium text-gray-700">
                          {m.medicine_name} ({m.dosage})
                        </span>
                      ))}
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
            {/* Bilingual Header */}
            <div>
              <div className="grid grid-cols-12 items-center border-b-2 border-green-800 pb-4">
                {/* Left Side: English */}
                <div className="col-span-5 text-left text-[11px] leading-tight text-gray-700 font-medium font-sans">
                  <p className="font-bold text-sm text-green-950 uppercase tracking-wide">DR. ARTI KUMARI</p>
                  <p className="font-semibold italic text-gray-500 text-[10px]">(Medical officer)</p>
                  <p className="mt-1">B.A.M.S (G.A.C.H Patna)</p>
                  <p>C.R.I.T (N.M.C.H Patna)</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Reg. No.- 42</p>
                </div>

                {/* Center: Medical Symbol */}
                <div className="col-span-2 flex justify-center">
                  <svg className="w-12 h-12 text-green-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A3,3 0 0,0 9,5C9,6.23 9.75,7.29 10.83,7.71C10.2,8.4 9.42,9.33 8.78,10.37C8.75,10.32 8.71,10.28 8.67,10.24C7.58,9.15 5.82,9.15 4.73,10.24C3.64,11.33 3.64,13.09 4.73,14.18L4.93,14.38C5.7,15.15 6.84,15.35 7.82,14.97C8.16,14.65 8.44,14.31 8.72,13.92C8.74,14.34 8.77,14.78 8.79,15.24C7.81,15.53 6.94,16.2 6.44,17.15C6.11,16.82 5.67,16.62 5.17,16.62A2,2 0 0,0 3.17,18.62A2,2 0 0,0 5.17,20.62C5.97,20.62 6.64,20.08 6.84,19.33C7.63,18.47 8.75,18.06 9.87,18.04C10.15,19.06 10.74,20.03 11.6,20.73L12,21.05L12.4,20.73C13.26,20.03 13.85,19.06 14.13,18.04C15.25,18.06 16.37,18.47 17.16,19.33C17.36,20.08 18.03,20.62 18.83,20.62A2,2 0 0,0 20.83,18.62A2,2 0 0,0 18.83,16.62C18.33,16.62 17.89,16.82 17.56,17.15C17.06,16.2 16.19,15.53 15.21,15.24C15.23,14.78 15.26,14.34 15.28,13.92C15.56,14.31 15.84,14.65 16.18,14.97C17.16,15.35 18.3,15.15 19.07,14.38L19.27,14.18C20.36,13.09 20.36,11.33 19.27,10.24C18.18,9.15 16.42,9.15 15.33,10.24C15.29,10.28 15.25,10.32 15.22,10.37C14.58,9.33 13.8,8.4 13.17,7.71C14.25,7.29 15,6.23 15,5A3,3 0 0,0 12,2M12,4A1,1 0 0,1 13,5A1,1 0 0,1 12,6A1,1 0 0,1 11,5A1,1 0 0,1 12,4Z" />
                  </svg>
                </div>

                {/* Right Side: Hindi */}
                <div className="col-span-5 text-right text-[11px] leading-tight text-gray-700 font-medium font-sans">
                  <p className="font-bold text-sm text-green-950 uppercase tracking-wide">डॉ. आरती कुमारी</p>
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
                <div className="col-span-3">Allergies: <span className="text-red-600 font-bold border-b border-gray-300 pb-0.5">{patientAllergies}</span></div>

                <div className="col-span-12 grid grid-cols-4 gap-2 border-t border-gray-100 pt-2 text-[10px] text-gray-600 font-medium">
                  <div>BP: <span className="text-gray-900 font-bold">{bloodPressure || "—"}</span></div>
                  <div>Pulse: <span className="text-gray-900 font-bold">{pulse || "—"}</span></div>
                  <div>Weight: <span className="text-gray-900 font-bold">{weight ? `${weight} kg` : "—"}</span></div>
                  <div>Temp: <span className="text-gray-900 font-bold">{temperature ? `${temperature} °F` : "—"}</span></div>
                </div>
              </div>

              {/* Chief Complaints & Diagnosis */}
              {(chiefComplaint || diagnosis) && (
                <div className="grid grid-cols-2 gap-4 py-3.5 border-b border-gray-100 text-[11px] leading-relaxed">
                  {chiefComplaint && (
                    <div>
                      <p className="font-bold text-green-900 uppercase text-[9px] tracking-wide mb-1">Chief Complaints:</p>
                      <p className="text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">{chiefComplaint}</p>
                    </div>
                  )}
                  {diagnosis && (
                    <div>
                      <p className="font-bold text-green-900 uppercase text-[9px] tracking-wide mb-1">Diagnosis:</p>
                      <p className="text-gray-800 bg-green-50/30 p-2 rounded-lg border border-green-100 font-bold">{diagnosis}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Prescription Body Rx */}
              <div className="py-5 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold font-serif text-green-900">Rx</span>
                  <div className="h-0.5 bg-green-800 flex-1"></div>
                </div>

                <table className="w-full text-left text-[11px] font-sans">
                  <thead>
                    <tr className="border-b border-gray-200 text-green-900 font-bold uppercase text-[9px] tracking-wide">
                      <th className="pb-2 w-[40%]">Medicine Name</th>
                      <th className="pb-2 text-center w-[15%]">Dosage</th>
                      <th className="pb-2 text-center w-[20%]">Timing</th>
                      <th className="pb-2 text-center w-[12%]">Duration</th>
                      <th className="pb-2 text-right w-[13%]">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-2.5 font-bold text-gray-900">{med.medicine_name || "__________________"}</td>
                        <td className="py-2.5 text-center text-gray-700 font-semibold">{med.dosage || "—"}</td>
                        <td className="py-2.5 text-center text-gray-700 font-semibold">{med.timing || "—"}</td>
                        <td className="py-2.5 text-center text-gray-700 font-semibold">{med.duration || "—"}</td>
                        <td className="py-2.5 text-right text-gray-500 font-medium">{med.remarks || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Doctor notes & Investigations */}
              {(doctorNotes || testsAdvised) && (
                <div className="grid grid-cols-12 gap-4 py-4 border-t border-gray-100 text-[11px] mt-4">
                  {doctorNotes && (
                    <div className="col-span-8">
                      <p className="font-bold text-green-900 uppercase text-[9px] tracking-wide mb-1">Lifestyle & Diet Advice:</p>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{doctorNotes}</p>
                    </div>
                  )}
                  {testsAdvised && (
                    <div className="col-span-4 border-l border-gray-100 pl-4">
                      <p className="font-bold text-green-900 uppercase text-[9px] tracking-wide mb-1">Tests Advised:</p>
                      <p className="text-gray-700 font-bold whitespace-pre-wrap leading-relaxed">{testsAdvised}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Print Footer */}
            <div className="mt-8 pt-4 border-t border-green-800 flex flex-col justify-end gap-4">
              <div className="flex justify-between items-end">
                {/* QR Code Validation Mock */}
                <div className="text-[10px] text-gray-500 flex items-center gap-2">
                  <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded p-1 flex items-center justify-center font-bold text-[8px] uppercase text-gray-400 text-center">
                    QR Verify
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-[9px]">PRESCRIPTION VERIFICATION</p>
                    <p className="text-gray-400 text-[8px]">Scan to verify authenticity</p>
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
                  <div className="w-24 h-8 bg-gray-50/50 rounded mb-1 flex items-center justify-center italic text-gray-400 text-[9px]">
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
