"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from accounts.views import login, createaccount, retrieveUserEvents, createEvent, modify_event, retrieve_Events_from_Day  # Import the login view
from accounts.routers import router


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', login, name='login'),  # Add the login API endpoint
    path('api/createaccount/', createaccount, name='createaccount'), # account creation endpoint
    path('api/retrieveUserEvents/', retrieveUserEvents, name='retrieveUserEvents'),   #grab a user's events by ids
    path('api/createEvents/', createEvent, name='createEvent'), #make an event for a specific user
    path('api/modify_event/<int:event_id>/', modify_event, name='modify_event'), #path for modifying events, has dynamic parameter for the id of the event to be modified
    path('api/', include((router.urls, 'core_api'), namespace='core_api')),
    path('api/retrieve_Events_from_Day/', retrieve_Events_from_Day, name='retrieve_Events_from_Day')
]
