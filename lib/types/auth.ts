export type SessionUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type SessionPayload = {
  user: SessionUser;
};
