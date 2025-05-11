export const QUERY_KEYS = {
  Workflows: () => ["workflows"],
  Stages: (workflowId: string) => ["stages", workflowId],
  Tickets: (stageId: string) => ["tickets", stageId],
  Ticket: (ticketId: string) => ["ticket", ticketId],
  TicketsCount: (stageId: string) => ["ticketsCount", stageId],
  Notifications: (userId?: number) => [userId, "notifications"],
  UserInfo: (userId?: string) => [userId, "userInfo"],
};
