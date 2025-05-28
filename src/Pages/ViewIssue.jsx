
import React from "react";
import { useParams } from "react-router-dom";

/**
 * 
 * @returns {JSX.Element} A component that displays the details of a specific issue.
 */
const ViewIssue = () => {
    const { id } = useParams();
    return (
        <div className="view-issue">
        <h1>View Issue</h1>
        <p>This page will display the details of a specific issue.</p>
        {/* Additional content and components can be added here */}
        </div>
    );
}

export default ViewIssue;