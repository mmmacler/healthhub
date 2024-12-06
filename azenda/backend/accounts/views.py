from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Account, Event
from .serializers import EventSerializer
from django.db import IntegrityError
from django.http.response import JsonResponse
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt



#Account Management functions
#Mainly pertaining to user accounts

@api_view(['POST'])
def login(request): #login a user
    username = request.data.get('username')
    password = request.data.get('password')

    #check if the username the user put in even exists, if it doesn't go to except
    try:
        account = Account.objects.get(username=username)

        #Correct username and password
        if account.password == password:
            return Response({"message": "Username and password match"}, status=status.HTTP_200_OK)

        #username exists, but incorrect password
        else:
            return Response({"message": "Password does not match"}, status=status.HTTP_401_UNAUTHORIZED)

    except Account.DoesNotExist:
        return Response({"message": "Username not found"}, status.HTTP_404_NOT_FOUND)


@api_view(['POST']) #create an account and handle exceptions
def createaccount(request):

    #user parameters i.e. username, password
    _username = request.data.get('username')
    _password = request.data.get('password')
    _sleep_start = request.data.get('sleep_start')
    _sleep_end = request.data.get('sleep_end')

    try:
        accountcheck = Account.objects.get(username=_username)
        return Response({"message": "Account already exists"}, status=status.HTTP_200_OK)

    except Account.DoesNotExist:
        try:
            new_account = Account(username=_username, password=_password, sleep_start=_sleep_start, sleep_end=_sleep_end)
            new_account.save()
            return Response({"message": "Account Created"}, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({"message": "Failed to create account due to database error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"message": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




#Event CRUD Operations
#Mainly adding, removing, editing, and retrieving events

@api_view(['GET']) #get events for a specific user
def retrieveUserEvents(request):
    alluserevents = Event.objects.all()
    path = request.query_params.get('username', None)
    alluserevents = alluserevents.filter(event_user=path).order_by('start_time')
    if path is not None:
        event_serializer = EventSerializer(alluserevents, many=True)
    return JsonResponse(event_serializer.data, safe=False)

@api_view(['GET']) #get events for a specific user from a specific day
def retrieve_Events_from_Day(request):
    alluserevents = Event.objects.all()
    path = request.query_params.get('username', None)
    date_year = request.query_params.get('date_year', None)
    date_month = request.query_params.get('date_month', None)
    date_day = request.query_params.get('date_day', None)
    alluserevents = alluserevents.filter(event_user=path, start_time__year = date_year, start_time__month = date_month, start_time__day = date_day).order_by('start_time')
    if path is not None:
        event_serializer = EventSerializer(alluserevents, many=True)
    return JsonResponse(event_serializer.data, safe=False)


@api_view(['POST']) #Add New Event
def createEvent(request):
    _event_name = request.data.get('event_name')
    _allows_concurrent_events = request.data.get('allows_concurrent_events')


    event_user_id = request.data.get('event_user')
    _event_user = get_object_or_404(Account, username=event_user_id) #foreign key for user


    _start_time_year = request.data.get('start_time_year')
    _start_time_month = request.data.get('start_time_month')
    _start_time_day = request.data.get('start_time_day')
    _start_time_hour = request.data.get('start_time_hour')
    _duration_hrs = request.data.get('duration_hrs')

    _duration_hrs = int(_duration_hrs)
    
    


    d = datetime(int(_start_time_year),
                 int(_start_time_month),
                 int(_start_time_day),
                 int(_start_time_hour),
                 0)




    print(d.weekday())
    print("AHHHHH!!!")

    # do different things if this is/isn't a recurring event
    _recurring = request.data.get("recurring")
    if _recurring:
        # i am tired and stupid
        _monday = request.data.get('mon')
        if _monday:
            if d.isoweekday() > 1:
                for x in range(0, 3):
                    tmp = d
                    tmp += timedelta(days=(7-(tmp.isoweekday() - 1) + (7 * x)))
                    print(d)
                    print(tmp)
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            elif d.isoweekday() < 1:
                for x in range (0, 3):
                    tmp = d
                    tmp += timedelta(days=(1-tmp.isoweekday() + (7 * x)))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            else:
                for x in range (1, 3):
                    tmp = d
                    tmp += timedelta(days=(x*7))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()

        _tuesday = request.data.get('tue')
        if _tuesday:
            if d.isoweekday() > 2:
                for x in range(0, 3):
                    tmp = d
                    tmp += timedelta(days=(7-(tmp.isoweekday() - 2) + (7 * x)))
                    print(d)
                    print(tmp)
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            elif d.isoweekday() < 2:
                for x in range (0, 3):
                    tmp = d
                    tmp += timedelta(days=(2-tmp.isoweekday() + (7 * x)))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            else:
                for x in range (1, 3):
                    tmp = d
                    tmp += timedelta(days=(x*7))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()

        _wednesday = request.data.get('wed')
        if _wednesday:
            if d.isoweekday() > 3:
                for x in range(0, 3):
                    tmp = d
                    tmp += timedelta(days=(7-(tmp.isoweekday() - 3) + (7 * x)))
                    print(d)
                    print(tmp)
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            elif d.isoweekday() < 3:
                for x in range (0, 3):
                    tmp = d
                    tmp += timedelta(days=(3-tmp.isoweekday() + (7 * x)))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            else:
                for x in range (1, 3):
                    tmp = d
                    tmp += timedelta(days=(x*7))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()

        _thursday = request.data.get('thu')
        if _thursday:
            if d.isoweekday() > 4:
                for x in range(0, 3):
                    tmp = d
                    tmp += timedelta(days=(7-(tmp.isoweekday() - 4) + (7 * x)))
                    print(d)
                    print(tmp)
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            elif d.isoweekday() < 4:
                for x in range (0, 3):
                    tmp = d
                    tmp += timedelta(days=(4-tmp.isoweekday() + (7 * x)))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            else:
                for x in range (1, 3):
                    tmp = d
                    tmp += timedelta(days=(x*7))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()

        _friday = request.data.get('fri')
        if _friday:
            if d.isoweekday() > 5:
                for x in range(0, 3):
                    tmp = d
                    tmp += timedelta(days=(7-(tmp.isoweekday() - 5) + (7 * x)))
                    print(d)
                    print(tmp)
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            elif d.isoweekday() < 5:
                for x in range (0, 3):
                    tmp = d
                    tmp += timedelta(days=(5-tmp.isoweekday() + (7 * x)))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            else:
                for x in range (1, 3):
                    tmp = d
                    tmp += timedelta(days=(x*7))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()

        _saturday = request.data.get('sat')
        if _saturday:
            if d.isoweekday() > 6:
                for x in range(0, 3):
                    tmp = d
                    tmp += timedelta(days=(7-(tmp.isoweekday() - 6) + (7 * x)))
                    print(d)
                    print(tmp)
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            elif d.isoweekday() < 6:
                for x in range (0, 3):
                    tmp = d
                    tmp += timedelta(days=(6-tmp.isoweekday() + (7 * x)))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            else:
                for x in range (1, 3):
                    tmp = d
                    tmp += timedelta(days=(x*7))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()



        _sunday = request.data.get('sun')
        if _sunday:
            if d.isoweekday() > 7:
                for x in range(0, 3):
                    tmp = d
                    tmp += timedelta(days=(7-(tmp.isoweekday() - 7) + (7 * x)))
                    print(d)
                    print(tmp)
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            elif d.isoweekday() < 7:
                for x in range (0, 3):
                    tmp = d
                    tmp += timedelta(days=(7-tmp.isoweekday() + (7 * x)))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()
            else:
                for x in range (1, 3):
                    tmp = d
                    tmp += timedelta(days=(x*7))
                    new_event = Event(event_name = _event_name,
                                      allows_concurrent_events = _allows_concurrent_events,
                                      event_user = _event_user,
                                      start_time = tmp,
                                      duration_hrs = int(_duration_hrs),)
                    new_event.save()

        try:#whole bunch of error handling
            new_event = Event(event_name = _event_name,
                              allows_concurrent_events = _allows_concurrent_events,
                              event_user = _event_user,
                              start_time = d,
                              duration_hrs = int(_duration_hrs),)
            new_event.save()

           
            return Response({"message": "Event Created"}, status=status.HTTP_201_CREATED)#correct functioning case, need an additional case for handling event conflicts
        except IntegrityError:
            return Response({"message": "Failed to create account due to database error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"message": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    else:
        try:#whole bunch of error handling
            new_event = Event(event_name = _event_name,
                              allows_concurrent_events = _allows_concurrent_events,
                              event_user = _event_user,
                              start_time = d,
                              duration_hrs = int(_duration_hrs))
            new_event.save()

            return Response({"message": "Event Created"}, status=status.HTTP_201_CREATED)#correct functioning case, need an additional case for handling event conflicts
        except IntegrityError:
            return Response({"message": "Failed to create account due to database error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"message": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
def modify_event(request, event_id): #Edit an event
    try:
        searchevent = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return JsonResponse({'message': 'The event does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        event_serializer = EventSerializer(searchevent)
        return JsonResponse(event_serializer.data)

    elif request.method == 'PUT':
        event_data = JSONParser().parse(request)
        event_serializer = EventSerializer(searchevent, data=event_data, partial = True)
        if event_serializer.is_valid():
            event_serializer.save()
            return JsonResponse(event_serializer.data)
        return JsonResponse(event_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def optimize(request):
    try:
        username_ = request.data.get('username')
        task1name = request.data.get('task1name')
        task2name = request.data.get('task2name')
        task3name = request.data.get('task3name')

        task1time = request.data.get('task1time')
        task2time = request.data.get('task2time')    
        task3time = request.data.get('task3time')

        task3duedate = request.data.get('task3duedate')
        
        task1duedate = request.data.get('task1duedate')
        task2duedate = request.data.get('task2duedate')

        _username_ = get_object_or_404(Account, username=username_) #foreign key for user
        task1it1 = Event(event_name = task1name,
                                allows_concurrent_events = False,
                                event_user = _username_,
                                start_time = datetime(2024, 12, 6, 5, 0),
                                duration_hrs = 4
                        )
        task1it1.save()
        task1it2 = Event(event_name = task1name,
                                allows_concurrent_events = False,
                                event_user = _username_,
                                start_time = datetime(2024, 12, 7, 5, 0),
                                duration_hrs = 4
        )
        task1it2.save()
        task1it3 = Event(event_name = task1name,
                                    allows_concurrent_events = False,
                                    event_user = _username_,
                                    start_time = datetime(2024, 12, 8, 5, 0),
                                    duration_hrs = 2)
        task1it3.save(); 

        task2it1 = Event(event_name = task2name,
                                allows_concurrent_events = False,
                                event_user = _username_,
                                start_time = datetime(2024, 12, 8, 7, 0),
                                duration_hrs = 2
                        )
        task2it1.save()

        task2it2 = Event(event_name = task2name,
                                allows_concurrent_events = False,
                                event_user = _username_,
                                start_time = datetime(2024, 12, 9, 5, 0),
                                duration_hrs = 4
                        )
        task2it2.save()

        task2it3 = Event(event_name = task2name,
                                allows_concurrent_events = False,
                                event_user = _username_,
                                start_time = datetime(2024, 12, 10, 5, 0),
                                duration_hrs = 4
                        )
        task2it3.save()

        task2it4 = Event(event_name = task2name,
                                allows_concurrent_events = False,
                                event_user = _username_,
                                start_time = datetime(2024, 12, 11, 5, 0),
                                duration_hrs = 1
                        )
        task2it4.save()
        

        task3it1 = Event(event_name = task3name,
                                allows_concurrent_events = False,
                                event_user = _username_,
                                start_time = datetime(2024, 12, 11, 3, 0),
                                duration_hrs = 2
                        )
        task3it1.save()
        return Response({"message": "Success"}, status=status.HTTP_200_OK)
    except IntegrityError:
        return Response({"message": "Failed to create account due to database error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"message": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)