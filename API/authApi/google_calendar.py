import datetime
import os.path

from django.shortcuts import redirect
from django.conf import settings
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow, InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/calendar"]

def get_calendar_service(request=None):
  creds = None
  token_path = settings.GOOGLE_CREDENTIALS_DIR / 'token.json'

  if os.path.exists(token_path):
    print(f'creds 19 {creds}')
    creds = Credentials.from_authorized_user_file(token_path, SCOPES)

  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      print(f'creds 24 {creds}')
      creds.refresh(Request())
    else:
      print(f'creds 27 {creds}')
      flow = InstalledAppFlow.from_client_secrets_file(settings.GOOGLE_CREDENTIALS_FILE, SCOPES)
      if request is not None:
        flow.redirect_uri = settings.GOOGLE_OAUTH2_CALLBACK_URL
        auth_url, state = flow.authorization_url(prompt='consent', access_type='offline')
        request.session['state'] = state
        print(f'auth {auth_url}')
        print(f'state {state}')
        return auth_url
      #creds = flow.run_local_server(port=8000, access_type='offline', prompt='consent')
      #auth_url, _ = flow.authorization_url(prompt='consent')

  if creds:
    with open(token_path, 'w') as token:
      token.write(creds.to_json())

  print(f'RETURN CALENDAR SERVICE {build("calendar", "v3", credentials=creds)}')
  return build("calendar", "v3", credentials=creds) if creds else None

def list_upcomming_events(request, max_results=10):
  service = get_calendar_service(request)
  print(f'service 41 {service}')
  if isinstance(service, str):
    print(f'service isinstance {service}')
    return service
  
  if service:
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    #tomorrow = (datetime.datetime.now() + datetime.timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0).isoformat() + 'Z'

    events_result = service.events().list(
      calendarId='primary',
      timeMin=now,
      maxResults=max_results,
      singleEvents=True,
      orderBy='startTime'
    ).execute()

    events = events_result.get('items', [])

    if not events:
      return "No upcoming events found."
    else:
      event_list = []
      for event in events:
        start = event['start'].get('dateTime', event['start'].get('date'))
        meet = event.get('hangoutLink')
        attendees = event.get('attendees')
        event_list.append({"start": start, "summary": event['summary'], "meet":meet, "idEvent": event['id'], "attendees": attendees})
        #event_list.append(f"{start} - {event['summary']} - Link Meeting: {meet} - IdEvent: {event['id']}")

      print(events)
      print(event_list)
      return event_list
  else:
    return "No service"
  
def create_event(summary, start_time, end_time, timezone, attendees=None):
  service = get_calendar_service()

  # start = datetime.datetime.strptime(start_time, '%Y-%m-%dT%H:%M:%S')
  # end = datetime.datetime.strptime(end_time, '%Y-%m-%dT%H:%M:%S')

  event = {
    'summary': summary,
    'start': {
      'dateTime': start_time,
      'timeZone': timezone,
    },
    'end': {
      'dateTime': end_time,
      'timeZone': timezone,
    },
    'sendNotifications': True,
    'conferenceData': {
      'createRequest': {
        'requestId': 'sample123',
        'conferenceSolutionKey': {
          'type': 'hangoutsMeet'
        },
        'status': {
          'statusCode': 'success'
        }
      }
    }
  }
  print(f"event 113: {event}")

  if attendees:
    event['attendees'] = [{'email':email} for email in attendees]
  print(f"event 117: {event}")

  try:
    event = service.events().insert(calendarId='primary', body=event, conferenceDataVersion=1).execute()
    print('Event created: %s' % (event.get('htmlLink')))
    print(event)
    return event
  except HttpError as e:
    print(f"An error occurred: {e}")

def update_event(event_id, summary=None, start_time=None, end_time=None):
  calendar_service = get_calendar_service()
  event = calendar_service.events().get(calendarId='primary', eventId=event_id).execute()

  if summary:
      event['summary'] = summary

  if start_time:
      event['start']['dateTime'] = start_time

  if end_time:
      event['end']['dateTime'] = end_time

  updated_event = calendar_service.events().update(
      calendarId='primary', eventId=event_id, body=event).execute()
  return updated_event

def delete_event(event_id):
  calendar_service = get_calendar_service()
  calendar_service.events().delete(calendarId='primary', eventId=event_id).execute()
  return True

#create_event('Meeting Not Gmail','2024-07-21T07:00:00', '2024-07-21T8:50:00', "America/Tijuana", ["fernanda.ugalde@sdgku.edu"])
#create_event('Meeting Test Gmail','2024-07-22T07:00:00', '2024-07-22T8:50:00', "America/Tijuana", ["fernanda.ugalde@sdgku.edu"])
#list_upcomming_events()
#update_event('t7pc4hm4fls0jp6h7sdq7o2ue0', 'Fer Meeting Test')
#delete_event('thuo0j7114prrk45ru77g96or0')

#t7pc4hm4fls0jp6h7sdq7o2ue0