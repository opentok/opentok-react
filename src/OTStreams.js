import React, { PropTypes, Children, cloneElement } from 'react';

export default function OTStreams(props) {
  if (!props.session) {
    return <div />;
  }

  const child = Children.only(props.children);

  const childrenWithProps = Array.isArray(props.streams) ? props.streams.map(
    stream => cloneElement(
      child,
      {
        session: props.session,
        stream,
        key: stream.id
      }
    )
  ) : null;

  return <div>{childrenWithProps}</div>;
}

OTStreams.propTypes = {
  children: PropTypes.element.isRequired,
  session: PropTypes.object,
  streams: PropTypes.arrayOf(React.PropTypes.object)
};
