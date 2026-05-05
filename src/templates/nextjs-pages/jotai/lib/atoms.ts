import { atom } from 'jotai'

export const countAtom = atom(0)
export const doubleCountAtom = atom((get) => get(countAtom) * 2)
