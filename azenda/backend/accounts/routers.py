from rest_framework import routers

from accounts.viewsets import AccountViewSet, EventViewSet

router = routers.SimpleRouter()

router.register(r'account', AccountViewSet, basename="account")
router.register(r'event', EventViewSet, basename="event")

urlpatterns = router.urls