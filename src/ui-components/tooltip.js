// Look out for errors when wrapping styled-components?
//  - https://github.com/FezVrasta/react-popper/issues/267
// TODO:
// * allow click-to-trigger?

import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { Manager, Reference, Popper } from "react-popper";

const color = "rgba(0, 0, 0, 0.8)";

const Tip = styled.output`
  background: ${color};
  border-color: ${color};
  border-radius: 6px;
  color: white;

  ${props =>
    props.customStyles
      ? css`
          ${props.customStyles}
        `
      : ""}
`;

const Arrow = styled.span`
  border-color: inherit;
  border-style: solid;
  height: 0;
  position: absolute;
  width: 0;

  &[data-placement="top"] {
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
    border-width: 5px 5px 0 5px;
    bottom: -5px;
    left: calc(50% - 5px);
    margin: 0 5px;
  }

  &[data-placement="bottom"] {
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    border-width: 0 5px 5px 5px;
    left: calc(50% - 5px);
    margin: 0 5px;
    top: -5px;
  }

  &[data-placement="right"] {
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-top-color: transparent;
    border-width: 5px 5px 5px 0;
    left: -5px;
    margin: 5px 0;
    top: calc(50% - 5px);
  }

  &[data-placement="left"] {
    border-bottom-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    border-width: 5px 0 5px 5px;
    margin: 5px 0;
    right: -5px;
    top: calc(50% - 5px);
  }

  ${props =>
    props.customStyles
      ? css`
          ${props.customStyles}
        `
      : ""}
`;

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = { shown: false };
  }

  render() {
    const {
      arrowStyles,
      children,
      placement: preferredPlacement,
      tipContent,
      tipStyles
    } = this.props;
    const { shown } = this.state;
    return (
      <Manager>
        <Reference>
          {({ ref }) =>
            React.isValidElement(children) ? (
              React.cloneElement(children, {
                ref,
                onMouseEnter: () => this.setState({ shown: true }),
                onMouseLeave: () => this.setState({ shown: false })
              })
            ) : (
              <span
                ref={ref}
                onMouseEnter={() => this.setState({ shown: true })}
                onMouseLeave={() => this.setState({ shown: false })}>
                {children}
              </span>
            )
          }
        </Reference>
        <Popper placement={preferredPlacement} positionFixed>
          {({ ref, style, placement, arrowProps }) => {
            if (!shown) return null;
            return (
              <Tip
                customStyles={tipStyles}
                data-placement={placement}
                ref={ref}
                style={style}
                onMouseEnter={() => this.setState({ shown: true })}
                onMouseLeave={() => this.setState({ shown: false })}>
                {typeof tipContent === "function" ? tipContent() : tipContent}
                <Arrow
                  customStyles={arrowStyles}
                  data-placement={placement}
                  ref={arrowProps.ref}
                  style={arrowProps.style}
                />
              </Tip>
            );
          }}
        </Popper>
      </Manager>
    );
  }
}

Tooltip.defaultProps = {
  arrowStyles: "",
  placement: "top",
  tipStyles: ""
};

Tooltip.propTypes = {
  arrowStyles: PropTypes.string,
  children: PropTypes.node.isRequired,
  placement: PropTypes.string,
  tipContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
    PropTypes.func
  ]).isRequired,
  tipStyles: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export { Tip };
export default Tooltip;
