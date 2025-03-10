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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";
import axios from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

interface TemplateField {
  label: string;
  type: string;
  required: boolean;
}

interface Asset {
  _id: string;
  template_id: {
    _id: string;
    name: string;
    fields: TemplateField[];
  };
  assigned_to?: {
    _id: string;
    fullName: string;
  };
  created_by?: {
    _id: string;
    name: string;
  };
  data: Record<string, unknown>;
  created_at: string;
  last_updated_at: string;
}

interface AssetTemplate {
  _id: string;
  name: string;
  fields: TemplateField[];
}

interface APIResponse {
  success: boolean;
  assetTemplates: AssetTemplate[];
}

export default function Assets() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templateFields, setTemplateFields] = useState<TemplateField[]>([]);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [assets, setAssets] = useState<Asset[]>([]);
  const [templates, setTemplates] = useState<AssetTemplate[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<APIResponse>(`${API_URL}/templates`);
      setTemplates(response.data.assetTemplates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch assets for selected template
  const fetchAssets = async (templateId: string) => {
    try {
      const response = await axios.get(`${API_URL}/assets?template_id=${templateId}`);
      setAssets(response.data.assets || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setAssets([]);
    }
  };

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    const template = templates.find(t => t._id === value);
    if (template) {
      setTemplateFields(template.fields);
      fetchAssets(value);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/assets`, {
        template_id: selectedTemplate,
        name: formValues["Name"],
        data: formValues
      });
      setDialogOpen(false);
      setFormValues({});
      fetchAssets(selectedTemplate);
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-start w-full">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Asset Management</h2>
          <p className="text-muted-foreground">
            Manage and track your organization&apos;s assets
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select 
            value={selectedTemplate} 
            onValueChange={handleTemplateChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder={isLoading ? "Loading templates..." : "Select a template"} />
            </SelectTrigger>
            <SelectContent>
              {templates && templates.length > 0 ? (
                templates.map((template) => (
                  <SelectItem key={template._id} value={template._id}>
                    {template.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="placeholder" disabled>
                  {isLoading ? "Loading..." : "No templates available"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={isLoading || templates.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {templateFields?.map((field) => (
                  <div key={field.label} className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {field.label} {field.required && '*'}
                    </label>
                    <Input
                      type={field.type}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.label, e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                ))}

                <div className="pt-4">
                  <Button type="submit" className="w-full">
                    Add Asset
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {selectedTemplate && (
        <div className="w-full rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">ID</TableHead>
                {templateFields?.filter(field => field.required || field.label !== "Name").map((field) => (
                  <TableHead key={field.label}>
                    {field.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={templateFields.length + 1} 
                    className="text-center"
                  >
                    No assets found for this template
                  </TableCell>
                </TableRow>
              ) : (
                assets.map((asset) => (
                  <TableRow key={asset._id}>
                    <TableCell key={`${asset._id}-id`} className="font-medium">
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
                    {templateFields?.filter(field => field.required || field.label !== "Name").map((field) => (
                      <TableCell key={`${asset._id}-${field.label}`}>
                        {String(asset.data?.[field.label] ?? '')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}