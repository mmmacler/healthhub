from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Account, Event
from .serializers import EventSerializer
from django.db import IntegrityError
from django.http.response import JsonResponse
from django.shortcuts import get_object_or_404
from datetime import datetime
from rest_framework.parsers import JSONParser 
from django.views.decorators.csrf import csrf_exempt

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    '''
    # Simple hardcoded login check for now
    if username == 'username' and password == 'password':
        return Response({"message": "Login successful!"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    '''
    
    try:
        account = Account.objects.get(username=username)#check if the username the user put in even exists
        
        if account.password == password:
            return Response({"message": "Username and password match"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Password does not match"}, status=status.HTTP_401_UNAUTHORIZED)
    
    except Account.DoesNotExist:
        return Response({"message": "Username not found"}, status.HTTP_404_NOT_FOUND)
    

@api_view(['POST']) 
def createaccount(request):
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



@api_view(['GET'])
def retrieveUserEvents(request):
    alluserevents = Event.objects.all()
    path = request.query_params.get('username', None)
    alluserevents = alluserevents.filter(event_user=path)
    if path is not None:
        event_serializer = EventSerializer(alluserevents, many=True)
    return JsonResponse(event_serializer.data, safe=False)

@api_view(['POST'])
def createEvent(request):
    _event_name = request.data.get('event_name')
    _allows_concurrent_events = request.data.get('allows_concurrent_events')


    event_user_id = request.data.get('event_user')
    _event_user = get_object_or_404(Account, username=event_user_id)


    _start_time_year = request.data.get('start_time_year')
    _start_time_month = request.data.get('start_time_month')
    _start_time_day = request.data.get('start_time_day')
    _start_time_hour = request.data.get('start_time_hour')
    _start_time_minute = request.data.get('start_time_minute')
    _duration_mins = request.data.get('duration_mins')
    
    
    d = datetime(int(_start_time_year), 
                 int(_start_time_month), 
                 int(_start_time_day), 
                 int(_start_time_hour), 
                 int(_start_time_minute))
    
    try:
        new_event = Event(event_name = _event_name, 
                          allows_concurrent_events = _allows_concurrent_events, 
                          event_user = _event_user, 
                          start_time = d, 
                          duration_mins = int(_duration_mins))
        new_event.save()
        return Response({"message": "Event Created"}, status=status.HTTP_201_CREATED)
    except IntegrityError:
        return Response({"message": "Failed to create account due to database error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"message": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@csrf_exempt
def modify_event(request, event_id):
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
 