export interface Housemate {
  id: string;
  name: string;
}

export interface ScheduleAssignment {
  userId: string;
}

export interface ChoresData {
  housemates: Housemate[];
  schedule: ScheduleAssignment[];
  optOuts: string[];
}
