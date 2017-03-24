import React, { PropTypes, Children, cloneElement } from 'react';

export default function OTStreams(props) {
  if (!props.session) {
    return <div />;
  }

  const child = Children.only(props.children);

  const childrenWithProps = Array.isArray(props.streams) ? props.streams.map(
    stream => (child ? cloneElement(
      child,
      {
        session: props.session,
        stream,
        key: stream.id,
      },
    ) : child),
  ) : null;

  return <div>{childrenWithProps}</div>;
}

OTStreams.propTypes = {
  children: PropTypes.element.isRequired,
  session: PropTypes.shape({
    publish: PropTypes.func,
    subscribe: PropTypes.func,
  }),
  streams: PropTypes.arrayOf(React.PropTypes.object),
};

OTStreams.defaultProps = {
  session: null,
  streams: [],
};
