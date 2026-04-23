import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/inventory").then((res) => setData(res.data));
  }, []);

  return (
    <div>
      {data.map((item) => (
        <div key={item._id}>
          {item.item} - {item.quantity}
        </div>
      ))}
    </div>
  );
}
