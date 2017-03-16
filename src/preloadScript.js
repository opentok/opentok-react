import React, {Component, PropTypes} from 'react';
import getDisplayName from 'react-display-name';
import scriptjs from 'scriptjs';

const DEFAULT_SCRIPT_URL = 'https://static.opentok.com/v2/js/opentok.min.js';

/*
This higher-order component will load the OpenTok client thru a script tag.
It will render its inner component only when the OpenTok client has loaded.
In the meantime, it will render a loading element chosen by the developer.
*/
export default function preloadScript(InnerComponent) {
  class PreloadScript extends Component {
    constructor(props) {
      super(props);

      this.state = {
        scriptLoaded: typeof OT !== 'undefined'
      };
      this.isPresent = false;
    }

    componentDidMount() {
      this.isPresent = true;

      if (this.state.scriptLoaded || this.state.scriptLoading) {
        return;
      }

      this.setState({
        scriptLoading: true
      });

      const scriptUrl = this.props.opentokClientUrl || DEFAULT_SCRIPT_URL;
      scriptjs(scriptUrl, this.onScriptLoad);
    }

    componentWillUnmount() {
      this.isPresent = false;
    }

    onScriptLoad = () => {
      if (this.isPresent) {
        this.setState({
          scriptLoaded: true
        });
      }
    }

    render() {
      const { opentokClientUrl, loadingDelegate, ...restProps } = this.props;

      if (this.state.scriptLoaded) {
        return <InnerComponent {...restProps} />;
      }
      else {
        return loadingDelegate || <div />;
      }
    }
  };

  PreloadScript.displayName = `preloadScript(${getDisplayName(InnerComponent)})`;
  PreloadScript.propTypes = {
    opentokClientUrl: PropTypes.string,
    loadingDelegate: PropTypes.node
  };

  return PreloadScript;
}
