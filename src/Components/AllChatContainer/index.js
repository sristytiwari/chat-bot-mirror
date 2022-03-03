import {
  Avatar,
  Divider,
  Fab,
  FormControl,
  Grid,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Chat, Person, Send, SmartToy } from "@mui/icons-material";
import React from "react";
import "./styles.css";
import _ from "underscore";
import moment from "moment";
import FirebaseRDB from "../../Utils/FirebaseRDB";

class AllChatContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userMessage: "",
      messages: [],
    };

    this.userPath = "/users/";

    this.messagesEnd = React.createRef();
  }

  componentDidMount() {
    this.listenToMessages();
  }

  listenToMessages = () => {
    FirebaseRDB.listenToData(this.userPath, this.callbackFunction);
  };

  callbackFunction = (data) => {
    this.setState({ messages: data }, () => {
      this.scrollToBottom();
    });
  };

  scrollToBottom = _.debounce((ref = this.messagesEnd) => {
    if (!!ref.current) {
      ref.current.scrollTop = ref.current?.scrollHeight;
    }
  }, 400);

  handleFieldChange = (key, value) => {
    let newState = { ...this.state };
    newState[key] = value;
    this.setState(newState);
  };

  onSubmit(e) {
    e.preventDefault();
    const { userMessage } = this.state;

    const payload = {
      message: userMessage,
      senderId: "user",
      createdAt: moment().valueOf(),
    };

    this.setState(
      {
        userMessage: "",
      },
      () => {
        FirebaseRDB.pushData(this.userPath, payload);
      }
    );
  }

  render() {
    const { userMessage, messages } = this.state;

    return (
      <Paper elevation={0} className={"chat-provider"}>
        <Paper elevation={2} className={"chat-container"}>
          <Paper elevation={0} className={"chat-header"}>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={1}>
                <Grid container justifyContent={"center"}>
                  <Grid item>
                    <Avatar
                      className={"chat-header-avatar"}
                      variant={"circular"}
                    >
                      <Chat fontSize={"small"} />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={11}>
                <Typography variant={"h5"}>Chat Bot</Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider variant={"middle"} />
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={0} className={"chat-holder"} ref={this.messagesEnd}>
            <Grid container spacing={2} alignItems={"flex-end"}>
              {/* Here comes all messages*/}
              {messages?.map((message) => {
                return (
                  <MessageRow
                    key={message.messageId}
                    messageDetails={message}
                  />
                );
              })}
            </Grid>
          </Paper>

          <Paper elevation={0} className={"base-padding"}>
            <form onSubmit={this.onSubmit.bind(this)}>
              <Grid
                container
                spacing={1}
                alignItems={"center"}
                justifyContent={"space-around"}
              >
                <Grid item xs={10} md={11}>
                  <FormControl fullWidth>
                    <TextField
                      autoFocus
                      value={userMessage}
                      variant={"outlined"}
                      margin={"dense"}
                      placeholder={"Type your message here…."}
                      onChange={({ target: { value } }) =>
                        this.handleFieldChange("userMessage", value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={2} md={1}>
                  <Grid
                    container
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Grid item>
                      <Tooltip title={"Send Message"} placement={"top"}>
                        <span>
                          <Fab
                            color={"primary"}
                            type={"submit"}
                            size={"small"}
                            disabled={!userMessage?.trim()}
                          >
                            <Send fontSize={"small"} />
                          </Fab>
                        </span>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Paper>
      </Paper>
    );
  }
}

export default AllChatContainer;

const MessageRow = ({
  classes,
  userId,
  messageDetails,
  menuOptions = [],
  ...rest
}) => {
  const swap = messageDetails.senderId === "bot";
  const format = "Do MMM YYYY (hh:mm:ss) A";
  const messageBGClass = swap
    ? "message-left-background"
    : "message-right-background";

  return (
    <Grid item xs={12} {...rest}>
      <Grid container justifyContent={swap ? "flex-start" : "flex-end"}>
        <Grid item xs={6}>
          <Grid
            container
            spacing={1}
            justifyContent={"flex-start"}
            direction={swap ? "row" : "row-reverse"}
            wrap={"nowrap"}
          >
            <Grid item>
              <Grid
                container
                spacing={1}
                justifyContent={swap ? "flex-start" : "flex-end"}
              >
                <Grid item xs={12}>
                  <Grid
                    container
                    justifyContent={swap ? "flex-start" : "flex-end"}
                    alignItems={"center"}
                    spacing={1}
                  >
                    <Grid item>
                      <Avatar sx={{ bgcolor: swap ? "#039be5" : "#b3e5fc" }}>
                        {swap ? (
                          <SmartToy fontSize={"small"} color={"white"} />
                        ) : (
                          <Person fontSize={"small"} color={"primary"} />
                        )}
                      </Avatar>
                    </Grid>

                    <Grid item>
                      <Typography
                        variant={"body2"}
                        component={"p"}
                        align={swap ? "left" : "right"}
                      >
                        <b>{messageDetails.senderId?.toUpperCase?.()}</b>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Paper
                    elevation={0}
                    className={`message-container ${messageBGClass}`}
                  >
                    <Grid item xs={12}>
                      <Typography
                        variant={"body1"}
                        component={"p"}
                        color={swap ? "white" : "GrayText"}
                      >
                        {messageDetails?.message}
                      </Typography>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant={"body2"}
                    component={"p"}
                    color={"GrayText"}
                    align={swap ? "left" : "right"}
                  >
                    <i>{moment(messageDetails?.createdAt).format(format)}</i>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
