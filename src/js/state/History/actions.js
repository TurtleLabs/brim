/* @flow */

import type {
  HISTORY_BACK,
  HISTORY_CLEAR,
  HISTORY_FORWARD,
  HISTORY_PUSH
} from "./types"
import type {SearchRecord} from "../../types"
import brim, {type Ts} from "../../brim"

export default {
  back: (): HISTORY_BACK => ({
    type: "HISTORY_BACK"
  }),
  forward: (): HISTORY_FORWARD => ({
    type: "HISTORY_FORWARD"
  }),
  clear: (): HISTORY_CLEAR => ({
    type: "HISTORY_CLEAR"
  }),
  push: (record: SearchRecord, ts: Ts = brim.time().toTs()): HISTORY_PUSH => ({
    type: "HISTORY_PUSH",
    entry: record,
    ts: ts
  })
}
