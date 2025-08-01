export type TJobRun = {
  id: string;
  attempt: number;
  jobName: string;
  jobMode: string;
  startedOn: string;
  lastModifiedOn: string;
  completedOn: string;
  jobRunState: string;
};

export type TJob = Record<string, any> & {
  name: string;
  jobMode: string;
  createdOn: string;
  lastModifiedOn: string;
};
