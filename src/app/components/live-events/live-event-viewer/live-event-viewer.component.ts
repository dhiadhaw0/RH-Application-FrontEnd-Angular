import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LiveEventService } from '../../../services/live-event.service';
import { LiveEvent, EventParticipant, EventChatMessage } from '../../../models/live-event.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-live-event-viewer',
  standalone: false,
  templateUrl: './live-event-viewer.component.html',
  styleUrl: './live-event-viewer.component.scss'
})
export class LiveEventViewerComponent implements OnInit, OnDestroy {
  @ViewChild('videoContainer', { static: true }) videoContainer!: ElementRef;

  event: LiveEvent | null = null;
  participants: EventParticipant[] = [];
  chatMessages: EventChatMessage[] = [];
  newMessage = '';
  isJoined = false;
  isHost = false;
  isMuted = false;
  isVideoOn = true;
  raisedHand = false;
  loading = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private liveEventService: LiveEventService
  ) {}

  ngOnInit(): void {
    const eventId = +this.route.snapshot.params['id'];
    this.loadEvent(eventId);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.leaveEvent();
  }

  loadEvent(eventId: number): void {
    this.loading = true;
    this.liveEventService.getEvent(eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.loading = false;
        this.loadParticipants();
        this.loadChatMessages();
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.loading = false;
      }
    });
  }

  loadParticipants(): void {
    if (!this.event) return;
    this.liveEventService.getParticipants(this.event.id).subscribe({
      next: (participants) => {
        this.participants = participants;
        // Check if current user is host
        // this.isHost = participants.some(p => p.userId === currentUserId && p.isHost);
      },
      error: (error) => console.error('Error loading participants:', error)
    });
  }

  loadChatMessages(): void {
    if (!this.event) return;
    this.liveEventService.getChatMessages(this.event.id).subscribe({
      next: (messages) => {
        this.chatMessages = messages;
      },
      error: (error) => console.error('Error loading chat messages:', error)
    });
  }

  async joinEvent(): Promise<void> {
    if (!this.event) return;

    try {
      await this.liveEventService.createLocalTracks();
      await this.liveEventService.joinChannel(this.event.channelName, this.event.token);
      await this.liveEventService.publishLocalTracks();

      this.isJoined = true;
      this.registerParticipant();
    } catch (error) {
      console.error('Error joining event:', error);
    }
  }

  async leaveEvent(): Promise<void> {
    if (this.isJoined) {
      await this.liveEventService.leaveChannel();
      this.isJoined = false;
    }
  }

  registerParticipant(): void {
    if (!this.event) return;
    this.liveEventService.registerForEvent(this.event.id).subscribe({
      next: (participant) => {
        this.loadParticipants();
      },
      error: (error) => console.error('Error registering participant:', error)
    });
  }

  toggleMute(): void {
    const audioTrack = this.liveEventService.getLocalAudioTrack();
    if (audioTrack) {
      if (this.isMuted) {
        audioTrack.setEnabled(true);
      } else {
        audioTrack.setEnabled(false);
      }
      this.isMuted = !this.isMuted;
    }
  }

  toggleVideo(): void {
    const videoTrack = this.liveEventService.getLocalVideoTrack();
    if (videoTrack) {
      if (this.isVideoOn) {
        videoTrack.setEnabled(false);
      } else {
        videoTrack.setEnabled(true);
      }
      this.isVideoOn = !this.isVideoOn;
    }
  }

  raiseHand(): void {
    if (!this.event) return;
    const participant = this.participants.find(p => p.isHost === false); // Current user
    if (participant) {
      this.liveEventService.raiseHand(this.event.id, participant.id).subscribe({
        next: () => {
          this.raisedHand = !this.raisedHand;
          this.loadParticipants();
        },
        error: (error) => console.error('Error raising hand:', error)
      });
    }
  }

  sendMessage(): void {
    if (!this.event || !this.newMessage.trim()) return;

    this.liveEventService.sendChatMessage(this.event.id, this.newMessage).subscribe({
      next: (message) => {
        this.chatMessages.push(message);
        this.newMessage = '';
      },
      error: (error) => console.error('Error sending message:', error)
    });
  }

  recordingResourceId: string | null = null;
  recordingSid: string | null = null;

  async startRecording(): Promise<void> {
    if (!this.event || !this.isHost) return;

    try {
      const response = await this.liveEventService.startCloudRecording(this.event.id, this.event.channelName);
      this.recordingResourceId = response.resourceId;
      this.recordingSid = response.sid;
      console.log('Cloud recording started:', response);
    } catch (error) {
      console.error('Error starting cloud recording:', error);
    }
  }

  async stopRecording(): Promise<void> {
    if (!this.event || !this.isHost || !this.recordingResourceId || !this.recordingSid) return;

    try {
      const response = await this.liveEventService.stopCloudRecording(
        this.event.id,
        this.recordingResourceId,
        this.recordingSid
      );
      console.log('Cloud recording stopped:', response);
      this.recordingResourceId = null;
      this.recordingSid = null;
    } catch (error) {
      console.error('Error stopping cloud recording:', error);
    }
  }

  viewDiscussion(): void {
    if (!this.event) return;
    // Navigate to forum thread or open discussion modal
    // For now, we'll navigate to forum and let user find the discussion
    // In a full implementation, this would link directly to the event's discussion thread
    window.open('/forum', '_blank');
  }

  // Host participant management methods
  muteParticipant(participant: EventParticipant): void {
    if (!this.event || !this.isHost) return;
    this.liveEventService.muteParticipant(this.event.id, participant.id).subscribe({
      next: () => {
        this.loadParticipants();
      },
      error: (error) => console.error('Error muting participant:', error)
    });
  }

  unmuteParticipant(participant: EventParticipant): void {
    if (!this.event || !this.isHost) return;
    this.liveEventService.unmuteParticipant(this.event.id, participant.id).subscribe({
      next: () => {
        this.loadParticipants();
      },
      error: (error) => console.error('Error unmuting participant:', error)
    });
  }

  lowerParticipantHand(participant: EventParticipant): void {
    if (!this.event || !this.isHost) return;
    this.liveEventService.lowerHand(this.event.id, participant.id).subscribe({
      next: () => {
        this.loadParticipants();
      },
      error: (error) => console.error('Error lowering participant hand:', error)
    });
  }

  removeParticipant(participant: EventParticipant): void {
    if (!this.event || !this.isHost) return;
    // This would typically remove the participant from the event
    // Implementation depends on backend API
    console.log('Remove participant:', participant);
  }
}
