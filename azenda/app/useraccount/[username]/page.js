'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";




async function deleteEvent(id) 
{
    const res = await fetch(`http://localhost:8000/api/event/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete event");
    }
    return Promise.resolve();
}

async function getEvents(username)
{
  const res = await fetch(`http://localhost:8000/api/retrieveUserEvents/?username=${username}`, {
      method: "GET",
  });
  if (!res.ok) {
    console.log("didn't work")
    throw new Error("Failed to create event");
  }
  console.log("worked")

  return res.json();
}




const Eventbox = ({ id, event_name, allows_concurrent_events, start_time, duration_mins, onEdit, onDelete }) => {
    return (
      <div className="menu-item" data-id={id}>
        <div className="menu-item-info">
          <div className="menu-item-name">{event_name}</div>
          <div className="menu-item-name">{allows_concurrent_events}</div>
          <div className="menu-item-name">{start_time}</div>
          <div className="menu-item-name">{duration_mins}</div>
        </div>
        <div className="menu-item-actions">
          <button className="edit-button" onClick={onEdit}>
            Edit
          </button>
          <button
            className="delete-button"
            onClick={() => {
              deleteEvent(id).then(() => onDelete(id));
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
};

export default function Page() {
  const [eventItems, setEventItems] = useState(null);
  const router = useRouter();
  const params = useSearchParams();
  const dynamic_param = useParams();
  const user_name = dynamic_param.username;

  // State for displaying a success message
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState({
    show: false,
    type: "", // either 'add' or 'update'
  });

  // Fetch menu items on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getEvents(user_name);
      setEventItems(data);
    };
    fetchData().catch(console.error);
  }, [user_name]);

  // Detect changes in URL parameters for success messages
  useEffect(() => {
    if (!!params.get("action")) {
      setDisplaySuccessMessage({
        type: params.get("action"),
        show: true,
      });
      router.replace("/");
    }
  }, [params, router]);

  // Automatically hide the success message after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (displaySuccessMessage.show) {
        setDisplaySuccessMessage({ show: false, type: "" });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [displaySuccessMessage.show]);

  // Handle deletion of a menu item
  const handleDelete = (id) => {
    setEventItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <button className="add-button" onClick={() => router.push(`/useraccount/${user_name}/addevents`)}>
        Add
      </button>
      {displaySuccessMessage.show && (
        <p className="success-message">
          {displaySuccessMessage.type === "add" ? "Added a" : "Modified a"} menu
          item.
        </p>
      )}
      {eventItems ? (
        eventItems.map((item) => (
          <Eventbox
            key={item.id}
            id={item.id}
            event_name={item.event_name}
            allows_concurrent_events={item.allows_concurrent_events}
            start_time={item.start_time}
            duration_mins={item.duration_mins}
            onEdit={() => router.push(`${user_name}/edit/${item.id}`)}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}