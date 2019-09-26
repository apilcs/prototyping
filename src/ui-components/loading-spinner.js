import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const LoadingSpinnerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9;
`;

const LoadingSpinnerInner = styled.div`
  &,
  &::before,
  &::after {
    background: ${props => props.customColor};
    animation: load1 1s infinite ease-in-out;
    width: 1em;
    height: 4em;
  }

  & {
    color: ${props => props.customColor};
    text-indent: -9999em;
    margin: 88px auto;
    font-size: 11px;
    transform: translateZ(0);
    animation-delay: -0.16s;
  }

  &::before,
  &::after {
    position: absolute;
    top: 0;
    content: "";
  }

  &::before {
    left: -1.5em;
    animation-delay: -0.32s;
  }

  &::after {
    left: 1.5em;
  }

  @keyframes load1 {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }
    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }
`;

function LoadingSpinner(props) {
  const { color } = props;
  return (
    <LoadingSpinnerContainer>
      <LoadingSpinnerInner customColor={color} />
    </LoadingSpinnerContainer>
  );
}

LoadingSpinner.propTypes = {
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};
LoadingSpinner.defaultProps = { color: "red" };

export default LoadingSpinner;
