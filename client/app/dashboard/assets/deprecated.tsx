"use client";
import useAssets from "@/hooks/useAssets";
import useAssetTemplates from "@/hooks/useAssetTemplates";
import { API_URL } from "@/lib/constants";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { IAsset } from "@/models/Asset";
import { IAssetTemplate } from "@/models/AssetTemplate";
import type { SelectChangeEvent } from '@mui/material';

interface TemplateField {
  label: string;
  type: string;
  required: boolean;
}

export default function Assets() {
  const { assetsList } = useAssets();
  const { assetTemplates } = useAssetTemplates();
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templateFields, setTemplateFields] = useState<TemplateField[]>([]);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTemplate("");
    setTemplateFields([]);
    setFormValues({});
  };

  const handleTemplateChange = (_event: unknown, value: IAssetTemplate | null) => {
    const templateId = value?.id || "";
    setSelectedTemplate(templateId);

    if (value) {
      setTemplateFields(value.fields as TemplateField[] || []);
      setFormValues({});
    } else {
      setTemplateFields([]);
      setFormValues({});
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/assets`, {
        data: formValues,
        templateId: selectedTemplate,
      });
      console.log("Asset created successfully:", response);
      handleClose();
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };

  // Get the fields to display in the table
  const getTableFields = () => {
    // Get fields directly from the selected template
    const currentTemplate = assetTemplates?.find(
      (template: any) => template.id === selectedTemplate
    );
    
    if (currentTemplate?.fields) {
      return currentTemplate.fields.map((field: TemplateField) => field.label);
    }
    
    return [];
  };

  const tableFields = getTableFields();

  // Filter assets based on the selected template ID
  const filteredAssets = selectedTemplate 
    ? assetsList.filter((asset: any) => asset.template_id?.id === selectedTemplate)
    : [];

  return (
    <Box>
      <Box display="flex" width="80vw" justifyContent="space-between">
        <Box>
          <Autocomplete
            options={assetTemplates || []}
            renderInput={(params) => (
              <TextField {...params} label="Select Template" />
            )}
            getOptionLabel={(option: IAssetTemplate) => option.name}
            onChange={handleTemplateChange}
            sx={{ width: "300px" }}
          />
        </Box>
        <Box>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add Asset
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  options={assetTemplates || []}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Template" />
                  )}
                  getOptionLabel={(option: IAssetTemplate) => option.name}
                  onChange={handleTemplateChange}
                  sx={{ width: "300px" }}
                />
              </FormControl>
              <form onSubmit={handleSubmit}>
                {templateFields?.map((field: TemplateField, index: number) => (
                  <TextField
                    key={`${field.label}-${index}`}
                    label={field.label}
                    type={field.type}
                    fullWidth
                    margin="normal"
                    required={field.required}
                    name={field.label}
                    onChange={handleInputChange}
                  />
                ))}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </Box>
      </Box>

      {/* Assets Table - Only show when a template is selected */}
      {selectedTemplate && (
        <Box mt={4}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  {tableFields.map((field) => (
                    <TableCell key={field}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={tableFields.length + 1} align="center">
                      No assets found for this template
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset: IAsset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{asset.id}</TableCell>
                      {tableFields.map((field) => (
                        <TableCell key={field}>
                          {asset.data && asset.data[field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}
