import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import AgoraRTC, { IAgoraRTCClient, ILocalVideoTrack, ILocalAudioTrack } from 'agora-rtc-sdk-ng';
import { LiveEvent, EventParticipant, EventChatMessage } from '../models/live-event.model';
import { ForumService } from './forum.service';
import { ForumThread } from '../models/forum-thread.model';

@Injectable({
  providedIn: 'root'
})
export class LiveEventService {
  private client: IAgoraRTCClient;
  private localVideoTrack: ILocalVideoTrack | null = null;
  private localAudioTrack: ILocalAudioTrack | null = null;
  private participantsSubject = new BehaviorSubject<EventParticipant[]>([]);
  private chatMessagesSubject = new BehaviorSubject<EventChatMessage[]>([]);

  public participants$ = this.participantsSubject.asObservable();
  public chatMessages$ = this.chatMessagesSubject.asObservable();

  constructor(private http: HttpClient, private forumService: ForumService) {
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  }

  // API calls
  getEvents(): Observable<LiveEvent[]> {
    return this.http.get<LiveEvent[]>('/api/live-events');
  }

  getEvent(id: number): Observable<LiveEvent> {
    return this.http.get<LiveEvent>(`/api/live-events/${id}`);
  }

  createEvent(event: Partial<LiveEvent>): Observable<LiveEvent> {
    return this.http.post<LiveEvent>('/api/live-events', event);
  }

  updateEvent(id: number, event: Partial<LiveEvent>): Observable<LiveEvent> {
    return this.http.put<LiveEvent>(`/api/live-events/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`/api/live-events/${id}`);
  }

  registerForEvent(eventId: number): Observable<EventParticipant> {
    return this.http.post<EventParticipant>(`/api/live-events/${eventId}/register`, {});
  }

  getParticipants(eventId: number): Observable<EventParticipant[]> {
    return this.http.get<EventParticipant[]>(`/api/live-events/${eventId}/participants`);
  }

  getChatMessages(eventId: number): Observable<EventChatMessage[]> {
    return this.http.get<EventChatMessage[]>(`/api/live-events/${eventId}/chat`);
  }

  sendChatMessage(eventId: number, message: string): Observable<EventChatMessage> {
    return this.http.post<EventChatMessage>(`/api/live-events/${eventId}/chat`, { message });
  }

  // Agora RTC methods
  async joinChannel(channelName: string, token: string, uid?: string): Promise<void> {
    await this.client.join('your-app-id', channelName, token, uid);
  }

  async leaveChannel(): Promise<void> {
    if (this.localVideoTrack) {
      this.localVideoTrack.close();
      this.localVideoTrack = null;
    }
    if (this.localAudioTrack) {
      this.localAudioTrack.close();
      this.localAudioTrack = null;
    }
    await this.client.leave();
  }

  async createLocalTracks(): Promise<void> {
    [this.localAudioTrack, this.localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
  }

  async publishLocalTracks(): Promise<void> {
    if (this.localAudioTrack && this.localVideoTrack) {
      await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
    }
  }

  async unpublishLocalTracks(): Promise<void> {
    if (this.localAudioTrack && this.localVideoTrack) {
      await this.client.unpublish([this.localAudioTrack, this.localVideoTrack]);
    }
  }

  getClient(): IAgoraRTCClient {
    return this.client;
  }

  getLocalVideoTrack(): ILocalVideoTrack | null {
    return this.localVideoTrack;
  }

  getLocalAudioTrack(): ILocalAudioTrack | null {
    return this.localAudioTrack;
  }

  // Recording methods with Agora Cloud Recording integration
  async startCloudRecording(eventId: number, channelName: string): Promise<any> {
    try {
      // Start Agora Cloud Recording
      const response = await this.http.post(`/api/live-events/${eventId}/start-cloud-recording`, {
        channelName,
        uid: '0', // Use 0 for composite recording
        token: '', // Server should generate token
        recordingConfig: {
          channelType: 1, // 0: COMMUNICATION, 1: LIVE_BROADCASTING
          streamTypes: 2, // 0: AUDIO_ONLY, 1: VIDEO_ONLY, 2: AUDIO_AND_VIDEO
          audioProfile: 2, // 0: SPEECH_STANDARD, 1: MUSIC_STANDARD, 2: MUSIC_STANDARD_STEREO, 3: MUSIC_HIGH_QUALITY, 4: MUSIC_HIGH_QUALITY_STEREO
          videoStreamType: 0, // 0: HIGH_VIDEO_STREAM, 1: LOW_VIDEO_STREAM
          maxIdleTime: 30,
          transcodingConfig: {
            width: 640,
            height: 360,
            fps: 15,
            bitrate: 500,
            mixedVideoLayout: 1, // 0: FLOATING_LAYOUT, 1: BEST_FIT_LAYOUT, 2: VERTICAL_LAYOUT
            backgroundColor: '#000000'
          }
        }
      }).toPromise();

      return response;
    } catch (error) {
      console.error('Error starting cloud recording:', error);
      throw error;
    }
  }

  async stopCloudRecording(eventId: number, resourceId: string, sid: string): Promise<any> {
    try {
      const response = await this.http.post(`/api/live-events/${eventId}/stop-cloud-recording`, {
        resourceId,
        sid,
        async: false
      }).toPromise();

      return response;
    } catch (error) {
      console.error('Error stopping cloud recording:', error);
      throw error;
    }
  }

  // Get recording status
  getRecordingStatus(eventId: number, resourceId: string, sid: string): Observable<any> {
    return this.http.get(`/api/live-events/${eventId}/recording-status`, {
      params: { resourceId, sid }
    });
  }

  // Participant management
  updateParticipantStatus(eventId: number, participantId: number, status: Partial<EventParticipant>): Observable<EventParticipant> {
    return this.http.put<EventParticipant>(`/api/live-events/${eventId}/participants/${participantId}`, status);
  }

  raiseHand(eventId: number, participantId: number): Observable<EventParticipant> {
    return this.updateParticipantStatus(eventId, participantId, { raisedHand: true });
  }

  lowerHand(eventId: number, participantId: number): Observable<EventParticipant> {
    return this.updateParticipantStatus(eventId, participantId, { raisedHand: false });
  }

  muteParticipant(eventId: number, participantId: number): Observable<EventParticipant> {
    return this.updateParticipantStatus(eventId, participantId, { isMuted: true });
  }

  unmuteParticipant(eventId: number, participantId: number): Observable<EventParticipant> {
    return this.updateParticipantStatus(eventId, participantId, { isMuted: false });
  }

  // Forum integration methods
  createEventDiscussionThread(eventId: number, eventTitle: string, authorId: number): Observable<ForumThread> {
    const threadTitle = `Discussion: ${eventTitle}`;
    const threadContent = `This thread is for discussing the live event "${eventTitle}". Share your thoughts, questions, and feedback about the event here.`;
    // Assuming there's a "Live Events" category with ID 1 - this should be configurable
    return this.forumService.createThread(1, authorId, threadTitle, threadContent);
  }

  getEventDiscussionThread(eventId: number): Observable<ForumThread[]> {
    // This would need backend support to link events to forum threads
    // For now, we'll search for threads with the event title
    return this.forumService.listThreads(1); // Assuming category 1 is for live events
  }

  addDiscussionPost(threadId: number, authorId: number, content: string): Observable<any> {
    return this.forumService.createPost(threadId, authorId, content, false);
  }
}