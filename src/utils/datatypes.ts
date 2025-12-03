export interface ContestSummary {
    cid: string,
    name: string,
    start_time: number,
    end_time: number,
    status: string,
    can_virtual: boolean,
    can_register: boolean,
    is_registered: boolean,
    elapsed: number
}

export interface ProblemSummary {
    pid: string,
    name: string,
}

export interface SubmissionSummary {
    id: string,
    time: number,
    user_id: string,
    user_name: string,
    problem_id: string,
    problem_name: string,
    lang: string,
    result: string,
    can_see: boolean,
    can_rejudge: boolean
}