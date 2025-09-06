export enum ErrorCodeEnum {
  PermissionDenied = 10403,

  EventNotFound = 10000,

  OrganizerNotFound = 11000,
}

export const ErrorCode = Object.freeze<Record<ErrorCodeEnum, [string, number]>>({
  [ErrorCodeEnum.PermissionDenied]: ['Permission denied', 403],

  [ErrorCodeEnum.EventNotFound]: ['Event not found', 400],

  [ErrorCodeEnum.OrganizerNotFound]: ['Organizer not found', 400],
});
