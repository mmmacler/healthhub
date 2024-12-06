'use client'


import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

async function optimizeevent(username, task1name, task1time, task1duedate, task2name, task2time, task2duedate, task3name, task3time, task3duedate, prefworkstart, prefworkend)
{
    const res = await fetch("http://127.0.0.1:8000/api/optimize/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username, task1name, task1time, task1duedate, task2name, task2time, task2duedate, task3name, task3time, task3duedate, prefworkstart, prefworkend}),
      });

      if (!res.ok) {
        throw new Error("Failed to create data");
      }

      return res.json();

}

const Page = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({ username: "", task1name: "", task1time: "", task1duedate: "", task2name: "", task2time: "", task2duedate: "", task3name: "", task3time: "", task3duedate: "", prefworkstart: "", prefworkend: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const params = useParams();
    const user_name = params.username;

    //gets dynamic parameters


    /**
     * Handles the form submission.
     * @param {Event} event The form submission event.
     */
    const onFinish = (event) => {
      event.preventDefault();
      setIsLoading(true);

        optimizeevent(user_name, formData.task1name,formData.task1time, formData.task1duedate, formData.task2name, formData.task2time, formData.task2duedate, formData.task3name, formData.task3time, formData.task3duedate, formData.prefworkstart, formData.prefworkend)
        .then(() => {
          // Navigate to the main page with a query parameter indicating success
          //router.replace("/?action=add");
          router.replace(`..`);
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
          <label htmlFor="event_name">Task 1 Name</label>
          <input
            required
            name="event_name"
            value={formData.task1name}
            onChange={(event) =>
              setFormData({ ...formData, task1name: event.target.value })
            }
          />
        </div>

        <div className="form-item">
          <label htmlFor="duration_hrs">Task 1 approximate work load(in hours)</label>
          <input
            required
            name="duration_hrs"
            type="number"
            value={formData.task1time}
            onChange={(event) =>
              setFormData({ ...formData, task1time: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="duration_hrs">Task 1 due date</label>
          <input
            required
            name="duration_hrs"
            value={formData.task1duedate}
            onChange={(event) =>
              setFormData({ ...formData, task1duedate: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="start_time_hour">Task 2 Name</label>
          <input
            required
            name="start_time_hour"
            value={formData.task2name}
            onChange={(event) =>
              setFormData({ ...formData, task2name: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="duration_hrs">Task 2 approximate work load(in hours)</label>
          <input
            required
            name="duration_hrs"
            type="number"
            value={formData.task2time}
            onChange={(event) =>
              setFormData({ ...formData, task2time: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="duration_hrs">Task 2 due date</label>
          <input
            required
            name="duration_hrs"
            value={formData.task2duedate}
            onChange={(event) =>
              setFormData({ ...formData, task2duedate: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="start_time_hour">Task 3 Name</label>
          <input
            required
            name="start_time_hour"
            value={formData.task3name}
            onChange={(event) =>
              setFormData({ ...formData, task3name: event.target.value })
            }
          />
        </div>

        <div className="form-item">
          <label htmlFor="duration_hrs">Task 3 approximate work load(in hours)</label>
          <input
            required
            name="duration_hrs"
            type="number"
            value={formData.task3time}
            onChange={(event) =>
              setFormData({ ...formData, task3time: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="duration_hrs">Task 3 due date</label>
          <input
            required
            name="duration_hrs"
            value={formData.task3duedate}
            onChange={(event) =>
              setFormData({ ...formData, task3duedate: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="duration_hrs">Daily Work Hours Start</label>
          <input
            required
            name="duration_hrs"
            type="number"
            value={formData.prefworkstart}
            onChange={(event) =>
              setFormData({ ...formData, prefworkstart: event.target.value })
            }
          />
        </div>
        <div className="form-item">
          <label htmlFor="duration_hrs">Daily Work Hours End</label>
          <input
            required
            name="duration_hrs"
            type="number"
            value={formData.duration_hrs}
            onChange={(event) =>
              setFormData({ ...formData, prefworkstart: event.target.value })
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
