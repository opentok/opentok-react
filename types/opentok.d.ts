export type ConnectionDisconnectReason = 'clientDisconnected' | 'forceDisconnected' | 'networkDisconnected';

/**
 * Base interface for all OpenTok events
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Event.html}
 */
export interface Event<ET extends string = string, T = unknown> {
  type: ET;
  cancelable: boolean;
  target: T;
  preventDefault(): void;
  isDefaultPrevented(): boolean;
}

/**
 * ArchiveEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/ArchiveEvent.html}
 */
export interface ArchiveEvent extends Event<'archiveStarted' | 'archiveStopped'> {
  id: string;
  name: string;
}

/**
 * AudioLevelUpdatedEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/AudioLevelUpdatedEvent.html}
 */
export interface AudioLevelUpdatedEvent extends Event<'audioLevelUpdated'> {
  audioLevel: number;
}

/**
 * ConnectionEvent, a common interface for {@link ConnectionCreatedEvent} and {@link ConnectionDestroyedEvent}
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/ConnectionEvent.html}
 */
export interface ConnectionEvent<T extends 'connectionCreated' | 'connectionDestroyed'> extends Event<T> {
  connection: Connection;
  connections?: Connection[];
}

/**
 * ConnectionCreatedEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/ConnectionEvent.html}
 */
export interface ConnectionCreatedEvent extends ConnectionEvent<'connectionCreated'> {
  reason: undefined;
}

/**
 * ConnectionDestroyedEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/ConnectionEvent.html}
 */
export interface ConnectionDestroyedEvent extends ConnectionEvent<'connectionDestroyed'> {
  reason: ConnectionDisconnectReason;
}

/**
 * MediaStoppedEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/MediaStoppedEvent.html}
 */
export interface MediaStoppedEvent extends Event<'mediaStopped'> {
  track: MediaStreamTrack;
}

/**
 * SessionEvent, a common interface for {@link SessionConnectEvent} and {@link SessionDisconnectEvent}
 */
export interface SessionEvent<T extends 'sessionConnected' | 'sessionDisconnected'> extends Event<T> {
  connections?: Connection[];
  streams?: Stream[];
}

/**
 * SessionConnectEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/SessionConnectEvent.html}
 */
export interface SessionConnectEvent extends SessionEvent<'sessionConnected'> {
  reason: undefined;
}

/**
 * SessionDisconnectEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/SessionDisconnectEvent.html}
 */
export interface SessionDisconnectEvent extends SessionEvent<'sessionDisconnected'> {
  reason: ConnectionDisconnectReason;
}

/**
 * SessionReconnectEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Event.html}
 */
export interface SessionReconnectEvent extends Event<'sessionReconnected'> {}

/**
 * SessionReconnectingEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Event.html}
 */
export interface SessionReconnectingEvent extends Event<'sessionReconnecting'> {}

/**
 * SignalEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/SignalEvent.html}
 */
export interface SignalEvent extends Event<'signal' | string> {
  data: string;
  from: Connection;
}

/**
 * StreamEvent, a common interface for {@link StreamCreatedEvent} and {@link StreamDestroyedEvent}
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/StreamEvent.html}
 */
export interface StreamEvent<T extends 'streamCreated' | 'streamDestroyed' | 'streamPropertyChanged'> extends Event<T> {
  stream: Stream;
  streams?: Stream[];
}

/**
 * StreamCreatedEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/StreamEvent.html}
 */
export interface StreamCreatedEvent extends StreamEvent<'streamCreated'> {
  reason: undefined;
}

/**
 * StreamDestroyedEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/StreamEvent.html}
 */
export interface StreamDestroyedEvent extends StreamEvent<'streamDestroyed'> {
  reason: 'clientDisconnected' | 'forceDisconnected' | 'forceUnpublished' | 'mediaStopped' | 'networkDisconnected';
}

/**
 * StreamPropertyChangedEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/StreamPropertyChangedEvent.html}
 */
export interface StreamPropertyChangedEvent<V = unknown> extends StreamEvent<'streamPropertyChanged'> {
  changedProperty: string;
  newValue: V;
  oldValue: V;
}

/**
 * VideoDimensionsChangedEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/VideoDimensionsChangedEvent.html}
 */
export interface VideoDimensionsChangedEvent extends Event<'videoDimensionsChanged'> {
  newValue: Dimensions;
  oldValue: Dimensions;
}

/**
 * VideoEnabledChangedEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/VideoEnabledChangedEvent.html}
 */
export interface VideoEnabledChangedEvent<T extends 'videoDisabled' | 'videoEnabled'> extends Event<T> {
  reason: 'publishVideo' | 'quality' | 'subscribeToVideo' | 'codecNotSupported' | 'codecChanged';
}

/**
 * VideoElementCreatedEvent
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/VideoElementCreatedEvent.html}
 */
export interface VideoElementCreatedEvent extends Event<'videoElementCreated'> {
  element: Element;
}

export type CompletionHandler = (error?: Error) => void;
export type EventHandler<E extends Event<string> = Event<string>> = (event: E) => void;

/**
 * Base interface for all objects that emit events:
 * 
 * {@link Session}
 */
export interface EventEmitter<EventHandlers extends {}> {
  addEventListener<T extends keyof EventHandlers & string>(type: T, listener: EventHandlers[T], context?: any): void;
  addEventListener(type: string, listener: EventHandler, context?: any): void;

  removeEventListener<T extends keyof EventHandlers & string>(type: T, listener: EventHandlers[T], context?: any): void;
  removeEventListener(type: string, listener: EventHandler, context?: any): void;
  
  off(handlers?: Partial<EventHandlers>): this;
  off<T extends keyof EventHandlers & string>(type: T, handler?: EventHandlers[T]): this;
  off(type: string, handler?: EventHandler): this;

  on(handlers: Partial<EventHandlers>, context?: any): this;
  on<T extends keyof EventHandlers & string>(type: T, handler: EventHandlers[T], context?: any): this;
  on(type: string, handler: EventHandler, context?: any): this;

  once(handlers: Partial<EventHandlers>, context?: any): this;
  once<T extends keyof EventHandlers & string>(type: T, handler: EventHandler<Event<T>>, context?: any): this;
}

/**
 * Signal object
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Session.html#signal}
 */
export interface Signal {
  data?: string;
  retryAfterReconnect?: boolean;
  to?: Connection;
  type?: string;
}

export type SessionEventHandlers = {
  archiveStarted?: EventHandler<ArchiveEvent>;
  archiveStopped?: EventHandler<ArchiveEvent>;
  connectionCreated?: EventHandler<ConnectionCreatedEvent>;
  connectionDestroyed?: EventHandler<ConnectionDestroyedEvent>;
  sessionConnected?: EventHandler<SessionConnectEvent>;
  sessionDisconnected?: EventHandler<SessionDisconnectEvent>;
  sessionReconnected?: EventHandler<SessionReconnectEvent>;
  sessionReconnecting?: EventHandler<SessionReconnectingEvent>;
  signal?: EventHandler<SignalEvent>;
  streamCreated?: EventHandler<StreamCreatedEvent>;
  streamDestroyed?: EventHandler<StreamDestroyedEvent>;
  streamPropertyChanged?: EventHandler<StreamPropertyChangedEvent>;
} | Record<string, EventHandler<SignalEvent>>;

/**
 * Session object
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Session.html}
 */
export interface Session extends EventEmitter<SessionEventHandlers> {
  capabilities: Capabilities;
  connection: Connection;
  sessionId: string;
  connect(token: string, completionHandler?: CompletionHandler): void;
  disconnect(): void;
  forceDisconnect(connection: Connection, completionHandler?: CompletionHandler): void;
  forceUnpublish(stream: Stream, completionHandler?: CompletionHandler): void;
  getPublisherForStream(stream: Stream): Publisher;
  getSubscribersForStream(stream: Stream): Subscriber[];
  publish(publisher: Publisher, completionHandler?: CompletionHandler): void;
  signal(signal: Signal, completionHandler?: CompletionHandler): void;
  subscribe(stream: Stream, targetElement: Element | string | undefined, properties: SubscriberProperties, completionHandler?: CompletionHandler): Subscriber;
  unpublish(publisher: Publisher): void;
  unsubscribe(subscriber: Subscriber): void;
}

/**
 * Dimensions object 
 * 
 * Passed in Session.subscribe properties {@link SubscriberProperties#preferredResolution}
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Session.html#subscribe}
 */
export interface Dimensions {
  height: number;
  width: number;
}

export type StyleToggle = 'on' | 'off' | 'auto';

export interface Style {
  audioLevelDisplayMode?: StyleToggle;
  backgroundImageURI?: string;
  buttonDisplayMode?: StyleToggle;
  nameDisplayMode?: StyleToggle;
  videoDisabledDisplayMode?: StyleToggle;
}

/**
 * Style object passed in Session.subscribe properties {@link SubscriberProperties#style}
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Session.html#subscribe}
 */
export interface SubscriberStyle extends Style {
  audioBlockedDisplayMode?: StyleToggle;
  videoDisabledDisplayMode?: StyleToggle;
}

/**
 * Properties object passed to Session.subscribe
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Session.html#subscribe}
 */
export interface SubscriberProperties {
  audioVolume?: number;
  fitMode?: 'cover' | 'contain';
  height?: string | number;
  insertDefaultUI?: boolean;
  insertMode?: 'replace' | 'after' | 'before' | 'append';
  preferredFrameRate?: number;
  preferredResolution?: Dimensions;
  showControls?: boolean;
  style?: SubscriberStyle;
  subscribeToAudio?: boolean;
  subscribeToVideo?: boolean;
  testNetwork?: boolean;
  width?: string | number;
}

export type SubscriberEventHandlers = {
  audioBlocked?: EventHandler<Event<'audioBlocked'>>;
  audioLevelUpdated?: EventHandler<AudioLevelUpdatedEvent>;
  audioUnblocked?: EventHandler<Event<'audioUnblocked'>>;
  connected?: EventHandler<Event<'connected'>>;
  destroyed?: EventHandler<Event<'destroyed'>>;
  disconnected?: EventHandler<Event<'disconnected'>>;
  videoDimensionsChanged?: EventHandler<VideoDimensionsChangedEvent>;
  videoDisabled?: EventHandler<VideoEnabledChangedEvent<'videoDisabled'>>;
  videoDisableWarning?: EventHandler<Event<'videoDisableWarning'>>;
  videoDisableWarningLifted?: EventHandler<Event<'videoDisableWarningLifted'>>;
  videoElementCreated?: EventHandler<VideoElementCreatedEvent>;
  videoEnabled?: EventHandler<VideoEnabledChangedEvent<'videoEnabled'>>;
};

/**
 * Subscriber object
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Subscriber.html}
 */
export interface Subscriber extends EventEmitter<SubscriberEventHandlers> {
  element: Element;
  id: string;
  stream: Stream;
  getAudioVolume(): number;
  getImgData(): string;
  getStats(completionHandler: (error: Error | undefined, stats: SubscriberStats) => void): void;
  getStyle(): SubscriberStyle;
  isAudioBlocked(): boolean;
  restrictFrameRate(value: boolean): this;
  setAudioVolume(value: number): this;
  setPreferredFrameRate(value: number): void;
  setPreferredResolution(value: number): void;
  setStyle(style: SubscriberStyle): this;
  setStyle<K extends keyof SubscriberStyle>(style: K, value: SubscriberStyle[K]): this;
  subscribeToAudio(value: boolean): this;
  subscribeToVideo(value: boolean): this;
  videoHeight(): number;
  videoWidth(): number;
}

/**
 * Capabilities object
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Capabilities.html}
 */
export interface Capabilities {
  forceDisconnect?: 0 | 1;
  forceUnpublish?: 0 | 1;
  publish?: 0 | 1;
  subscribe?: 0 | 1;
}

/**
 * Connection object
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Connection.html}
 */
export interface Connection {
  connectionId: string;
  creationTime: number;
  data: string;
}

/**
 * Error object
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Error.html}
 */
export interface Error {
  code?: number;
  name: string;
  preventDefault(): void;
  isDefaultPrevented(): boolean;
}

/**
 * Publisher style object
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Publisher.html#setStyle}
 */
export interface PublisherStyle extends Style {
  archiveStatusDisplayMode: StyleToggle;
}

export interface PublisherEventHandlers {
  accessAllowed?: EventHandler<Event<'accessAllowed'>>;
  accessDenied?: EventHandler<Event<'accessDenied'>>;
  accessDialogClosed?: EventHandler<Event<'accessDialogClosed'>>;
  accessDialogOpened?: EventHandler<Event<'accessDialogOpened'>>;
  audioLevelUpdated?: EventHandler<AudioLevelUpdatedEvent>;
  destroyed?: EventHandler<Event<'destroyed'>>;
  mediaStopped?: EventHandler<MediaStoppedEvent>;
  streamCreated?: EventHandler<StreamCreatedEvent>;
  streamDestroyed?: EventHandler<StreamDestroyedEvent>;
  videoDimensionsChanged?: EventHandler<VideoDimensionsChangedEvent>;
  videoElementCreated?: EventHandler<VideoElementCreatedEvent>;
}

/**
 * Publisher object
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Publisher.html}
 */
export interface Publisher extends EventEmitter<PublisherEventHandlers> {
  accessAllowed: boolean;
  element?: Element;
  id: string;
  stream: Stream;
  session: Session;
  cycleVideo(): Promise<void>;
  destroy(): this;
  getAudioSource(): MediaStreamTrack;
  getImgData(): string;
  getStats(completionHandler: (error: Error | undefined, stats: PublisherStats[]) => void): void;
  getStyle(): PublisherStyle;
  publishAudio(value: boolean): void;
  publishVideo(value: boolean): void;
  setAudioSource(value: string | MediaStreamTrack): void;
  setStyle(style: PublisherStyle): this;
  setStyle<K extends keyof PublisherStyle>(style: K, value: PublisherStyle[K]): this;
  videoHeight(): number;
  videoWidth(): number;
}

/**
 * Stream object
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Stream.html}
 */
export interface Stream {
  connection: Connection;
  creationTime: number;
  frameRate: number;
  hasAudio: boolean;
  hasVideo: boolean;
  name: string;
  streamId: string;
  videoDimensions: Dimensions;
  videoType: 'camera' | 'screen' | 'custom';
}

/**
 * Publisher stats object
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Publisher.html#getStats}
 */
export interface PublisherStats {
  connectionId?: string;
  subscriberId?: string;
  stats: {
    'audio.bytesSent': number;
    'audio.packetsLost': number;
    'audio.packetsSent': number;
    timestamp: number;
    'video.bytesSent': number;
    'video.packetsLost': number;
    'video.packetsSent': number;
    'video.frameRate': number;
  }
}

/**
 * SubscriberStats stats object
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/Subscribe.html#getStats}
 */
export interface SubscriberStats {
  'audio.bytesReceived': number;
  'audio.packetsLost': number;
  'audio.packetsReceived': number;
  timestamp: number;
  'video.bytesReceived': number;
  'video.packetsLost': number;
  'video.packetsReceived': number;
  'video.frameRate': number;
}

/**
 * Publisher properties object
 * 
 * {@link https://tokbox.com/developer/sdks/js/reference/OT.html#initPublisher}
 */
export interface PublisherProperties {
  audioBitrate?: number;
  audioFallbackEnabled?: boolean;
  audioSource?: string | MediaStreamTrack | boolean | null;
  disableAudioProcessing?: boolean;
  enableStereo?: boolean;
  facingMode?: 'user' | 'environment' | 'left' | 'right';
  fitMode?: 'cover' | 'contain';
  frameRate?: number;
  height?: number | string;
  insertDefaultUI?: boolean;
  insertMode?: 'replace' | 'after' | 'before' | 'append';
  maxResolution?: Dimensions;
  mirror?: boolean;
  name?: string;
  publishAudio?: boolean;
  publishVideo?: boolean;
  resolution?: string;
  showControls?: boolean;
  style?: PublisherStyle;
  usePreviousDeviceSelection?: boolean;
  videoSource?: string | MediaStreamTrack | boolean | null;
  width?: number | string;
}