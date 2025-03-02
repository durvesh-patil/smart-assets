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

interface TemplateField {
  label: string;
  type: string;
  required: boolean;
}

interface Asset {
  _id: string;
  template_id: {
    id: string;
    name: string;
  };
  data: Record<string, unknown>;
}

interface AssetTemplate {
  id: string;
  name: string;
  fields: TemplateField[];
}

interface APITemplate {
  _id: string;
  name: string;
  fields: TemplateField[];
  created_at: string;
  updated_at: string;
  __v: number;
}

interface APIResponse {
  success: boolean;
  assetTemplates: APITemplate[];
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
      // Map the response data to match our expected format
      const mappedTemplates = response.data.assetTemplates.map(template => ({
        id: template._id,
        name: template.name,
        fields: template.fields
      }));
      setTemplates(mappedTemplates);
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
      const response = await axios.get(`${API_URL}/assets?templateId=${templateId}`);
      setAssets(response.data.assets || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setAssets([]);
    }
  };

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    const template = templates.find(t => t.id === value);
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
        data: formValues,
        templateId: selectedTemplate,
      });
      setDialogOpen(false);
      fetchAssets(selectedTemplate);
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center w-full">
        <Select 
          value={selectedTemplate} 
          onValueChange={handleTemplateChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder={isLoading ? "Loading templates..." : "Select a template"} />
          </SelectTrigger>
          <SelectContent>
            {templates && templates.length > 0 ? (
              templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
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
            <Button disabled={isLoading || templates.length === 0}>Add Asset</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select 
                value={selectedTemplate} 
                onValueChange={handleTemplateChange}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates && templates.length > 0 ? (
                    templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
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

              {templateFields?.map((field) => (
                <div key={field.label} className="space-y-2">
                  <Input
                    type={field.type}
                    placeholder={field.label}
                    required={field.required}
                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                  />
                </div>
              ))}

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {selectedTemplate && (
        <div className="w-full rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">ID</TableHead>
                {templateFields?.map((field) => (
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
                    {templateFields?.map((field) => (
                      <TableCell key={`${asset._id}-${field.label}`}>
                        {String(asset.data[field.label] || '')}
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