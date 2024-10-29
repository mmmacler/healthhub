from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from accounts.models import Account, Event

from accounts.serializers import AccountSerializer, EventSerializer


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [AllowAny]

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]