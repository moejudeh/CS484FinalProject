import { type SetStateAction, useEffect, useState } from "react";
import type { clothesItem, clothesType } from "../utils/types";

function Landing(AppProps: { email: string }) {
  const [closet, setCloset] = useState<Array<clothesItem>>([]); // will hold all users clothesItems
  const [types, setTypes] = useState<Array<string>>([]); // will hold all users clothesTypes

  const email = AppProps.email; // grabs user email from props

  useEffect(() => {
    // fetch all clothesItems from the database for the user
    async function fetchData() {
      try {
        const response = await fetch(
          `/api/clothesManagement/getItems?email=${email}`
        );
        const data = await response.json();

        data.flatMap((type: clothesType) => {
          // adds all types to the types array
          if (!types.includes(type.type))
            setTypes((oldTypes: Array<string>) => [...oldTypes, type.type]);

          // adds all clothesItems to the closet array
          type.clothesItems.flatMap((item: clothesItem) => {
            setCloset((oldCloset: Array<clothesItem>) => [...oldCloset, item]);
          });
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData(); // calls fetchData function to grab the clothes
  }, [email]); // include email in the dependency array

  // function to delete a clothesItem from the database
  async function deleteItem(event: React.MouseEvent<HTMLButtonElement>) {
    const id = event.currentTarget as HTMLButtonElement; // grabs the id of the clothesItem to delete
    const linkToDelete =
      id.parentElement?.firstElementChild?.getAttribute("src");

    // Find the item to delete and its type
    const itemToDelete = closet.find((item) => item.photoLink === linkToDelete);
    const deleteType = itemToDelete ? itemToDelete.type : "";

    // delete the clothesItem from the closet array
    const newCloset = closet.filter((item) => item.photoLink !== linkToDelete);
    setCloset(newCloset);

    console.log("Delete Type: " + deleteType);

    const bodyData = {
      email: email,
      clothesItem: { photoLink: linkToDelete, type: deleteType },
    };

    // deletes the clothesItem from the database
    try {
      const response = await fetch(`/api/clothesManagement/deleteItem`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div>
      <h1>Welcome to your closet</h1>
      <h2>Your clothes:</h2>
      <div>
        {types.map((type: string, index) => (
          <div key={index}>
            {closet.filter((item: clothesItem) => item.type === type).length >
            0 ? (
              <div className="typeGroup">
                <h3> {type} </h3>
                {closet
                  .filter((item: clothesItem) => item.type === type)
                  .map((item: clothesItem) => (
                    <div className="clothesItem">
                      <img src={item.photoLink} />
                      <button onClick={deleteItem}>Detele</button>
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;
