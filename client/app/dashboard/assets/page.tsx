"use client";
import useAssets from "@/hooks/useAssets";
import useAssetTemplates from "@/hooks/useAssetTemplates";
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
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Assets() {
  const { assetsList } = useAssets();
  const { assetTemplates } = useAssetTemplates(); // Fetch asset templates
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateFields, setTemplateFields] = useState([]);
  const [formValues, setFormValues] = useState({}); // State to hold form field values

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTemplate(""); // Reset selected template when closing
    setTemplateFields([]); // Clear template fields
    setFormValues({}); // Reset form values
  };

  const handleTemplateChange = (event) => {
    const templateId = event.target.value;
    setSelectedTemplate(templateId);

    // Find the selected template and set its fields
    const selectedAssetTemplate = assetTemplates.find(
      (template) => template.id === templateId
    );
    if (selectedAssetTemplate) {
      setTemplateFields(selectedAssetTemplate.fields);
      setFormValues({}); // Reset form values for the new template
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(name,value)
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value, // Update the specific field in the formValues state
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can handle form submission, e.g., send data to your API
    console.log("Form Values: ", formValues);
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Asset
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Asset</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Asset Template</InputLabel>
            <Select value={selectedTemplate} onChange={handleTemplateChange}>
              {assetTemplates?.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <form onSubmit={handleSubmit}>
            {templateFields?.map((field, index) => (
              <TextField
                key={index}
                label={field.label}
                type={field.type}
                fullWidth
                margin="normal"
                required={field.required}
                name={field.label}
                onChange={handleInputChange} // Handle change for inputs
              />
            ))}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Box>assets page</Box>
    </Box>
  );
}
