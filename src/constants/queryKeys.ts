export const QUERY_KEYS = {
  Workflows: () => ["workflows"],
  Stages: (workflowId: string) => ["stages", workflowId],
  Tickets: (stageId: string) => ["tickets", stageId],
  Notifications: (userId?: number) => [userId, "notifications"],
  UserInfo: (userId?: string) => [userId, "userInfo"],
};
