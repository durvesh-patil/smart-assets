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

interface Asset {
  _id: string;
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
              <TableHead className="w-[200px]">ID</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Loading assets...
                </TableCell>
              </TableRow>
            ) : assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No assets assigned to you
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset._id}>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">
                          {asset._id.slice(0, 4)}...
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{asset._id}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{asset.template_id.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {asset.template_id.fields.map((field) => (
                        <div key={field.label} className="text-sm">
                          <span className="font-medium">{field.label}:</span>{" "}
                          {String(asset.data[field.label] || "N/A")}
                        </div>
                      ))}
                    </div>
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