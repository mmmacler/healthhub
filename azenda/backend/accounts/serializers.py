from rest_framework import serializers

from accounts.models import Account, Event


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['username', 'password', 'sleep_start', 'sleep_end']    

class EventSerializer(serializers.ModelSerializer):
    #start_time = serializers.DateTimeField(format="%d/%m/%Y %H:%M")
    class Meta:
        model = Event
        fields = ['event_name', 'allows_concurrent_events', 'event_user', 'start_time', 'duration_mins', 'id']
