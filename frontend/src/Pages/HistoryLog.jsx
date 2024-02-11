import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import AddHomeRoundedIcon from "@mui/icons-material/AddHomeRounded";
import FlipCameraAndroidRoundedIcon from "@mui/icons-material/FlipCameraAndroidRounded";
import { useLogQuery } from "../slices/logSlices";
import CircularProgress from "@mui/material/CircularProgress";

export default function Historiques() {
  const { data: logLists, isLoading, error, refetch } = useLogQuery();
  console.log("sdfdfs", logLists);
  return (
    <>
      <Timeline position="alternate">
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <div>{error?.data.message || error.error}</div>
        ) : (
          logLists.map((log) => (
            <TimelineItem>
              <TimelineOppositeContent
                sx={{ m: "auto 0" }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                {new Date(log.timestamp).getHours()} :{" "}
                {new Date(log.timestamp).getMinutes()}:{" "}
                {new Date(log.timestamp).getHours() >= 12 ? "PM" : "AM"}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot
                  sx={{
                    bgcolor:
                      log.action === "update"
                        ? "deeppink"
                        : log.action === "create"
                        ? "success.main"
                        : "secondary.main",
                  }}
                >
                  {log.action === "update" ? (
                    <FlipCameraAndroidRoundedIcon />
                  ) : log.action === "create" ? (
                    <AddHomeRoundedIcon />
                  ) : (
                    <DeleteSweepRoundedIcon />
                  )}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="h6" component="span">
                  {log.action}
                </Typography>
                <Typography>Because you need strength</Typography>
              </TimelineContent>
            </TimelineItem>
          ))
        )}
      </Timeline>
    </>
  );
}
