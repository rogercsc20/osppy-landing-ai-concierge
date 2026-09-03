// React's <ViewTransition> ships in the canary channel that the App Router
// bundles (next/dist/compiled/react); @types/react keeps its declarations in
// react/canary, which is not loaded by default. One reference anywhere in the
// project is enough, and this file is that place.
/// <reference types="react/canary" />
