import { API_URL } from "@/lib/constants";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useAssets() {
  const [assetsList, setAssetsList] = useState<object[]>([]);
  useEffect(() => {
    async function getdata() {
      const data = await axios.get(API_URL + "/assets");
      if (data.status === 200) {
        setAssetsList(data.data.assets);
      }
    }
    getdata();
  }, []);
  return { assetsList };
}
