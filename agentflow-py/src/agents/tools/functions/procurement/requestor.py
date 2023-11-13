
def submit_item_request(items, reason):
    # Here you would implement the logic to handle the item request.
    # This is a mock implementation.
    request_id = "REQ123"  # A generated request ID
    return {
        "request_id": request_id,
        "status": "Submitted",
        "message": f"Request for items submitted successfully. Reason: {reason}"
    }


def update_request_details(request_id, updated_details):
    # Here you would implement the logic to update the request details.
    # This is a mock implementation.
    return {
        "request_id": request_id,
        "status": "Updated",
        "updated_details": updated_details,
        "message": "Request details updated successfully."
    }


def cancel_request(request_id):
    # Here you would implement the logic to cancel the request.
    # This is a mock implementation.
    return {
        "request_id": request_id,
        "status": "Cancelled",
        "message": "Request cancelled successfully."
    }
