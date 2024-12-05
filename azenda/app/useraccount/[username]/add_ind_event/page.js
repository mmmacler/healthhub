'use client'


import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

async function addEvent(event_name, allows_concurrent_events, event_user, start_time_year, start_time_month, start_time_day, start_time_hour, start_time_minute, duration_mins)
{
    const res = await fetch("http://127.0.0.1:8000/api/createEvents/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({event_name, allows_concurrent_events, event_user, start_time_year, start_time_month, start_time_day, start_time_hour, start_time_minute, duration_mins}),
      });
    
      if (!res.ok) {
        throw new Error("Failed to create data");
      }
    
      return res.json();
    
}

const Page = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ event_name: "", start_time_year: "", start_time_month: "", start_time_day: "", start_time_hour: "", start_time_minute: "", duration_mins: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const params = useParams();
    const user_name = params.username;
    /**
     * Handles the form submission.
     * @param {Event} event The form submission event.
     */
    const onFinish = (event) => {
      event.preventDefault();
      setIsLoading(true);
      
      addEvent(formData.event_name, false, user_name, formData.start_time_year, formData.start_time_month, formData.start_time_day, formData.start_time_hour, formData.start_time_minute, formData.duration_mins)
        .then(() => {
          // Navigate to the main page with a query parameter indicating success
          //router.replace("/?action=add");
          router.replace(`../${user_name}`);
        })
        .catch(() => {
          setError("An error occurred");
          setIsLoading(false);
        });
    };
  
    // Cleanup effect for resetting loading state
    useEffect(() => {
      return () => setIsLoading(false);
    }, []);
  
    return (
      <form onSubmit={onFinish}>
        <div className="form-item">
          <label htmlFor="event_name">Event Name</label>
          <input
            required
            name="event_name"
            value={formData.event_name}
            onChange={(event) =>
              setFormData({ ...formData, event_name: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="start_time_year">Year of Event</label>
          <input
            required
            name="start_time_year"
            type="number"
            value={formData.start_time_year}
            onChange={(event) =>
              setFormData({ ...formData, start_time_year: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="start_time_month">Month of Event</label>
          <input
            required
            name="start_time_month"
            type="number"
            value={formData.start_time_month}
            onChange={(event) =>
              setFormData({ ...formData, start_time_month: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="start_time_day">Day of Event</label>
          <input
            required
            name="start_time_day"
            type="number"
            value={formData.start_time_day}
            onChange={(event) =>
              setFormData({ ...formData, start_time_day: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="start_time_hour">Hour of Event</label>
          <input
            required
            name="start_time_hour"
            type="number"
            value={formData.start_time_hour}
            onChange={(event) =>
              setFormData({ ...formData, start_time_hour: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="start_time_minute">Minute of Event</label>
          <input
            required
            name="start_time_minute"
            type="number"
            value={formData.start_time_minute}
            onChange={(event) =>
              setFormData({ ...formData, start_time_minute: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="duration_mins">Duration of Event(in minutes)</label>
          <input
            required
            name="duration_mins"
            type="number"
            value={formData.duration_mins}
            onChange={(event) =>
              setFormData({ ...formData, duration_mins: event.target.value })
            }
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div>
          <button disabled={isLoading} className="add-button" type="submit">
            Submit
          </button>
        </div>
      </form>
    );
  };
  
  export default Page;