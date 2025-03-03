// useAssetTemplates.js
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";

export default function useAssetTemplates() {
  const [assetTemplates, setAssetTemplates] = useState([]);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API_URL}/templates`);
      console.log(response);
      setAssetTemplates(response.data.assetTemplates);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await axios.delete(`${API_URL}/templates/${templateId}`);
      await fetchTemplates(); // Refetch templates after deletion
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    assetTemplates,
    handleDeleteTemplate,
    setAssetTemplates,
    fetchTemplates,
  };
}
