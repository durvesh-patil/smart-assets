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

export default function Assets() {
  const { assetsList } = useAssets();
  const { assetTemplates } = useAssetTemplates();
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateFields, setTemplateFields] = useState([]);
  const [formValues, setFormValues] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTemplate("");
    setTemplateFields([]);
    setFormValues({});
  };

  const handleTemplateChange = (event, value) => {
    const templateId = value?.id; // Get selected template ID from the value
    console.log(event, value);
    setSelectedTemplate(templateId);

    const selectedAssetTemplate = assetTemplates.find(
      (template) => template.id === templateId
    );
    if (selectedAssetTemplate) {
      setTemplateFields(selectedAssetTemplate.fields);
      setFormValues({});
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/assets`, {
        data: formValues,
        templateId: selectedTemplate, // include template ID if needed by the backend
      });
      console.log("Asset created successfully:", response);
      handleClose(); // Close the dialog after successful submission
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };

  // Filter assets based on the selected template ID
  const filteredAssets = assetsList.filter(
    (asset) => asset.template_id?.id === selectedTemplate // Match against template_id.id for populated template info
  );

  return (
    <Box>
      <Box display={"flex"} width={"80vw"} justifyContent={"space-between"}>
        <Box>
          <Autocomplete
            options={assetTemplates || []}
            renderInput={(params) => (
              <TextField {...params} label="Template..." />
            )}
            getOptionLabel={(option) => option.name}
            onChange={handleTemplateChange} // Update to handle selection
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
                    <TextField {...params} label="Template..." />
                  )}
                  getOptionLabel={(option) => option.name}
                  onChange={handleTemplateChange} // Update to handle selection
                  sx={{ width: "300px" }}
                />
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

      {/* Assets Table - only display if a template is selected */}
      {selectedTemplate && (
        <Box mt={4}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  {filteredAssets.length > 0 &&
                    Object.keys(filteredAssets[0].data).map((field) => (
                      <TableCell key={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.id}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.status}</TableCell>
                    {Object.keys(asset.data).map((field) => (
                      <TableCell key={field}>{asset.data[field]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}
