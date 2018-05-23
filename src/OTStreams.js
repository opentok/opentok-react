import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';

export default function OTStreams(props) {
  if (!props.session) {
    return <div />;
  }

  const child = Children.only(props.children);

  const childrenWithProps = Array.isArray(props.streams) ? props.streams.map(
    (stream, i) => (child ? cloneElement(
      child,
      {
        session: props.session,
        stream,
        containerStyle: props.subContainerStyles.length > i ? props.subContainerStyles[i] : {},
        key: stream.id,
      },
    ) : child),
  ) : null;

  return <div style={props.style}>{childrenWithProps}</div>;
}

OTStreams.propTypes = {
  children: PropTypes.element.isRequired,
  session: PropTypes.shape({
    publish: PropTypes.func,
    subscribe: PropTypes.func,
  }),
  streams: PropTypes.arrayOf(PropTypes.object),
  subContainerStyles: PropTypes.arrayOf(PropTypes.object),
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

OTStreams.defaultProps = {
  session: null,
  streams: [],
  subContainerStyles: [],
  style: {},
};
