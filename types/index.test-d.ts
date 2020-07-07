import React from 'react';
import { expectNotAssignable, expectAssignable } from 'tsd';
import { OTSessionProps, OTPublisherProps, OTStreamsProps, OTSubscriberProps, OTSubscriberRef, OTPublisherRef } from ".";
import { Error, Event, ArchiveEvent, SignalEvent, Session, AudioLevelUpdatedEvent, Stream, SubscriberProperties } from "./opentok";

/**
 * OTSessionProps
 */
expectNotAssignable<OTSessionProps>({});
expectNotAssignable<OTSessionProps>({
  apiKey: ''
});
expectNotAssignable<OTSessionProps>({
  apiKey: '',
  sessionId: ''
});

expectAssignable<OTSessionProps>({
  apiKey: '',
  sessionId: '',
  token: ''
});
expectAssignable<OTSessionProps>({
  apiKey: '',
  sessionId: '',
  token: '',
  eventHandlers: {}
});
expectAssignable<OTSessionProps>({
  apiKey: '',
  sessionId: '',
  token: '',
  eventHandlers: {
    archiveStarted: (event: ArchiveEvent) => {}
  }
});
expectAssignable<OTSessionProps>({
  apiKey: '',
  sessionId: '',
  token: '',
  eventHandlers: {
    archiveStarted: (event: ArchiveEvent) => {},
    'signal:foo': (event: SignalEvent) => {},
    'archiveStarted streamCreated': (event: Event) => {}
  }
});

declare const session: Session;
declare const publisherRef: React.RefObject<OTPublisherRef>;

/**
 * OTPublisherProps
 */
expectNotAssignable<OTPublisherProps>({
  session: null
});
expectAssignable<OTPublisherProps>({
  session,
});
expectAssignable<OTPublisherProps>({
  session,
  properties: {}
});
expectAssignable<OTPublisherProps>({
  properties: {
    audioBitrate: 10000
  }
});
expectAssignable<OTPublisherProps>({
  eventHandlers: {}
});
expectAssignable<OTPublisherProps>({
  ref: undefined
});
expectAssignable<OTPublisherProps>({
  ref: (instance: OTPublisherRef | null) => {}
});
expectAssignable<OTPublisherProps>({
  ref: publisherRef
});
expectAssignable<OTPublisherProps>({
  eventHandlers: {
    accessAllowed: (event: Event) => undefined,
    accessDenied: (event: Event<'accessDenied'>) => undefined,
    destroyed: event => undefined,
    audioLevelUpdated: (event: AudioLevelUpdatedEvent) => undefined
  }
});
expectAssignable<OTPublisherProps>({
  onInit: () => undefined
});
expectAssignable<OTPublisherProps>({
  onPublish: () => undefined
});
expectAssignable<OTPublisherProps>({
  onError: () => undefined
});
expectAssignable<OTPublisherProps>({
  onError: (error: Error) => undefined
});

declare const node: React.ReactNode;
declare const nodeArray: React.ReactNodeArray;
declare const element: React.ReactElement;
declare const stream: Stream;

/**
 * OTStreamsProps
 */
expectNotAssignable<OTStreamsProps>({});
expectNotAssignable<OTStreamsProps>({ session });
expectNotAssignable<OTStreamsProps>({ session, streams: [] });
expectNotAssignable<OTStreamsProps>({
  children: node
});
expectNotAssignable<OTStreamsProps>({
  children: nodeArray
});
expectAssignable<OTStreamsProps>({
  children: element
});
expectAssignable<OTStreamsProps>({
  children: element,
  session
});
expectAssignable<OTStreamsProps>({
  children: element,
  streams: []
});
expectAssignable<OTStreamsProps>({
  children: element,
  streams: [stream]
});

declare const subscriberProperties: SubscriberProperties;
declare const subscriberRef: React.RefObject<OTSubscriberRef>;

/**
 * OTSubscriberProps
 */
expectAssignable<OTSubscriberProps>({});
expectAssignable<OTSubscriberProps>({ session });
expectAssignable<OTSubscriberProps>({ stream });
expectAssignable<OTSubscriberProps>({ onSubscribe: () => undefined });
expectAssignable<OTSubscriberProps>({ onError: () => undefined });
expectAssignable<OTSubscriberProps>({ onError: error => undefined });
expectAssignable<OTSubscriberProps>({ onError: (error: Error) => undefined });
expectAssignable<OTSubscriberProps>({
  properties: subscriberProperties
});
expectNotAssignable<OTSubscriberProps>({
  properties: null
});
expectNotAssignable<OTSubscriberProps>({
  properties: {
    fitMode: NaN
  }
});
expectAssignable<OTSubscriberProps>({
  eventHandlers: {}
});
expectAssignable<OTSubscriberProps>({
  ref: undefined
});
expectAssignable<OTSubscriberProps>({
  ref: (instance: OTSubscriberRef | null) => {}
});
expectAssignable<OTSubscriberProps>({
  ref: subscriberRef
});
expectAssignable<OTSubscriberProps>({
  eventHandlers: {
    videoDimensionsChanged: event => undefined,
    audioBlocked: (event: Event) => undefined,
    audioLevelUpdated: (event: AudioLevelUpdatedEvent) => undefined,
    videoElementCreated: (event: Event) => undefined
  }
});
expectNotAssignable<OTSubscriberProps>({
  eventHandlers: {
    'foo': (event: Event) => undefined
  }
});