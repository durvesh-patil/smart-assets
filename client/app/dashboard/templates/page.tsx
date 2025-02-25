"use client";
import { FormEvent, useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Grid2,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { Delete, Edit } from "@mui/icons-material";
import useAssetTemplates from "@/hooks/useAssetTemplates";

function CreateTemplateForm() {
  const [template, setTemplate] = useState({
    name: "",
    note: "",
    fields: [],
  });

  // const [templates, setTemplates] = useState([]); // State to hold fetched templates
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to track if editing
  const {
    assetTemplates: templates,
    handleDeleteTemplate,
    setAssetTemplates: setTemplates,
    fetchTemplates,
  } = useAssetTemplates();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${API_URL}/templates`);
        console.log(response);
        setTemplates(response.data.assetTemplates); // Assuming the response has a `templates` array
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, []);

  const addProperty = () => {
    setTemplate((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        { label: "", type: "text", options: [], required: false },
      ],
    }));
  };

  const handlePropertyChange = (index, key, value) => {
    const updatedFields = [...template.fields];
    updatedFields[index][key] = value;
    setTemplate((prev) => ({ ...prev, fields: updatedFields }));
  };

  const submitTemplate = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update template logic
        const res = await axios.put(
          `${API_URL}/templates/${template.id}`,
          template
        );
        console.log(res);
      } else {
        // Create new template logic
        const res = await axios.post(`${API_URL}/templates`, template);
        fetchTemplates();
        console.log(res);
      }
      // Optionally, refetch templates after creating or updating one
      const response = await axios.get(`${API_URL}/templates`);
      setTemplates(response.data.templates);
      handleClose(); // Close the dialog after submitting
    } catch (error) {
      console.error("Error creating/updating template:", error);
    }
  };

  const handleClickOpen = (selectedTemplate = null) => {
    if (selectedTemplate) {
      setTemplate(selectedTemplate);
      setIsEditing(true);
    } else {
      setTemplate({ name: "", note: "", fields: [] }); // Reset for new template
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset template state when closing the dialog
    setTemplate({ name: "", note: "", fields: [] });
    setIsEditing(false); // Reset editing state
  };

  console.log(templates);
  return (
    <Box>
      <Box>
        <Button variant="outlined" onClick={() => handleClickOpen()}>
          Add Template
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>
            {isEditing ? "Update Template" : "Create New Template"}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={submitTemplate}>
              <Box>
                <TextField
                  label="Template Name"
                  fullWidth
                  value={template.name}
                  onChange={(e) =>
                    setTemplate({ ...template, name: e.target.value })
                  }
                  margin="normal"
                />

                {template.fields?.map((property, index) => (
                  <Grid2 container spacing={2} key={index} alignItems="center">
                    <TextField
                      label="Property Label"
                      fullWidth
                      value={property.label}
                      onChange={(e) =>
                        handlePropertyChange(index, "label", e.target.value)
                      }
                    />
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={property.type}
                        onChange={(e) =>
                          handlePropertyChange(index, "type", e.target.value)
                        }
                      >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="number">Number</MenuItem>
                        <MenuItem value="select">Select</MenuItem>
                      </Select>
                    </FormControl>
                    {property.type === "select" && (
                      <TextField
                        label="Options (comma-separated)"
                        fullWidth
                        value={property.options.join(", ")}
                        onChange={(e) =>
                          handlePropertyChange(
                            index,
                            "options",
                            e.target.value.split(",")
                          )
                        }
                      />
                    )}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={property.required}
                          onChange={(e) =>
                            handlePropertyChange(
                              index,
                              "required",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Required"
                    />
                  </Grid2>
                ))}
                <TextareaAutosize
                  minRows={3}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  value={template.note}
                  onChange={(e) =>
                    setTemplate({ ...template, note: e.target.value })
                  }
                  placeholder="Add a note"
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={addProperty}
                style={{ marginTop: "20px" }}
              >
                Add Property
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                style={{ marginTop: "20px", marginLeft: "10px" }}
              >
                {isEditing ? "Update Template" : "Create Template"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Box>

      {/* Display templates as cards */}
      <Box mt={4} display="flex" flexDirection="column" gap={2}>
        {templates?.map((template) => (
          <Card key={template.id}>
            <CardContent>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box pr={"20px"}>
                  <Typography variant="h5">{template.name}</Typography>
                  {/* <Typography variant="body1">{template.notes}</Typography> */}
                </Box>
                <Box>
                  <Button onClick={() => handleClickOpen(template)}>
                    <Edit />
                  </Button>
                  <Button onClick={() => handleDeleteTemplate(template.id)}>
                    <Delete />
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default CreateTemplateForm;
