export const Screens = {
  Home: 'Home',
  Onboarding: 'Onboarding',
  Entries: 'Entries',
  AddEntry: 'AddEntry',
  CreateNewSegment: 'CreateNewSegment',
  SegmentDetail: 'SegmentDetail',
  Profile: 'Profile',
  ProfileEdit: 'ProfileEdit',
} as const
export const Actions = {
  View: 'View',
  Click: 'Click',
  Add: 'Add',
  Save: 'Save',
  Update: 'Update',
  Delete: 'Delete',
  Clear: 'Clear',
  Complete: 'Complete',
} as const
export const Triggers = {
  ClearAll: 'ClearAll',
  DeleteEntry: 'DeleteEntry',
  AddEntry: 'AddEntry',
  FeedbackTelegram: 'FeedbackTelegram',
  SegmentsHint: 'SegmentsHint',
  SegmentsHintLater: 'SegmentsHintLater',
  SegmentsHintCreate: 'SegmentsHintCreate',
} as const
export type Screen = (typeof Screens)[keyof typeof Screens]
export type Action = (typeof Actions)[keyof typeof Actions]
export type Trigger = (typeof Triggers)[keyof typeof Triggers]
const normalizeToken = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .replace(/__+/g, '_')
    .trim()
export const buildAnalyticsEventName = ({
  screen,
  trigger,
  action,
}: {
  screen: Screen
  trigger?: Trigger
  action: Action
}) =>
  [screen, trigger, action]
    .filter(Boolean)
    .map((item) => normalizeToken(String(item)))
    .join('_')
