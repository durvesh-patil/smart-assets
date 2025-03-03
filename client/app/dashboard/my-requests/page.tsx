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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { RequestType, RequestStatus } from "@/app/types/request";

interface Request {
  _id: string;
  request_type: RequestType;
  status: RequestStatus;
  asset_id: string;
  asset_template: {
    _id: string;
    name: string;
  };
  reason: string;
  notes?: string;
  created_at: string;
}

interface Asset {
  _id: string;
  template_id: {
    _id: string;
    name: string;
  };
}

interface AssetTemplate {
  _id: string;
  name: string;
}

export default function MyRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [templates, setTemplates] = useState<AssetTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    request_type: "",
    asset_id: "",
    asset_template: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    fetchMyRequests();
    fetchMyAssets();
    fetchTemplates();
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
      const response = await axios.get(`${API_URL}/assets/my-assets/${user.id}`);
      setAssets(response.data.assets || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setAssets([]);
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
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await axios.post(`${API_URL}/requests`, {
        ...formData,
        employee: user.id,
      });
      setDialogOpen(false);
      setFormData({
        request_type: "",
        asset_id: "",
        asset_template: "",
        reason: "",
        notes: "",
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
                      {assets.map((asset) => (
                        <SelectItem key={asset._id} value={asset._id}>
                          {asset.template_id.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.request_type === RequestType.TRANSFER && (
                <>
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
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {assets.map((asset) => (
                          <SelectItem key={asset._id} value={asset._id}>
                            {asset.template_id.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transfer To</label>
                    <Input
                      placeholder="Employee ID"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      required
                    />
                  </div>
                </>
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
                      {assets.map((asset) => (
                        <SelectItem key={asset._id} value={asset._id}>
                          {asset.template_id.name}
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
                  <TableCell>{request.asset_template.name}</TableCell>
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