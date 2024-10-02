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
} from "@mui/material";

function CreateTemplateForm() {
  const [template, setTemplate] = useState<object>({
    name: "",
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

  const submitTemplate = (e: FormEvent) => {
    e.preventDefault();
    console.log(template);
    // Handle submitting the template to the server
  };

  return (
    <form onSubmit={submitTemplate}>
      <TextField
        label="Template Name"
        fullWidth
        value={template.name}
        onChange={(e) => setTemplate({ ...template, name: e.target.value })}
        margin="normal"
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
