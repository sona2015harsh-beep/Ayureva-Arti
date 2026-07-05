'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Search, FileText, Calendar, ArrowRight, UserCheck, PlusCircle, RefreshCw, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';

interface TimelineEvent {
  status: string;
  created_at: string;
  note: string;
}

interface Lead {
    id: string;
    full_name: string;
    phone_number: string;
    message: string;
    status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'rx_sent' | 'converted' | 'follow_up' | 'closed';
    source: 'google' | 'instagram' | 'facebook' | 'referral' | 'direct' | 'whatsapp';
    notes: string | null;
    patient_id: string | null;
    timeline: TimelineEvent[] | null;
    created_at: string;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sourceFilter, setSourceFilter] = useState("all");
    
    // CRM Panel State
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [crmNotes, setCrmNotes] = useState("");
    const [crmSource, setCrmSource] = useState("");
    const [customEventText, setCustomEventText] = useState("");
    const [savingCrm, setSavingCrm] = useState(false);
    
    const { toast } = useToast();

    useEffect(() => {
        fetchLeads();
    }, [statusFilter, sourceFilter]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            let url = `/api/leads?status=${statusFilter}&source=${sourceFilter}`;
            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
            } else {
                toast({
                    title: "Fetch Error",
                    description: "Failed to load inquiries from Supabase.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/leads', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });
            
            if (res.ok) {
                const data = await res.json();
                
                // Update local list
                setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus as any, timeline: data.lead.timeline, patient_id: data.lead.patient_id } : l));
                
                // If updated lead is currently selected, update details panel
                if (selectedLead && selectedLead.id === id) {
                    setSelectedLead({ ...selectedLead, status: newStatus as any, timeline: data.lead.timeline, patient_id: data.lead.patient_id });
                }

                toast({
                    title: "Status Updated",
                    description: `Lead marked as ${newStatus} in Supabase.`,
                });
            } else {
                toast({
                    title: "Update Failed",
                    description: "Database status update failed.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveCrmDetails = async () => {
        if (!selectedLead) return;
        setSavingCrm(true);

        try {
            const payload: any = {
                id: selectedLead.id,
                notes: crmNotes,
                source: crmSource,
            };

            if (customEventText) {
                payload.timelineEvent = customEventText;
            }

            const res = await fetch('/api/leads', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                
                // Update local lists
                setLeads(leads.map(l => l.id === selectedLead.id ? data.lead : l));
                setSelectedLead(data.lead);
                setCustomEventText(""); // reset input

                toast({
                    title: "CRM Saved",
                    description: "Lead details and timeline updated successfully.",
                });
            } else {
                toast({
                    title: "Save Failed",
                    description: "Failed to persist CRM updates.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSavingCrm(false);
        }
    };

    const handleSelectLead = (lead: Lead) => {
        setSelectedLead(lead);
        setCrmNotes(lead.notes || "");
        setCrmSource(lead.source);
        setCustomEventText("");
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'converted': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Converted</Badge>;
            case 'rx_sent': return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">Rx Sent</Badge>;
            case 'scheduled': return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200">Scheduled</Badge>;
            case 'completed': return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">Completed</Badge>;
            case 'contacted': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Contacted</Badge>;
            case 'follow_up': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200">Follow-up Due</Badge>;
            case 'rejected': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Rejected</Badge>;
            case 'closed': return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">Closed</Badge>;
            default: return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">New Lead</Badge>;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'converted': return 'bg-green-50 text-green-800 border-green-200';
            case 'rx_sent': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            case 'scheduled': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
            case 'completed': return 'bg-purple-50 text-purple-800 border-purple-200';
            case 'contacted': return 'bg-blue-50 text-blue-800 border-blue-200';
            case 'follow_up': return 'bg-orange-50 text-orange-800 border-orange-200';
            case 'rejected': return 'bg-red-50 text-red-800 border-red-200';
            case 'closed': return 'bg-gray-50 text-gray-800 border-gray-200';
            default: return 'bg-yellow-50 text-yellow-800 border-yellow-200';
        }
    };

    // Calculate Dashboard Analytics
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const convertedLeads = leads.filter(l => l.status === 'converted' || l.status === 'rx_sent').length;
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Lead CRM</h1>
                    <p className="text-gray-500 mt-1">Track conversions, manage appointments, and trigger prescriptions.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchLeads} variant="outline" className="h-10">
                        <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                    </Button>
                </div>
            </div>

            {/* Analytics Dashboard Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white border-green-100">
                    <CardContent className="p-5 flex flex-col justify-between">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Leads</span>
                        <span className="text-3xl font-black text-green-950 mt-2">{totalLeads}</span>
                    </CardContent>
                </Card>
                <Card className="bg-white border-green-100">
                    <CardContent className="p-5 flex flex-col justify-between">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">New Inquiries</span>
                        <span className="text-3xl font-black text-yellow-600 mt-2">{newLeads}</span>
                    </CardContent>
                </Card>
                <Card className="bg-white border-green-100">
                    <CardContent className="p-5 flex flex-col justify-between">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Converted Patients</span>
                        <span className="text-3xl font-black text-green-700 mt-2">{convertedLeads}</span>
                    </CardContent>
                </Card>
                <Card className="bg-white border-green-100">
                    <CardContent className="p-5 flex flex-col justify-between">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Conversion Rate</span>
                        <span className="text-3xl font-black text-indigo-700 mt-2">{conversionRate}%</span>
                    </CardContent>
                </Card>
            </div>

            {/* Filters Section */}
            <div className="grid md:grid-cols-12 gap-3 bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
                <div className="md:col-span-6 relative">
                    <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-400" />
                    <Input
                        placeholder="Search by student name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
                        className="pl-10 h-10"
                    />
                </div>
                <div className="md:col-span-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full h-10 px-3 border rounded-md text-sm text-gray-700 bg-white"
                    >
                        <option value="all">All Lifecycles</option>
                        <option value="new">New Inquiries</option>
                        <option value="contacted">Contacted</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="rx_sent">Rx Sent</option>
                        <option value="converted">Converted</option>
                        <option value="follow_up">Follow-up Due</option>
                        <option value="rejected">Rejected</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
                <div className="md:col-span-3">
                    <select
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        className="w-full h-10 px-3 border rounded-md text-sm text-gray-700 bg-white"
                    >
                        <option value="all">All Traffic Sources</option>
                        <option value="google">Google Search</option>
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="referral">Referral</option>
                        <option value="direct">Direct Traffic</option>
                        <option value="whatsapp">WhatsApp / Chat</option>
                    </select>
                </div>
            </div>

            {/* Split Screen Grid (Table + Side CRM Panel) */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">
                <div className={`${selectedLead ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-300`}>
                    <div className="border rounded-xl bg-white shadow-sm overflow-hidden border-gray-150">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead className="py-3 font-semibold text-gray-600">Date</TableHead>
                                    <TableHead className="py-3 font-semibold text-gray-600">Lead Detail</TableHead>
                                    <TableHead className="py-3 font-semibold text-gray-600">Status</TableHead>
                                    <TableHead className="py-3 font-semibold text-gray-600 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads.map((lead) => (
                                    <TableRow
                                        key={lead.id}
                                        className={`hover:bg-gray-50/50 cursor-pointer ${selectedLead?.id === lead.id ? 'bg-green-50/30' : ''}`}
                                        onClick={() => handleSelectLead(lead)}
                                    >
                                        <TableCell className="whitespace-nowrap font-medium text-gray-400 text-xs">
                                            {format(new Date(lead.created_at), 'MMM d, p')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm">{lead.full_name}</span>
                                                <span className="font-mono text-xs text-gray-400 mt-0.5">{lead.phone_number}</span>
                                                <span className="bg-gray-100 text-[10px] text-gray-600 font-semibold px-2 py-0.5 rounded-full mt-1.5 w-max">
                                                    Source: {lead.source}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Select
                                                defaultValue={lead.status}
                                                onValueChange={(val) => updateStatus(lead.id, val)}
                                            >
                                                <SelectTrigger className={`w-[140px] h-8 font-semibold text-xs ${getStatusColor(lead.status)}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="new">New Lead</SelectItem>
                                                    <SelectItem value="contacted">Contacted</SelectItem>
                                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="rx_sent">Rx Sent</SelectItem>
                                                    <SelectItem value="converted">Converted</SelectItem>
                                                    <SelectItem value="follow_up">Follow-up Due</SelectItem>
                                                    <SelectItem value="rejected">Rejected</SelectItem>
                                                    <SelectItem value="closed">Closed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleSelectLead(lead)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-500" />
                                                </Button>
                                                <Link
                                                    href={
                                                        lead.patient_id
                                                            ? `/admin/prescriptions?patientId=${lead.patient_id}&leadId=${lead.id}`
                                                            : `/admin/prescriptions?leadId=${lead.id}`
                                                    }
                                                >
                                                    <Button size="sm" className="h-8 bg-green-700 hover:bg-green-800 text-white font-bold text-xs">
                                                        <PlusCircle className="w-3.5 h-3.5 mr-1" /> Rx
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {leads.length === 0 && !loading && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-gray-400 font-medium">
                                            No inquiries matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* CRM Details Slide Panel */}
                {selectedLead && (
                    <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b pb-3">
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">{selectedLead.full_name}</h3>
                                <p className="text-xs font-mono text-gray-400">{selectedLead.phone_number}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-700">
                                Close Panel ✕
                            </Button>
                        </div>

                        {/* Direct Patient link indicator */}
                        {selectedLead.patient_id ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 flex items-center gap-2 text-xs font-semibold text-green-800">
                                <UserCheck className="w-4 h-4 text-green-700" />
                                <span>Linked to Patient profile in database</span>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 flex items-center gap-2 text-xs font-semibold text-yellow-800">
                                <Clock className="w-4 h-4 text-yellow-700" />
                                <span>No Patient record linked yet (pending Conversion)</span>
                            </div>
                        )}

                        {/* CRM Config */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Traffic Source</label>
                                <select
                                    value={crmSource}
                                    onChange={(e) => setCrmSource(e.target.value)}
                                    className="w-full h-9 px-3 border rounded-md text-xs text-gray-700 bg-white"
                                >
                                    <option value="google">Google Search</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="referral">Referral</option>
                                    <option value="direct">Direct Traffic</option>
                                    <option value="whatsapp">WhatsApp / Chat</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Internal Notes (Staff Only)</label>
                                <Textarea
                                    value={crmNotes}
                                    onChange={(e) => setCrmNotes(e.target.value)}
                                    placeholder="Write medical history summaries, consultation timings request, or follow-up details..."
                                    rows={4}
                                    className="text-xs"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Add Timeline Event (Auditing)</label>
                                <Input
                                    value={customEventText}
                                    onChange={(e) => setCustomEventText(e.target.value)}
                                    placeholder="e.g. Sent pricing catalog on WhatsApp"
                                    className="text-xs h-9"
                                />
                            </div>

                            <Button onClick={handleSaveCrmDetails} disabled={savingCrm} className="w-full bg-green-700 hover:bg-green-800 text-white font-bold h-9 text-xs">
                                {savingCrm ? "Saving Updates..." : "Save CRM Details"}
                            </Button>
                        </div>

                        {/* Timeline logs */}
                        <div className="border-t pt-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-green-700" /> Interaction & Status Timeline
                            </h4>
                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                                {Array.isArray(selectedLead.timeline) && (selectedLead.timeline as TimelineEvent[]).map((evt, idx) => (
                                    <div key={idx} className="border-l border-green-200 pl-3 py-1 relative">
                                        <div className="absolute w-2 h-2 bg-green-600 rounded-full -left-[4.5px] top-[14px]"></div>
                                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold">
                                            <span className="uppercase text-green-850 font-bold">{evt.status}</span>
                                            <span>{format(new Date(evt.created_at), 'MMM d, h:mm a')}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-600 mt-1 font-medium leading-relaxed">{evt.note}</p>
                                    </div>
                                ))}
                                {(!selectedLead.timeline || (selectedLead.timeline as TimelineEvent[]).length === 0) && (
                                    <p className="text-xs text-gray-400 italic">No events logged yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
