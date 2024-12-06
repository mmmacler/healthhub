'use client'


import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

async function modifyEvent(id, data)
{
    const res = await fetch(`http://localhost:8000/api/modify_event/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create data");
      }

      return res.json();

}
async function getEvent(id)
{
    const res = await fetch(`http://localhost:8000/api/modify_event/${id}/`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error("Failed to create data");
      }

      return res.json();
}

const Page = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({event_name: "", start_time: "", duration_hrs: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const params = useParams();
    const eventid = params.event_id;
    const user_name = params.username;
    const full_date = params.custom_date;
    /**
     * Handles the form submission.
     * @param {Event} event The form submission event.
     */
    const onFinish = (event) => {
      event.preventDefault();
      setIsLoading(true);
      modifyEvent(eventid, formData)
        .then(() => {
          // Navigate to the main page with a query parameter indicating success
          //router.replace("/?action=add");
          router.replace(`../../${full_date}`);
        })
        .catch((error) => {
            console.error("Error details:", error);
            setError("An error occurred");
            setIsLoading(false);
        });
    };

    // Cleanup effect for resetting loading state
    useEffect(() => {
      return () => setIsLoading(false);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getEvent(eventid);
            setFormData({event_name: data.event_name, start_time: data.start_time, duration_hrs: data.duration_hrs});
          } catch (error) {
            setError(error.message);
          }
        };
        fetchData();
      }, [eventid]);
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
          <label htmlFor="start_time">Time of Event</label>
          <input
            required
            name="start_time_year"
            value={formData.start_time}
            onChange={(event) =>
              setFormData({ ...formData, start_time: event.target.value })
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
