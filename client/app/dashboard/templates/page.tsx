"use client";
import { FormEvent, useState } from "react";
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
} from "@mui/material";
import axios from "axios";
import { API_URL } from "@/lib/constants";

function CreateTemplateForm() {
  const [template, setTemplate] = useState<object>({
    name: "",
    note: "",
    properties: [],
  });

  const addProperty = () => {
    setTemplate((prev) => ({
      ...prev,
      properties: [
        ...prev.properties,
        { label: "", type: "text", options: [], required: false },
      ],
    }));
  };

  const handlePropertyChange = (index, key, value) => {
    const updatedProperties = [...template.properties];
    updatedProperties[index][key] = value;
    setTemplate((prev) => ({ ...prev, properties: updatedProperties }));
  };

  const submitTemplate = async (e: FormEvent) => {
    e.preventDefault();
    console.log(template);
    const res = await axios.post(API_URL + "/templates", template);
    console.log(res);
    // Handle submitting the template to the server
  };

  return (
    <form onSubmit={submitTemplate}>
      <Box>
        <TextField
          label="Template Name"
          fullWidth
          value={template.name}
          onChange={(e) => setTemplate({ ...template, name: e.target.value })}
          margin="normal"
        />
        <TextareaAutosize
          minRows={3}
          style={{
            border: "1px solid #ccc", // Set your desired border color and style
            borderRadius: "4px", // Optional: Add border radius
            padding: "8px", // Optional: Add some padding
            width: "100%", // Optional: Set width
            boxSizing: "border-box", // Optional: Ensure padding and border are included in width
          }}
          value={template.note}
          onChange={(e) => setTemplate({ ...template, note: e.target.value })}
          placeholder="Add a note"
        />
        {template.properties.map((property, index) => (
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
                    handlePropertyChange(index, "required", e.target.checked)
                  }
                />
              }
              label="Required"
            />
          </Grid2>
        ))}
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
        Create Template
      </Button>
    </form>
  );
}

export default CreateTemplateForm;
