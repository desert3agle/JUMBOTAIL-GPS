import React from "react";
import PropTypes from "prop-types";
import withWidth from "@material-ui/core/withWidth";
import Button from "@material-ui/core/Button";

/**
 * This example uses the `withWidth` HOC to render a button with
 * different props based on screen size.
 */
function ResponsiveButton({ width }) {
    // isSmallScreen will be true if current breakpoint is "xs" or "sm".
    // This is equivelant to theme.breakpoints.down("sm")
    const isSmallScreen = /xs|sm/.test(width);
    const buttonProps = {
        variant: isSmallScreen ? "text" : "outlined",
        size: isSmallScreen ? "small" : "large"
    };
    return buttonProps;
}

ResponsiveButton.propTypes = {
    /** The name of the current breakpoint, for example "sm" */
    width: PropTypes.string.isRequired
};

export default withWidth()(ResponsiveButton);
