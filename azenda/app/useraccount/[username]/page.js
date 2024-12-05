'use client';

import TaskCalendar from '../../../components/Calendar';

//this function can be used to retrieve all events associated with a user and a specific day, so you click a day on the calendar and it retrieves events from it

//an example of the implementation can be found in ..\addeventsbyday\[custom_date]\page.js

async function getEventsbyDay(username, year_of, month_of, day_of)//retrieve the username from dynamic router, and date details from the task calendar
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



export default function Page() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Azenda</h1>
      <TaskCalendar />
    </main>
  );
}