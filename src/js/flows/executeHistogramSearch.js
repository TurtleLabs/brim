/* @flow */
import type {SearchArgs} from "./searchArgs"
import type {Thunk} from "../state/types"
import {addEveryCountProc} from "../searches/histogramSearch"
import ErrorFactory from "../models/ErrorFactory"
import Notice from "../state/Notice"
import brim from "../brim"
import chart from "../state/Chart"
import executeSearch from "./executeSearch"

export default function executeHistogramSearch({
  program,
  span,
  space,
  tabId
}: SearchArgs): Thunk {
  return function(dispatch) {
    let histogram = brim
      .search(addEveryCountProc(program, span), span, space)
      .id("Histogram")
      .status((status) => dispatch(chart.setStatus(tabId, status)))
      .chan(0, (records) => dispatch(chart.appendRecords(tabId, records)))
      .error((error) => dispatch(Notice.set(ErrorFactory.create(error))))

    dispatch(chart.clear(tabId))
    dispatch(chart.setStatus(tabId, "FETCHING"))
    return dispatch(executeSearch(histogram))
  }
}
