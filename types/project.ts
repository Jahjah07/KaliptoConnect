interface Assignment {
  _id: string;
  status: "Pending" | "Ongoing" | "Completed";
  startDate?: string;
  endDate?: string;
  completedAt?: string;
}

export interface Project {
id: string;
name: string;
description?: string;
startDate?: number;
endDate?: number;
progress?: number;
assignment: Assignment;
}