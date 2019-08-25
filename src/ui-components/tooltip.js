// Possibly look out for https://github.com/FezVrasta/react-popper/issues/267
// TODO:
// * allow click-to-trigger?
// * think more about styling, and customizable styling

import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Manager, Reference, Popper } from "react-popper";

const color = "rgba(0, 0, 0, 0.8)";

const Tip = styled.output`
  background: ${color};
  border-radius: 6px;
  color: white;
  font-family: ${props => props.theme.fonts.body};
  font-size: 0.9rem;
  line-height: 1.45;
  max-width: 20rem;
  padding: 0.5rem 1rem;
  z-index: 2;

  a[href^="#ftn"] {
    display: none;
  }

  p:last-of-type {
    margin-bottom: 0;
  }
`;

const Arrow = styled.span`
  border-color: ${color};
  border-style: solid;
  height: 0;
  margin: 5px;
  position: absolute;
  width: 0;

  &[data-placement="top"] {
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
    border-width: 5px 5px 0 5px;
    bottom: -5px;
    left: calc(50% - 5px);
    margin-bottom: 0;
    margin-top: 0;
  }

  &[data-placement="bottom"] {
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    border-width: 0 5px 5px 5px;
    left: calc(50% - 5px);
    margin-bottom: 0;
    margin-top: 0;
    top: -5px;
  }

  &[data-placement="right"] {
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-top-color: transparent;
    border-width: 5px 5px 5px 0;
    left: -5px;
    margin-left: 0;
    margin-right: 0;
    top: calc(50% - 5px);
  }

  &[data-placement="left"] {
    border-bottom-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    border-width: 5px 0 5px 5px;
    margin-left: 0;
    margin-right: 0;
    right: -5px;
    top: calc(50% - 5px);
  }
`;

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = { shown: false };
  }

  render() {
    const { tipContent, children, placement: preferredPlacement } = this.props;
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
                ref={ref}
                style={style}
                data-placement={placement}
                onMouseEnter={() => this.setState({ shown: true })}
                onMouseLeave={() => this.setState({ shown: false })}>
                {typeof tipContent === "function" ? tipContent() : tipContent}
                <Arrow
                  ref={arrowProps.ref}
                  style={arrowProps.style}
                  data-placement={placement}
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
  placement: "top"
};

Tooltip.propTypes = {
  tipContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
    PropTypes.func
  ]).isRequired,
  children: PropTypes.node.isRequired,
  placement: PropTypes.string
};

export default Tooltip;
