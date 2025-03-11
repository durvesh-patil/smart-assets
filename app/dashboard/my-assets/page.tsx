"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RequestType } from "@/app/types/request";

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
  data: Record<string, unknown>;
  created_at: string;
  last_updated_at: string;
}

export default function MyAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchMyAssets();
  }, []);

  const fetchMyAssets = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await axios.get(`${API_URL}/assets/my-assets/${user.id}`);
      setAssets(response.data.assets || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setAssets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnRequest = async () => {
    if (!selectedAsset || !returnReason.trim()) return;

    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await axios.post(`${API_URL}/requests`, {
        request_type: RequestType.RETURN,
        asset_id: selectedAsset._id,
        reason: returnReason,
        asset_template: selectedAsset.template_id._id,
        employee: user.id
      });

      // Reset form
      setReturnReason("");
      setSelectedAsset(null);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error creating return request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAssetDisplayName = (asset: Asset): string => {
    // First try to use the asset name
    if (asset.name) {
      return asset.name;
    }

    // Then try to find the "Name" field in data
    if (asset.data?.Name) {
      return String(asset.data.Name);
    }

    // Finally fall back to template name with first required field value
    const firstRequiredField = asset.template_id.fields.find(field => field.required);
    if (firstRequiredField && asset.data?.[firstRequiredField.label]) {
      return `${asset.template_id.name} - ${String(asset.data[firstRequiredField.label])}`;
    }

    // If nothing else, just show template name
    return asset.template_id.name;
  };

  const getImportantFields = (asset: Asset) => {
    // Filter out the Name field since we're showing it separately
    return asset.template_id.fields
      .filter(field => field.required && field.label !== "Name")
      .map(field => ({
        label: field.label,
        value: asset.data[field.label] || "N/A"
      }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">My Assets</h2>
          <p className="text-muted-foreground">
            View all assets assigned to you
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Key Details</TableHead>
              <TableHead>Assigned Date</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading assets...
                </TableCell>
              </TableRow>
            ) : assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No assets assigned to you
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset._id}>
                  <TableCell className="font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help text-left">
                          {getAssetDisplayName(asset)}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Asset ID: {asset._id}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {asset.template_id.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getImportantFields(asset).map(({ label, value }) => (
                        <div key={label} className="text-sm">
                          <span className="font-medium">{label}:</span>{" "}
                          {String(value)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(asset.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog open={dialogOpen && selectedAsset?._id === asset._id} onOpenChange={(open) => {
                      setDialogOpen(open);
                      if (!open) {
                        setSelectedAsset(null);
                        setReturnReason("");
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedAsset(asset)}
                        >
                          Return
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Return Asset</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Asset</p>
                            <p className="text-sm text-muted-foreground">
                              {getAssetDisplayName(asset)}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Reason for Return
                            </label>
                            <Textarea
                              placeholder="Please provide a reason for returning this asset"
                              value={returnReason}
                              onChange={(e) => setReturnReason(e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={handleReturnRequest}
                            disabled={isSubmitting || !returnReason.trim()}
                          >
                            {isSubmitting ? "Submitting..." : "Submit Return Request"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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