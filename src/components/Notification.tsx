import { Snackbar, SnackbarContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../stores/reducers/notificationReducers";
import React from "react";

const Notification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: any) => state.notifications.notifications
  );

  const handleCloseNotification = (id: number) => {
    dispatch(removeNotification(id));
  };

  return (
    <>
      {notifications.map((notification: any) => (
        <Snackbar
          key={notification.id}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => handleCloseNotification(notification.id)}
          sx={{
            // Ensure notifications appear above all other components
            zIndex: 10000,
            "& .MuiSnackbarContent-root": {
              backgroundColor:
                notification.severity === "success"
                  ? "#43a047"
                  : notification.severity === "error"
                  ? "#d32f2f"
                  : notification.severity === "warning"
                  ? "#ffa000"
                  : notification.severity === "info"
                  ? "#5c5e5e"
                  : "#2979ff",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1rem",
              // Additional styling for better visibility
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              borderRadius: "8px",
            },
          }}
        >
          <SnackbarContent message={notification.message} />
        </Snackbar>
      ))}
    </>
  );
};

export default Notification;
