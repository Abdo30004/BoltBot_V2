type eventNames =
  | "authenticated"
  | "auth_failure"
  | "ready"
  | "chat_removed"
  | "chat_archived"
  | "message"
  | "message_create"
  | "message_revoke_everyone"
  | "message_revoke_me"
  | "message_ack"
  | "unread_count"
  | "message_reaction"
  | "media_uploaded"
  | "contact_changed"
  | "group_join"
  | "group_leave"
  | "group_admin_changed"
  | "group_update"
  | "qr"
  | "loading_screen"
  | "disconnected"
  | "change_state"
  | "change_battery"
  | "call"
  | "remote_session_saved";

interface Event {
  name: eventNames;
  once?: boolean;
  run: (...args: any[]) => Promise<any>;
}

export default Event;
export{Event}