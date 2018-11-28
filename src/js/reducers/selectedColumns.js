/* @flow */

import createReducer from "./createReducer"
import {createSelector} from "reselect"
import * as columnWidths from "./columnWidths"
import * as mainSearch from "./mainSearch"
import * as descriptors from "./descriptors"
import * as spaces from "./spaces"
import UniqArray from "../models/UniqArray"
import Columns from "../models/Columns"
import columnOrder from "../lib/columnOrder"
import type {State} from "./types"
import type {ColumnWidths} from "./columnWidths"

const initialState = []

export type SelectedColumns = typeof initialState

export default createReducer(initialState, {
  COLUMNS_SET: (state, {columns}) => {
    return columns
  },
  COLUMNS_TOGGLE: (state, {column}) => {
    const exists = state.find(
      c => c.name === column.name && c.type === column.type
    )
    if (exists) {
      return state.filter(c => c !== exists)
    } else {
      return [column, ...state]
    }
  }
})

export const getAll = (state: State) => {
  return state.selectedColumns
}

export const getColumnsFromTds = createSelector(
  mainSearch.getTds,
  descriptors.getDescriptors,
  spaces.getCurrentSpaceName,
  (tds, descriptors, space) => {
    const compareFn = (a, b) => a.name === b.name && a.type === b.type
    const columns = new UniqArray(compareFn)
    tds.forEach(td => {
      const desc = descriptors[space + "." + td]
      if (desc) desc.forEach(field => columns.push({td, ...field}))
    })
    return columns.toArray()
  }
)

export const getColumns = createSelector(
  getColumnsFromTds,
  getAll,
  columnWidths.getAll,
  (all, visible, widths) => createColumns(all, visible, widths)
)

export const createColumns = (all: *[], visible: *[], widths: ColumnWidths) => {
  visible = visible.length === 0 ? all : visible

  return new Columns(
    columnOrder(
      all.map(({name, type, td}) => ({
        name,
        type,
        td,
        isVisible: !!visible.find(
          vis => vis.name === name && vis.type === type
        ),
        width: name in widths ? widths[name] : widths.default
      }))
    )
  )
}
