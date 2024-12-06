'use client'


import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

async function addEvent(event_name, allows_concurrent_events, event_user, start_time_year, start_time_month, start_time_day, start_time_hour, duration_hrs, recurring, mon, tue, wed, thu, fri, sat, sun)
{
    const res = await fetch("http://127.0.0.1:8000/api/createEvents/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({event_name, allows_concurrent_events, event_user, start_time_year, start_time_month, start_time_day, start_time_hour, duration_hrs, recurring, mon, tue, wed, thu, fri, sat, sun}),
      });

      if (!res.ok) {
        throw new Error("Failed to create data");
      }

      return res.json();

}

const Page = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ event_name: "", allows_concurrent_events: "", start_time_hour: "", duration_hrs: "", recurring: "", mon: "", tue: "", wed: "", thu: "", fri: "", sat: "", sun: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const params = useParams();

    //gets dynamic parameters
    const user_name = params.username;
    const full_date = params.custom_date;
    const [date_month, date_day, date_year] = full_date.split("-");

    /**
     * Handles the form submission.
     * @param {Event} event The form submission event.
     */
    const onFinish = (event) => {
      event.preventDefault();
      setIsLoading(true);

      addEvent(formData.event_name, formData.allows_concurrent_events, user_name, date_year, date_month, date_day, formData.start_time_hour, formData.duration_hrs,  formData.recurring, formData.mon, formData.tue, formData.wed, formData.thu, formData.fri, formData.sat, formData.sun)
        .then(() => {
          // Navigate to the main page with a query parameter indicating success
          //router.replace("/?action=add");
          router.replace(`../..`);
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

    /*
    RecurHandle = (event) => {
        setFormData({ ...formData, recurring: event.target.checked});
        console.log(event.target.checked);
    }
    */

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
          <label htmlFor="duration_hrs">Duration of Event (in hours)</label>
          <input
            required
            name="duration_hrs"
            type="number"
            value={formData.duration_hrs}
            onChange={(event) =>
              setFormData({ ...formData, duration_hrs: event.target.value })
            }
          />
        </div>
        <div className="form-item">
            <label htmlFor="allows_concurrent_events">Allow Concurrent Events</label>
            <input
                name=""
                type="checkbox"
                value={formData.allows_concurrent_events}
                onChange={(event) =>
                    setFormData({ ...formData, allows_concurrent_events: event.target.checked})
                }
            />
        </div>
        <div className="form-item">
            <label htmlFor="recurring">Recurring Event</label>
            <input
                name="recurring"
                type="checkbox"
                value={formData.recurring}
                onChange={(event) =>
                    setFormData({ ...formData, recurring: event.target.checked})
                }
            />
        </div>
        <div className="form-item">
            <label htmlFor="monday">Monday</label>
            <input
                name="monday"
                type="checkbox"
                value={formData.mon}
                onChange={(event) =>
                    setFormData({ ...formData, mon: event.target.checked})
                }
            />
        </div>
        <div className="form-item">
            <label htmlFor="tuesday">Tuesday</label>
            <input
                name="tuesday"
                type="checkbox"
                value={formData.tue}
                onChange={(event) =>
                    setFormData({ ...formData, tue: event.target.checked})
                }
            />
        </div>
        <div className="form-item">
            <label htmlFor="wednesday">Wednesday</label>
            <input
                name="wednesday"
                type="checkbox"
                value={formData.wed}
                onChange={(event) =>
                    setFormData({ ...formData, wed: event.target.checked})
                }
            />
        </div>
        <div className="form-item">
            <label htmlFor="thursday">Thursday</label>
            <input
                name="thursday"
                type="checkbox"
                value={formData.thu}
                onChange={(event) =>
                    setFormData({ ...formData, thu: event.target.checked})
                }
            />
        </div>
        <div className="form-item">
            <label htmlFor="friday">Friday</label>
            <input
                name="friday"
                type="checkbox"
                value={formData.fri}
                onChange={(event) =>
                    setFormData({ ...formData, fri: event.target.checked})
                }
            />
        </div>
        <div className="form-item">
            <label htmlFor="saturday">Saturday</label>
            <input
                name="saturday"
                type="checkbox"
                value={formData.sat}
                onChange={(event) =>
                    setFormData({ ...formData, sat: event.target.checked})
                }
            />
        </div>
        <div className="form-item">
            <label htmlFor="sunday">Sunday</label>
            <input
                name="sunday"
                type="checkbox"
                value={formData.sun}
                onChange={(event) =>
                    setFormData({ ...formData, sun: event.target.checked})
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
