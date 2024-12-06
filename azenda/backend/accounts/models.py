from django.db import models
from datetime import datetime


class Account(models.Model):
    username = models.CharField(max_length=100, primary_key = True)
    password = models.CharField(max_length=30)

    sleep_start = models.IntegerField(default=0)  # Starting time for person's sleep cycle
    sleep_end = models.IntegerField(default=8)  # Ending time
    #ideal_work_times = models.JSONField(default=list)  # JSONField to store array of ideal work times

    def get_associated_events(self):  # Retrieves all Event objects linked to this Account instance

        return Event.objects.filter(event_user=self)

#Events, unique to each user
class Event(models.Model):
    event_name = models.CharField(max_length=50)  # Event name/description
    allows_concurrent_events = models.BooleanField()  # Whether or not an event allows concurrent events

    event_user = models.ForeignKey(Account, on_delete=models.CASCADE)  # Foreign key to Account

    # Starting time details for the event
    start_time = models.DateTimeField(default=datetime(1970, 1, 1))
    duration_hrs = models.IntegerField(default=0)


#class RecurringEvent(Event):
#    # model what days this task recurs on
#    monday = models.BooleanField(default=False)
#    tuesday = models.BooleanField(default=False)
#    wednesday = models.BooleanField(default=False)
#    thursday = models.BooleanField(default=False)
#    friday = models.BooleanField(default=False)
#    saturday = models.BooleanField(default=False)
#    sunday = models.BooleanField(default=False)

