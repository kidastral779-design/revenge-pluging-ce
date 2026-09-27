import { findByProps } from "@vendetta/metro";
import { before } from "@vendetta/patcher";

const MessageActions = findByProps("sendMessage", "editMessage");

let patches = [];

export default {
  onLoad: () => {
    patches.push(
      before("sendMessage", MessageActions, (args) => {
        if (!args[1] || typeof args[1].content !== "string") return;

        args[1].content = args[1].content
          .replace(/\bbro\b/gi, "choom")
          .replace(/\bdumbass\b/gi, "gonk");
      })
    );
  },
  onUnload: () => {
    for (const unpatch of patches) {
      unpatch();
    }
  },
};
