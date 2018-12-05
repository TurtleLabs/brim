/* @flow */
import type {Tuple, Descriptor} from "../models/Log"

export type SearchResult = {
  type: "SearchResult",
  results: {
    tuples: Tuple[],
    descriptor: Descriptor
  }
}

export type SearchEnd = {
  type: "SearchEnd"
}

export type Payload = SearchResult | SearchEnd