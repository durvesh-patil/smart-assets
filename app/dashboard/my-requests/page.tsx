"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";
import axios from "axios";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { RequestType, RequestStatus } from "@/app/types/request";

interface Request {
  _id: string;
  request_type: RequestType;
  status: RequestStatus;
  asset_id: string;
  asset: {
    _id: string;
    name?: string;
    template_id: {
      _id: string;
      name: string;
      fields: {
        label: string;
        type: string;
        required: boolean;
      }[];
    };
    data: Record<string, string | number | boolean | null>;
  };
  reason: string;
  notes?: string;
  created_at: string;
}

interface Asset {
  _id: string;
  name?: string;
  template_id: {
    _id: string;
    name: string;
    fields: {
      label: string;
      type: string;
      required: boolean;
    }[];
  };
  assigned_to: string | null;
  data: Record<string, string | number | boolean | null>;
}

export default function MyRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [assignedAssets, setAssignedAssets] = useState<Asset[]>([]);
  const [unassignedAssets, setUnassignedAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    request_type: "",
    asset_id: "",
    reason: "",
    notes: ""
  });

  useEffect(() => {
    fetchMyRequests();
    fetchMyAssets();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await axios.get(`${API_URL}/requests?employee=${user.id}`);
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyAssets = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!user.id) {
        console.error("User not logged in");
        setAssignedAssets([]);
        setUnassignedAssets([]);
        return;
      }

      // Fetch assigned assets
      const assignedResponse = await axios.get(`${API_URL}/assets/my-assets/${user.id}`);
      setAssignedAssets(assignedResponse.data.assets || []);

      // Fetch unassigned assets
      const unassignedResponse = await axios.get(`${API_URL}/assets/unassigned`);
      setUnassignedAssets(unassignedResponse.data.assets || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setAssignedAssets([]);
      setUnassignedAssets([]);
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
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Get the selected asset
      const selectedAsset = formData.request_type === RequestType.TRANSFER
        ? unassignedAssets.find(a => a._id === formData.asset_id)
        : assignedAssets.find(a => a._id === formData.asset_id);

      await axios.post(`${API_URL}/requests`, {
        request_type: formData.request_type,
        asset_id: formData.asset_id,
        reason: formData.reason,
        notes: formData.notes,
        employee: user.id,
        asset_template: selectedAsset?.template_id._id
      });

      setDialogOpen(false);
      setFormData({
        request_type: "",
        asset_id: "",
        reason: "",
        notes: ""
      });
      fetchMyRequests();
    } catch (error) {
      console.error("Error creating request:", error);
    }
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

  const getAssetDisplayName = (asset: Asset | Request['asset']) => {
    // First try to use the asset name
    if (asset.name) {
      return asset.name;
    }

    // Then try to find the "Name" field in data
    if (asset.data?.Name) {
      return asset.data.Name;
    }

    // Finally fall back to template name with first required field value
    const firstRequiredField = asset.template_id.fields.find(field => field.required);
    if (firstRequiredField && asset.data?.[firstRequiredField.label]) {
      return `${asset.template_id.name} - ${asset.data[firstRequiredField.label]}`;
    }

    // If nothing else, just show template name
    return asset.template_id.name;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">My Requests</h2>
          <p className="text-muted-foreground">
            View and manage your asset requests
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Request Type</label>
                <Select
                  value={formData.request_type}
                  onValueChange={(value) =>
                    handleInputChange("request_type", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
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

              {formData.request_type === RequestType.REPLACEMENT && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset to Replace</label>
                  <Select
                    value={formData.asset_id}
                    onValueChange={(value) =>
                      handleInputChange("asset_id", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignedAssets.map((asset) => (
                        <SelectItem key={asset._id} value={asset._id}>
                          {getAssetDisplayName(asset)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.request_type === RequestType.TRANSFER && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset to Transfer</label>
                  <Select
                    value={formData.asset_id}
                    onValueChange={(value) =>
                      handleInputChange("asset_id", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unassigned asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {unassignedAssets.map((asset) => (
                        <SelectItem key={asset._id} value={asset._id}>
                          {getAssetDisplayName(asset)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.request_type === RequestType.RETURN && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset to Return</label>
                  <Select
                    value={formData.asset_id}
                    onValueChange={(value) =>
                      handleInputChange("asset_id", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignedAssets.map((asset) => (
                        <SelectItem key={asset._id} value={asset._id}>
                          {getAssetDisplayName(asset)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason</label>
                <Textarea
                  placeholder="Enter reason for request"
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading requests...
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell className="capitalize">
                    {request.request_type}
                  </TableCell>
                  <TableCell>
                    {request.asset ? getAssetDisplayName(request.asset) : 'N/A'}
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <span className={getStatusColor(request.status)}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(request.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 