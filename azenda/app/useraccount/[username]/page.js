'use client';

import TaskCalendar from '../../../components/Calendar';

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

//this function can be used to retrieve all events associated with a user and a specific day, so you click a day on the calendar and it retrieves events from it

//an example of the implementation can be found in ..\addeventsbyday\[custom_date]\page.js



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


async function getEventsbyDay(username, year_of, month_of, day_of)
{
  const res = await fetch(`http://localhost:8000/api/retrieve_Events_from_Day/?username=${username}&date_year=${year_of}&date_month=${month_of}&date_day=${day_of}`, {
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
  const [eventItems, setEventItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to the current date
  const [selectedYear, setSelectedYear] = useState(); // Default to the current date
  const [selectedMonth, setSelectedMonth] = useState(); // Default to the current date
  const [selectedDay, setSelectedDay] = useState(); // Default to the current date

  const router = useRouter();
  const params = useSearchParams();
  const dynamic_param = useParams();
  const user_name = dynamic_param.username || "default_user"; // Replace with actual user retrieval logic

  const [displaySuccessMessage, setDisplaySuccessMessage] = useState({
    show: false,
    type: "",
  });

  // Fetch events on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEventsbyDay(user_name, selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate());
        setEventItems(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [user_name, selectedDate]);

  // Handle deletion of an event
  const handleDelete = (id) => {
    setEventItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <main className="main-container">
        <div className="calendar-section">
            <TaskCalendar onDateChange={(date) => setSelectedDate(date)}/>
            <button
                className="add-button"
                onClick={() => router.push(`${user_name}/add-repeating-events`)}
            >
                Add Repeating Events
            </button>
            <button
                className="add-button"
                onClick={() => router.push(`${user_name}/optimize-tasks`)}
            >
                Optimize Tasks
            </button>
        </div>
        <div className="event-box-section">
            <h2 className="text-2xl font-semibold text-center mb-4">Enter Task for Selected Date</h2>
            <h2 className="text-2xl font-semibold text-center mb-4">Selected Date: {selectedDate.toDateString()}</h2>

            <button
                className="add-button"
                onClick={() => router.push(`${user_name}/addeventsbyday/${selectedDate.getMonth() + 1}-${selectedDate.getDate()}-${selectedDate.getFullYear()}/addevents`)}
            >
                Add Event
            </button>
            {eventItems.length > 0 ? (
                eventItems.map((item) => (
                    <Eventbox
                        key={item.id}
                        id={item.id}
                        event_name={item.event_name}
                        allows_concurrent_events={item.allows_concurrent_events}
                        start_time={item.start_time}
                        duration_mins={item.duration_mins}
                        onEdit={() => router.push(`${user_name}/addeventsbyday/${selectedDate.getMonth() + 1}-${selectedDate.getDate()}-${selectedDate.getFullYear()}/edit/${item.id}`)}
                        onDelete={handleDelete}
                    />
                ))
            ) : (
                <p>No events available</p>
            )}
        </div>

    </main>
  );
}