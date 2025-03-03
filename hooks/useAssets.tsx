import { API_URL } from "@/lib/constants";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useAssets() {
  const [assetsList, setAssetsList] = useState<object[]>([]);
  useEffect(() => {
    async function getdata() {
      const data = await axios.get(API_URL + "/assets");
      if (data.status === 200) {
        console.log(data.data.assets);
        setAssetsList(data.data.assets);
      }
    }
    getdata();
  }, []);
  return { assetsList };
}
