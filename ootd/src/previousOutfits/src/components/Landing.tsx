import { useEffect, useState } from "react";
import type { clothesItem } from "../../../closet/src/utils/types";

function Landing(AppProps: { email: string }) {
  const email = AppProps.email; // grabs user email from props

  const date = new Date();
  const [year, setYear] = useState<number>(date.getFullYear());
  const [month, setMonth] = useState<number>(date.getMonth() + 1);
  const [day, setDay] = useState<number>(date.getDate());
  const [outfit, setOutfit] = useState<Array<clothesItem>>([]);

  // used to find number of days
  const numDays = (y: number, m: number) => new Date(y, m, 0).getDate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `/api/clothesManagement/getOutfit?email=${email}&year=${year}&month=${month}&day=${day}`
        );

        const data = await response.json();

        setOutfit(data.outfit);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchData();
    console.log(outfit);
  });

  return (
    <div>
      <h1>Previous Outfits</h1>

      <div>
        <h3>Select Outfit</h3>

        <input
          type="number"
          placeholder="month"
          value={month}
          onChange={(e) => {
            if (parseInt(e.target.value) > 12) {
              setMonth(12);
              setDay(1);
            } else if (parseInt(e.target.value) < 1) {
              setMonth(1);
              setDay(1);
            } else {
              setMonth(parseInt(e.target.value));
              setDay(1);
            }
          }}
        />

        <input
          type="number"
          placeholder="day"
          value={day}
          onChange={(e) => {
            if (parseInt(e.target.value) < 1) {
              setDay(1);
            } else if (parseInt(e.target.value) > numDays(year, month)) {
              setDay(numDays(year, month));
            } else {
              setDay(parseInt(e.target.value));
            }
          }}
        />

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => {
            if (parseInt(e.target.value) > date.getFullYear()) {
              setYear(date.getFullYear());
            } else {
              setYear(parseInt(e.target.value));
            }
          }}
        />
      </div>

      <div>
        <h2>
          Outfit for {month}/{day}/{year}
        </h2>
      </div>

      {outfit &&
        outfit.map((item: clothesItem) => (
          <div className="clothesItem">
            <h3>{item.type}</h3>
            <img src={item.photoLink} />
          </div>
        ))}

      {outfit.length === 0 && (
        <h3>
          No outfit found for {month}/{day}/{year}
        </h3>
      )}
    </div>
  );
}

export default Landing;
