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

  const getAssetDisplayName = (asset: Asset) => {
    console.log(asset)
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading assets...
                </TableCell>
              </TableRow>
            ) : assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
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
                    <Badge variant="success">
                      Active
                    </Badge>
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