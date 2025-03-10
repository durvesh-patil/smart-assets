"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";
import axios from "axios";
import { Plus, Trash2, CheckCircle2, XCircle, Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RequestType,
  RequestStatus,
  type Request,
  type Employee,
  type AssetTemplate,
} from "@/app/types/request";

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [templates, setTemplates] = useState<AssetTemplate[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [formData, setFormData] = useState({
    request_type: RequestType.REPLACEMENT,
    employee: "",
    asset_id: "",
    asset_template: "",
    reason: "",
    notes: "",
    transfer_to: "",
    replacement_reason: "",
  });
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">(
    "all"
  );
  const [typeFilter, setTypeFilter] = useState<RequestType | "all">("all");

  useEffect(() => {
    fetchRequests();
    fetchEmployees();
    fetchTemplates();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      let url = `${API_URL}/requests`;
      const params = new URLSearchParams();

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees`);
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API_URL}/templates`);
      setTemplates(response.data.assetTemplates || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setTemplates([]);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/requests`, formData);
      setDialogOpen(false);
      resetForm();
      fetchRequests();
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  const handleStatusChange = async (
    requestId: string,
    newStatus: RequestStatus
  ) => {
    try {
      await axios.put(`${API_URL}/requests/${requestId}`, {
        status: newStatus,
      });
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const handleDelete = async (requestId: string) => {
    try {
      await axios.delete(`${API_URL}/requests/${requestId}`);
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      request_type: RequestType.REPLACEMENT,
      employee: "",
      asset_id: "",
      asset_template: "",
      reason: "",
      notes: "",
      transfer_to: "",
      replacement_reason: "",
    });
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.APPROVED:
        return "text-green-600";
      case RequestStatus.REJECTED:
        return "text-red-600";
      case RequestStatus.COMPLETED:
        return "text-blue-600";
      case RequestStatus.CANCELLED:
        return "text-gray-600";
      default:
        return "text-yellow-600";
    }
  };

  const pendingRequests = requests.filter(
    (r) => r.status === RequestStatus.PENDING
  );
  console.log("pendingRequests", pendingRequests);
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-start w-full">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Asset Requests</h2>
          <p className="text-muted-foreground">
            Manage and track asset requests from employees
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Request Type *</label>
                  <Select
                    value={formData.request_type}
                    onValueChange={(value) =>
                      handleInputChange("request_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(RequestType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee *</label>
                  <Select
                    value={formData.employee}
                    onValueChange={(value) =>
                      handleInputChange("employee", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee._id} value={employee._id}>
                          {employee.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Asset Template *
                  </label>
                  <Select
                    value={formData.asset_template}
                    onValueChange={(value) =>
                      handleInputChange("asset_template", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template._id} value={template._id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset ID *</label>
                  <Input
                    placeholder="Enter asset ID"
                    value={formData.asset_id}
                    onChange={(e) =>
                      handleInputChange("asset_id", e.target.value)
                    }
                    required
                  />
                </div>

                {formData.request_type === RequestType.TRANSFER && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transfer To *</label>
                    <Select
                      value={formData.transfer_to}
                      onValueChange={(value) =>
                        handleInputChange("transfer_to", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee._id} value={employee._id}>
                            {employee.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.request_type === RequestType.REPLACEMENT && (
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">
                      Replacement Reason *
                    </label>
                    <Input
                      placeholder="Enter replacement reason"
                      value={formData.replacement_reason}
                      onChange={(e) =>
                        handleInputChange("replacement_reason", e.target.value)
                      }
                      required={
                        formData.request_type === RequestType.REPLACEMENT
                      }
                    />
                  </div>
                )}

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Reason *</label>
                  <Input
                    placeholder="Enter reason for request"
                    value={formData.reason}
                    onChange={(e) =>
                      handleInputChange("reason", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">
                    Additional Notes
                  </label>
                  <Input
                    placeholder="Enter additional notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Fields marked with * are required
                </p>
                <Button type="submit" className="w-full">
                  Create Request
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending Requests
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No pending requests
              </div>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request._id} className="relative">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">
                        {request.request_type} Request
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      From: {request.employee?.email || "Unassigned"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Asset:</span>
                        <span>
                          {request.asset?.data?.Name ||
                            request.asset?.template_id?.name ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Template:</span>
                        <span>{request.asset?.template_id?.name || "N/A"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Created:</span>
                        <span>
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <p className="text-sm font-medium">Reason:</p>
                        <p className="text-sm text-muted-foreground">
                          {request.reason}
                        </p>
                      </div>
                      {request.notes && (
                        <div className="border-t pt-2 mt-2">
                          <p className="text-sm font-medium">
                            Additional Notes:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.notes}
                          </p>
                        </div>
                      )}
                      <div className="flex gap-2 justify-end pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleStatusChange(
                              request._id,
                              RequestStatus.APPROVED
                            )
                          }
                          className="hover:bg-green-100 hover:text-green-600"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleStatusChange(
                              request._id,
                              RequestStatus.REJECTED
                            )
                          }
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="flex items-center gap-4 mb-4">
            <Select
              value={statusFilter}
              onValueChange={(value: RequestStatus | "all") => {
                setStatusFilter(value);
                fetchRequests();
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.values(RequestStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={(value: RequestType | "all") => {
                setTypeFilter(value);
                fetchRequests();
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.values(RequestType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {isLoading ? "Loading requests..." : "No requests found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell className="font-medium">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="cursor-help">
                              {request._id.slice(0, 4)}...
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{request._id}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="capitalize">
                        {request.request_type}
                      </TableCell>
                      <TableCell>{request.employee?.email}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="cursor-help">
                              {request.asset_template}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Asset ID: {request.asset_id}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <span className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {request.status === RequestStatus.PENDING && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleStatusChange(
                                    request._id,
                                    RequestStatus.APPROVED
                                  )
                                }
                                className="hover:bg-green-100 hover:text-green-600"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleStatusChange(
                                    request._id,
                                    RequestStatus.REJECTED
                                  )
                                }
                                className="hover:bg-red-100 hover:text-red-600"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-destructive/90 hover:text-destructive-foreground"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Request
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this request?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(request._id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {selectedRequest && (
        <Dialog
          open={!!selectedRequest}
          onOpenChange={() => setSelectedRequest(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Request Type</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedRequest.request_type}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p
                    className={`text-sm ${getStatusColor(
                      selectedRequest.status
                    )}`}
                  >
                    {selectedRequest.status.charAt(0).toUpperCase() +
                      selectedRequest.status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Employee</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.employee?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Asset Template</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.asset_template}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Asset ID</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.asset_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Created At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedRequest.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Reason</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.reason}
                </p>
              </div>

              {selectedRequest.notes && (
                <div>
                  <p className="text-sm font-medium">Additional Notes</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}

              {selectedRequest.request_type === RequestType.TRANSFER &&
                selectedRequest.transfer_to && (
                  <div>
                    <p className="text-sm font-medium">Transfer To</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.transfer_to.fullName}
                    </p>
                  </div>
                )}

              {selectedRequest.request_type === RequestType.REPLACEMENT &&
                selectedRequest.replacement_reason && (
                  <div>
                    <p className="text-sm font-medium">Replacement Reason</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.replacement_reason}
                    </p>
                  </div>
                )}

              {selectedRequest.status === RequestStatus.PENDING && (
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleStatusChange(
                        selectedRequest._id,
                        RequestStatus.APPROVED
                      )
                    }
                    className="hover:bg-green-100 hover:text-green-600"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleStatusChange(
                        selectedRequest._id,
                        RequestStatus.REJECTED
                      )
                    }
                    className="hover:bg-red-100 hover:text-red-600"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
